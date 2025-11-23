import React from 'react'

function PredictionResult({ result }) {
    if (!result) return null

    const isAI = result.prediction === 'FAKE'
    const fake = result.probabilities?.FAKE ?? 0
    const real = result.probabilities?.REAL ?? 0
    const confidence = result.confidence ?? 0

    return (
        <div style={styles.container}>
            <div style={{ ...styles.result, ...(isAI ? styles.resultAI : styles.resultHuman) }}>
                <div style={styles.icon}>{isAI ? '🤖' : '👤'}</div>
                <h3 style={styles.title}>{isAI ? 'AI-Generated' : 'Human-Made'}</h3>
                <p style={styles.confidence}>Confidence: {confidence.toFixed(2)}%</p>
            </div>

            <h4 style={styles.subtitle}>Probabilities</h4>

            <div style={styles.probabilities}>
                <div style={styles.probBar}>
                    <div style={styles.probLabel}>
                        <span>🤖 AI - Generated</span>
                        <span>{fake.toFixed(2)}%</span>
                    </div>
                    <div style={styles.barContainer}>
                        <div
                            style={{
                                ...styles.bar,
                                ...styles.barAI,
                                width: `${Math.min(Math.max(fake, 0), 100)}%`,
                            }}
                        >
                            {fake.toFixed(2)}%
                        </div>
                    </div>
                </div>

                <div style={styles.probBar}>
                    <div style={styles.probLabel}>
                        <span>👤 Human - Made</span>
                        <span>{real.toFixed(2)}%</span>
                    </div>
                    <div style={styles.barContainer}>
                        <div
                            style={{
                                ...styles.bar,
                                ...styles.barHuman,
                                width: `${Math.min(Math.max(real, 0), 100)}%`,
                            }}
                        >
                            {real.toFixed(2)}%
                        </div>
                    </div>
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
    result: {
        textAlign: 'center',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
    },
    resultAI: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
    },
    resultHuman: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
    },
    icon: {
        fontSize: '4rem',
        marginBottom: '15px',
    },
    title: {
        fontSize: '2rem',
        margin: '0 0 10px 0',
    },
    confidence: {
        fontSize: '1.2rem',
        opacity: 0.9,
        margin: 0,
    },
    subtitle: {
        fontSize: '1.3rem',
        marginTop: 0,
        marginBottom: '20px',
        color: '#2d3748',
    },
    probabilities: {
        marginTop: '20px',
    },
    probBar: {
        marginBottom: '20px',
    },
    probLabel: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        color: '#4a5568',
        fontWeight: '600',
    },
    barContainer: {
        background: '#e2e8f0',
        height: '30px',
        borderRadius: '15px',
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        transition: 'width 0.5s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '10px',
        color: 'white',
        fontWeight: '600',
    },
    barAI: {
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    },
    barHuman: {
        background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
    },
}

export default PredictionResult