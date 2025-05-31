
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicantData, employmentLengthOptions, homeOwnershipOptions, loanTermOptions } from "@/types";
import { Briefcase, CalendarDays, DollarSign, Home, Loader2, UserCircle, FileText, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  applicantName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  loanAmount: z.coerce.number().positive({ message: "Loan amount must be positive." }),
  annualIncome: z.coerce.number().positive({ message: "Annual income must be positive." }),
  creditScore: z.coerce.number().min(300).max(850, { message: "Credit score must be between 300 and 850." }),
  loanTerm: z.coerce.number({invalid_type_error: "Please select a loan term."}).positive(),
  employmentLength: z.string().min(1, { message: "Please select employment length." }),
  homeOwnership: z.string().min(1, { message: "Please select home ownership status." }),
});

interface ApplicantDataFormProps {
  onSubmit: (data: ApplicantData) => Promise<void>;
  isModelUploaded: boolean;
  isLoading: boolean;
}

export function ApplicantDataForm({ onSubmit, isModelUploaded, isLoading }: ApplicantDataFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantName: "",
      loanAmount: undefined,
      annualIncome: undefined,
      creditScore: undefined,
      employmentLength: "",
      homeOwnership: "",
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isModelUploaded) {
      toast({
        title: "Model Not Uploaded",
        description: "Please upload a prediction model before assessing risk.",
        variant: "destructive",
      });
      return;
    }
    await onSubmit(values as ApplicantData);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <FileText className="h-6 w-6 text-primary" />
          Applicant Data
        </CardTitle>
        <CardDescription>
          Enter the applicant's information to assess loan default risk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="applicantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><UserCircle className="h-4 w-4 text-muted-foreground" />Applicant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-muted-foreground" />Loan Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="annualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-muted-foreground" />Annual Income ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creditScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><TrendingUp className="h-4 w-4 text-muted-foreground" />Credit Score</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 700" {...field} min="300" max="850" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><CalendarDays className="h-4 w-4 text-muted-foreground" />Loan Term</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loanTermOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-muted-foreground" />Employment Length</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment length" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employmentLengthOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homeOwnership"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Home className="h-4 w-4 text-muted-foreground" />Home Ownership</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select home ownership" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {homeOwnershipOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={!isModelUploaded || isLoading} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assessing...
                </>
              ) : "Assess Risk"}
            </Button>
            {!isModelUploaded && (
              <p className="text-sm text-destructive mt-2">
                Please upload a prediction model first to enable risk assessment.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
