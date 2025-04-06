
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AcceptanceSelector from '../AcceptanceSelector';

interface SettingsCardProps {
  selectedBin: string;
  onBinChange: (value: string) => void;
  acceptedCategories: string[];
  onAcceptedCategoriesChange: (categories: string[]) => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  selectedBin,
  onBinChange,
  acceptedCategories,
  onAcceptedCategoriesChange
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recycling Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <AcceptanceSelector 
          selectedBin={selectedBin}
          onBinChange={onBinChange}
          acceptedCategories={acceptedCategories}
          onAcceptedCategoriesChange={onAcceptedCategoriesChange}
        />
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
