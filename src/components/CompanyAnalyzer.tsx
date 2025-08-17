import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Building2, Search, Globe, FileText, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CompanyResult } from './CompanyResult';
import { CompetitorAnalyzer } from './CompetitorAnalyzer';
import { SubsidiaryAnalyzer } from './SubsidiaryAnalyzer';

interface ExtractedEntity {
  id: string;
  name: string;
  type: 'public' | 'private' | 'unknown';
  confidence: number;
  ticker?: string;
  normalizedName?: string;
  events?: string[];
  monitoringStrategy?: {
    exchangeFilings: boolean;
    earningsTranscripts: boolean;
    annualReports: boolean;
    webNews: boolean;
    keywords: string[];
  };
}

interface AnalysisResult {
  originalPrompt: string;
  extractedEntities: ExtractedEntity[];
  intent: 'direct' | 'indirect' | 'list' | 'competitor';
  suggestedEvents: string[];
  warnings: string[];
}

export const CompanyAnalyzer = () => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  // Mock company database for demo
  const mockCompanyDB = new Map([
    ['apple', { id: 'AAPL', name: 'Apple Inc.', ticker: 'AAPL' }],
    ['microsoft', { id: 'MSFT', name: 'Microsoft Corporation', ticker: 'MSFT' }],
    ['google', { id: 'GOOGL', name: 'Alphabet Inc.', ticker: 'GOOGL' }],
    ['alphabet', { id: 'GOOGL', name: 'Alphabet Inc.', ticker: 'GOOGL' }],
    ['tesla', { id: 'TSLA', name: 'Tesla, Inc.', ticker: 'TSLA' }],
    ['tcs', { id: 'TCS', name: 'Tata Consultancy Services', ticker: '532540' }],
    ['tata consultancy', { id: 'TCS', name: 'Tata Consultancy Services', ticker: '532540' }],
    ['target', { id: 'TGT', name: 'Target Corporation', ticker: 'TGT' }],
    ['box', { id: 'BOX', name: 'Box Inc.', ticker: 'BOX' }],
  ]);

  const analyzePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Mock analysis logic
      const entities: ExtractedEntity[] = [];
      const warnings: string[] = [];
      const suggestedEvents: string[] = [];
      
      const lowerPrompt = prompt.toLowerCase();
      
      // Extract potential company names
      const words = prompt.split(/\s+/);
      const extractedNames: string[] = [];
      
      // Check for direct mentions
      for (const [key, value] of mockCompanyDB.entries()) {
        if (lowerPrompt.includes(key)) {
          extractedNames.push(key);
        }
      }
      
      // Handle special cases
      let intent: 'direct' | 'indirect' | 'list' | 'competitor' = 'direct';
      
      if (lowerPrompt.includes('competitors') || lowerPrompt.includes('competitor')) {
        intent = 'competitor';
      } else if (lowerPrompt.includes('nifty') || lowerPrompt.includes('top 10') || lowerPrompt.includes('all companies')) {
        intent = 'list';
        warnings.push('List-based queries require additional processing to resolve company lists');
      } else if (extractedNames.length === 0) {
        intent = 'indirect';
        warnings.push('No direct company mentions found. Treating as keyword-based monitoring.');
      }

      // Process each extracted name
      extractedNames.forEach((name, index) => {
        const companyData = mockCompanyDB.get(name);
        if (companyData) {
          entities.push({
            id: `entity-${index}`,
            name: companyData.name,
            type: 'public',
            confidence: 0.95,
            ticker: companyData.ticker,
            normalizedName: companyData.name,
            events: ['earnings', 'filings', 'annual_reports'],
            monitoringStrategy: {
              exchangeFilings: true,
              earningsTranscripts: true,
              annualReports: true,
              webNews: true,
              keywords: [name, companyData.name, companyData.ticker]
            }
          });
          suggestedEvents.push('SEC Filings', 'Earnings Calls', 'Annual Reports', 'Press Releases');
        } else {
          entities.push({
            id: `entity-${index}`,
            name: name,
            type: 'unknown',
            confidence: 0.6,
            events: ['web_news'],
            monitoringStrategy: {
              exchangeFilings: false,
              earningsTranscripts: false,
              annualReports: false,
              webNews: true,
              keywords: [name]
            }
          });
          warnings.push(`"${name}" not found in public company database. Will be monitored as keyword.`);
          suggestedEvents.push('Web News', 'Press Releases', 'Funding Announcements');
        }
      });

      // Handle edge cases
      if (lowerPrompt.includes('microsof') && !extractedNames.includes('microsoft')) {
        warnings.push('Possible typo detected: "microsof" - did you mean "Microsoft"?');
      }

      const analysisResult: AnalysisResult = {
        originalPrompt: prompt,
        extractedEntities: entities,
        intent,
        suggestedEvents: [...new Set(suggestedEvents)],
        warnings
      };

      setResult(analysisResult);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${entities.length} entities with ${warnings.length} warnings`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze prompt",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setPrompt('');
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Search className="h-6 w-6 text-primary" />
            Company Entity Analyzer
          </CardTitle>
          <CardDescription className="text-base">
            Test prompt analysis, entity extraction, and company classification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <label className="text-sm font-medium mb-2 block">User Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter test prompts like:
• Track news about Apple
• Monitor Tesla competitors
• Follow all Nifty 50 companies
• Track Tata Consulting earnings
• Monitor funding news for Acme Corp"
              className="min-h-[120px] resize-none"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={analyzePrompt}
              disabled={isAnalyzing}
              className="flex-1"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Prompt
                </>
              )}
            </Button>
            {result && (
              <Button 
                onClick={clearResults}
                variant="outline"
                size="lg"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Warnings */}
          {result.warnings.length > 0 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  Warnings & Edge Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent rounded-lg">
                  <div className="text-2xl font-bold text-accent-foreground">{result.extractedEntities.length}</div>
                  <div className="text-sm text-muted-foreground">Entities Found</div>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <div className="text-2xl font-bold text-accent-foreground capitalize">{result.intent}</div>
                  <div className="text-sm text-muted-foreground">Intent Type</div>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <div className="text-2xl font-bold text-accent-foreground">{result.suggestedEvents.length}</div>
                  <div className="text-sm text-muted-foreground">Event Types</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Suggested Event Types:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedEvents.map((event, index) => (
                    <Badge key={index} variant="secondary">{event}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extracted Entities */}
          <Card>
            <CardHeader>
              <CardTitle>Extracted Entities & Classification</CardTitle>
            </CardHeader>
            <CardContent>
              {result.extractedEntities.length > 0 ? (
                <div className="space-y-4">
                  {result.extractedEntities.map((entity) => (
                    <CompanyResult key={entity.id} entity={entity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No entities extracted from the prompt</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Testing Tools */}
      <Tabs defaultValue="competitors" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="subsidiaries">Subsidiary Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="competitors" className="space-y-4">
          <CompetitorAnalyzer />
        </TabsContent>
        
        <TabsContent value="subsidiaries" className="space-y-4">
          <SubsidiaryAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
};