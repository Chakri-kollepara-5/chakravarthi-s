import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'

// Modular Components
import { Header } from './components/layout/Header'
import { AuthModal } from './components/auth/AuthModal'
import { InputPanel } from './components/analyze/InputPanel'
import { CareerTools } from './components/tools/CareerTools'
import { HistoryView } from './components/history/HistoryView'
import { TipsView } from './components/tips/TipsView'
import { useAuth } from './context/AuthContext'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL
const MODEL = import.meta.env.VITE_OPENAI_MODEL

// ─── Interfaces ───
interface AnalysisResult {
  score: number; verdict: string; summary: string; grade: string;
  categories: { impact: number; skills: number; structure: number; ats: number };
  strengths: string[]; improvements: string[]; keywords_found: string[]; keywords_missing: string[];
}
interface ATSMatchResult { ats_match_score: number; missing_keywords: string[]; matched_keywords: string[]; }
interface SkillGapResult { required_skills: string[]; missing_skills: string[]; suggested_skills_to_learn: string[]; }
interface SectionFeedbackResult { education_feedback: string; experience_feedback: string; projects_feedback: string; }
interface HistoryEntry { id: number; role: string; result: AnalysisResult; date: string; }

export default function App() {
  const { isLoggedIn, trialUsed, incrementAnalysis } = useAuth();
  const [view, setView] = useState<'analyse' | 'history' | 'tips' | 'tools'>('analyse')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // State
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    return JSON.parse(localStorage.getItem('resumeiq_full_history') || '[]');
  });

  // Results
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [atsResult, setAtsResult] = useState<ATSMatchResult | null>(null)
  const [skillGap, setSkillGap] = useState<SkillGapResult | null>(null)
  const [resumeSummary, setResumeSummary] = useState<string | null>(null)
  const [sectionFeedback, setSectionFeedback] = useState<SectionFeedbackResult | null>(null)

  const [loadingStates, setLoadingStates] = useState({
    main: false, ats: false, skills: false, summary: false, sections: false, fixes: false,
  })

  // Effects
  useEffect(() => {
    localStorage.setItem('resumeiq_full_history', JSON.stringify(history));
  }, [history]);

  // Auth Guard for Nav
  const handleNav = (newView: typeof view) => {
    if ((newView === 'history' || newView === 'tools') && trialUsed && !isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setView(newView);
  }

  // ─── API Helpers ───
  async function callAI(systemPrompt: string, userContent: string): Promise<string> {
    try {
      const resp = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userContent }],
          response_format: { type: 'json_object' },
        }),
      })

      if (resp.status === 401) {
        throw new Error('AUTH_ERROR: Invalid API Key. Please update your .env file with a valid VITE_OPENAI_API_KEY.');
      }
      
      if (!resp.ok) throw new Error(`API error ${resp.status}`);
      
      const data = await resp.json();
      const rawContent = data.choices[0].message.content.trim();
      // Extract the first JSON object found in the response for maximum robustness
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      return jsonMatch ? jsonMatch[0] : rawContent;
    } catch (err: any) {
      if (err.message.includes('AUTH_ERROR')) throw err;
      throw new Error(`Connection Error: ${err.message}`);
    }
  }

  async function callAIPlain(systemPrompt: string, userContent: string): Promise<string> {
    try {
      const resp = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userContent }],
        }),
      })

      if (resp.status === 401) {
        throw new Error('AUTH_ERROR: Invalid API Key. Please update your .env file.');
      }
      
      if (!resp.ok) throw new Error(`API error ${resp.status}`);
      
      const data = await resp.json();
      return data.choices[0].message.content.trim();
    } catch (err: any) {
      throw err;
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f); setError(null);
    try {
      const buf = await f.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i); const tc = await page.getTextContent();
        text += tc.items.map((item: any) => item.str).join(' ') + '\n'
      }
      setResumeText(text.trim())
    } catch { setError('Failed to extract text from PDF. Try copy-pasting your resume below.'); }
  }

  const runAnalysis = async (demo = false) => {
    if (trialUsed && !isLoggedIn && !demo) { setIsAuthModalOpen(true); return; }
    if ((!resumeText && !demo) || isAnalyzing) return
    setIsAnalyzing(true); setError(null); clearResults()

    const role = targetRole.trim() || 'Software Engineer'
    const jd = jobDescription.trim()

    if (demo) {
      await new Promise(r => setTimeout(r, 2000))
      setResult({
        score: 95, verdict: 'Elite Candidate Output', grade: 'A',
        summary: 'Outstanding structural impact, keyword density, and narrative coherence.',
        categories: { impact: 98, skills: 92, structure: 88, ats: 96 },
        strengths: ['Strong quantified impact statements', 'Excellent keyword alignment'],
        improvements: ['Add date ranges to experience', 'Include specific technology keywords'],
        keywords_found: ['Kubernetes', 'CI/CD', 'Rust', 'EKS'], keywords_missing: ['Istio', 'GraphQL'],
      });
      setAtsResult({ ats_match_score: 92, matched_keywords: ['K8s', 'React'], missing_keywords: ['Istio'] });
      setIsAnalyzing(false); return;
    }

    const setLoading = (key: string, val: boolean) => setLoadingStates(prev => ({ ...prev, [key]: val }))
    const promises: Promise<void>[] = []
    const contextStr = `Target Role: ${role}\n${jd ? `Job Description:\n${jd}\n` : ''}\nResume:\n${resumeText}`;

    promises.push((async () => {
      setLoading('main', true);
      try {
        const sys = `You are a Resume Expert. Return ONLY valid JSON with no markdown formatting. Schema: { "score": number, "verdict": "string", "summary": "string", "grade": "letter", "categories": { "impact": number, "skills": number, "structure": number, "ats": number }, "strengths": ["string"], "improvements": ["string"], "keywords_found": ["string"], "keywords_missing": ["string"] }`;
        const content = await callAI(sys, contextStr);
        const parsed = JSON.parse(content); setResult(parsed);
        setHistory(prev => [{ id: Date.now(), role, result: parsed, date: new Date().toISOString() }, ...prev]);
      } catch (err: any) { 
        setError(err.message.includes('AUTH_ERROR') ? err.message.replace('AUTH_ERROR: ', '') : `Analysis Error: ${err.message}`); 
      } finally {
        setLoading('main', false);
      }
    })());

    promises.push((async () => {
      setLoading('ats', true);
      setLoading('ats', true);
      try {
        const sys = `Return ONLY valid JSON. Schema: { "ats_match_score": number, "missing_keywords": ["string"], "matched_keywords": ["string"] }`;
        const content = await callAI(sys, contextStr);
        setAtsResult(JSON.parse(content));
      } catch {} finally {
        setLoading('ats', false);
      }
    })());

    promises.push((async () => {
      setLoading('skills', true);
      setLoading('skills', true);
      try {
        const sys = `Identify skill gaps for role. Return ONLY JSON. Schema: { "required_skills": ["string"], "missing_skills": ["string"], "suggested_skills_to_learn": ["string"] }`;
        const content = await callAI(sys, contextStr);
        setSkillGap(JSON.parse(content));
      } catch {} finally {
        setLoading('skills', false);
      }
    })());

    promises.push((async () => {
      setLoading('summary', true);
      try {
        const sys = `Return ONLY JSON. Schema: { "summary": "string" }`;
        const content = await callAI(sys, contextStr);
        setResumeSummary(JSON.parse(content).summary);
      } catch {} finally {
        setLoading('summary', false);
      }
    })());

    await Promise.allSettled(promises)
    setIsAnalyzing(false); incrementAnalysis();
  }

  const clearResults = () => { setResult(null); setAtsResult(null); setSkillGap(null); setResumeSummary(null); }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="bg-ambient" />
      <div className="grid-bg" />
      <Header view={view} setView={handleNav} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <main style={{ position: 'relative', zIndex: 1, paddingBottom: 80, maxWidth: 1200, margin: '0 auto' }}>
        <AnimatePresence mode='wait'>
          {view === 'analyse' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section className="hero">
                <div className="hero-chip">AI-Powered SaaS Analysis</div>
                <h1 style={{ marginBottom: 16 }}>Your resume, <br /><em>honestly</em> rated.</h1>
                <p className="hero-sub" style={{ marginBottom: 40 }}>Full score, precision JD matching, and automated career preparation tools.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button className="btn-primary" style={{ maxWidth: 220 }} onClick={() => runAnalysis(true)}>✦ DEMO AUDIT</button>
                </div>
              </section>

              <div className="main-grid">
                <InputPanel 
                  file={file} resumeText={resumeText} targetRole={targetRole} jobDescription={jobDescription}
                  isAnalyzing={isAnalyzing} onFileUpload={handleFileUpload} onClearFile={() => { setFile(null); setResumeText('') }}
                  onResumeTextChange={setResumeText} onTargetRoleChange={setTargetRole} onJobDescriptionChange={setJobDescription}
                  onRunAnalysis={() => runAnalysis(false)} error={error} loadingStates={loadingStates} result={result} atsResult={atsResult}
                />

                <div className="results-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {!result && !atsResult && !Object.values(loadingStates).some(Boolean) ? (
                    <div className="empty-state">
                      <div className="empty-glyph">🔎</div>
                      <div className="empty-title">Awaiting Input</div>
                    </div>
                  ) : (
                    <>
                      {resumeSummary && <div className="exp-summary-banner"><p className="summary-text">{resumeSummary}</p></div>}
                      {result && (
                        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ width: 4, height: 20, background: 'var(--accent)', borderRadius: 2 }} />
                            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Executive Audit Result</h3>
                          </div>
                          
                          <div className="score-card">
                            <div className="ring-wrap">
                              <div className="ring-score">{result.score}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div className="score-grade">Tier: {result.grade}</div>
                              <div className="score-verdict">{result.verdict}</div>
                              <p className="score-summary">{result.summary}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {atsResult && (
                        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                            <div style={{ width: 4, height: 16, background: 'var(--blue)', borderRadius: 2 }} />
                            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Target Match Matrix</h3>
                          </div>
                          <div className="result-section">
                            <div className="result-section-head">🎯 JD Match Analysis</div>
                            <div className="result-section-body">
                              <div className="ats-score-wrap">
                                <div className="ats-ring">
                                  <div className="ats-ring-center">
                                    <div className="ats-ring-score">{atsResult.ats_match_score}%</div>
                                  </div>
                                </div>
                                <div className="ats-keywords">
                                  <div className="ats-kw-label matched">✓ MATCHED</div>
                                  <div className="kw-grid">
                                    {atsResult.matched_keywords.map((k, i) => <span key={i} className="kw kw-found">{k}</span>)}
                                  </div>
                                  <div className="ats-kw-label missing" style={{ marginTop: 12 }}>✕ MISSING</div>
                                  <div className="kw-grid">
                                    {atsResult.missing_keywords.map((k, i) => <span key={i} className="kw kw-missing">{k}</span>)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {skillGap && (
                        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                            <div style={{ width: 4, height: 16, background: 'var(--coral)', borderRadius: 2 }} />
                            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Strategic Skill Gap Identification</h3>
                          </div>
                          <div className="result-section">
                            <div className="result-section-body">
                              <div className="skill-gap-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                <div className="skill-col">
                                  <div className="skill-col-head missing">⚠️ Critical Gaps</div>
                                  {skillGap.missing_skills?.map((s, i) => <div key={i} className="skill-tag missing">{s}</div>)}
                                </div>
                                <div className="skill-col">
                                  <div className="skill-col-head learn">🚀 Upskilling Roadmap</div>
                                  {skillGap.suggested_skills_to_learn?.map((s, i) => <div key={i} className="skill-tag learn">{s}</div>)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'history' && <HistoryView history={history} onSelect={(e) => { setResult(e.result); setView('analyse') }} onClear={() => setHistory([])} />}
          {view === 'tips' && <TipsView />}
          {view === 'tools' && (
            <div className="fade-in-up">
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, marginBottom: 8 }}>Career Suite</h2>
              <p style={{ color: 'var(--text2)', marginBottom: 32 }}>Leverage advanced AI to craft high-impact career assets.</p>
              <CareerTools resumeText={resumeText} targetRole={targetRole} callAI={callAI} callAIPlain={callAIPlain} />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
