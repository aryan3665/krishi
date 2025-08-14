import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, BarChart3, CheckCircle, XCircle, Clock } from 'lucide-react';
import { demoScenarios, runDemoScenario, generateDemoReport, DemoScenario } from '@/utils/demoScenarios';

interface DemoPanelProps {
  onRunScenario: (query: string, language: string) => Promise<any>;
  language: string;
}

export const DemoPanel = ({ onRunScenario, language }: DemoPanelProps) => {
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [showReport, setShowReport] = useState(false);

  const handleRunScenario = async (scenario: DemoScenario) => {
    setRunningScenario(scenario.id);
    try {
      const result = await runDemoScenario(scenario, onRunScenario);
      setResults(prev => [...prev.filter(r => r.scenarioId !== scenario.id), { 
        scenarioId: scenario.id, 
        scenario, 
        ...result 
      }]);
    } catch (error) {
      console.error('Error running scenario:', error);
    } finally {
      setRunningScenario(null);
    }
  };

  const handleRunAllScenarios = async () => {
    setResults([]);
    for (const scenario of demoScenarios) {
      await handleRunScenario(scenario);
      // Small delay between scenarios
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setShowReport(true);
  };

  const getCategoryColor = (category: DemoScenario['category']) => {
    const colors = {
      weather: 'bg-blue-100 text-blue-800',
      market: 'bg-green-100 text-green-800',
      crop: 'bg-yellow-100 text-yellow-800',
      soil: 'bg-amber-100 text-amber-800',
      scheme: 'bg-purple-100 text-purple-800',
      multilingual: 'bg-pink-100 text-pink-800'
    };
    return colors[category];
  };

  const getResultIcon = (result: any) => {
    if (!result) return <Clock className="h-4 w-4 text-gray-400" />;
    if (result.success && result.sourcesMatched) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (result.success) return <CheckCircle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Demo Scenarios - Hyperlocal RAG System
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleRunAllScenarios} disabled={runningScenario !== null}>
              Run All Scenarios
            </Button>
            {results.length > 0 && (
              <Button variant="outline" onClick={() => setShowReport(!showReport)}>
                {showReport ? 'Hide Report' : 'Show Report'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showReport && results.length > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Demo Report</h3>
              {(() => {
                const report = generateDemoReport(results);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Scenarios</p>
                      <p className="font-bold text-lg">{report.totalScenarios}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-bold text-lg text-green-600">{report.successRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data Integration</p>
                      <p className="font-bold text-lg text-blue-600">{report.dataIntegrationRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RAG Pipeline</p>
                      <p className="font-bold text-lg text-purple-600">Active</p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {demoScenarios.map((scenario) => {
            const result = results.find(r => r.scenarioId === scenario.id);
            const isRunning = runningScenario === scenario.id;
            
            return (
              <Card key={scenario.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{scenario.title}</h3>
                        <Badge className={getCategoryColor(scenario.category)}>
                          {scenario.category}
                        </Badge>
                        {result && getResultIcon(result)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
                        {scenario.query}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {scenario.expectedDataSources.map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                      
                      {result && result.usedSources && result.usedSources.length > 0 && (
                        <div className="text-xs text-green-600">
                          ✅ Used sources: {result.usedSources.join(', ')}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => handleRunScenario(scenario)}
                      disabled={isRunning}
                      size="sm"
                      className="flex-shrink-0"
                    >
                      {isRunning ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      {isRunning ? 'Running...' : 'Run'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};