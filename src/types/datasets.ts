export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  forecast: string;
  date: string;
  source: string;
}

export interface CropAdvisory {
  crop: string;
  region: string;
  sowingTime: string;
  harvestTime: string;
  pestAlerts: string[];
  recommendations: string[];
  date: string;
  source: string;
}

export interface MarketPrice {
  crop: string;
  market: string;
  price: number;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  source: string;
}

export interface SoilHealth {
  region: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  recommendations: string[];
  source: string;
}

export interface GovernmentScheme {
  name: string;
  description: string;
  eligibility: string[];
  benefits: string;
  applicationProcess: string;
  deadline?: string;
  source: string;
}

export interface DatasetResponse {
  weather?: WeatherData[];
  cropAdvisories?: CropAdvisory[];
  marketPrices?: MarketPrice[];
  soilHealth?: SoilHealth[];
  schemes?: GovernmentScheme[];
  sources: string[];
  lastUpdated: string;
}

export interface LocationInfo {
  district: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface QueryContext {
  location?: LocationInfo;
  crop?: string;
  season?: string;
  date?: string;
  queryType: 'weather' | 'crop' | 'market' | 'soil' | 'scheme' | 'general';
}