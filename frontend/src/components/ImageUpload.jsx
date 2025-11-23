import { useState } from 'react'

const fileInputRef = useRef(null)

function ImageUpload({ onUpload, loading }) {
    const [preview, setPreview] = useState(null)
    const [dragActive, setDragActive] = useState(false)

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
            onUpload(file)
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    return (
        <div
            className={`image-upload ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleChange}
            />

            {loading ? (
                <div>Analyzing image...</div>
            ) : preview ? (
                <div>
                    <img src={preview} alt="preview" style={{ maxWidth: '100%' }} />
                    <div>Click or drag to change image</div>
                </div>
            ) : (
                <div>
                    <div style={{ fontSize: 40 }}>📷</div>
                    <div>Drop an image here or click to upload</div>
                    <div>Supports JPG, PNG, WEBP</div>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        marginBottom: '20px',
    },
    dropZone: {
        background: 'white',
        border: '3px dashed #cbd5e0',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    dropZoneActive: {
        borderColor: '#667eea',
        background: '#f7fafc',
    },
    input: {
        display: 'none',
    },
    label: {
        cursor: 'pointer',
        display: 'block',
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '5px solid #e2e8f0',
        borderTopColor: '#667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    preview: {
        maxWidth: '300px',
        maxHeight: '300px',
        borderRadius: '8px',
        marginBottom: '15px',
    },
    changeText: {
        color: '#718096',
        margin: 0,
    },
    uploadPrompt: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    icon: {
        fontSize: '4rem',
        marginBottom: '15px',
    },
    promptText: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#2d3748',
        margin: '0 0 8px 0',
    },
    promptSubtext: {
        color: '#718096',
        margin: 0,
    }
}

const styleSheet = document.createElement('style')
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(styleSheet)

export default ImageUpload