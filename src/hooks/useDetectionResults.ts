
import { useState } from 'react';
import { Detection } from '@/services/DetectionService';

export const useDetectionResults = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [activeDetection, setActiveDetection] = useState<string | null>(null);
  const [frameSize, setFrameSize] = useState({ width: 640, height: 480 });
  const [detectionCount, setDetectionCount] = useState(0);
  const [rejectionCount, setRejectionCount] = useState(0);
  
  const updateDetections = (newDetections: Detection[]) => {
    setDetections(newDetections);
    
    // Track active detection (largest object)
    if (newDetections.length > 0) {
      const largest = newDetections.reduce((prev, current) => {
        const prevArea = prev.bbox.width * prev.bbox.height;
        const currentArea = current.bbox.width * current.bbox.height;
        return currentArea > prevArea ? current : prev;
      });
      setActiveDetection(largest.class);
    } else {
      setActiveDetection(null);
    }
  };
  
  return {
    detections,
    activeDetection,
    frameSize,
    detectionCount,
    rejectionCount,
    updateDetections,
    updateFrameSize: (width: number, height: number) => {
      if (width !== frameSize.width || height !== frameSize.height) {
        setFrameSize({ width, height });
      }
    },
    incrementDetectionCount: () => setDetectionCount(prev => prev + 1),
    incrementRejectionCount: () => setRejectionCount(prev => prev + 1)
  };
};
