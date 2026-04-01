export interface AnalysisResult {
  score: number;
  verdict: string;
  summary: string;
  grade: string;
  categories: {
    impact: number;
    skills: number;
    structure: number;
    ats: number;
  };
  strengths: string[];
  improvements: string[];
  keywords_found: string[];
  keywords_missing: string[];
}

export interface ATSMatchResult {
  ats_match_score: number;
  missing_keywords: string[];
  matched_keywords: string[];
}

export interface SkillGapResult {
  required_skills: string[];
  missing_skills: string[];
  suggested_skills_to_learn: string[];
}

export interface HistoryEntry {
  id: number;
  role: string;
  result: AnalysisResult;
  date: string;
}

export interface LoadingStates {
  main: boolean;
  ats: boolean;
  skills: boolean;
  summary: boolean;
  sections: boolean;
  fixes: boolean;
  [key: string]: boolean;
}
