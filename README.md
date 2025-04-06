# EcoSort Guardian - Smart Waste Detection System

EcoSort Guardian is a modern web application designed to help users correctly sort waste items into appropriate recycling bins using computer vision technology. The system detects, classifies, and recommends the correct disposal bin for various waste items captured through a camera or uploaded as images.

## ♻️ Features

- **Real-time Waste Detection**: Analyze waste items through your camera
- **Image Upload**: Upload images of waste items for classification
- **Smart Classification**: Automatically categorize waste into appropriate categories
- **Three-Bin System**:
  - 🟡 Yellow Bin (Recyclables): Plastic, cardboard, paper, metal, and glass items
  - 🟣 Purple Bin (Reusable cups): Specific reusable cups that will be washed and reused
  - ⚫ Black Bin (General waste): Food scraps, tissues, and non-recyclable items
- **Rejection Feedback**: Clear visual feedback when items don't belong in the selected bin
- **Detection Statistics**: Track detection counts, rejections, and acceptance rates

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone
   cd ecosort-guardian-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🧰 Tech Stack

- **Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query
- **Routing**: React Router
- **API Client**: Axios
- **Computer Vision Integration**: Custom AI model backend

## 📸 Camera Access

The application requires camera access for real-time waste detection. Make sure to:

1. Use HTTPS in production environments
2. Grant camera permissions in your browser when prompted
3. If using a mobile device, ensure the application has necessary permissions

## 🔄 Bin System Overview

### Yellow Bin - Recyclables

- Plastic containers and bottles
- Paper and cardboard
- Glass bottles and jars
- Metal cans and aluminum foil

### Purple Bin - Reusable Cups

- Specific types of reusable cups
- Coffee mugs
- Reusable drink containers

### Black Bin - General Waste

- Food waste
- Tissues and paper towels
- Non-recyclable plastics
- Other non-recyclable items

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Frontend UI components based on [shadcn/ui](https://ui.shadcn.com/)
- Icons provided by [Lucide](https://lucide.dev/)
- Computer vision models trained on waste classification datasets
