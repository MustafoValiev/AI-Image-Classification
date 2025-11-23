import torch
from torchvision import transforms
from PIL import Image
from models.simple_cnn import SimpleCNN
from models.resnet_model import ResNetClassifier

class ImageClassifier:
    def __init__(self, model_type='simple_cnn'):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model_type = model_type
        
        if model_type == 'simple_cnn':
            self.model = SimpleCNN().to(self.device)
        else:
            self.model = ResNetClassifier().to(self.device)
        
        self.model.load_state_dict(torch.load(f'saved_models/{model_type}.pth', map_location=self.device))
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((32, 32)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])
        
        self.classes = ['FAKE', 'REAL']
    
    def predict(self, image_path):
        image = Image.open(image_path).convert('RGB')
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        return {
            'prediction': self.classes[predicted.item()],
            'confidence': confidence.item() * 100,
            'probabilities': {
                'FAKE': probabilities[0][0].item() * 100,
                'REAL': probabilities[0][1].item() * 100
            }
        }