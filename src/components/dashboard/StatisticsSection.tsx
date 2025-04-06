
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Recycle, Ban, CheckCircle } from 'lucide-react';

interface StatisticsSectionProps {
  detectionCount: number;
  rejectionCount: number;
  isModelLoaded: boolean;
  activeCategory?: string | null;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  detectionCount,
  rejectionCount,
  activeCategory
}) => {
  const acceptanceRate = detectionCount > 0 
    ? Math.round(((detectionCount - rejectionCount) / detectionCount) * 100) 
    : 0;

  // Get category color for badge
  const getCategoryColor = (category?: string | null) => {
    if (!category) return "";
    
    // Simplified color scheme for the new 3-bin system
    switch (category) {
      case 'cardboard':
      case 'glass':
      case 'metal':
      case 'paper':
      case 'plastic':
        return 'bg-yellow-400 text-black'; // Recyclables (yellow bin)
      case 'cups':
        return 'bg-purple-600 text-white'; // Reusable cups (purple bin)
      case 'organic':
      case 'trash':
      case 'battery':
      case 'clothes':
      case 'shoes':
      default:
        return 'bg-gray-900 text-white'; // General waste (black bin)
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="outline" className="flex items-center gap-1 bg-muted">
        <Recycle size={14} className="text-primary" />
        <span>Items: {detectionCount}</span>
      </Badge>
      
      <Badge variant="outline" className="flex items-center gap-1 bg-destructive/10">
        <Ban size={14} className="text-destructive" />
        <span>Rejected: {rejectionCount}</span>
      </Badge>
      
      <Badge variant="outline" className="flex items-center gap-1 bg-primary/10">
        <CheckCircle size={14} className="text-primary" />
        <span>Accepted: {acceptanceRate}%</span>
      </Badge>
      
      {activeCategory && (
        <Badge variant="outline" className={`ml-2 ${getCategoryColor(activeCategory)}`}>
          <span className="capitalize">{activeCategory}</span>
        </Badge>
      )}
    </div>
  );
};

export default StatisticsSection;
