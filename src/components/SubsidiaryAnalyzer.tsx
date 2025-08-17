import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Network, Building2, FileText, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Subsidiary {
  company_name: string;
  ticker: string;
  details: string;
}

export const SubsidiaryAnalyzer = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyTicker, setCompanyTicker] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);
  const { toast } = useToast();

  // Mock subsidiary data for demo
  const mockSubsidiaries = {
    'alphabet': [
      { company_name: 'Google LLC', ticker: 'N/A', details: 'Primary search engine and advertising business, core revenue driver' },
      { company_name: 'YouTube LLC', ticker: 'N/A', details: 'Video sharing platform acquired in 2006, major advertising revenue source' },
      { company_name: 'Waymo LLC', ticker: 'N/A', details: 'Autonomous vehicle development subsidiary' },
      { company_name: 'Verily Life Sciences', ticker: 'N/A', details: 'Healthcare and life sciences research subsidiary' },
      { company_name: 'DeepMind Technologies', ticker: 'N/A', details: 'Artificial intelligence research lab acquired in 2014' },
      { company_name: 'Calico LLC', ticker: 'N/A', details: 'Biotechnology company focused on aging and longevity research' }
    ],
    'microsoft': [
      { company_name: 'LinkedIn Corporation', ticker: 'N/A', details: 'Professional networking platform acquired in 2016 for $26.2 billion' },
      { company_name: 'GitHub, Inc.', ticker: 'N/A', details: 'Software development platform acquired in 2018 for $7.5 billion' },
      { company_name: 'Skype Technologies', ticker: 'N/A', details: 'Video calling service acquired in 2011, integrated into Microsoft Teams' },
      { company_name: 'Activision Blizzard', ticker: 'ATVI', details: 'Gaming company acquired in 2023 for $68.7 billion' },
      { company_name: 'Nuance Communications', ticker: 'N/A', details: 'AI and speech recognition company acquired in 2022' }
    ],
    'apple': [
      { company_name: 'Beats Electronics', ticker: 'N/A', details: 'Audio equipment company acquired in 2014, integrated into Apple Music ecosystem' },
      { company_name: 'Shazam Entertainment', ticker: 'N/A', details: 'Music recognition app acquired in 2018, integrated into iOS and Siri' },
      { company_name: 'Apple Sales International', ticker: 'N/A', details: 'Irish subsidiary handling European operations and tax optimization' },
      { company_name: 'Apple Operations International', ticker: 'N/A', details: 'Irish holding company for international operations outside Americas' },
      { company_name: 'Braeburn Capital', ticker: 'N/A', details: 'Asset management subsidiary managing Apple\'s cash reserves' }
    ]
  };

  const findSubsidiaries = async () => {
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
      const subsidiaryData = mockSubsidiaries[key as keyof typeof mockSubsidiaries];
      
      if (subsidiaryData) {
        setSubsidiaries(subsidiaryData);
        toast({
          title: "Analysis Complete",
          description: `Found ${subsidiaryData.length} subsidiaries for ${companyName}`,
        });
      } else {
        // Fallback for unknown companies
        setSubsidiaries([
          { company_name: 'Subsidiary Analysis Pending', ticker: 'N/A', details: 'Real-time subsidiary analysis would be performed here using corporate filing APIs and databases' }
        ]);
        toast({
          title: "Limited Data",
          description: "Using mock data for demonstration. Real implementation would query SEC filings and corporate databases.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze subsidiaries",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setSubsidiaries([]);
    setCompanyName('');
    setCompanyTicker('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Subsidiary Analysis
          </CardTitle>
          <CardDescription>
            Discover all majority-owned subsidiaries and related entities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Parent Company Name</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Alphabet, Microsoft, Apple"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Ticker (Optional)</label>
              <Input
                value={companyTicker}
                onChange={(e) => setCompanyTicker(e.target.value)}
                placeholder="e.g., GOOGL, MSFT, AAPL"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={findSubsidiaries}
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
                  <Network className="h-4 w-4 mr-2" />
                  Find Subsidiaries
                </>
              )}
            </Button>
            {subsidiaries.length > 0 && (
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

      {subsidiaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Corporate Structure</CardTitle>
            <CardDescription>
              Majority-owned subsidiaries and related entities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subsidiaries.map((subsidiary, index) => (
                <Card key={index} className="border-l-4 border-l-info/50">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-info" />
                        <h3 className="text-lg font-semibold">{subsidiary.company_name}</h3>
                        {subsidiary.ticker !== 'N/A' && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {subsidiary.ticker}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground pl-8">{subsidiary.details}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {subsidiaries.length > 1 && (
              <div className="mt-6 p-4 bg-accent rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Monitoring Strategy
                </h4>
                <p className="text-sm text-muted-foreground">
                  Each subsidiary would be automatically monitored for relevant events including 
                  acquisitions, divestitures, regulatory filings, and operational changes that 
                  could impact the parent company.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};