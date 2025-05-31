'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RiskAssessmentResult, ApplicantData } from "@/types";
import { ShieldCheck, ShieldAlert, ShieldX, BarChart3 } from 'lucide-react';

interface RiskAssessmentResultCardProps {
  result: RiskAssessmentResult | null;
}

function RiskLevelIndicator({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  if (level === 'Low') {
    return <ShieldCheck className="h-5 w-5 text-green-500" />;
  }
  if (level === 'Medium') {
    return <ShieldAlert className="h-5 w-5 text-yellow-500" />;
  }
  return <ShieldX className="h-5 w-5 text-red-500" />;
}

export function RiskAssessmentResultCard({ result }: RiskAssessmentResultCardProps) {
  if (!result) {
    return null;
  }

  const { applicantData, riskScore, flaggedFactors, explanation, riskLevel } = result;

  const displayData = [
    { label: "Applicant Name", value: applicantData.applicantName },
    { label: "Loan Amount", value: `$${applicantData.loanAmount.toLocaleString()}` },
    { label: "Annual Income", value: `$${applicantData.annualIncome.toLocaleString()}` },
    { label: "Credit Score", value: applicantData.creditScore },
    { label: "Loan Term", value: `${applicantData.loanTerm} months` },
    { label: "Employment Length", value: applicantData.employmentLength },
    { label: "Home Ownership", value: applicantData.homeOwnership },
  ];

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <BarChart3 className="h-6 w-6 text-primary" />
          Risk Assessment Result
        </CardTitle>
        <CardDescription>
          Summary of the loan default risk assessment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-card">
          <div>
            <p className="text-sm text-muted-foreground">Overall Risk Score</p>
            <p className={`text-3xl font-bold ${
              riskLevel === 'High' ? 'text-destructive' :
              riskLevel === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {riskScore.toFixed(0)} / 100
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RiskLevelIndicator level={riskLevel} />
            <Badge variant={
              riskLevel === 'High' ? 'destructive' :
              riskLevel === 'Medium' ? 'secondary' : // Using secondary, or could define a warning variant
              'default' // Default is primary, can be green if customized
            }
            className={`${
                riskLevel === 'High' ? '' :
                riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50 dark:bg-yellow-500/30 dark:text-yellow-300 dark:border-yellow-500/70' :
                'bg-green-500/20 text-green-700 border-green-500/50 dark:bg-green-500/30 dark:text-green-300 dark:border-green-500/70'
              }`}
            >
              {riskLevel} Risk
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Applicant Details</h3>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableBody>
                {displayData.map((item) => (
                  <TableRow key={item.label}>
                    <TableCell className="font-medium w-1/3">{item.label}</TableCell>
                    <TableCell>{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {flaggedFactors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Risk Factors</h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              {flaggedFactors.map((factor, index) => (
                <li key={index} className="text-sm">{factor}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">AI-Generated Explanation</h3>
          <p className="text-sm text-muted-foreground p-4 border rounded-md bg-secondary/50">
            {explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
