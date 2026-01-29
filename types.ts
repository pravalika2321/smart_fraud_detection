
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface JobInputData {
  title: string;
  company: string;
  salary: string;
  location: string;
  email: string;
  website: string;
  description: string;
  sourceType: 'manual' | 'email' | 'file';
}

export interface AnalysisResult {
  result: 'Fake Job' | 'Genuine Job';
  confidence_score: number;
  risk_rate: number;
  risk_level: RiskLevel;
  explanations: string[];
  safety_tips: string[];
}

export interface AnalysisResponse {
  data: AnalysisResult | null;
  loading: boolean;
  error: string | null;
}
