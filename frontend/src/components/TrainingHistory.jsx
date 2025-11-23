import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_URL = 'http://localhost:5000/api'

function TrainingHistory({ selectedModel }) {
    const [history, setHistory] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!selectedModel) {
            setHistory(null)
            return
        }
        fetchHistory()
    }, [selectedModel])

    const fetchHistory = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${API_URL}/history/${selectedModel}`)
            setHistory(response.data)
        } catch (err) {
            setError('Training history not found. Train the model first.')
            setHistory(null)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div style={styles.loading}>Loading history...</div>
    }

    if (error) {
        return (
            <div style={styles.error}>
                <div>{error}</div>
                <code style={styles.code}>python train.py --model {selectedModel}</code>
            </div>
        )
    }

    if (!history) {
        return null
    }

    const scale = (v) => (typeof v === 'number' && v <= 1 ? v * 100 : v)

    const epochs = history.train_loss.map((_, i) => i + 1)
    const chartData = epochs.map((epoch, i) => ({
        epoch,
        trainLoss: history.train_loss[i],
        valLoss: history.val_loss[i],
        trainAcc: scale(history.train_acc[i]),
        valAcc: scale(history.val_acc[i]),
    }))

    const finalAcc = scale(history.val_acc[history.val_acc.length - 1] ?? 0)

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>
                    {selectedModel === 'simple_cnn' ? 'Simple CNN' : 'ResNet-50'} Training History
                </h2>

                <div style={styles.stats}>
                    <div style={styles.stat}>
                        <div style={styles.statLabel}>Final Validation Accuracy</div>
                        <div style={styles.statValue}>{finalAcc.toFixed(2)}%</div>
                    </div>

                    <div style={styles.stat}>
                        <div style={styles.statLabel}>Epochs Trained</div>
                        <div style={styles.statValue}>{epochs.length}</div>
                    </div>
                </div>
            </div>

            <div style={styles.chartContainer}>
                <div style={styles.chartTitle}>Accuracy Over Epochs</div>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epoch" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="trainAcc" stroke="#8884d8" name="Train Acc (%)" />
                            <Line type="monotone" dataKey="valAcc" stroke="#82ca9d" name="Val Acc (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={styles.chartContainer}>
                <div style={styles.chartTitle}>Loss Over Epochs</div>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epoch" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="trainLoss" stroke="#ff7300" name="Train Loss" />
                            <Line type="monotone" dataKey="valLoss" stroke="#387908" name="Val Loss" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    loading: {
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: '#718096',
        fontSize: '1.1rem',
    },
    error: {
        background: '#fff3cd',
        border: '1px solid #ffc107',
        padding: '20px',
        borderRadius: '12px',
        color: '#856404',
    },
    code: {
        display: 'block',
        marginTop: '15px',
        background: '#f8f9fa',
        padding: '12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
    },
    header: {
        marginBottom: '30px',
    },
    title: {
        fontSize: '1.8rem',
        margin: '0 0 20px 0',
        color: '#2d3748',
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    stat: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
    },
    statLabel: {
        fontSize: '0.9rem',
        opacity: 0.9,
        marginBottom: '5px',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: '700',
    },
    chartContainer: {
        marginBottom: '30px',
    },
    chartTitle: {
        fontSize: '1.2rem',
        marginBottom: '15px',
        color: '#4a5568',
    },
}
export default TrainingHistory