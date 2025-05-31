export interface ApplicantData {
  applicantName: string;
  loanAmount: number;
  annualIncome: number;
  creditScore: number;
  loanTerm: number; // in months
  employmentLength: string;
  homeOwnership: string;
}

export interface RiskAssessmentResult {
  applicantData: ApplicantData;
  riskScore: number; // 0-100
  flaggedFactors: string[];
  explanation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export const employmentLengthOptions = [
  "< 1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
] as const;

export const homeOwnershipOptions = [
  "Rent",
  "Mortgage",
  "Own",
] as const;

export const loanTermOptions = [
  { label: "12 Months", value: 12 },
  { label: "24 Months", value: 24 },
  { label: "36 Months", value: 36 },
  { label: "48 Months", value: 48 },
  { label: "60 Months", value: 60 },
] as const;
