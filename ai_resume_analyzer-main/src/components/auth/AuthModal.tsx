import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Unlock Premium Insights", 
  subtitle = "You've used your free trial. Sign up to unlock full history, career tools, and unlimited audits." 
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate a premium login experience
    await new Promise(resolve => setTimeout(resolve, 1500));
    login({ email, name: email.split('@')[0] });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '440px',
              zIndex: 1001,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px', 
                filter: 'drop-shadow(0 0 12px var(--accent-glow))' 
              }}>
                ✨
              </div>
              <h2 style={{ 
                fontFamily: 'Playfair Display, serif', 
                fontSize: '28px', 
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                {title}
              </h2>
              <p style={{ 
                fontSize: '14px', 
                color: 'var(--text2)', 
                lineHeight: '1.6',
                textAlign: 'center',
                maxWidth: '320px'
              }}>
                {subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="role-input-wrap" style={{ marginTop: 0 }}>
                <label className="role-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="role-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSubmitting}
                style={{ margin: 0 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    AUTHENTICATING...
                  </>
                ) : (
                  "CONTINUE WITH EMAIL"
                )}
              </button>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                margin: '8px 0' 
              }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button type="button" className="btn-sm" style={{ padding: '12px' }}>
                  Google
                </button>
                <button type="button" className="btn-sm" style={{ padding: '12px' }}>
                  LinkedIn
                </button>
              </div>

              <p style={{ 
                fontSize: '11px', 
                textAlign: 'center', 
                marginTop: '16px', 
                color: 'var(--text2)',
                opacity: 0.6
              }}>
                By continuing, you agree to our Terms of Service.
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
