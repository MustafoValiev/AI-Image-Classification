import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PredictionResult from './components/PredictionResult'
import TrainingHistory from './components/TrainingHistory'

const API_URL = 'http://localhost:5000/api'

function App() {
    const [selectedModel, setSelectedModel] = useState('simple_cnn')
    const [availableModels, setAvailableModels] = useState([])
    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('predict')

    useEffect(() => {
        fetchAvailableModels()
    }, [])

    const fetchAvailableModels = async () => {
        try {
            const response = await axios.get(`${API_URL}/models`)
            setAvailableModels(response.data.models || [])
            if (response.data.models && response.data.models.length > 0) {
                setSelectedModel(response.data.models[0])
            }
        } catch (error) {
            console.error('Error fetching models:', error)
        }
    }

    const handleImageUpload = async (file) => {
        if (!file) return
        setLoading(true)
        const formData = new FormData()
        formData.append('image', file)
        formData.append('model', selectedModel)

        try {
            const response = await axios.post(`${API_URL}/predict`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            setPrediction(response.data)
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || 'Failed to classify image'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>AI vs Human - Generated Image Classifier</h1>
                <p style={styles.subtitle}>Detect AI-generated images using Deep Learning</p>
            </header>

            <div style={styles.tabs}>
                <button
                    style={activeTab === 'predict' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
                    onClick={() => setActiveTab('predict')}
                >
                    Prediction
                </button>

                <button
                    style={activeTab === 'history' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
                    onClick={() => setActiveTab('history')}
                >
                    Training History
                </button>
            </div>

            <main style={styles.main}>
                {activeTab === 'predict' ? (
                    <div>
                        <div style={styles.modelSelector}>
                            <label style={styles.label}>Select Model:</label>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                style={styles.select}
                            >
                                {availableModels.map((model) => (
                                    <option key={model} value={model}>
                                        {model === 'simple_cnn' ? 'Simple CNN' : model}
                                    </option>
                                ))}
                            </select>

                            {availableModels.length === 0 && (
                                <div style={styles.warning}>
                                    No trained models found. Please train models first using:
                                    <code style={styles.code}>python train.py --model simple_cnn</code>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <label style={styles.label}>Upload Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e.target.files?.[0])}
                            />
                        </div>

                        {loading && <div style={{ marginTop: 12 }}>Analyzing image...</div>}

                        {prediction && (
                            <div style={{ marginTop: 20 }}>
                                <PredictionResult result={prediction} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <TrainingHistory selectedModel={selectedModel} />
                    </div>
                )}
            </main>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingBottom: 40,
    },
    header: {
        textAlign: 'center',
        padding: '40px 20px',
        color: 'white',
    },
    title: {
        fontSize: '2.5rem',
        margin: '0 0 10px 0',
        fontWeight: '700',
    },
    subtitle: {
        fontSize: '1.1rem',
        opacity: 0.9,
        margin: 0,
    },
    tabs: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
    },
    tab: {
        padding: '12px 30px',
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        color: 'white',
        fontSize: '1rem',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'all 0.3s',
    },
    tabActive: {
        background: 'white',
        color: '#667eea',
    },
    main: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 20px 40px',
    },
    modelSelector: {
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
    },
    select: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    warning: {
        background: '#fff3cd',
        border: '1px solid #ffc107',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '12px',
        color: '#856404',
    },
    code: {
        display: 'block',
        marginTop: '10px',
        background: '#f8f9fa',
        padding: '10px',
        borderRadius: '4px',
        fontFamily: 'monospace',
    },
}
export default App