import React from 'react';
import { motion } from 'framer-motion';

interface HistoryEntry {
  id: number;
  role: string;
  result: any; // Using any for compatibility with expanding result objects
  date: string;
}

interface HistoryViewProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-glyph">📊</div>
        <div className="empty-title">No Audit History</div>
        <p style={{ fontSize: 13, opacity: 0.5 }}>Your previous resume audits will appear here.</p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24 }}>Audit History</h2>
        <button className="btn-sm" onClick={onClear}>Clear All</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {history.map(entry => (
          <motion.div
            key={entry.id}
            whileHover={{ scale: 1.01, borderColor: 'var(--accent-glow)' }}
            onClick={() => onSelect(entry)}
            className="history-item"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 20, 
              padding: '16px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            <div className="history-score" style={{ 
              width: 50, height: 50, borderRadius: '50%', 
              border: '2px solid var(--accent)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Playfair Display', fontWeight: 700, color: 'var(--accent)'
            }}>
              {entry.result?.score || 0}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{entry.role}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                {new Date(entry.date).toLocaleDateString()} · {entry.result?.verdict || 'No verdict'}
              </div>
            </div>
            <div style={{ 
              fontSize: 10, fontWeight: 800, padding: '4px 10px', 
              borderRadius: 12, background: 'var(--accent-dim)', color: 'var(--accent)',
              border: '1px solid var(--accent-glow)'
            }}>
              GRADE {entry.result?.grade || 'N/A'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
