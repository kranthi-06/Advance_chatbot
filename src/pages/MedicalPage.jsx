import React, { useState, useRef } from 'react';
import { FileHeart, Upload, FileText, Loader2, RotateCcw, Sparkles, AlertTriangle, File } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';
import { GroqService } from '../services/groqService.js';
import { LANGUAGES } from '../constants/languages.js';
import { extractTextFromPDF } from '../utils/pdfExtractor.js';

const groqService = new GroqService();

export default function MedicalPage({ language = 'en' }) {
    const [reportText, setReportText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);  // base64 data
    const [filePreview, setFilePreview] = useState(null);     // preview URL or file name
    const [fileType, setFileType] = useState(null);           // 'image' or 'pdf'
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [inputMode, setInputMode] = useState('upload');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const currentLangInfo = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        processFile(file);
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

    const processFile = (file) => {
        if (!file) return;
        setError(null);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSelectedFile(ev.target.result);
                setFilePreview(URL.createObjectURL(file));
                setFileType('image');
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSelectedFile(ev.target.result);
                setFilePreview(file.name);
                setFileType('pdf');
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please upload an image (JPG, PNG) or PDF file.');
        }
    };

    const handleAnalyze = async () => {
        if (!reportText.trim() && !selectedFile) {
            setError('Please upload a report image/PDF or paste report text.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        try {
            let textForAnalysis = reportText.trim();
            let imageForAnalysis = null;

            if (selectedFile && fileType === 'pdf') {
                // PDF: extract text client-side first, then send text to Groq
                const pdfText = await extractTextFromPDF(selectedFile);
                if (textForAnalysis) {
                    textForAnalysis = `${textForAnalysis}\n\nExtracted from PDF:\n${pdfText}`;
                } else {
                    textForAnalysis = pdfText;
                }
            } else if (selectedFile && fileType === 'image') {
                // Image: send to Groq vision model
                imageForAnalysis = selectedFile;
            }

            const result = await groqService.analyzeMedicalReport(textForAnalysis, imageForAnalysis, language, 'image/jpeg');
            setAnalysisResult(result);
        } catch (err) {
            setError(err.message || 'Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setReportText('');
        setSelectedFile(null);
        setFilePreview(null);
        setFileType(null);
        setAnalysisResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setFileType(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-icon gradient-rose-pink">
                    <FileHeart className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="page-title">Medical Report Analysis</h1>
                    <p className="page-subtitle">AI-powered lab report interpretation • Output in {currentLangInfo.nativeName}</p>
                </div>
            </div>

            {/* Disclaimer Banner */}
            <div className="disclaimer-banner" id="medical-disclaimer-banner">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm">
                    <strong>Disclaimer:</strong> This tool provides AI-generated analysis for educational purposes only.
                    It is <strong>not a medical diagnosis</strong>. Always consult a qualified healthcare professional.
                </p>
            </div>

            <div className="analysis-layout">
                {/* Input Section */}
                <div className="analysis-input-panel">
                    <div className="panel-card">
                        <h2 className="panel-title">
                            <FileText className="w-5 h-5" /> Upload Report
                        </h2>

                        {/* Mode Toggle */}
                        <div className="mode-toggle" id="input-mode-toggle">
                            <button
                                onClick={() => setInputMode('upload')}
                                className={`mode-btn ${inputMode === 'upload' ? 'mode-btn-active' : ''}`}
                                id="mode-upload-btn"
                            >
                                <Upload className="w-4 h-4" /> Upload File
                            </button>
                            <button
                                onClick={() => setInputMode('text')}
                                className={`mode-btn ${inputMode === 'text' ? 'mode-btn-active' : ''}`}
                                id="mode-text-btn"
                            >
                                <FileText className="w-4 h-4" /> Paste Text
                            </button>
                        </div>

                        {inputMode === 'upload' ? (
                            <div 
                                className={`upload-zone ${dragActive ? 'drag-active' : ''}`} 
                                id="upload-zone"
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    id="medical-file-input"
                                />
                                {selectedFile ? (
                                    <div className="uploaded-preview">
                                        {fileType === 'image' ? (
                                            <img src={filePreview} alt="Report" className="uploaded-image" />
                                        ) : (
                                            <div className="pdf-preview">
                                                <File className="w-12 h-12 text-red-400" />
                                                <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-primary)' }}>{filePreview}</p>
                                                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>PDF file ready for analysis</p>
                                            </div>
                                        )}
                                        <button onClick={removeFile} className="remove-upload-btn" id="remove-medical-file">
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="upload-placeholder"
                                        id="click-to-upload"
                                    >
                                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                        <p className="text-sm font-semibold">Click to upload lab report</p>
                                        <p className="text-xs mt-1">Supports JPG, PNG images & PDF files</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="Paste your lab report values here...&#10;&#10;Example:&#10;Hemoglobin: 12.5 g/dL&#10;WBC: 8500 /μL&#10;Platelets: 250000 /μL&#10;Blood Sugar (Fasting): 110 mg/dL&#10;..."
                                className="report-textarea"
                                id="report-text-input"
                            />
                        )}

                        {inputMode === 'upload' && selectedFile && (
                            <textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="(Optional) Add additional report text or notes..."
                                className="report-textarea report-textarea-small"
                                id="additional-text-input"
                            />
                        )}

                        {/* Language Notice */}
                        <div className="lang-notice" id="lang-notice-medical">
                            🌐 Analysis will be in <strong>{currentLangInfo.nativeName}</strong>
                        </div>

                        {error && (
                            <div className="error-msg" id="error-message">
                                <AlertTriangle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <div className="action-buttons">
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || (!reportText.trim() && !selectedFile)}
                                className="analyze-btn gradient-rose-pink"
                                id="analyze-medical-btn"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing Report...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Analyze Report
                                    </>
                                )}
                            </button>
                            <button onClick={handleReset} className="reset-btn" id="reset-medical-btn">
                                <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result Section */}
                <div className="analysis-result-panel">
                    {isAnalyzing ? (
                        <div className="analyzing-state">
                            <div className="analyzing-spinner">
                                <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mt-4">Analyzing Your Report...</h3>
                            <p className="text-sm text-gray-500 mt-1">Extracting values, comparing with normal ranges</p>
                            <div className="analyzing-steps">
                                <div className="step-dot active" />
                                <div className="step-dot active delay-1" />
                                <div className="step-dot active delay-2" />
                            </div>
                        </div>
                    ) : analysisResult ? (
                        <div className="result-card" id="analysis-result">
                            <div className="result-header gradient-rose-pink">
                                <FileHeart className="w-6 h-6 text-white" />
                                <h3 className="text-white font-bold text-lg">Analysis Report</h3>
                            </div>
                            <div className="result-body">
                                <MarkdownRenderer content={analysisResult} />
                            </div>
                        </div>
                    ) : (
                        <div className="empty-result">
                            <div className="empty-result-icon gradient-rose-pink">
                                <FileHeart className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mt-4">Upload a Lab Report</h3>
                            <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
                                Upload a blood test, sugar test, thyroid, or any lab report to get AI-powered analysis with health insights.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
