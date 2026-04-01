import React from 'react';
import { motion } from 'framer-motion';

export const TipsView: React.FC = () => {
  const tips = [
    { title: 'The 6-Second Rule', desc: 'Recruiters spend an average of 6 seconds scaning a resume. Use clear headings and bullet points.', icon: '⏱️' },
    { title: 'Quantify Impact', desc: 'Instead of "Managed a team," use "Managed a team of 10+, increasing productivity by 25%."', icon: '📈' },
    { title: 'Keywords Matter', desc: 'ATS systems look for specific skills. Match your resume keywords to the job description.', icon: '🎯' },
    { title: 'Reverse Chronological', desc: 'Always list your most recent experience first. It is what recruiters care about most.', icon: '📅' },
    { title: 'Clean Typography', desc: 'Use professional fonts like DM Sans, Inter, or Roboto. Keep font size between 10-12pt.', icon: '✍️' },
    { title: 'Project Variety', desc: 'Showcase diverse projects that demonstrate both technical depth and soft skills.', icon: '🛠️' },
  ];

  return (
    <div className="fade-in-up">
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, marginBottom: 8 }}>Expert Resume Tips</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 32 }}>Proven strategies to help you land more interviews.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="feedback-card"
            style={{ 
              padding: '24px', 
              background: 'var(--surface)', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius)' 
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 16 }}>{tip.icon}</div>
            <div style={{ 
              fontWeight: 700, 
              fontSize: 16, 
              color: 'var(--accent)', 
              fontFamily: 'Playfair Display, serif',
              marginBottom: 8 
            }}>
              {tip.title}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{tip.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
