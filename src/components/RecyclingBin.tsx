
import React from 'react';
import { Recycle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BinType } from '@/hooks/useTrashCategories';

interface RecyclingBinProps {
  bin: BinType;
  isSelected: boolean;
  onClick: () => void;
}

const RecyclingBin: React.FC<RecyclingBinProps> = ({ bin, isSelected, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center space-y-2 cursor-pointer"
      onClick={onClick}
    >
      <div 
        className={cn(
          "recycling-bin relative", 
          isSelected && "ring-4 ring-offset-2 ring-primary ring-offset-background"
        )}
        style={{ backgroundColor: bin.color }}
      >
        <div className="bin-lid" style={{ backgroundColor: bin.color }}></div>
        {isSelected && (
          <div className="absolute -top-3 -right-3 bg-primary text-white rounded-full p-1">
            <Recycle size={18} />
          </div>
        )}
        <div className="text-black font-bold text-sm absolute bottom-4">
          {bin.id.toUpperCase()}
        </div>
      </div>
      <span className="text-sm font-medium text-center max-w-[100px]">
        {bin.name}
      </span>
    </div>
  );
};

export default RecyclingBin;
