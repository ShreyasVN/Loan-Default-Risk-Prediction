import { Target } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-6 bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center gap-3">
        <Target className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-semibold text-foreground">
          RiskRadar
        </h1>
      </div>
    </header>
  );
}
