import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CareerToolsProps {
  resumeText: string;
  targetRole: string;
  callAIPlain: (systemPrompt: string, userContent: string) => Promise<string>;
}

export const CareerTools: React.FC<CareerToolsProps> = ({ 
  resumeText, 
  targetRole, 
  callAIPlain 
}) => {
  const [activeTool, setActiveTool] = useState<'interview' | 'coverletter' | 'linkedin' | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const tools = [
    { 
      id: 'interview', 
      name: 'Interview Prep', 
      icon: '🎙️', 
      desc: 'Generate 5 behavioral & technical questions based on your background.',
      prompt: 'Generate exactly 5 realistic, high-impact interview questions (3 technical, 2 behavioral) based on this resume and target role. Provide concise responses for each as advice. Format: Question: ... Advice: ...'
    },
    { 
      id: 'coverletter', 
      name: 'Cover Letter', 
      icon: '✍️', 
      desc: 'Create a personalized, compelling cover letter for your target role.',
      prompt: 'Write a high-converting, professional cover letter based on this resume and target role. Keep it concise, engaging, and focus on value-add. Return ONLY the letter text.'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn Optimizer', 
      icon: '🔗', 
      desc: 'Optimize your profile with a killer headline and "About" section.',
      prompt: 'Generate a standout LinkedIn Headline and a 2-paragraph "About" section based on this resume. Return ONLY the headline and about section. Format: Headline: ... About: ...'
    }
  ] as const;

  const handleToolAction = async (toolId: 'interview' | 'coverletter' | 'linkedin') => {
    if (!resumeText) return;
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;

    setActiveTool(toolId);
    setIsLoading(true);
    setResult(null);

    try {
      const content = await callAIPlain(tool.prompt, `Target Role: ${targetRole}\n\nResume:\n${resumeText}`);
      setResult(content);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setResult(`Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tool Selection Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {tools.map(tool => (
          <motion.div
            key={tool.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleToolAction(tool.id)}
            style={{
              padding: '24px',
              background: activeTool === tool.id ? 'var(--accent-dim)' : 'var(--surface)',
              border: `1px solid ${activeTool === tool.id ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{tool.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{tool.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{tool.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Result Area */}
      <AnimatePresence mode='wait'>
        {(isLoading || result) && (
          <motion.div
            key="tool-result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="result-section"
            style={{ minHeight: 200 }}
          >
            <div className="result-section-head">
              {isLoading ? 'Generating Insights...' : tools.find(t => t.id === activeTool)?.name}
            </div>
            <div className="result-section-body">
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160, gap: 12 }}>
                  <span className="animate-spin" style={{ fontSize: 24, color: 'var(--accent)' }}>⟳</span>
                  <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Crafting your personalized career assets...</div>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'DM Sans, sans-serif', 
                    fontSize: 14, 
                    lineHeight: 1.8,
                    color: 'var(--text)',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    padding: '10px'
                  }}>
                    {result}
                  </pre>
                  <button
                    className="btn-sm accent"
                    onClick={() => navigator.clipboard.writeText(result || '')}
                    style={{ position: 'absolute', top: -10, right: 0, fontSize: 10, padding: '4px 10px' }}
                  >
                    📋 Copy Text
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
