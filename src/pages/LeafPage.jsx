import React, { useState, useRef } from 'react';
import { Leaf, Upload, Loader2, RotateCcw, Sparkles, AlertTriangle, Camera } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';
import { GroqService } from '../services/groqService.js';
import { LANGUAGES } from '../constants/languages.js';

const groqService = new GroqService();

export default function LeafPage({ language = 'en' }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const currentLangInfo = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file only.');
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setSelectedImage(ev.target.result);
            setImagePreview(URL.createObjectURL(file));
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        processFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleAnalyze = async () => {
        if (!selectedImage) {
            setError('Please upload a leaf image first.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await groqService.analyzeLeafDisease(selectedImage, language);
            setAnalysisResult(result);
        } catch (err) {
            setError(err.message || 'Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setAnalysisResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-icon gradient-green-emerald">
                    <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="page-title">Leaf Disease Analysis</h1>
                    <p className="page-subtitle">AI-powered plant pathology • Output in {currentLangInfo.nativeName}</p>
                </div>
            </div>

            <div className="analysis-layout">
                {/* Input Section */}
                <div className="analysis-input-panel">
                    <div className="panel-card">
                        <h2 className="panel-title">
                            <Camera className="w-5 h-5" /> Upload Leaf Image
                        </h2>

                        <div
                            className={`upload-zone leaf-upload ${dragActive ? 'drag-active' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            id="leaf-upload-zone"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                className="hidden"
                                id="leaf-file-input"
                            />
                            {imagePreview ? (
                                <div className="uploaded-preview leaf-preview">
                                    <img src={imagePreview} alt="Leaf" className="uploaded-image leaf-image" />
                                    <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="remove-upload-btn" id="remove-leaf-image">
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="upload-placeholder"
                                    id="click-to-upload-leaf"
                                >
                                    <div className="leaf-upload-icon">
                                        <Leaf className="w-10 h-10 text-green-500" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-600 mt-3">
                                        Drop leaf image here or click to upload
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Take a clear photo of the affected leaf
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Tips */}
                        <div className="tips-card">
                            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">📸 Photo Tips</h4>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Use natural lighting for best results</li>
                                <li>• Capture both healthy and affected areas</li>
                                <li>• Keep the leaf in sharp focus</li>
                                <li>• Include both sides if possible</li>
                            </ul>
                        </div>

                        {/* Language Notice */}
                        <div className="lang-notice" id="lang-notice-leaf">
                            🌐 Analysis will be in <strong>{currentLangInfo.nativeName}</strong>
                        </div>

                        {error && (
                            <div className="error-msg" id="leaf-error-message">
                                <AlertTriangle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <div className="action-buttons">
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !selectedImage}
                                className="analyze-btn gradient-green-emerald"
                                id="analyze-leaf-btn"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing Leaf...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Analyze Leaf
                                    </>
                                )}
                            </button>
                            <button onClick={handleReset} className="reset-btn" id="reset-leaf-btn">
                                <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result Section */}
                <div className="analysis-result-panel">
                    {isAnalyzing ? (
                        <div className="analyzing-state">
                            <div className="analyzing-spinner leaf-spinner">
                                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mt-4">Analyzing Leaf Condition...</h3>
                            <p className="text-sm text-gray-500 mt-1">Detecting diseases, identifying symptoms</p>
                            <div className="analyzing-steps">
                                <div className="step-dot active green" />
                                <div className="step-dot active green delay-1" />
                                <div className="step-dot active green delay-2" />
                            </div>
                        </div>
                    ) : analysisResult ? (
                        <div className="result-card" id="leaf-analysis-result">
                            <div className="result-header gradient-green-emerald">
                                <Leaf className="w-6 h-6 text-white" />
                                <h3 className="text-white font-bold text-lg">Disease Analysis Report</h3>
                            </div>
                            <div className="result-body">
                                <MarkdownRenderer content={analysisResult} />
                            </div>
                        </div>
                    ) : (
                        <div className="empty-result">
                            <div className="empty-result-icon gradient-green-emerald">
                                <Leaf className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mt-4">Upload a Leaf Image</h3>
                            <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
                                Upload a photo of any plant leaf to detect diseases, get treatment suggestions, and prevention tips.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
