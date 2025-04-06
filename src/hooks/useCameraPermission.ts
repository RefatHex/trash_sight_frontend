
import { useState } from 'react';

export const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);

  const handlePermissionChange = (newPermissionState: boolean | null) => {
    setHasPermission(newPermissionState);
  };

  const handleRequestPermission = (cameraRef: React.RefObject<any>) => {
    setShowPermissionDialog(false);
    
    // Use the ref to call startCamera on the Camera component
    if (cameraRef.current) {
      cameraRef.current.startCamera().catch((error: Error) => {
        console.error('Failed to start camera:', error);
        // Show the permission dialog again if there was an error
        setShowPermissionDialog(true);
      });
    }
  };

  return {
    hasPermission,
    showPermissionDialog,
    setShowPermissionDialog,
    handlePermissionChange,
    handleRequestPermission
  };
};
