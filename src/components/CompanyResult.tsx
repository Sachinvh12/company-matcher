import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, ExternalLink, FileText, Globe, Briefcase, CheckCircle2, XCircle } from 'lucide-react';

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

interface CompanyResultProps {
  entity: ExtractedEntity;
}

export const CompanyResult = ({ entity }: CompanyResultProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'success';
      case 'private': return 'warning';
      case 'unknown': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'public': return <Building2 className="h-4 w-4" />;
      case 'private': return <Briefcase className="h-4 w-4" />;
      case 'unknown': return <Globe className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const confidenceColor = entity.confidence >= 0.8 ? 'success' : entity.confidence >= 0.6 ? 'warning' : 'destructive';

  return (
    <Card className="border-l-4 border-l-primary/50">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{entity.name}</h3>
                <Badge variant={getTypeColor(entity.type) as any} className="flex items-center gap-1">
                  {getTypeIcon(entity.type)}
                  {entity.type.toUpperCase()}
                </Badge>
              </div>
              
              {entity.ticker && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="h-4 w-4" />
                  <span>Ticker: <strong>{entity.ticker}</strong></span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <Badge variant={confidenceColor as any}>
                  {(entity.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          </div>

          {/* Normalized Name */}
          {entity.normalizedName && entity.normalizedName !== entity.name && (
            <div className="p-3 bg-accent rounded-lg">
              <p className="text-sm">
                <strong>Normalized to:</strong> {entity.normalizedName}
              </p>
            </div>
          )}

          {/* Monitoring Strategy */}
          {entity.monitoringStrategy && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Monitoring Strategy
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  {entity.monitoringStrategy.exchangeFilings ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Exchange Filings</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {entity.monitoringStrategy.earningsTranscripts ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Earnings Transcripts</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {entity.monitoringStrategy.annualReports ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Annual Reports</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {entity.monitoringStrategy.webNews ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Web News</span>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <p className="text-sm font-medium mb-2">Monitoring Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {entity.monitoringStrategy.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Suggested Events */}
          {entity.events && entity.events.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Suggested Events to Monitor:</h4>
              <div className="flex flex-wrap gap-2">
                {entity.events.map((event, index) => (
                  <Badge key={index} variant="secondary">
                    {event.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};