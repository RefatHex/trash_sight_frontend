
import React from 'react';
import { Detection } from '@/services/DetectionService';
import { WasteCategory } from '@/hooks/useTrashCategories';

interface DetectionOverlayProps {
  detections: Detection[];
  width: number;
  height: number;
}

const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ detections, width, height }) => {
  if (!detections.length) return null;

  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none" 
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {detections.map((detection, index) => {
        const { bbox, class: category, confidence } = detection;
        
        // Get color based on waste category
        let color;
        
        // Map category to one of our three bin categories
        switch (category) {
          case 'recyclables': 
            color = '#FFEB3B'; // Yellow for recyclables
            break;
          case 'reusable-cups': 
            color = '#9C27B0'; // Purple for reusable cups
            break;
          case 'general-waste': 
          default: 
            color = '#757575'; // Gray for general waste
            break;
        }

        return (
          <g key={index}>
            {/* Bounding box */}
            <rect
              x={bbox.x}
              y={bbox.y}
              width={bbox.width}
              height={bbox.height}
              stroke={color}
              strokeWidth="3"
              fill="none"
              rx="4"
              ry="4"
            />
            
            {/* Label background */}
            <rect
              x={bbox.x}
              y={bbox.y - 26}
              width={140}
              height={26}
              fill={color}
              fillOpacity="0.9"
              rx="4"
              ry="4"
            />
            
            {/* Label text */}
            <text
              x={bbox.x + 5}
              y={bbox.y - 10}
              fill="white"
              fontSize="14"
              fontWeight="bold"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              {category} ({Math.round(confidence * 100)}%)
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default DetectionOverlay;
