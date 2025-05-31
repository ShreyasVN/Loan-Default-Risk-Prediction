'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ModelUploadCardProps {
  onModelUploaded: (isUploaded: boolean, modelName?: string) => void;
}

export function ModelUploadCard({ onModelUploaded }: ModelUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [modelName, setModelName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.name.endsWith('.pkl') || file.name.endsWith('.joblib') || file.name.endsWith('.sav')) { // Common model formats
        setSelectedFile(file);
        setIsUploaded(false); // Reset upload status on new file selection
        setModelName(null);
        onModelUploaded(false);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid model file (e.g., .pkl, .joblib, .sav).",
          variant: "destructive",
        });
        setSelectedFile(null);
        event.target.value = ""; // Clear the input
      }
    }
  };

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      // Simulate model upload
      setTimeout(() => {
        setIsUploaded(true);
        setModelName(selectedFile.name);
        onModelUploaded(true, selectedFile.name);
        toast({
          title: "Model Uploaded",
          description: `${selectedFile.name} has been successfully uploaded.`,
        });
      }, 500);
    } else {
      toast({
        title: "No File Selected",
        description: "Please select a model file to upload.",
        variant: "destructive",
      });
    }
  }, [selectedFile, onModelUploaded, toast]);
  
  const handleRemoveModel = () => {
    setSelectedFile(null);
    setIsUploaded(false);
    setModelName(null);
    onModelUploaded(false);
    const fileInput = document.getElementById('model-upload-input') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ""; // Clear the file input
    }
    toast({
      title: "Model Removed",
      description: "The model has been removed.",
    });
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <UploadCloud className="h-6 w-6 text-primary" />
          Upload Prediction Model
        </CardTitle>
        <CardDescription>
          Upload your pre-trained machine learning model (e.g., .pkl, .joblib, .sav).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isUploaded ? (
          <>
            <Input 
              id="model-upload-input"
              type="file" 
              onChange={handleFileChange} 
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              aria-label="Upload model file"
            />
            {selectedFile && <p className="text-sm text-muted-foreground">Selected file: {selectedFile.name}</p>}
            <Button onClick={handleUpload} disabled={!selectedFile} className="w-full sm:w-auto">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Model
            </Button>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-md">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium">Model '{modelName}' uploaded successfully.</p>
            </div>
            <Button onClick={handleRemoveModel} variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 mt-2 sm:mt-0">
              <XCircle className="mr-1 h-4 w-4" /> Remove
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
