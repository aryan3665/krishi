import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi, Clock, AlertCircle } from 'lucide-react';

interface OfflineIndicatorProps {
  lastDataUpdate?: string;
  language: string;
}

export const OfflineIndicator = ({ lastDataUpdate, language }: OfflineIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMode, setShowOfflineMode] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMode(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineMode && isOnline) return null;

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-amber-600" />
            )}
            <Badge variant={isOnline ? "secondary" : "outline"} className="text-xs">
              {isOnline ? "Online" : "Offline Mode"}
            </Badge>
          </div>
          
          {!isOnline && (
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-4 w-4" />
              <span>Limited functionality available</span>
            </div>
          )}
        </div>
        
        {lastDataUpdate && (
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Last data update: {new Date(lastDataUpdate).toLocaleString()}
            </span>
          </div>
        )}
        
        {!isOnline && (
          <div className="mt-3 text-xs text-amber-700 dark:text-amber-300">
            <p>• Basic AI advice available</p>
            <p>• Real-time data unavailable</p>
            <p>• Some features may not work</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};