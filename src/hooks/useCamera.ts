
import { useState, useEffect, useRef, useCallback } from 'react';

export const useCamera = (onFrame: (imageData: ImageData) => void, isPaused: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Function to start camera
  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      setErrorMessage('Camera access denied. Please allow camera permissions and try again.');
    }
  }, [facingMode, stream]);

  // Function to switch camera between front and back
  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    
    if (hasPermission) {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        const newStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: newFacingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        setStream(newStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (error) {
        console.error('Error switching camera:', error);
      }
    }
  }, [facingMode, hasPermission, stream]);

  // Process frames from the camera
  useEffect(() => {
    if (!hasPermission || !videoRef.current || !canvasRef.current) return;

    const processFrame = () => {
      if (isPaused) {
        requestAnimationFrame(processFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== 4) {
        requestAnimationFrame(processFrame);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        requestAnimationFrame(processFrame);
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Extract image data and pass to parent
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      onFrame(imageData);
      
      requestAnimationFrame(processFrame);
    };

    videoRef.current.onloadedmetadata = () => {
      requestAnimationFrame(processFrame);
    };

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasPermission, onFrame, isPaused, stream]);

  // Check if we're on a mobile device
  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  return {
    videoRef,
    canvasRef,
    hasPermission,
    errorMessage,
    facingMode,
    startCamera,
    switchCamera,
    isMobile
  };
};
