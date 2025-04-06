
// Mock detection service (to be replaced with real TensorFlow.js implementation)
import { WasteCategory } from '@/hooks/useTrashCategories';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  class: WasteCategory;
  confidence: number;
  bbox: BoundingBox;
}

// This is a mock service that simulates detections
export class DetectionService {
  private mockDetectionInterval: number = 2000; // ms
  private lastDetectionTime: number = 0;
  private categories: WasteCategory[] = [
    'recyclables', 'reusable-cups', 'general-waste'
  ];

  constructor() {
    console.log('Detection service initialized');
  }

  // Mock detection function
  public async detectObjects(imageData: ImageData): Promise<Detection[]> {
    const currentTime = Date.now();
    
    // Generate mock detections occasionally to simulate the model
    if (currentTime - this.lastDetectionTime > this.mockDetectionInterval) {
      this.lastDetectionTime = currentTime;
      
      // Randomly decide whether to generate a detection
      if (Math.random() > 0.3) {
        return this.generateMockDetections(imageData.width, imageData.height);
      }
    }
    
    return [];
  }

  private generateMockDetections(width: number, height: number): Detection[] {
    const detections: Detection[] = [];
    const numDetections = Math.floor(Math.random() * 2) + 1; // 1-2 objects
    
    for (let i = 0; i < numDetections; i++) {
      // Generate random bounding box that's somewhat centered
      const boxWidth = Math.floor(width * (0.2 + Math.random() * 0.3));
      const boxHeight = Math.floor(height * (0.2 + Math.random() * 0.3));
      const x = Math.floor((width - boxWidth) * (0.3 + Math.random() * 0.4));
      const y = Math.floor((height - boxHeight) * (0.3 + Math.random() * 0.4));
      
      // Random category and confidence
      const category = this.categories[Math.floor(Math.random() * this.categories.length)];
      const confidence = 0.6 + Math.random() * 0.3; // Between 0.6 and 0.9
      
      detections.push({
        class: category,
        confidence: confidence,
        bbox: {
          x: x,
          y: y,
          width: boxWidth,
          height: boxHeight
        }
      });
    }
    
    return detections;
  }

  // Additional method to check if object is "close" (large in the frame)
  public isObjectClose(bbox: BoundingBox, frameWidth: number, frameHeight: number): boolean {
    // Calculate the area of the bounding box relative to the frame
    const bboxArea = bbox.width * bbox.height;
    const frameArea = frameWidth * frameHeight;
    const relativeArea = bboxArea / frameArea;
    
    // If the bounding box occupies more than 25% of the frame, consider it "close"
    return relativeArea > 0.25;
  }
}

export default new DetectionService();
