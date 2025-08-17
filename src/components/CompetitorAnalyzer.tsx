import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, TrendingUp, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Competitor {
  rank: number;
  company_name: string;
  ticker: string;
  reason: string;
}

export const CompetitorAnalyzer = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyTicker, setCompanyTicker] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const { toast } = useToast();

  // Mock competitor data for demo
  const mockCompetitors = {
    'tesla': [
      { rank: 1, company_name: 'Ford Motor Company', ticker: 'F', reason: 'Direct competitor in electric vehicle market with F-150 Lightning' },
      { rank: 2, company_name: 'General Motors', ticker: 'GM', reason: 'Major automaker with expanding EV portfolio including Bolt and Ultium platform' },
      { rank: 3, company_name: 'Volkswagen AG', ticker: 'VWAGY', reason: 'European leader investing heavily in electric vehicles with ID series' },
      { rank: 4, company_name: 'NIO Inc', ticker: 'NIO', reason: 'Chinese EV manufacturer with innovative battery swapping technology' },
      { rank: 5, company_name: 'BYD Company', ticker: 'BYDDY', reason: 'Chinese EV and battery manufacturer, world\'s largest EV producer by volume' }
    ],
    'apple': [
      { rank: 1, company_name: 'Microsoft Corporation', ticker: 'MSFT', reason: 'Direct competitor in personal computing, cloud services, and enterprise software' },
      { rank: 2, company_name: 'Samsung Electronics', ticker: '005930.KS', reason: 'Primary competitor in smartphones, tablets, and consumer electronics' },
      { rank: 3, company_name: 'Alphabet Inc', ticker: 'GOOGL', reason: 'Competitor in mobile OS (Android vs iOS) and digital services' },
      { rank: 4, company_name: 'Amazon.com Inc', ticker: 'AMZN', reason: 'Competitor in cloud services (AWS vs iCloud) and digital content' },
      { rank: 5, company_name: 'Meta Platforms', ticker: 'META', reason: 'Competitor in virtual reality and metaverse technologies' }
    ]
  };

  const findCompetitors = async () => {
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const key = companyName.toLowerCase();
      const competitorData = mockCompetitors[key as keyof typeof mockCompetitors];
      
      if (competitorData) {
        setCompetitors(competitorData);
        toast({
          title: "Analysis Complete",
          description: `Found ${competitorData.length} key competitors for ${companyName}`,
        });
      } else {
        // Fallback for unknown companies
        setCompetitors([
          { rank: 1, company_name: 'Competitor Analysis Pending', ticker: 'N/A', reason: 'Real-time competitor analysis would be performed here using market research APIs' }
        ]);
        toast({
          title: "Limited Data",
          description: "Using mock data for demonstration. Real implementation would query market research APIs.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze competitors",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setCompetitors([]);
    setCompanyName('');
    setCompanyTicker('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Competitor Analysis
          </CardTitle>
          <CardDescription>
            Find and rank the top 10 most significant competitors for any company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Company Name</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Tesla, Apple, Microsoft"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Ticker (Optional)</label>
              <Input
                value={companyTicker}
                onChange={(e) => setCompanyTicker(e.target.value)}
                placeholder="e.g., TSLA, AAPL, MSFT"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={findCompetitors}
              disabled={isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Find Competitors
                </>
              )}
            </Button>
            {competitors.length > 0 && (
              <Button 
                onClick={clearResults}
                variant="outline"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {competitors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Competitor Rankings</CardTitle>
            <CardDescription>
              Ranked by market significance and competitive overlap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitors.map((competitor) => (
                <Card key={competitor.rank} className="border-l-4 border-l-primary/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-bold">
                            #{competitor.rank}
                          </Badge>
                          <h3 className="text-lg font-semibold">{competitor.company_name}</h3>
                          {competitor.ticker !== 'N/A' && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              {competitor.ticker}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{competitor.reason}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {competitors.length > 1 && (
              <div className="mt-6 p-4 bg-accent rounded-lg">
                <h4 className="font-medium mb-2">Analysis Summary</h4>
                <p className="text-sm text-muted-foreground">
                  Found {competitors.length} key competitors. These companies would be automatically 
                  monitored for competitive intelligence including product launches, partnerships, 
                  and market moves.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};