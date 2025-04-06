
import React from 'react';
import { InfoIcon, Recycle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const InformationAlert: React.FC = () => {
  return (
    <Alert className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <div className="flex items-center gap-2">
        <InfoIcon className="h-4 w-4 text-primary" />
        <AlertTitle className="font-semibold">Smart Recycling System</AlertTitle>
      </div>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          This system detects and classifies waste into different categories, helping you sort items 
          into the correct recycling bins:
        </p>
        
        <div className="grid gap-x-4 gap-y-2 text-sm mt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="font-semibold">Yellow Bin - Recyclables:</span>
            <span className="text-muted-foreground">Plastic, cardboard, paper, metal, and glass items</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span className="font-semibold">Purple Bin - Reusable Cups:</span>
            <span className="text-muted-foreground">Specific reusable cups that will be washed and reused</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-900"></div>
            <span className="font-semibold">Black Bin - General Waste:</span>
            <span className="text-muted-foreground">Food scraps, tissues, and non-recyclable items</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-3 pt-2 border-t border-primary/20">
          <Recycle size={14} className="text-primary mr-1" />
          <span className="text-xs text-center italic">
            Proper recycling helps reduce landfill waste and conserves natural resources
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default InformationAlert;
