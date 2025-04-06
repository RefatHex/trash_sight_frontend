
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BinType, BINS } from '@/hooks/useTrashCategories';
import { Recycle } from 'lucide-react';

interface SettingsDisplayProps {
  selectedBin: string;
  acceptedCategories: string[];
}

const SettingsDisplay: React.FC<SettingsDisplayProps> = ({
  selectedBin,
  acceptedCategories
}) => {
  const currentBin = BINS.find(bin => bin.id === selectedBin) as BinType;
  
  // Get badge color based on category and bin system
  const getCategoryBadgeColor = (category: string, binId: string) => {
    if (binId === 'yellow') return 'bg-yellow-400 text-black';
    if (binId === 'purple') return 'bg-purple-600 text-white';
    if (binId === 'black') return 'bg-gray-900 text-white';
    return '';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-primary recycling-icon" />
          <span>Active Recycling Bin</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div 
              className="h-8 w-8 rounded-full" 
              style={{ backgroundColor: currentBin.color }}
            ></div>
            <span className="font-medium text-lg">{currentBin.name}</span>
          </div>
          
          <div>
            <span className="text-muted-foreground">{currentBin.description}</span>
          </div>
          
          <div>
            <span className="font-medium">Accepted Categories:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {acceptedCategories.map(category => (
                <Badge 
                  key={category} 
                  className={getCategoryBadgeColor(category, selectedBin)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsDisplay;
