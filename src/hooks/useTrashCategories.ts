
import { useState } from 'react';

// Define the waste categories
export type WasteCategory = 'recyclables' | 'reusable-cups' | 'general-waste';

// Define the bin types
export interface BinType {
  id: string;
  name: string;
  color: string;
  description: string;
  defaultCategories: WasteCategory[];
}

// Define the available bins
export const BINS: BinType[] = [
  {
    id: 'yellow-bin',
    name: 'Yellow Bin',
    color: 'yellow',
    description: 'For all packaging and recyclables including plastic bottles, cans, cardboard, and paper.',
    defaultCategories: ['recyclables']
  },
  {
    id: 'purple-bin',
    name: 'Purple Bin',
    color: 'purple',
    description: 'For reusable cups that can be washed and reused on campus.',
    defaultCategories: ['reusable-cups']
  },
  {
    id: 'black-bin',
    name: 'Black Bin',
    color: 'black',
    description: 'For general waste including food scraps, tissues, and non-recyclable items.',
    defaultCategories: ['general-waste']
  }
];

export const useTrashCategories = () => {
  const [selectedBin, setSelectedBin] = useState<string>(BINS[0].id);
  const [acceptedCategories, setAcceptedCategories] = useState<WasteCategory[]>(
    BINS[0].defaultCategories
  );

  const updateSelectedBin = (binId: string) => {
    setSelectedBin(binId);
    
    // Find the selected bin
    const bin = BINS.find(b => b.id === binId);
    if (bin) {
      // Set the accepted categories based on the bin's default categories
      setAcceptedCategories(bin.defaultCategories);
    }
  };

  return {
    selectedBin,
    setSelectedBin: updateSelectedBin,
    acceptedCategories,
    setAcceptedCategories
  };
};
