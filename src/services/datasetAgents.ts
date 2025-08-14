import { WeatherData, CropAdvisory, MarketPrice, SoilHealth, GovernmentScheme, DatasetResponse, LocationInfo, QueryContext } from '@/types/datasets';

// Mock data for demonstration - In production, these would be real API calls
const MOCK_WEATHER_DATA: WeatherData[] = [
  {
    location: "Allahabad, UP",
    temperature: 28,
    humidity: 65,
    rainfall: 2.5,
    windSpeed: 12,
    forecast: "Partly cloudy with light rain expected",
    date: new Date().toISOString(),
    source: "Indian Meteorological Department"
  },
  {
    location: "Mumbai, Maharashtra",
    temperature: 32,
    humidity: 78,
    rainfall: 0,
    windSpeed: 8,
    forecast: "Clear skies, hot and humid",
    date: new Date().toISOString(),
    source: "Indian Meteorological Department"
  }
];

const MOCK_CROP_ADVISORIES: CropAdvisory[] = [
  {
    crop: "Paddy/Rice",
    region: "Uttar Pradesh",
    sowingTime: "June-July (Kharif season)",
    harvestTime: "October-November",
    pestAlerts: ["Brown Plant Hopper", "Stem Borer"],
    recommendations: [
      "Prepare nursery beds with proper drainage",
      "Use certified seeds for better yield",
      "Apply organic manure before sowing"
    ],
    date: new Date().toISOString(),
    source: "Department of Agriculture, UP"
  },
  {
    crop: "Wheat",
    region: "Punjab",
    sowingTime: "November-December (Rabi season)",
    harvestTime: "April-May",
    pestAlerts: ["Aphids", "Rust disease"],
    recommendations: [
      "Ensure proper soil moisture before sowing",
      "Use recommended fertilizer doses",
      "Monitor for pest attacks regularly"
    ],
    date: new Date().toISOString(),
    source: "Punjab Agricultural University"
  }
];

const MOCK_MARKET_PRICES: MarketPrice[] = [
  {
    crop: "Rice",
    market: "Allahabad Mandi",
    price: 2850,
    unit: "per quintal",
    date: new Date().toISOString(),
    trend: 'up',
    source: "eNAM - National Agriculture Market"
  },
  {
    crop: "Wheat",
    market: "Delhi Mandi",
    price: 2200,
    unit: "per quintal",
    date: new Date().toISOString(),
    trend: 'stable',
    source: "eNAM - National Agriculture Market"
  }
];

const MOCK_SOIL_DATA: SoilHealth[] = [
  {
    region: "Allahabad District",
    ph: 7.2,
    nitrogen: 280,
    phosphorus: 45,
    potassium: 320,
    organicMatter: 1.8,
    recommendations: [
      "Soil pH is optimal for most crops",
      "Consider adding organic matter",
      "Phosphorus levels are adequate"
    ],
    source: "Soil Health Card Scheme"
  }
];

const MOCK_SCHEMES: GovernmentScheme[] = [
  {
    name: "PM-KISAN",
    description: "Direct income support to farmers",
    eligibility: ["Small and marginal farmers", "Land ownership required"],
    benefits: "₹6000 per year in three installments",
    applicationProcess: "Online registration through PM-KISAN portal",
    source: "Ministry of Agriculture & Farmers Welfare"
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme for farmers",
    eligibility: ["All farmers", "Covers notified crops"],
    benefits: "Insurance coverage against crop loss",
    applicationProcess: "Through banks, CSCs, or insurance companies",
    source: "Ministry of Agriculture & Farmers Welfare"
  }
];

class WeatherAgent {
  async getWeatherData(location: LocationInfo): Promise<WeatherData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, this would call actual weather APIs like:
    // - IMD API
    // - OpenWeatherMap with India focus
    // - AccuWeather India
    
    return MOCK_WEATHER_DATA.filter(data => 
      data.location.toLowerCase().includes(location.district.toLowerCase()) ||
      data.location.toLowerCase().includes(location.state.toLowerCase())
    );
  }
}

class CropAdvisoryAgent {
  async getCropAdvisories(context: QueryContext): Promise<CropAdvisory[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In production, this would call:
    // - State agriculture department APIs
    // - ICAR advisories
    // - KVK (Krishi Vigyan Kendra) data
    
    let advisories = MOCK_CROP_ADVISORIES;
    
    if (context.location) {
      advisories = advisories.filter(advisory =>
        advisory.region.toLowerCase().includes(context.location!.state.toLowerCase())
      );
    }
    
    if (context.crop) {
      advisories = advisories.filter(advisory =>
        advisory.crop.toLowerCase().includes(context.crop!.toLowerCase())
      );
    }
    
    return advisories;
  }
}

class MarketPriceAgent {
  async getMarketPrices(context: QueryContext): Promise<MarketPrice[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In production, this would call:
    // - eNAM API
    // - State mandi board APIs
    // - AGMARKNET data
    
    let prices = MOCK_MARKET_PRICES;
    
    if (context.crop) {
      prices = prices.filter(price =>
        price.crop.toLowerCase().includes(context.crop!.toLowerCase())
      );
    }
    
    if (context.location) {
      prices = prices.filter(price =>
        price.market.toLowerCase().includes(context.location!.district.toLowerCase()) ||
        price.market.toLowerCase().includes(context.location!.state.toLowerCase())
      );
    }
    
    return prices;
  }
}

class SoilHealthAgent {
  async getSoilData(location: LocationInfo): Promise<SoilHealth[]> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // In production, this would call:
    // - Soil Health Card API
    // - ICAR soil databases
    // - State soil testing lab data
    
    return MOCK_SOIL_DATA.filter(soil =>
      soil.region.toLowerCase().includes(location.district.toLowerCase())
    );
  }
}

class GovernmentSchemeAgent {
  async getSchemes(context: QueryContext): Promise<GovernmentScheme[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In production, this would call:
    // - DBT Agriculture portal
    // - State government scheme APIs
    // - Central scheme databases
    
    return MOCK_SCHEMES;
  }
}

export class DatasetOrchestrator {
  private weatherAgent = new WeatherAgent();
  private cropAgent = new CropAdvisoryAgent();
  private marketAgent = new MarketPriceAgent();
  private soilAgent = new SoilHealthAgent();
  private schemeAgent = new GovernmentSchemeAgent();

  async retrieveRelevantData(context: QueryContext): Promise<DatasetResponse> {
    const promises: Promise<any>[] = [];
    const sources: string[] = [];
    
    // Determine which agents to call based on query context
    if (context.queryType === 'weather' || context.queryType === 'general') {
      if (context.location) {
        promises.push(this.weatherAgent.getWeatherData(context.location));
      }
    }
    
    if (context.queryType === 'crop' || context.queryType === 'general') {
      promises.push(this.cropAgent.getCropAdvisories(context));
    }
    
    if (context.queryType === 'market' || context.queryType === 'general') {
      promises.push(this.marketAgent.getMarketPrices(context));
    }
    
    if (context.queryType === 'soil' || context.queryType === 'general') {
      if (context.location) {
        promises.push(this.soilAgent.getSoilData(context.location));
      }
    }
    
    if (context.queryType === 'scheme' || context.queryType === 'general') {
      promises.push(this.schemeAgent.getSchemes(context));
    }

    try {
      const results = await Promise.allSettled(promises);
      const response: DatasetResponse = {
        sources: [],
        lastUpdated: new Date().toISOString()
      };

      let resultIndex = 0;
      
      if (context.queryType === 'weather' || context.queryType === 'general') {
        if (context.location && results[resultIndex]) {
          const weatherResult = results[resultIndex];
          if (weatherResult.status === 'fulfilled') {
            response.weather = weatherResult.value;
            response.sources.push('Indian Meteorological Department');
          }
          resultIndex++;
        }
      }
      
      if (context.queryType === 'crop' || context.queryType === 'general') {
        const cropResult = results[resultIndex];
        if (cropResult && cropResult.status === 'fulfilled') {
          response.cropAdvisories = cropResult.value;
          response.sources.push('State Agriculture Departments');
        }
        resultIndex++;
      }
      
      if (context.queryType === 'market' || context.queryType === 'general') {
        const marketResult = results[resultIndex];
        if (marketResult && marketResult.status === 'fulfilled') {
          response.marketPrices = marketResult.value;
          response.sources.push('eNAM - National Agriculture Market');
        }
        resultIndex++;
      }
      
      if (context.queryType === 'soil' || context.queryType === 'general') {
        if (context.location && results[resultIndex]) {
          const soilResult = results[resultIndex];
          if (soilResult.status === 'fulfilled') {
            response.soilHealth = soilResult.value;
            response.sources.push('Soil Health Card Scheme');
          }
          resultIndex++;
        }
      }
      
      if (context.queryType === 'scheme' || context.queryType === 'general') {
        const schemeResult = results[resultIndex];
        if (schemeResult && schemeResult.status === 'fulfilled') {
          response.schemes = schemeResult.value;
          response.sources.push('Ministry of Agriculture & Farmers Welfare');
        }
      }

      return response;
    } catch (error) {
      console.error('Error retrieving dataset information:', error);
      return {
        sources: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }
}

// Utility functions for parsing location and context from queries
export const parseLocationFromQuery = (query: string): LocationInfo | undefined => {
  const locationPatterns = [
    // District, State patterns
    /(?:in|at|from)\s+([a-zA-Z\s]+),?\s+([a-zA-Z\s]+)/i,
    // Just district/city names
    /(?:in|at|from)\s+([a-zA-Z\s]+)/i
  ];

  for (const pattern of locationPatterns) {
    const match = query.match(pattern);
    if (match) {
      if (match[2]) {
        return {
          district: match[1].trim(),
          state: match[2].trim()
        };
      } else {
        // Try to infer if it's a known city/district
        const location = match[1].trim();
        return {
          district: location,
          state: inferStateFromDistrict(location)
        };
      }
    }
  }

  return undefined;
};

export const parseCropFromQuery = (query: string): string | undefined => {
  const crops = ['rice', 'paddy', 'wheat', 'maize', 'cotton', 'sugarcane', 'soybean', 'tomato', 'potato', 'onion'];
  const lowerQuery = query.toLowerCase();
  
  for (const crop of crops) {
    if (lowerQuery.includes(crop)) {
      return crop;
    }
  }
  
  return undefined;
};

export const determineQueryType = (query: string): QueryContext['queryType'] => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('temperature')) {
    return 'weather';
  }
  if (lowerQuery.includes('price') || lowerQuery.includes('market') || lowerQuery.includes('mandi')) {
    return 'market';
  }
  if (lowerQuery.includes('soil') || lowerQuery.includes('ph') || lowerQuery.includes('fertility')) {
    return 'soil';
  }
  if (lowerQuery.includes('scheme') || lowerQuery.includes('subsidy') || lowerQuery.includes('loan')) {
    return 'scheme';
  }
  if (lowerQuery.includes('crop') || lowerQuery.includes('sow') || lowerQuery.includes('plant') || lowerQuery.includes('harvest')) {
    return 'crop';
  }
  
  return 'general';
};

const inferStateFromDistrict = (district: string): string => {
  const districtStateMap: Record<string, string> = {
    'allahabad': 'Uttar Pradesh',
    'prayagraj': 'Uttar Pradesh',
    'lucknow': 'Uttar Pradesh',
    'kanpur': 'Uttar Pradesh',
    'mumbai': 'Maharashtra',
    'pune': 'Maharashtra',
    'nagpur': 'Maharashtra',
    'delhi': 'Delhi',
    'bangalore': 'Karnataka',
    'bengaluru': 'Karnataka',
    'chennai': 'Tamil Nadu',
    'hyderabad': 'Telangana',
    'kolkata': 'West Bengal',
    'ahmedabad': 'Gujarat',
    'jaipur': 'Rajasthan',
    'chandigarh': 'Punjab',
    'ludhiana': 'Punjab'
  };
  
  return districtStateMap[district.toLowerCase()] || 'Unknown';
};