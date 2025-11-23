from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from inference import ImageClassifier

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

classifiers = {
    'simple_cnn': None,
    'resnet': None
}

def load_classifier(model_type):
    if classifiers[model_type] is None:
        try:
            classifiers[model_type] = ImageClassifier(model_type)
        except Exception as e:
            return None
    return classifiers[model_type]

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    model_type = request.form.get('model', 'simple_cnn')
    
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    classifier = load_classifier(model_type)
    if classifier is None:
        return jsonify({'error': f'Model {model_type} not found. Please train it first.'}), 404
    
    try:
        result = classifier.predict(filepath)
        os.remove(filepath)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history/', methods=['GET'])
def get_history(model_type):
    history_path = f'saved_models/{model_type}_history.json'
    
    if not os.path.exists(history_path):
        return jsonify({'error': 'Training history not found'}), 404
    
    with open(history_path, 'r') as f:
        history = json.load(f)
    
    return jsonify(history)

@app.route('/api/models', methods=['GET'])
def get_models():
    available_models = []
    
    for model_type in ['simple_cnn', 'resnet']:
        model_path = f'saved_models/{model_type}.pth'
        if os.path.exists(model_path):
            available_models.append(model_type)
    
    return jsonify({'models': available_models})

if __name__ == '__main__':
    app.run(debug=True, port=5000)