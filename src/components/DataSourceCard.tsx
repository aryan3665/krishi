import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink, Database, TrendingUp, CloudRain, Leaf } from "lucide-react";
import { useState } from "react";
import { DatasetResponse } from "@/types/datasets";

interface DataSourceCardProps {
  data: DatasetResponse;
  language: string;
}

export const DataSourceCard = ({ data, language }: DataSourceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data.sources.length) return null;

  const getSourceIcon = (source: string) => {
    if (source.includes('Weather') || source.includes('Meteorological')) {
      return <CloudRain className="h-4 w-4" />;
    }
    if (source.includes('Market') || source.includes('eNAM')) {
      return <TrendingUp className="h-4 w-4" />;
    }
    if (source.includes('Agriculture') || source.includes('Crop')) {
      return <Leaf className="h-4 w-4" />;
    }
    return <Database className="h-4 w-4" />;
  };

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-600" />
            Data Sources Used
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-auto p-1"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Source badges */}
          <div className="flex flex-wrap gap-2">
            {data.sources.map((source, index) => (
              <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                {getSourceIcon(source)}
                {source}
              </Badge>
            ))}
          </div>

          {/* Last updated */}
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>

          {/* Expanded details */}
          {isExpanded && (
            <div className="space-y-4 pt-3 border-t">
              {/* Weather data */}
              {data.weather && data.weather.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-blue-600" />
                    Weather Information
                  </h4>
                  {data.weather.map((weather, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg text-sm">
                      <p><strong>Location:</strong> {weather.location}</p>
                      <p><strong>Temperature:</strong> {weather.temperature}°C</p>
                      <p><strong>Humidity:</strong> {weather.humidity}%</p>
                      <p><strong>Rainfall:</strong> {weather.rainfall}mm</p>
                      <p><strong>Forecast:</strong> {weather.forecast}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Market prices */}
              {data.marketPrices && data.marketPrices.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Market Prices
                  </h4>
                  {data.marketPrices.map((price, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg text-sm">
                      <p><strong>Crop:</strong> {price.crop}</p>
                      <p><strong>Market:</strong> {price.market}</p>
                      <p><strong>Price:</strong> ₹{price.price} {price.unit}</p>
                      <p><strong>Trend:</strong> 
                        <Badge variant={price.trend === 'up' ? 'default' : price.trend === 'down' ? 'destructive' : 'secondary'} className="ml-2 text-xs">
                          {price.trend}
                        </Badge>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Crop advisories */}
              {data.cropAdvisories && data.cropAdvisories.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Crop Advisories
                  </h4>
                  {data.cropAdvisories.map((advisory, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg text-sm">
                      <p><strong>Crop:</strong> {advisory.crop}</p>
                      <p><strong>Region:</strong> {advisory.region}</p>
                      <p><strong>Sowing Time:</strong> {advisory.sowingTime}</p>
                      <p><strong>Harvest Time:</strong> {advisory.harvestTime}</p>
                      {advisory.pestAlerts.length > 0 && (
                        <p><strong>Pest Alerts:</strong> {advisory.pestAlerts.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Soil health */}
              {data.soilHealth && data.soilHealth.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4 text-amber-600" />
                    Soil Health Data
                  </h4>
                  {data.soilHealth.map((soil, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg text-sm">
                      <p><strong>Region:</strong> {soil.region}</p>
                      <p><strong>pH:</strong> {soil.ph}</p>
                      <p><strong>Nitrogen:</strong> {soil.nitrogen} kg/ha</p>
                      <p><strong>Phosphorus:</strong> {soil.phosphorus} kg/ha</p>
                      <p><strong>Potassium:</strong> {soil.potassium} kg/ha</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Government schemes */}
              {data.schemes && data.schemes.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-purple-600" />
                    Government Schemes
                  </h4>
                  {data.schemes.map((scheme, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg text-sm">
                      <p><strong>Scheme:</strong> {scheme.name}</p>
                      <p><strong>Benefits:</strong> {scheme.benefits}</p>
                      <p><strong>Eligibility:</strong> {scheme.eligibility.join(', ')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};