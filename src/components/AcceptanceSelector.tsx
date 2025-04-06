
import React from 'react';
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import RecyclingBin from './RecyclingBin';
import { BINS, WasteCategory } from '@/hooks/useTrashCategories';
import ScrollAreaFixed from './ScrollAreaFixed';

interface AcceptanceSelectorProps {
  selectedBin: string;
  onBinChange: (value: string) => void;
  acceptedCategories: string[];
  onAcceptedCategoriesChange: (categories: string[]) => void;
}

// All available waste categories
const ALL_CATEGORIES: WasteCategory[] = ['recyclables', 'reusable-cups', 'general-waste'];

const AcceptanceSelector: React.FC<AcceptanceSelectorProps> = ({ 
  selectedBin, 
  onBinChange, 
  acceptedCategories, 
  onAcceptedCategoriesChange 
}) => {
  const handleCategoryToggle = (category: string) => {
    if (acceptedCategories.includes(category)) {
      // Remove category if already selected
      onAcceptedCategoriesChange(acceptedCategories.filter(c => c !== category));
    } else {
      // Add category if not selected
      onAcceptedCategoriesChange([...acceptedCategories, category]);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <Label className="text-lg font-semibold">Select a Recycling Bin</Label>
        <p className="text-muted-foreground text-sm">Choose the type of waste you want to collect</p>

        <ScrollAreaFixed className="w-full">
          <div className="flex space-x-4 py-4 px-1">
            {BINS.map(bin => (
              <RecyclingBin 
                key={bin.id} 
                bin={bin} 
                isSelected={selectedBin === bin.id}
                onClick={() => onBinChange(bin.id)}
              />
            ))}
          </div>
        </ScrollAreaFixed>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Selected Bin Info</CardTitle>
        </CardHeader>
        <CardContent>
          {BINS.find(bin => bin.id === selectedBin)?.description}
          <div className="mt-4">
            <Label className="text-base font-medium">Accepted Categories:</Label>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {ALL_CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`}
                    checked={acceptedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal capitalize cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptanceSelector;
