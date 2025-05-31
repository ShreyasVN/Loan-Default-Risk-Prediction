'use server';

/**
 * @fileOverview Generates an explanation of why a loan application was flagged as high risk.
 *
 * - generateExplanation - A function that generates the risk explanation.
 * - GenerateExplanationInput - The input type for the generateExplanation function.
 * - GenerateExplanationOutput - The return type for the generateExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExplanationInputSchema = z.object({
  applicantData: z.record(z.any()).describe('Loan applicant data as a JSON object.'),
  riskScore: z.number().describe('The risk score assigned to the loan application.'),
  flaggedFactors: z.array(z.string()).describe('The key factors that flagged the application as high risk.'),
});
export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;

const GenerateExplanationOutputSchema = z.object({
  explanation: z.string().describe('A brief explanation of why the loan application was flagged as high risk.'),
});
export type GenerateExplanationOutput = z.infer<typeof GenerateExplanationOutputSchema>;

export async function generateExplanation(input: GenerateExplanationInput): Promise<GenerateExplanationOutput> {
  return generateExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationPrompt',
  input: {schema: GenerateExplanationInputSchema},
  output: {schema: GenerateExplanationOutputSchema},
  prompt: `You are an AI assistant helping lenders understand loan risk.

  Given the following loan applicant data:
  {{#each applicantData}}
  {{@key}}: {{{this}}}
  {{/each}}

  And a risk score of: {{{riskScore}}}

  And the following flagged factors:
  {{#each flaggedFactors}}
  - {{{this}}}
  {{/each}}

  Generate a concise explanation (under 100 words) of why this loan application was flagged as high risk, focusing on the key factors.
  `,
});

const generateExplanationFlow = ai.defineFlow(
  {
    name: 'generateExplanationFlow',
    inputSchema: GenerateExplanationInputSchema,
    outputSchema: GenerateExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
