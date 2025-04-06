
import { useState, useEffect } from 'react';
import tensorflowService from '@/services/TensorflowService';
import { useToast } from '@/hooks/use-toast';

export const useModelLoader = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(true); // Set to true by default
  const [isCheckingStorage, setIsCheckingStorage] = useState(false); // Set to false initially

  const { toast } = useToast();

  // Auto-initialize the model service
  useEffect(() => {
    const initializeModel = async () => {
      try {
        // Check if model exists in storage
        const loaded = await tensorflowService.loadModelFromStorage();
        if (!loaded) {
          // If not in storage, we'll use the mock detection service
          toast({
            title: "Using mock detection",
            description: "Mock detection service is active"
          });
        } else {
          toast({
            title: "ML Model loaded",
            description: "Using machine learning for object detection"
          });
        }
      } catch (error) {
        console.error('Error initializing model service:', error);
      } finally {
        setIsCheckingStorage(false);
      }
    };

    initializeModel();
  }, [toast]);

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
    toast({
      title: "ML Model loaded successfully",
      description: "Now using machine learning for object detection"
    });
  };

  return {
    isModelLoaded,
    isCheckingStorage,
    handleModelLoaded
  };
};
