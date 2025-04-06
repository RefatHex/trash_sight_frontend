
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import tensorflowService from '@/services/TensorflowService';
import { Loader2, UploadCloud } from 'lucide-react';

interface ModelUploaderProps {
  onModelLoaded: () => void;
}

const ModelUploader: React.FC<ModelUploaderProps> = ({ onModelLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      // Find the model.json file
      const modelJsonFile = Array.from(files).find(file => file.name === 'model.json');
      // Get the weight files (all other files)
      const weightFiles = Array.from(files).filter(file => file.name !== 'model.json');

      if (!modelJsonFile) {
        toast({
          title: "Error",
          description: "model.json file is required",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Load the model
      await tensorflowService.loadModelFromFiles(modelJsonFile, weightFiles);
      
      toast({
        title: "Model loaded",
        description: "The model has been successfully loaded and saved for future use",
      });
      
      // Notify parent component
      onModelLoaded();
    } catch (error) {
      console.error('Error loading model:', error);
      toast({
        title: "Error loading model",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [onModelLoaded, toast]);

  return (
    <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50">
      <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium mb-2">Upload TensorFlow.js Model</h3>
      <p className="text-sm text-gray-500 text-center mb-4">
        Upload your model.json file and associated weight files
      </p>
      
      <div className="relative w-full">
        <input
          type="file"
          id="model-upload"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleUpload}
          disabled={isLoading}
        />
        <Button 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </>
          ) : (
            'Select Files'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ModelUploader;
