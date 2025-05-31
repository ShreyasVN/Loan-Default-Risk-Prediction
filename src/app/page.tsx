'use client';

import React, { useState, useCallback } from 'react';
import { AppHeader } from "@/components/AppHeader";
import { ModelUploadCard } from "@/components/ModelUploadCard";
import { ApplicantDataForm } from "@/components/ApplicantDataForm";
import { RiskAssessmentResultCard } from "@/components/RiskAssessmentResultCard";
import type { ApplicantData, RiskAssessmentResult as RiskAssessmentResultType } from "@/types";
import { generateExplanation, type GenerateExplanationInput } from '@/ai/flows/generate-explanation';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function RiskRadarPage() {
  const [isModelUploaded, setIsModelUploaded] = useState(false);
  const [uploadedModelName, setUploadedModelName] = useState<string | undefined>(undefined);
  const [riskAssessmentResult, setRiskAssessmentResult] = useState<RiskAssessmentResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleModelUploaded = useCallback((uploaded: boolean, modelName?: string) => {
    setIsModelUploaded(uploaded);
    setUploadedModelName(modelName);
    if (!uploaded) {
      setRiskAssessmentResult(null); // Clear results if model is removed
    }
  }, []);

  const handleFormSubmit = async (data: ApplicantData) => {
    setIsLoading(true);
    setRiskAssessmentResult(null);

    try {
      // Simulate risk score and flagged factors
      const mockRiskScore = Math.random() * 100;
      let mockFlaggedFactors: string[] = [];
      let riskLevel: 'Low' | 'Medium' | 'High';

      if (mockRiskScore < 40) {
        riskLevel = 'Low';
      } else if (mockRiskScore < 70) {
        riskLevel = 'Medium';
        mockFlaggedFactors.push("Moderate debt-to-income ratio");
        if (data.creditScore < 680) mockFlaggedFactors.push("Below average credit score");
      } else {
        riskLevel = 'High';
        mockFlaggedFactors.push("High debt-to-income ratio");
        if (data.creditScore < 620) mockFlaggedFactors.push("Low credit score");
        if (data.employmentLength === "< 1 year") mockFlaggedFactors.push("Short employment history");
      }
      
      // Ensure there's at least one factor if not low risk
      if (riskLevel !== 'Low' && mockFlaggedFactors.length === 0) {
        mockFlaggedFactors.push("General risk factors present");
      }


      const aiInput: GenerateExplanationInput = {
        applicantData: data, // The AI flow expects a record, which ApplicantData fits
        riskScore: mockRiskScore,
        flaggedFactors: mockFlaggedFactors,
      };

      const explanationResult = await generateExplanation(aiInput);

      setRiskAssessmentResult({
        applicantData: data,
        riskScore: mockRiskScore,
        flaggedFactors: mockFlaggedFactors,
        explanation: explanationResult.explanation,
        riskLevel: riskLevel,
      });

      toast({
        title: "Assessment Complete",
        description: `Risk assessment for ${data.applicantName} is ready.`,
      });

    } catch (error) {
      console.error("Error generating explanation:", error);
      toast({
        title: "Error",
        description: "Failed to generate risk explanation. Please try again.",
        variant: "destructive",
      });
      setRiskAssessmentResult(null); // Clear potentially partial results on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // setIsModelUploaded(false); // Optionally reset model upload status
    // setUploadedModelName(undefined); // Optionally reset model name
    setRiskAssessmentResult(null);
    setIsLoading(false);
    // Optionally clear form fields if ApplicantDataForm exposes a reset method or by re-keying it.
    // For simplicity, we are just clearing the result.
    toast({
      title: "Form Reset",
      description: "Assessment cleared. You can enter new data.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-6">
        <div className="space-y-8 max-w-3xl mx-auto">
          <ModelUploadCard onModelUploaded={handleModelUploaded} />
          <ApplicantDataForm 
            onSubmit={handleFormSubmit} 
            isModelUploaded={isModelUploaded}
            isLoading={isLoading} 
          />
          {riskAssessmentResult && (
            <>
              <RiskAssessmentResultCard result={riskAssessmentResult} />
              <div className="text-center">
                <Button onClick={handleReset} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start New Assessment
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} RiskRadar. All rights reserved.
      </footer>
    </div>
  );
}
