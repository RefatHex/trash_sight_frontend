
import { useState } from 'react';
import audioService from '@/services/AudioService';

export const useRejectionStatus = () => {
  const [showRejection, setShowRejection] = useState(false);
  
  const triggerRejection = () => {
    setShowRejection(true);
    audioService.playBeep();
  };
  
  return {
    showRejection,
    setShowRejection,
    triggerRejection
  };
};
