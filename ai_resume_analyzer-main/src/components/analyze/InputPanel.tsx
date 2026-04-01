import React from 'react';
import type { AnalysisResult, ATSMatchResult, LoadingStates } from '../../types';

interface InputPanelProps {
  file: File | null;
  resumeText: string;
  targetRole: string;
  jobDescription: string;
  isAnalyzing: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
  onResumeTextChange: (text: string) => void;
  onTargetRoleChange: (role: string) => void;
  onJobDescriptionChange: (jd: string) => void;
  onRunAnalysis: () => void;
  error: string | null;
  loadingStates: LoadingStates;
  result: AnalysisResult | null;
  atsResult: ATSMatchResult | null;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  file,
  resumeText,
  targetRole,
  jobDescription,
  isAnalyzing,
  onFileUpload,
  onClearFile,
  onResumeTextChange,
  onTargetRoleChange,
  onJobDescriptionChange,
  onRunAnalysis,
  error,
  loadingStates,
  result,
  atsResult,
}) => {
  const anyLoading = Object.values(loadingStates).some(Boolean);

  return (
    <div className="panel">
      <div className="panel-head">📋 Source Input</div>
      <div className="panel-body">
        <div className="drop-zone">
          <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.15 }}>📄</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Drop resume PDF
          </div>
          <div style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>
            or click to browse
          </div>
          <input type="file" accept=".pdf" onChange={onFileUpload} />
        </div>

        {file && (
          <div className="file-badge">
            <span>{file.name}</span>
            <button onClick={onClearFile}>✕</button>
          </div>
        )}

        <textarea
          className="resume-textarea"
          value={resumeText}
          onChange={e => onResumeTextChange(e.target.value)}
          placeholder="Or paste your resume text here..."
        />

        {/* Target Role Input */}
        <div className="role-input-wrap">
          <label className="role-label">
            <span className="role-label-icon">🎯</span>
            Target Job Role
          </label>
          <input
            type="text"
            className="role-input"
            value={targetRole}
            onChange={e => onTargetRoleChange(e.target.value)}
            placeholder="e.g. Frontend Developer, Data Scientist..."
          />
        </div>

        {/* Job Description Input (New) */}
        <div className="role-input-wrap">
          <label className="role-label">
            <span className="role-label-icon">📄</span>
            Job Description (Optional)
          </label>
          <textarea
            className="role-input"
            style={{ minHeight: '100px', resize: 'vertical' }}
            value={jobDescription}
            onChange={e => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the job description here for elite accuracy..."
          />
        </div>

        <button
          className="btn-primary"
          disabled={isAnalyzing || !resumeText}
          onClick={onRunAnalysis}
        >
          {isAnalyzing ? (
            <>
              <span className="animate-spin" style={{ display: 'inline-block' }}>⟳</span>
              ANALYZING...
            </>
          ) : (
            <>🔥 FULL ANALYSIS</>
          )}
        </button>

        {error && (
          <div className={`error-box ${error.includes('API Key') ? 'auth-error' : ''}`}>
            <span style={{ marginRight: 8 }}>⚠️</span>
            {error}
            {error.includes('API Key') && (
              <div style={{ marginTop: 8, fontSize: 11, opacity: 0.8 }}>
                Tip: Try the <strong>✦ Demo Audit</strong> in the hero section if you don't have a key.
              </div>
            )}
          </div>
        )}

        {/* Analysis Progress */}
        {anyLoading && (
          <div className="analysis-progress">
            {[
              { key: 'main', label: 'Core Analysis', icon: '📊' },
              { key: 'ats', label: 'ATS Match', icon: '🎯' },
              { key: 'skills', label: 'Skill Gap', icon: '🧩' },
              { key: 'summary', label: 'Summary', icon: '✍️' },
              { key: 'experience', label: 'Experience', icon: '📈' },
              { key: 'sections', label: 'Sections', icon: '📝' },
              { key: 'fixes', label: 'Quick Fixes', icon: '⚡' },
            ].map(item => (
              <div key={item.key} className={`progress-item ${loadingStates[item.key] ? 'loading' : (result || atsResult ? 'done' : '')}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {loadingStates[item.key] ? (
                  <span className="animate-spin" style={{ fontSize: 10 }}>⟳</span>
                ) : (
                  <span style={{ fontSize: 10, color: 'var(--accent)' }}>✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
