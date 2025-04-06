import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Recycle,
  Trash2,
  Upload,
  Image as ImageIcon,
  Camera,
} from "lucide-react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      // Reset previous results and errors
      setResult(null);
      setError(null);
    }
  };

  // Start camera
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  // Take photo
  const capturePhoto = () => {
    if (!videoRef.current || !photoRef.current) return;

    const video = videoRef.current;
    const canvas = photoRef.current;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        // Create a File object from the blob
        const file = new File([blob], "camera-capture.jpg", {
          type: "image/jpeg",
        });

        // Set the captured image as the selected file
        setSelectedFile(file);

        // Create and set preview URL
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);

        // Reset previous results and errors
        setResult(null);
        setError(null);

        // Stop the camera after taking the photo
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      console.log("Sending request to backend...");
      const response = await axios.post(
        "https://refathex-trash-sight.hf.space/classify_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response received:", response.data);
      setResult(response.data);
    } catch (err: any) {
      console.error("Error details:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      setError(
        err.response?.data?.error ||
          "Failed to analyze image. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header className="text-center mb-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 opacity-10">
          <Recycle size={150} className="text-primary animate-float" />
        </div>
        <div className="flex justify-center items-center gap-2">
          <Recycle size={32} className="text-primary recycling-icon" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Trash Sight
          </h1>
          <Trash2 size={28} className="text-accent" />
        </div>
        <p className="text-muted-foreground mt-2">
          Smart recycling detection and sorting assistant
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-center flex-wrap">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-full">
                    <ImageIcon size={20} className="text-primary" />
                  </div>
                  {showCamera ? "Camera Capture" : "Image Upload"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Hidden canvas for capturing photos */}
                <canvas ref={photoRef} className="hidden"></canvas>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {showCamera ? (
                    <div className="space-y-4">
                      <div className="relative overflow-hidden rounded-lg max-h-[400px]">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="mx-auto max-h-[400px] object-contain"
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={stopCamera}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={capturePhoto}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                          Take Photo
                        </button>
                      </div>
                    </div>
                  ) : !previewUrl ? (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                          onClick={startCamera}
                          className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Camera size={48} className="text-gray-400 mb-2" />
                          <p className="text-gray-600 font-medium">
                            Capture with Camera
                          </p>
                        </button>

                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                        >
                          <Upload size={48} className="text-gray-400 mb-2" />
                          <p className="text-gray-600 font-medium">
                            Upload an Image
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            JPG, PNG, GIF up to 10MB
                          </p>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative max-h-[400px] overflow-hidden rounded-lg">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto max-h-[400px] object-contain"
                        />
                      </div>

                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={clearImage}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleUpload}
                          disabled={isLoading}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                        >
                          {isLoading ? "Analyzing..." : "Analyze Image"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 text-red-500 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Results */}
                {result && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Analysis Results</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-600">
                          Detected Object
                        </p>
                        <p className="text-lg font-semibold mt-1 capitalize">
                          {result.detected_object}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-600">
                          Disposal Bin
                        </p>
                        <p className="text-lg font-semibold mt-1 capitalize">
                          {result.disposal_bin}
                        </p>
                      </div>
                    </div>

                    {result.labeled_image && (
                      <div className="mt-4">
                        <p className="font-medium text-gray-600 mb-2">
                          Labeled Image
                        </p>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={result.labeled_image}
                            alt="Labeled Result"
                            className="mx-auto max-h-[500px] object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-full">
                  <Recycle size={20} className="text-primary" />
                </div>
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  Upload or capture an image of an item you want to classify
                </li>
                <li>Our AI model will analyze the image</li>
                <li>
                  You'll receive the classification result and the appropriate
                  disposal bin
                </li>
                <li>Help reduce waste by disposing items correctly!</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-full">
                  <Trash2 size={20} className="text-primary" />
                </div>
                Bin Types
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <span className="font-medium">Yellow Bin:</span> Recyclables
                  (bottles, cans, cardboard)
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-700"></div>
                  <span className="font-medium">Purple Bin:</span> Coffee and
                  mugs
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-black"></div>
                  <span className="font-medium">Black Bin:</span> General waste
                  (food scraps, tissues)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
