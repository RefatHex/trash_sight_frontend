
import { useDetectionResults } from './useDetectionResults';
import { useRejectionStatus } from './useRejectionStatus';
import { useDetectionModel } from './useDetectionModel';
import detectionService from '@/services/DetectionService';
import huggingFaceService from '@/services/HuggingFaceService';

interface UseObjectDetectionProps {
  isPaused: boolean;
  acceptedCategories: string[];
}

export const useObjectDetection = ({ 
  isPaused, 
  acceptedCategories
}: UseObjectDetectionProps) => {
  const detectionResults = useDetectionResults();
  const rejectionStatus = useRejectionStatus();
  const detectionModel = useDetectionModel();
  
  const handleFrame = async (imageData: ImageData) => {
    if (isPaused) return;
    
    // Update frame size
    detectionResults.updateFrameSize(imageData.width, imageData.height);
    
    try {
      // Use Hugging Face if available, otherwise fall back to mock detection
      const newDetections = detectionModel.useHuggingFace 
        ? await huggingFaceService.detectObjects(imageData)
        : await detectionService.detectObjects(imageData);
      
      if (newDetections.length > 0) {
        detectionResults.updateDetections(newDetections);
        detectionResults.incrementDetectionCount();
        
        // Sort detections by size (largest first - assuming closer to camera)
        const sortedDetections = [...newDetections].sort((a, b) => {
          const areaA = a.bbox.width * a.bbox.height;
          const areaB = b.bbox.width * b.bbox.height;
          return areaB - areaA; // Largest first
        });
        
        // Only check the largest object for rejection
        const largestDetection = sortedDetections[0];
        if (largestDetection) {
          const isAccepted = acceptedCategories.includes(largestDetection.class);
          const isClose = detectionService.isObjectClose(
            largestDetection.bbox, 
            imageData.width, 
            imageData.height
          );
          
          if (!isAccepted && isClose) {
            detectionResults.incrementRejectionCount();
            rejectionStatus.triggerRejection();
          }
        }
      }
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  };

  return {
    detections: detectionResults.detections,
    activeDetection: detectionResults.activeDetection,
    frameSize: detectionResults.frameSize,
    showRejection: rejectionStatus.showRejection,
    setShowRejection: rejectionStatus.setShowRejection,
    detectionCount: detectionResults.detectionCount,
    rejectionCount: detectionResults.rejectionCount,
    handleFrame,
    useHuggingFace: detectionModel.useHuggingFace
  };
};
