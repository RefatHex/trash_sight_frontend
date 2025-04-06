
import React from 'react';
import { CameraIcon } from 'lucide-react';
import Camera, { CameraRef } from '../Camera';
import DetectionOverlay from '../DetectionOverlay';
import { Button } from '../ui/button';
import { Detection } from '@/services/DetectionService';

interface CameraSectionProps {
  cameraRef: React.RefObject<CameraRef>;
  onFrame: (imageData: ImageData) => void;
  showRejection: boolean;
  isPaused: boolean;
  hasPermission: boolean | null;
  onPermissionChange: (newPermissionState: boolean | null) => void;
  detections: Detection[];
  frameSize: { width: number; height: number };
  onRetryPermission: () => void;
}

const CameraSection: React.FC<CameraSectionProps> = ({
  cameraRef,
  onFrame,
  showRejection,
  isPaused,
  hasPermission,
  onPermissionChange,
  detections,
  frameSize,
  onRetryPermission
}) => {
  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
        <CameraIcon size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Camera access denied</h3>
        <p className="text-gray-500 text-center mb-4">
          Please allow camera access in your browser settings and refresh the page.
        </p>
        <Button onClick={onRetryPermission}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Camera 
        ref={cameraRef}
        onFrame={onFrame} 
        showRejection={showRejection}
        isPaused={isPaused}
        onPermissionChange={onPermissionChange}
      />
      <DetectionOverlay 
        detections={detections} 
        width={frameSize.width} 
        height={frameSize.height} 
      />
    </div>
  );
};

export default CameraSection;
