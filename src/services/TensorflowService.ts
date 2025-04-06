
import * as tf from '@tensorflow/tfjs';
import { Detection, BoundingBox } from './DetectionService';

export class TensorflowService {
  private model: tf.LayersModel | null = null;
  private isModelLoading: boolean = false;
  private modelLoadPromise: Promise<tf.LayersModel> | null = null;
  private readonly CLASS_NAMES = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash'];
  
  constructor() {
    console.log('TensorFlow service initialized');
  }

  // Load the model from files that the user uploaded
  public async loadModelFromFiles(modelJson: File, weightsFiles: File[]): Promise<boolean> {
    try {
      if (this.isModelLoading) {
        return this.modelLoadPromise!.then(() => true);
      }

      this.isModelLoading = true;
      // Create a weights manifest
      const weightsManifest = weightsFiles.map(file => ({
        name: file.name,
        path: file.name,
      }));

      // Create files object with model.json and weights
      const files = {
        [modelJson.name]: new Blob([await modelJson.arrayBuffer()], { type: 'application/json' }),
      };

      weightsFiles.forEach(file => {
        files[file.name] = new Blob([file], { type: 'application/octet-stream' });
      });

      // Load the model
      this.modelLoadPromise = tf.loadLayersModel(tf.io.browserFiles([modelJson, ...weightsFiles]));
      this.model = await this.modelLoadPromise;
      
      console.log('Model loaded successfully', this.model);
      this.isModelLoading = false;
      
      // Save model to IndexedDB for future use
      await this.model.save('indexeddb://trash-sight-model');
      
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      this.isModelLoading = false;
      throw error;
    }
  }

  // Try to load model from IndexedDB (previously saved)
  public async loadModelFromStorage(): Promise<boolean> {
    try {
      if (this.model) return true;
      if (this.isModelLoading) {
        return this.modelLoadPromise!.then(() => true);
      }
      
      this.isModelLoading = true;
      
      // Check if model exists in IndexedDB
      const models = await tf.io.listModels();
      if (models['indexeddb://trash-sight-model']) {
        this.modelLoadPromise = tf.loadLayersModel('indexeddb://trash-sight-model');
        this.model = await this.modelLoadPromise;
        console.log('Model loaded from IndexedDB');
        this.isModelLoading = false;
        return true;
      }
      
      this.isModelLoading = false;
      return false;
    } catch (error) {
      console.error('Error loading model from storage:', error);
      this.isModelLoading = false;
      return false;
    }
  }

  // Check if model is loaded
  public isModelLoaded(): boolean {
    return this.model !== null;
  }

  // Process an image and return detections
  public async detectObjects(imageData: ImageData): Promise<Detection[]> {
    if (!this.model) {
      const loaded = await this.loadModelFromStorage();
      if (!loaded) {
        return [];
      }
    }

    try {
      // Convert ImageData to tensor
      const tensor = this.imageDataToTensor(imageData);
      
      // Make prediction
      const result = await this.model!.predict(tensor) as tf.Tensor[];
      
      // Process results (assuming model outputs bounding boxes and class probabilities)
      // Note: This may need to be adjusted based on your specific model's output format
      const [boxesTensor, classesTensor] = result;
      
      // Convert tensors to arrays
      const boxes = await boxesTensor.array();
      const classes = await classesTensor.array();
      
      // Clean up tensors
      tf.dispose([tensor, ...result]);
      
      // Process detection results
      const detections: Detection[] = [];
      
      // Process each detection (assuming first dimension is batch size)
      for (let i = 0; i < boxes[0].length; i++) {
        const box = boxes[0][i];
        const scores = classes[0][i];
        
        // Find the class with highest probability
        const classIndex = tf.argMax(scores).dataSync()[0];
        const confidence = scores[classIndex];
        
        // Only include detections with reasonable confidence
        if (confidence > 0.5) {
          // Convert normalized box coordinates (x1, y1, x2, y2) to (x, y, width, height)
          const x = box[0] * imageData.width;
          const y = box[1] * imageData.height;
          const width = (box[2] - box[0]) * imageData.width;
          const height = (box[3] - box[1]) * imageData.height;
          
          const bbox: BoundingBox = {
            x,
            y,
            width,
            height
          };
          
          detections.push({
            class: this.CLASS_NAMES[classIndex] as any, // Type assertion to match the Detection type
            confidence,
            bbox
          });
        }
      }
      
      return detections;
    } catch (error) {
      console.error('Error in detection:', error);
      return [];
    }
  }

  // Helper method to convert ImageData to tensor
  private imageDataToTensor(imageData: ImageData): tf.Tensor {
    // Determine input dimensions expected by model
    // You may need to adjust these based on your model's requirements
    const inputHeight = this.model!.inputs[0].shape?.[1] || 224;
    const inputWidth = this.model!.inputs[0].shape?.[2] || 224;
    
    // Create tensor from imageData
    const tensor = tf.browser.fromPixels(imageData, 3)
      // Resize to the dimensions expected by the model
      .resizeBilinear([inputHeight, inputWidth])
      // Normalize pixel values to 0-1
      .div(255.0)
      // Add batch dimension
      .expandDims(0);
    
    return tensor;
  }
}

export default new TensorflowService();
