# AI vs Human-Generated Image Classifier

A deep learning project that classifies images as either AI-generated or human-made using CNN and ResNet models.

## Features

- Two models: Simple CNN and ResNet-50
- Train models on CIFAKE dataset
- Web interface for image classification
- Training history visualization
- Real-time predictions with confidence scores

## Tech Stack

**Backend:**
- Python
- PyTorch
- Flask
- torchvision

**Frontend:**
- React
- Vite
- Recharts (for visualizations)
- Axios

## Setup

### Prerequisites
- Python 3.10 or 3.11 (PyTorch 2.0.1 may not work with newer versions)
- Node.js and npm

### 1. Clone Repository
```bash
git clone <repository-url>
cd ai-image-classifier
```

### 2. Backend Setup
Create a virtual environment with Python 3.10 or 3.11:

```bash
cd backend
py -3.11 -m venv .venv311
.\.venv311\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If PyTorch installation fails, install from PyTorch's wheel index:
```bash
python -m pip install torch==2.0.1+cpu torchvision==0.15.2+cpu -f https://download.pytorch.org/whl/cpu.html
```

### 3. Download Dataset
Download CIFAKE dataset from Kaggle:
https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-synthetic-images

Organize it in the `data/` folder as described in `data/README.md`

### 4. Train Models
```bash
python train.py --model simple_cnn --epochs 10
python train.py --model resnet --epochs 15
```

### 5. Start Backend
```bash
python app.py
```

Backend will run on http://localhost:5000

### 6. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Select a model (Simple CNN or ResNet-50)
3. Upload an image or drag and drop
4. View the prediction and confidence scores
5. Check training history in the "Training History" tab

## Model Performance

Based on CIFAKE dataset:
- Simple CNN: ~87-90% accuracy
- ResNet-50: ~92-95% accuracy

## Troubleshooting

- If `pip install -r requirements.txt` fails for PyTorch, use the CPU wheel install command above.
- If `py -3.11` is not found, install Python 3.11 from python.org and retry.
- If `npm run dev` fails, ensure `npm install` was run in the frontend directory.
- If no models are available in the UI, train them first using the train commands.

## Project Structure

```
ai-image-classifier/
├── backend/
│   ├── models/          # Model architectures
│   ├── saved_models/    # Trained model weights
│   ├── uploads/         # Temporary upload folder
│   ├── train.py         # Training script
│   ├── inference.py     # Inference logic
│   └── app.py           # Flask API
├── frontend/
│   └── src/
│       ├── components/  # React components
│       └── App.jsx      # Main app component
└── data/                # Dataset folder
```

## API Endpoints

- `POST /api/predict` - Predict if image is AI-generated
- `GET /api/history/<model_type>` - Get training history
- `GET /api/models` - List available models
