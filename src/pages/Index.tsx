import { CompanyAnalyzer } from '@/components/CompanyAnalyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Zap, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Company Entity Extraction Testing Suite
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Interactive testing environment for prompt analysis, entity extraction, and company classification
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                AI-Powered Analysis
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Entity Recognition
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Real-time Testing
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Edge Case Handling
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Feature Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  Entity Extraction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Accurately identify company names from user prompts using advanced NLP
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Entity Matching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Match and normalize company names against internal public company database
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  Smart Classification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Classify entities as public companies or private/unknown keywords
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Edge Case Handling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Handle ambiguous names, typos, and indirect company references
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Testing Interface */}
          <CompanyAnalyzer />
        </div>
      </main>
    </div>
  );
};

export default Index;
