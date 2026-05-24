import { useState } from "react";
import { motion } from "framer-motion";
import "./AuraProject.css";

/* ─── DATA ─────────────────────────────────────────────────────────── */
const STATS = [
  { label: "13+ Phases", highlight: true },
  { label: "Lexer" },
  { label: "Parser" },
  { label: "AST" },
  { label: "Semantic Analysis" },
  { label: "Runtime" },
  { label: "REPL" },
  { label: "CLI Toolchain" },
  { label: "Formatter" },
  { label: "File I/O" },
  { label: "Concurrency" },
  { label: "VS Code Extension" },
];

const PIPELINE = [
  { label: "Source Code", cls: "source", sub: "Input" },
  { label: "Lexer", cls: "lexer", sub: "Tokenize" },
  { label: "Token Stream", cls: "token", sub: "Tokens" },
  { label: "Parser", cls: "parser", sub: "Syntax" },
  { label: "AST", cls: "ast", sub: "Tree" },
  { label: "Semantic Analysis", cls: "sem", sub: "Resolve" },
  { label: "Interpreter", cls: "interp", sub: "Evaluate" },
  { label: "Runtime", cls: "runtime", sub: "Execute" },
  { label: "Output", cls: "output", sub: "Result" },
];

const FEATURES = [
  { icon: "⚙️", name: "Compiler", desc: "Multi-phase compilation pipeline" },
  { icon: "🔄", name: "Interpreter", desc: "Tree-walk runtime evaluator" },
  { icon: "💻", name: "REPL", desc: "Interactive read-eval-print loop" },
  { icon: "🎨", name: "Formatter", desc: "Auto-format source with style rules" },
  { icon: "🔍", name: "Explain Mode", desc: "Step-by-step execution trace" },
  { icon: "🧠", name: "Semantic Engine", desc: "Type & scope resolution layer" },
  { icon: "📦", name: "Object Methods", desc: "First-class object method dispatch" },
  { icon: "📁", name: "File I/O", desc: "Built-in read/write file operations" },
  { icon: "⚡", name: "Concurrency Runtime", desc: "Thread-isolated task execution" },
  { icon: "🧩", name: "VS Code Extension", desc: "Syntax highlighting & snippets" },
];

const CHALLENGES = [
  {
    icon: "🔁",
    title: "Recursive Descent + Pratt Parser",
    desc: "Built a hand-rolled Pratt parser supporting operator precedence, associativity, and prefix/infix expressions.",
  },
  {
    icon: "🌲",
    title: "AST Immutability",
    desc: "Nodes are structurally frozen post-parse, preventing mutation bugs across semantic passes.",
  },
  {
    icon: "📋",
    title: "Semantic Registry",
    desc: "Scope-aware symbol registry with nested environment chains and lexical scoping rules.",
  },
  {
    icon: "🛡️",
    title: "Runtime Safety",
    desc: "Typed-value dispatch with runtime guards, null coercion protection, and call-stack depth limits.",
  },
  {
    icon: "🧵",
    title: "Thread Isolation",
    desc: "Each concurrent task runs in an isolated interpreter context with no shared mutable state.",
  },
  {
    icon: "📦",
    title: "CLI Packaging",
    desc: "Zero-dependency CLI distributable with shebang support, global install, and sub-command routing.",
  },
  {
    icon: "🎨",
    title: "VS Code Grammar Mapping",
    desc: "Hand-crafted TextMate grammar with regex-scoped token matching for full syntax highlighting.",
  },
];

const CODE_EXAMPLES = {
  Basic: {
    filename: "hello.aura",
    code: `<span class="tok-cmt">// Hello World in AURA</span>
<span class="tok-fn">print</span><span class="tok-punc">(</span><span class="tok-str">"Hello from AURA"</span><span class="tok-punc">);</span>`,
    raw: `// Hello World in AURA\nprint("Hello from AURA");`,
  },
  Intermediate: {
    filename: "factorial.aura",
    code: `<span class="tok-cmt">// Recursive factorial — AURA functions</span>
<span class="tok-kw">func</span> <span class="tok-fn">factorial</span><span class="tok-punc">(</span>n<span class="tok-punc">) {</span>
  <span class="tok-kw">if</span> <span class="tok-punc">(</span>n <span class="tok-op">&lt;=</span> <span class="tok-num">1</span><span class="tok-punc">)</span> <span class="tok-kw">return</span> <span class="tok-num">1</span><span class="tok-punc">;</span>
  <span class="tok-kw">return</span> n <span class="tok-op">*</span> <span class="tok-fn">factorial</span><span class="tok-punc">(</span>n <span class="tok-op">-</span> <span class="tok-num">1</span><span class="tok-punc">);</span>
<span class="tok-punc">}</span>

<span class="tok-fn">print</span><span class="tok-punc">(</span><span class="tok-fn">factorial</span><span class="tok-punc">(</span><span class="tok-num">10</span><span class="tok-punc">));</span>  <span class="tok-cmt">// → 3628800</span>`,
    raw: `// Recursive factorial\nfunc factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nprint(factorial(10)); // → 3628800`,
  },
  Advanced: {
    filename: "advanced.aura",
    code: `<span class="tok-cmt">// Struct + File I/O + Concurrency</span>
<span class="tok-kw">struct</span> <span class="tok-type">LogEntry</span> <span class="tok-punc">{</span>
  <span class="tok-fn">init</span><span class="tok-punc">(</span>level<span class="tok-punc">,</span> msg<span class="tok-punc">) {</span>
    <span class="tok-kw">self</span>.level <span class="tok-op">=</span> level<span class="tok-punc">;</span>
    <span class="tok-kw">self</span>.msg   <span class="tok-op">=</span> msg<span class="tok-punc">;</span>
  <span class="tok-punc">}</span>
  <span class="tok-fn">format</span><span class="tok-punc">() {</span>
    <span class="tok-kw">return</span> <span class="tok-str">"["</span> <span class="tok-op">+</span> <span class="tok-kw">self</span>.level <span class="tok-op">+</span> <span class="tok-str">"] "</span> <span class="tok-op">+</span> <span class="tok-kw">self</span>.msg<span class="tok-punc">;</span>
  <span class="tok-punc">}</span>
<span class="tok-punc">}</span>

<span class="tok-cmt">// Concurrent log writer</span>
<span class="tok-kw">spawn</span> <span class="tok-punc">{</span>
  <span class="tok-kw">var</span> entry <span class="tok-op">=</span> <span class="tok-type">LogEntry</span><span class="tok-punc">(</span><span class="tok-str">"INFO"</span><span class="tok-punc">,</span> <span class="tok-str">"Runtime started"</span><span class="tok-punc">);</span>
  <span class="tok-fn">writeFile</span><span class="tok-punc">(</span><span class="tok-str">"app.log"</span><span class="tok-punc">,</span> entry.<span class="tok-fn">format</span><span class="tok-punc">());</span>
<span class="tok-punc">}</span>

<span class="tok-fn">print</span><span class="tok-punc">(</span><span class="tok-fn">readFile</span><span class="tok-punc">(</span><span class="tok-str">"app.log"</span><span class="tok-punc">));</span>`,
    raw: `// Struct + File I/O + Concurrency\nstruct LogEntry {\n  init(level, msg) {\n    self.level = level;\n    self.msg   = msg;\n  }\n  format() {\n    return "[" + self.level + "] " + self.msg;\n  }\n}\n\nspawn {\n  var entry = LogEntry("INFO", "Runtime started");\n  writeFile("app.log", entry.format());\n}\n\nprint(readFile("app.log"));`,
  },
};

/* ─── ANIMATION VARIANTS ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/* ─── COPY HELPER ────────────────────────────────────────────────── */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return { copied, copy };
}

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const AuraProject = () => {
  const [activeTab, setActiveTab] = useState("Basic");
  const { copied, copy } = useCopy();

  return (
    <section id="aura" className="aura-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: "relative", zIndex: 1 }}>

        {/* ── SECTION HEADING ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <div className="aura-title-tag">◆ Flagship Engineering Project</div>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              background: "linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 50%, #c4b5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 12,
            }}
          >
            AURA 2.0
          </h2>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: "1rem" }}>
            Explainable Offline Programming Language &amp; Compiler Ecosystem
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            1. FEATURED CARD
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="aura-card"
          style={{ marginBottom: 40 }}
        >
          {/* corner accents */}
          <div className="aura-card-corner" />
          <div className="aura-card-corner-v" />

          {/* logo + version */}
          <div className="aura-logo-badge">
            {/* Monogram icon */}
            <img
              src="https://auraa1.vercel.app/images/aura-monogram.png"
              alt="AURA monogram"
              className="aura-logo-img"
              style={{ borderRadius: "10px", background: "#000" }}
            />
            {/* Horizontal wordmark */}
            <img
              src="https://auraa1.vercel.app/images/aura-horizontal.png"
              alt="AURA"
              style={{ height: 28, objectFit: "contain", filter: "brightness(1.1)" }}
            />
            <span className="aura-version-badge">v2.0 · Stable</span>
          </div>

          {/* title */}
          <div className="aura-card-title">
            AURA 2.0 — Explainable Offline Programming Language
          </div>
          <p className="aura-card-subtitle">
            An offline-first compiler and runtime ecosystem built for transparent
            execution and language engineering. From Lexer to Runtime — every phase
            hand-crafted, documented, and explainable.
          </p>

          {/* action buttons */}
          <div className="aura-btn-group">
            <a
              href="https://auraa1.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="aura-btn-primary"
              id="aura-view-docs"
            >
              <span>📄</span> View Docs
            </a>
            <a
              href="https://github.com/Chakravarthi1999"
              target="_blank"
              rel="noopener noreferrer"
              className="aura-btn-ghost"
              id="aura-github-repo"
            >
              <span>⭐</span> GitHub Repo
            </a>
            <button
              className="aura-btn-ghost"
              id="aura-architecture-btn"
              onClick={() => {
                document.getElementById("aura-architecture")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>🗺️</span> Architecture
            </button>
            <a
              href="https://marketplace.visualstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="aura-btn-ghost"
              id="aura-vscode-ext"
            >
              <span>🧩</span> VS Code Extension
            </a>
          </div>

          {/* stats bar */}
          <div className="aura-stats-bar">
            {STATS.map((s) => (
              <span key={s.label} className={`aura-stat-pill${s.highlight ? " highlight" : ""}`}>
                <span className="aura-stat-dot" />
                {s.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            2. ARCHITECTURE PIPELINE
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          id="aura-architecture"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          style={{ marginBottom: 56 }}
        >
          <div className="aura-sub-title">⚙️ Compiler Pipeline</div>
          <p className="aura-sub-desc">
            End-to-end architecture — every stage is isolated, testable, and inspectable
          </p>
          <div className="aura-pipeline">
            {PIPELINE.map((step, i) => (
              <div key={step.label} className="aura-pipe-step">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className={`aura-pipe-box ${step.cls}`}>
                    {step.label}
                    <span className="aura-pipe-label">{step.sub}</span>
                  </div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div className="aura-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            3. FEATURE GRID
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          style={{ marginBottom: 56 }}
        >
          <div className="aura-sub-title">🔧 Feature Modules</div>
          <p className="aura-sub-desc">Every module is independently designed and shipped</p>
          <div className="aura-feature-grid">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.name}
                custom={i}
                variants={fadeUp}
                className="aura-feat-card"
              >
                <div className="aura-feat-icon">{f.icon}</div>
                <div>
                  <div className="aura-feat-name">{f.name}</div>
                  <div className="aura-feat-desc">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            4. CODE DEMO
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          style={{ marginBottom: 56 }}
        >
          <div className="aura-sub-title">💻 Code Playground</div>
          <p className="aura-sub-desc">Real AURA syntax — from basics to advanced patterns</p>

          {/* tabs */}
          <div className="aura-code-tabs">
            {Object.keys(CODE_EXAMPLES).map((tab) => (
              <button
                key={tab}
                className={`aura-code-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
                id={`aura-code-tab-${tab.toLowerCase()}`}
              >
                {tab === "Basic" && "🟢 "}
                {tab === "Intermediate" && "🟡 "}
                {tab === "Advanced" && "🔴 "}
                {tab}
              </button>
            ))}
          </div>

          <div className="aura-code-window">
            <div className="aura-code-header">
              <div className="aura-code-dots">
                <div className="aura-code-dot" style={{ background: "#ef4444" }} />
                <div className="aura-code-dot" style={{ background: "#eab308" }} />
                <div className="aura-code-dot" style={{ background: "#22c55e" }} />
              </div>
              <span className="aura-code-filename">
                {CODE_EXAMPLES[activeTab].filename}
              </span>
              <button
                className="aura-code-copy"
                onClick={() => copy(CODE_EXAMPLES[activeTab].raw)}
                id={`aura-copy-${activeTab.toLowerCase()}`}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div className="aura-code-body">
              <pre dangerouslySetInnerHTML={{ __html: CODE_EXAMPLES[activeTab].code }} />
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            5. ENGINEERING CHALLENGES
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          style={{ marginBottom: 56 }}
        >
          <div className="aura-sub-title">🚧 Engineering Challenges</div>
          <p className="aura-sub-desc">
            Real problems solved — not tutorials, not wrappers
          </p>
          <div className="aura-challenges-grid">
            {CHALLENGES.map((c, i) => (
              <motion.div
                key={c.title}
                custom={i}
                variants={fadeUp}
                className="aura-challenge-card"
              >
                <div className="aura-challenge-icon">{c.icon}</div>
                <div className="aura-challenge-title">{c.title}</div>
                <div className="aura-challenge-desc">{c.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            6. BUILD NOTE
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="aura-build-note" id="aura-build-note">
            <div className="aura-build-note-icon">🛠️</div>
            <div>
              <div className="aura-build-note-text">
                <strong>Built it to understand how languages actually work.</strong>{" "}
                Started with a tokenizer. Kept going — parser, scopes, runtime, concurrency model, VS Code grammar.
                Each part broke in unexpected ways and had to be reasoned through.
                The docs walk through the real internals — not a high-level tour,
                the actual decisions made at each phase and why.
              </div>
              <a
                href="https://auraa1.vercel.app/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="aura-build-note-link"
                id="aura-live-link"
              >
                Read the docs — see how it's put together →
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AuraProject;
