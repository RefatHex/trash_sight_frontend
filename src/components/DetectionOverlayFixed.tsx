
import React from 'react';
import { WasteCategory } from '@/hooks/useTrashCategories';

interface Detection {
  category: WasteCategory;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DetectionOverlayProps {
  detections: Detection[];
  frameSize: { width: number; height: number };
  isRejection?: boolean;
}

const getCategoryColor = (category: WasteCategory): string => {
  switch (category) {
    case 'recyclables':
      return '#FFEB3B'; // Yellow for recyclables
    case 'reusable-cups':
      return '#9C27B0'; // Purple for reusable cups
    case 'general-waste':
    default:
      return '#757575'; // Gray for general waste
  }
};

const DetectionOverlayFixed: React.FC<DetectionOverlayProps> = ({ 
  detections, 
  frameSize, 
  isRejection = false 
}) => {
  if (!detections.length && !isRejection) return null;
  
  const { width, height } = frameSize;
  
  return (
    <svg 
      width={width} 
      height={height} 
      className="absolute top-0 left-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {detections.map((detection, index) => {
        const color = getCategoryColor(detection.category);
        const strokeColor = isRejection ? 'red' : color;
        const strokeDasharray = isRejection ? '5,5' : 'none';
        
        return (
          <g key={index}>
            <rect
              x={detection.x}
              y={detection.y}
              width={detection.width}
              height={detection.height}
              stroke={strokeColor}
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={strokeDasharray}
            />
            
            <rect
              x={detection.x}
              y={detection.y - 20}
              width={detection.category.length * 8 + 45}
              height={20}
              fill={color}
              fillOpacity="0.8"
            />
            
            {/* Text with outline for shadow effect */}
            <text
              x={detection.x + 5}
              y={detection.y - 5}
              fill="#000000"
              fillOpacity="0.5"
              fontSize="14px"
              fontWeight="bold"
              dx="1"
              dy="1"
            >
              {`${detection.category} ${Math.round(detection.confidence * 100)}%`}
            </text>
            
            <text
              x={detection.x + 5}
              y={detection.y - 5}
              fill="white"
              fontSize="14px"
              fontWeight="bold"
            >
              {`${detection.category} ${Math.round(detection.confidence * 100)}%`}
            </text>
          </g>
        );
      })}
      
      {isRejection && (
        <g>
          <rect
            x={10}
            y={10}
            width={width - 20}
            height={height - 20}
            stroke="red"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="10,10"
          />
          
          <rect
            x={width / 2 - 100}
            y={height / 2 - 20}
            width={200}
            height={40}
            fill="rgba(244, 67, 54, 0.8)"
            rx="5"
            ry="5"
          />
          
          <text
            x={width / 2}
            y={height / 2 + 8}
            fill="white"
            fontSize="24px"
            fontWeight="bold"
            textAnchor="middle"
          >
            REJECTED
          </text>
        </g>
      )}
    </svg>
  );
};

export default DetectionOverlayFixed;
