import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { gsap } from "gsap";

// Helper to scan offscreen text pixels and generate 3D coordinates
const generateTextPoints = (text, width = 700, height = 160) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Use extra bold font styling
  ctx.font = "900 115px 'Outfit', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const points = [];

  const step = 2; // pixel sampling density
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const red = data[idx];
      if (red > 128) {
        // Map centered coordinate space
        const px = (x - width / 2) * 0.55;
        const py = (height / 2 - y) * 0.55;

        // Extrude in Z to create 3D volumetric thickness
        const depthCount = 3;
        const depthStep = 3;
        for (let d = 0; d < depthCount; d++) {
          const pz = (d - (depthCount - 1) / 2) * depthStep;
          points.push({ x: px, y: py, z: pz });
        }
      }
    }
  }
  return points;
};

const Splash = ({ onComplete }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioBufferRef = useRef(null);
  const audioSourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  const tunnelOpacityRef = useRef({ value: 0 });
  const renderObjectsRef = useRef(null);

  // Preload audio on mount
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    fetch("/netflixx-intro.mp3")
      .then((res) => {
        if (!res.ok) throw new Error("Audio file not found");
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((decodedData) => {
        audioBufferRef.current = decodedData;
      })
      .catch((err) => {
        console.warn("Could not load netflixx-intro.mp3, will fallback to synth:", err);
      });

    return () => {
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {}
        audioSourceRef.current.disconnect();
      }
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(nextMuted ? 0 : 0.8, audioCtxRef.current.currentTime);
    }
  };

  const handleSkip = () => {
    setIsFadingOut(true);
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
    }
    // Clean up Three.js animation
    if (renderObjectsRef.current && renderObjectsRef.current.frameId) {
      cancelAnimationFrame(renderObjectsRef.current.frameId);
    }
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // Sound Synth Fallback
  const playSynthFallback = (ctx, now) => {
    // Double bass hit ("Tu-dum")
    const oscBass = ctx.createOscillator();
    const gainBass = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    oscBass.type = "sawtooth";
    oscBass.frequency.setValueAtTime(52, now); // G#1
    oscBass.frequency.linearRampToValueAtTime(45, now + 1.2);
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(110, now);

    gainBass.gain.setValueAtTime(0.001, now);
    gainBass.gain.exponentialRampToValueAtTime(0.95, now + 0.05);
    gainBass.gain.linearRampToValueAtTime(0.4, now + 0.35);
    gainBass.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    oscBass.connect(lp);
    lp.connect(gainBass);
    gainBass.connect(gainNodeRef.current);

    oscBass.start(now);
    oscBass.stop(now + 1.5);
  };

  const handleStart = () => {
    setIsStarted(true);

    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }

    // Phase timing:
    // 0s - 1.0s: Silence.
    // 1.0s: Play audio track.
    setTimeout(() => {
      if (audioBufferRef.current && ctx) {
        const source = ctx.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.connect(gainNodeRef.current);
        source.start(0);
        audioSourceRef.current = source;
      } else if (ctx) {
        playSynthFallback(ctx, ctx.currentTime);
      }
    }, 1000);

    setTimeout(() => {
      setShowSkip(true);
    }, 1200);
  };

  // --- Three.js & WebGL Render Pipeline ---
  useEffect(() => {
    if (!isStarted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Setup Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Setup Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    camera.position.set(0, 0, 350);

    // 3. Scan & Generate points
    const textPoints = generateTextPoints("CHAKRI");
    const count = textPoints.length;

    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(count * 3);
    const targetArray = new Float32Array(count * 3);
    const dirArray = new Float32Array(count * 3);
    const colorOffsetArray = new Float32Array(count);
    const sizeArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const pt = textPoints[i];

      // Scattered starting points in cosmic sphere
      const radius = Math.random() * 250 + 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = radius * Math.cos(phi) + 150;

      // Extruded Target
      targetArray[i * 3] = pt.x;
      targetArray[i * 3 + 1] = pt.y;
      targetArray[i * 3 + 2] = pt.z;

      // Ambient drift vectors
      const angle = Math.random() * Math.PI * 2;
      dirArray[i * 3] = Math.cos(angle);
      dirArray[i * 3 + 1] = Math.sin(angle);
      dirArray[i * 3 + 2] = (Math.random() - 0.5) * 2;

      // Color offsets
      colorOffsetArray[i] = Math.random() * 6.0;

      // Particle sizes
      sizeArray[i] = Math.random() * 1.6 + 0.8;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute("aTargetPosition", new THREE.BufferAttribute(targetArray, 3));
    geometry.setAttribute("aRandomDirection", new THREE.BufferAttribute(dirArray, 3));
    geometry.setAttribute("aColorOffset", new THREE.BufferAttribute(colorOffsetArray, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizeArray, 1));

    // 4. Shaders & Uniforms
    const getScaleFactor = () => {
      const w = window.innerWidth;
      if (w < 480) return 0.52;
      if (w < 768) return 0.75;
      return 1.0;
    };

    const uniforms = {
      uTime: { value: 0 },
      uStage: { value: 0 },
      uProgress: { value: 0 },
      uTextScale: { value: getScaleFactor() },
      uFlashIntensity: { value: 0 },
    };

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        uniform float uStage;
        uniform float uProgress;
        uniform float uTextScale;
        uniform float uFlashIntensity;
        attribute vec3 aTargetPosition;
        attribute vec3 aRandomDirection;
        attribute float aColorOffset;
        attribute float aSize;

        varying vec3 vColor;
        varying float vAlpha;

        vec3 getShiftedColor(float offset, float time) {
            float t = time * 0.6 + offset;
            vec3 c1 = vec3(0.9, 0.03, 0.08); // red
            vec3 c2 = vec3(0.05, 0.4, 0.9);  // electric blue
            vec3 c3 = vec3(0.5, 0.05, 0.85); // purple
            vec3 c4 = vec3(0.95, 0.4, 0.05); // orange
            vec3 c5 = vec3(0.9, 0.75, 0.1);  // gold
            vec3 c6 = vec3(1.0, 1.0, 1.0);   // white
            
            float m = mod(t, 6.0);
            if (m < 1.0) return mix(c1, c2, m);
            if (m < 2.0) return mix(c2, c3, m - 1.0);
            if (m < 3.0) return mix(c3, c4, m - 2.0);
            if (m < 4.0) return mix(c4, c5, m - 3.0);
            if (m < 5.0) return mix(c5, c6, m - 4.0);
            return mix(c6, c1, m - 5.0);
         }

        void main() {
            vec3 pos = position;
            
            if (uStage == 0.0) {
                pos += aRandomDirection * sin(uTime * 0.08) * 10.0;
            } else if (uStage == 1.0) {
                float t = uProgress;
                float ease = 1.0 - pow(1.0 - t, 3.0);
                pos = mix(position, aTargetPosition * uTextScale, ease);
                
                // Spiral warp
                float angle = (1.0 - ease) * 3.14159 * 1.5;
                float s = sin(angle);
                float c = cos(angle);
                float rx = pos.x * c - pos.y * s;
                float ry = pos.x * s + pos.y * c;
                pos.x = mix(rx, pos.x, ease);
                pos.y = mix(ry, pos.y, ease);
            } else {
                pos = aTargetPosition * uTextScale;
                if (uProgress > 0.0) {
                    pos += normalize(aTargetPosition - vec3(0.0)) * uProgress * 280.0;
                }
            }
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            float sizeMultiplier = 1.0 + uFlashIntensity * 3.5;
            gl_PointSize = aSize * (350.0 / -mvPosition.z) * sizeMultiplier;
            
            vColor = getShiftedColor(aColorOffset, uTime);
            vColor = mix(vColor, vec3(1.0, 1.0, 1.0), uFlashIntensity * 0.7);
            
            vAlpha = smoothstep(-15.0, 15.0, -mvPosition.z);
            if (uStage == 2.0) {
                vAlpha *= (1.0 - uProgress);
            }
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
            gl_FragColor = vec4(vColor, alpha);
        }
      `,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Background Soft Floating Dust System
    const bgCount = 200;
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgCount * 3);
    const bgSizes = new Float32Array(bgCount);
    const bgColorOffsets = new Float32Array(bgCount);

    for (let i = 0; i < bgCount; i++) {
      bgPositions[i * 3] = (Math.random() - 0.5) * 500;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 80;
      bgSizes[i] = Math.random() * 7 + 3;
      bgColorOffsets[i] = Math.random() * 6.0;
    }

    bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
    bgGeometry.setAttribute("aSize", new THREE.BufferAttribute(bgSizes, 1));
    bgGeometry.setAttribute("aColorOffset", new THREE.BufferAttribute(bgColorOffsets, 1));

    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        attribute float aSize;
        attribute float aColorOffset;
        varying vec3 vColor;
        varying float vAlpha;

        vec3 getMutedColor(float offset, float time) {
            float t = time * 0.15 + offset;
            vec3 c1 = vec3(0.35, 0.05, 0.05); // dark red
            vec3 c2 = vec3(0.04, 0.08, 0.25); // dark blue
            vec3 c3 = vec3(0.18, 0.04, 0.3);  // dark purple
            float m = mod(t, 3.0);
            if (m < 1.0) return mix(c1, c2, m);
            if (m < 2.0) return mix(c2, c3, m - 1.0);
            return mix(c3, c1, m - 2.0);
        }

        void main() {
            vec3 pos = position;
            pos.y += sin(uTime * 0.08 + aColorOffset) * 4.0;
            pos.x += cos(uTime * 0.08 + aColorOffset) * 4.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = aSize * (300.0 / -mvPosition.z);
            vColor = getMutedColor(aColorOffset, uTime);
            vAlpha = 0.2 * (1.0 - smoothstep(120.0, 320.0, -mvPosition.z));
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
            gl_FragColor = vec4(vColor, alpha);
        }
      `,
      uniforms: { uTime: uniforms.uTime },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const bgSystem = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgSystem);

    // 6. Volumetric Sweep Plane
    const sweepGeometry = new THREE.PlaneGeometry(500, 200);
    const sweepMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uProgress;
        uniform float uStage;
        void main() {
            if (uStage != 1.0) {
                discard;
            }
            float center = uProgress * 1.5 - 0.25;
            float width = 0.12;
            float dist = abs(vUv.x - center);
            if (dist > width) discard;
            
            float intensity = smoothstep(width, 0.0, dist) * 0.24;
            vec3 color = mix(vec3(0.9, 0.03, 0.08), vec3(0.05, 0.35, 0.9), uProgress);
            float edgeFade = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
            
            gl_FragColor = vec4(color, intensity * edgeFade);
        }
      `,
      uniforms: {
        uProgress: uniforms.uProgress,
        uStage: uniforms.uStage,
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const sweepMesh = new THREE.Mesh(sweepGeometry, sweepMaterial);
    sweepMesh.position.set(0, 0, 8);
    scene.add(sweepMesh);

    // 7. Colored Barcode Zoom Tunnel Beams (Netflix Spectra Concept)
    const tunnelGroup = new THREE.Group();
    scene.add(tunnelGroup);

    const numBeams = 190;
    const beams = [];
    const beamColors = [
      new THREE.Color(0.85, 0.03, 0.08),  // red
      new THREE.Color(0.05, 0.38, 0.92), // electric blue
      new THREE.Color(0.5, 0.05, 0.85),  // purple
      new THREE.Color(0.95, 0.42, 0.03), // orange
      new THREE.Color(0.92, 0.72, 0.08), // gold
      new THREE.Color(1.0, 1.0, 1.0),    // white highlights
    ];

    const beamGeometry = new THREE.PlaneGeometry(1, 1);

    for (let i = 0; i < numBeams; i++) {
      const z = THREE.MathUtils.randFloat(-1500, 100);

      // Distribute along cylinder but keep camera trajectory tunnel open
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.randFloat(25, 230);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const width = THREE.MathUtils.randFloat(0.6, 3.8);
      const height = THREE.MathUtils.randFloat(45, 200);

      const color = beamColors[Math.floor(Math.random() * beamColors.length)];
      const beamMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const beamMesh = new THREE.Mesh(beamGeometry, beamMaterial);
      beamMesh.position.set(x, y, z);
      beamMesh.scale.set(width, height, 1);

      tunnelGroup.add(beamMesh);
      beams.push({
        mesh: beamMesh,
        baseWidth: width,
        baseHeight: height,
        zPos: z,
      });
    }

    // 8. Explosion Particles System
    const rayCount = 130;
    const rayGeometry = new THREE.BufferGeometry();
    const rayPositions = new Float32Array(rayCount * 3);
    const rayVelocities = new Float32Array(rayCount * 3);
    const raySizes = new Float32Array(rayCount);
    const rayColorOffsets = new Float32Array(rayCount);

    for (let i = 0; i < rayCount; i++) {
      rayPositions[i * 3] = 0;
      rayPositions[i * 3 + 1] = 0;
      rayPositions[i * 3 + 2] = 0;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = THREE.MathUtils.randFloat(6.0, 18.0);

      rayVelocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      rayVelocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      rayVelocities[i * 3 + 2] = speed * Math.cos(phi) - 3.0;

      raySizes[i] = Math.random() * 2.2 + 1.0;
      rayColorOffsets[i] = Math.random() * 6.0;
    }

    rayGeometry.setAttribute("position", new THREE.BufferAttribute(rayPositions, 3));
    rayGeometry.setAttribute("aVelocity", new THREE.BufferAttribute(rayVelocities, 3));
    rayGeometry.setAttribute("aSize", new THREE.BufferAttribute(raySizes, 1));
    rayGeometry.setAttribute("aColorOffset", new THREE.BufferAttribute(rayColorOffsets, 1));

    const rayMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        attribute vec3 aVelocity;
        attribute float aSize;
        attribute float aColorOffset;
        varying vec3 vColor;
        varying float vAlpha;

        vec3 getShiftedColor(float offset, float time) {
            float t = time * 0.6 + offset;
            vec3 c1 = vec3(0.9, 0.03, 0.08); // red
            vec3 c2 = vec3(0.05, 0.4, 0.9);  // electric blue
            vec3 c3 = vec3(0.5, 0.05, 0.85); // purple
            vec3 c4 = vec3(0.95, 0.4, 0.05); // orange
            vec3 c5 = vec3(0.9, 0.75, 0.1);  // gold
            vec3 c6 = vec3(1.0, 1.0, 1.0);   // white
            
            float m = mod(t, 6.0);
            if (m < 1.0) return mix(c1, c2, m);
            if (m < 2.0) return mix(c2, c3, m - 1.0);
            if (m < 3.0) return mix(c3, c4, m - 2.0);
            if (m < 4.0) return mix(c4, c5, m - 3.0);
            if (m < 5.0) return mix(c5, c6, m - 4.0);
            return mix(c6, c1, m - 5.0);
         }

        void main() {
            vec3 pos = aVelocity * uProgress * 23.0;
            pos += aVelocity * uProgress * 1.5;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = aSize * (350.0 / -mvPosition.z) * (1.5 - uProgress);
            
            vColor = getShiftedColor(aColorOffset, uTime);
            vAlpha = 1.0 - uProgress;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
            gl_FragColor = vec4(vColor, alpha);
        }
      `,
      uniforms: {
        uTime: uniforms.uTime,
        uProgress: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const raySystem = new THREE.Points(rayGeometry, rayMaterial);
    raySystem.visible = false;
    scene.add(raySystem);

    // 9. Peak screen flash and camera shake definitions
    let flashOpacityVal = 0.0;
    let cameraShake = 0.0;

    const shakeCamera = () => {
      const shakeTL = gsap.timeline();
      const intensity = 10;
      const count = 8;
      for (let i = 0; i < count; i++) {
        shakeTL.to(camera.position, {
          x: (Math.random() - 0.5) * intensity * (1 - i / count),
          y: (Math.random() - 0.5) * intensity * (1 - i / count),
          duration: 0.045,
          ease: "none",
        });
      }
      shakeTL.to(camera.position, { x: 0, y: 0, duration: 0.05 });
    };

    // 10. Cinematic Timeline Orchestration
    const introTimeline = gsap.timeline();

    // PHASE 0: Silence (0s - 1.0s)
    introTimeline.to({}, { duration: 1.0 });

    // PHASE 1: Assembly (1.0s - 2.2s)
    introTimeline.add(() => {
      uniforms.uStage.value = 1.0;
    });
    introTimeline.to(uniforms.uProgress, {
      value: 1.0,
      duration: 1.2,
      ease: "power2.out",
    }, 1.0);
    introTimeline.to(camera.position, {
      z: 280,
      duration: 1.2,
      ease: "power2.out",
    }, 1.0);

    // PHASE 2: The Peak TUDUM Hit (2.2s)
    introTimeline.add(() => {
      // White screen flash triggers
      flashOpacityVal = 1.0;
      shakeCamera();

      // Show explosive rays
      raySystem.visible = true;
      gsap.fromTo(
        rayMaterial.uniforms.uProgress,
        { value: 0 },
        { value: 1.0, duration: 0.9, ease: "power2.out" }
      );

      // Increase particle glow flash
      gsap.fromTo(
        uniforms.uFlashIntensity,
        { value: 1.2 },
        { value: 0, duration: 0.7, ease: "power2.out" }
      );

      // Fade-in the barcode tunnel lines
      gsap.to(tunnelOpacityRef.current, {
        value: 0.8,
        duration: 0.45,
        ease: "power2.out",
      });
    }, 2.2);

    // PHASE 3: Netflix Zoom-through (2.2s - 3.5s)
    introTimeline.add(() => {
      uniforms.uStage.value = 2.0;
      uniforms.uProgress.value = 0.0;
    }, 2.22);

    introTimeline.to(camera.position, {
      z: -1600,
      duration: 1.3,
      ease: "power3.in",
    }, 2.22);

    introTimeline.to(uniforms.uProgress, {
      value: 1.0,
      duration: 1.3,
      ease: "power3.in",
    }, 2.22);

    // Phase 4: Fading Out (3.5s+)
    introTimeline.add(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 700);
    }, 3.5);

    // 11. Core Animation Frame Ticker
    const clock = new THREE.Clock();
    let frameId;

    const renderLoop = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      // Update particle rotation drift slightly
      particleSystem.rotation.y = elapsed * 0.015;
      bgSystem.rotation.y = -elapsed * 0.005;

      // Stretch & render the barcode beams
      const currentStage = uniforms.uStage.value;
      beams.forEach((beam) => {
        const relativeZ = beam.mesh.position.z - camera.position.z;

        if (relativeZ > -10) {
          beam.mesh.material.opacity = 0;
        } else {
          // Stretch along Z during flight past camera
          if (currentStage === 2.0 && relativeZ > -400) {
            const stretch = Math.max(1.0, (400 - Math.abs(relativeZ)) * 0.28);
            beam.mesh.scale.set(beam.baseWidth, beam.baseHeight, stretch);
          } else {
            beam.mesh.scale.set(beam.baseWidth, beam.baseHeight, 1);
          }

          // Fade close and far boundaries
          const distanceFade = Math.min(1.0, Math.abs(relativeZ + 10) / 80);
          beam.mesh.material.opacity = tunnelOpacityRef.current.value * distanceFade;
        }
      });

      renderer.render(scene, camera);

      // Custom screen flash rendering overlay onto canvas directly if needed,
      // but rendering is smoothly managed by CSS flash overlay + WebGL blend.
      frameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // Cache handles for manual cleanups
    renderObjectsRef.current = {
      frameId,
      renderer,
      particleMaterial,
      geometry,
      bgMaterial,
      bgGeometry,
      sweepMaterial,
      sweepGeometry,
      rayMaterial,
      rayGeometry,
      beams,
      introTimeline,
    };

    // 12. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uTextScale.value = getScaleFactor();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderObjectsRef.current) {
        cancelAnimationFrame(renderObjectsRef.current.frameId);
        renderObjectsRef.current.introTimeline.kill();
        renderObjectsRef.current.renderer.dispose();
        renderObjectsRef.current.particleMaterial.dispose();
        renderObjectsRef.current.geometry.dispose();
        renderObjectsRef.current.bgMaterial.dispose();
        renderObjectsRef.current.bgGeometry.dispose();
        renderObjectsRef.current.sweepMaterial.dispose();
        renderObjectsRef.current.sweepGeometry.dispose();
        renderObjectsRef.current.rayMaterial.dispose();
        renderObjectsRef.current.rayGeometry.dispose();
        renderObjectsRef.current.beams.forEach((b) => b.mesh.material.dispose());
      }
    };
  }, [isStarted]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#0A0603] flex flex-col items-center justify-center overflow-hidden select-none"
        >
          {/* Three.js WebGL Canvas */}
          {isStarted && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
            />
          )}

          {/* White Screen Flash Effect */}
          {isStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={
                isStarted
                  ? {
                      opacity: [0, 0, 1, 0],
                    }
                  : { opacity: 0 }
              }
              transition={{
                times: [0, 0.61, 0.63, 1], // synchronized at exactly 2.2 seconds (out of ~3.5s total time)
                duration: 3.5,
                ease: "easeOut",
              }}
              className="absolute inset-0 bg-orange-50/90 pointer-events-none z-20 mix-blend-screen"
            />
          )}

          {!isStarted ? (
            // Netflix-inspired Cinematic Gate Screen
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6 px-4 z-10"
            >
              <p className="text-[#FDDCA8] font-mono text-xs md:text-sm tracking-[0.4em] uppercase font-bold text-glow">
                Chakravarthi Portfolio v2.0
              </p>
              <h1 className="text-4xl md:text-6xl font-sans font-extralight text-[#FFFAF0] tracking-[0.25em] uppercase">
                Cinematic Entrance
              </h1>
              <motion.button
                onClick={handleStart}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#C47D10",
                  color: "#FFFAF0",
                  borderColor: "#C47D10",
                }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-12 py-5 border border-white/20 bg-transparent rounded-full text-xs font-sans font-bold text-[#FFFAF0] tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_4px_30px_rgba(196,125,16,0.08)] hover:shadow-[0_0_45px_rgba(196,125,16,0.4)]"
              >
                Enter Experience
              </motion.button>
            </motion.div>
          ) : (
            // Premium Controls overlay
            <>
              {/* Mute/Unmute Control */}
              <div className="absolute top-8 left-8 z-30 flex items-center space-x-3">
                <button
                  onClick={toggleMute}
                  className="px-4 py-2 border border-white/10 bg-black/40 text-white/80 rounded-md text-xs font-sans tracking-[0.1em] uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  {isMuted ? "🔇 Unmute" : "🔊 Mute"}
                </button>
              </div>

              {/* Skip Intro Button */}
              {showSkip && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleSkip}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.12)" }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-10 right-10 z-30 px-6 py-3 border border-white/20 bg-black/40 text-white/80 rounded-md text-xs font-sans tracking-[0.15em] uppercase font-bold backdrop-blur-md transition-all duration-300 hover:text-white"
                >
                  Skip Intro
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Splash;
