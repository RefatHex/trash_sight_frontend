
import { useState, useEffect } from 'react';
import huggingFaceService from '@/services/HuggingFaceService';
import { useToast } from '@/hooks/use-toast';

export const useDetectionModel = () => {
  const [useHuggingFace, setUseHuggingFace] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const initHuggingFace = async () => {
      try {
        const success = await huggingFaceService.initModel();
        if (success) {
          setUseHuggingFace(true);
          toast({
            title: "AI Model Loaded",
            description: "Using Hugging Face model for waste classification"
          });
        }
      } catch (error) {
        console.error("Error initializing Hugging Face model:", error);
      }
    };
    
    initHuggingFace();
  }, [toast]);
  
  return {
    useHuggingFace
  };
};
