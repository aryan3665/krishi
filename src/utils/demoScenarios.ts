export interface DemoScenario {
  id: string;
  title: string;
  query: string;
  language: string;
  description: string;
  expectedDataSources: string[];
  category: 'weather' | 'market' | 'crop' | 'soil' | 'scheme' | 'multilingual';
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'weather-crop-allahabad',
    title: 'Weather-based Crop Planning',
    query: 'What should I plant in Allahabad given this week\'s weather conditions?',
    language: 'en',
    description: 'Demonstrates integration of weather data with crop recommendations for specific location',
    expectedDataSources: ['Indian Meteorological Department', 'State Agriculture Departments'],
    category: 'weather'
  },
  {
    id: 'market-wheat-decision',
    title: 'Market-driven Selling Decision',
    query: 'Should I sell my wheat now or wait based on current market prices in Delhi?',
    language: 'en',
    description: 'Shows real-time market price integration for farming decisions',
    expectedDataSources: ['eNAM - National Agriculture Market'],
    category: 'market'
  },
  {
    id: 'hindi-pest-control',
    title: 'Multilingual Pest Control Query',
    query: 'मेरे टमाटर के पौधों में कीड़े लग गए हैं, क्या करूं?',
    language: 'hi',
    description: 'Demonstrates Hindi language processing with crop advisory integration',
    expectedDataSources: ['State Agriculture Departments'],
    category: 'multilingual'
  },
  {
    id: 'government-schemes',
    title: 'Government Scheme Information',
    query: 'What government schemes are available for small farmers like me?',
    language: 'en',
    description: 'Shows integration with government scheme databases',
    expectedDataSources: ['Ministry of Agriculture & Farmers Welfare'],
    category: 'scheme'
  },
  {
    id: 'soil-based-crops',
    title: 'Soil-based Crop Recommendations',
    query: 'My soil pH is 6.5 in Allahabad district, which crops should I grow?',
    language: 'en',
    description: 'Demonstrates soil health data integration with crop recommendations',
    expectedDataSources: ['Soil Health Card Scheme', 'State Agriculture Departments'],
    category: 'soil'
  },
  {
    id: 'marathi-sowing-time',
    title: 'Marathi Sowing Time Query',
    query: 'महाराष्ट्रात भात लावण्याची योग्य वेळ कधी आहे?',
    language: 'mr',
    description: 'Marathi language query about rice sowing time with regional advisories',
    expectedDataSources: ['State Agriculture Departments'],
    category: 'multilingual'
  },
  {
    id: 'complex-multi-factor',
    title: 'Multi-factor Decision Making',
    query: 'Considering current weather, soil conditions, and market prices, what is the best crop to plant in Punjab this season?',
    language: 'en',
    description: 'Complex query requiring multiple data sources and agentic reasoning',
    expectedDataSources: ['Indian Meteorological Department', 'Soil Health Card Scheme', 'eNAM - National Agriculture Market', 'State Agriculture Departments'],
    category: 'crop'
  },
  {
    id: 'bengali-fertilizer',
    title: 'Bengali Fertilizer Query',
    query: 'আমার ধানের জমিতে কোন সার দিলে ভালো ফলন হবে?',
    language: 'bn',
    description: 'Bengali language query about fertilizer recommendations for rice',
    expectedDataSources: ['State Agriculture Departments', 'Soil Health Card Scheme'],
    category: 'multilingual'
  }
];

export const runDemoScenario = async (scenario: DemoScenario, submitQuery: (query: string, language: string) => Promise<any>) => {
  console.log(`Running demo scenario: ${scenario.title}`);
  console.log(`Query: ${scenario.query}`);
  console.log(`Expected data sources: ${scenario.expectedDataSources.join(', ')}`);
  
  try {
    const result = await submitQuery(scenario.query, scenario.language);
    
    // Validate that expected data sources were used
    if (result.datasetInfo && result.datasetInfo.sources) {
      const usedSources = result.datasetInfo.sources;
      const expectedFound = scenario.expectedDataSources.some(expected => 
        usedSources.some((used: string) => used.includes(expected))
      );
      
      console.log(`✅ Demo scenario completed successfully`);
      console.log(`Used sources: ${usedSources.join(', ')}`);
      console.log(`Expected sources found: ${expectedFound ? 'Yes' : 'No'}`);
      
      return {
        success: true,
        result,
        sourcesMatched: expectedFound,
        usedSources
      };
    } else {
      console.log(`⚠️ Demo completed but no dataset info available`);
      return {
        success: true,
        result,
        sourcesMatched: false,
        usedSources: []
      };
    }
  } catch (error) {
    console.error(`❌ Demo scenario failed:`, error);
    return {
      success: false,
      error,
      sourcesMatched: false,
      usedSources: []
    };
  }
};

export const generateDemoReport = (results: any[]) => {
  const totalScenarios = results.length;
  const successfulScenarios = results.filter(r => r.success).length;
  const scenariosWithSources = results.filter(r => r.sourcesMatched).length;
  
  const report = {
    totalScenarios,
    successfulScenarios,
    scenariosWithSources,
    successRate: (successfulScenarios / totalScenarios) * 100,
    dataIntegrationRate: (scenariosWithSources / totalScenarios) * 100,
    details: results
  };
  
  console.log('📊 Demo Report:');
  console.log(`Total scenarios: ${totalScenarios}`);
  console.log(`Successful: ${successfulScenarios} (${report.successRate.toFixed(1)}%)`);
  console.log(`With data integration: ${scenariosWithSources} (${report.dataIntegrationRate.toFixed(1)}%)`);
  
  return report;
};