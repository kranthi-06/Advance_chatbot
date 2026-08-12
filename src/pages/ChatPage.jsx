import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Plus, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';
import { GroqService } from '../services/groqService.js';
import { SpeechManager } from '../utils/speechUtils.js';
import { DOMAINS } from '../constants/domains.js';
import { LANGUAGES } from '../constants/languages.js';

const groqService = new GroqService();

export default function ChatPage({ language = 'en', domain = 'agriculture' }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const speechManager = useRef(null);

    const currentDomainInfo = DOMAINS.find(d => d.id === domain);
    const currentLangInfo = LANGUAGES.find(l => l.code === language);

    useEffect(() => {
        speechManager.current = new SpeechManager();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            setSelectedImage(ev.target.result);
            setImagePreview(URL.createObjectURL(file));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = async (content, isVoice = false) => {
        if ((!content.trim() && !selectedImage) || isLoading) return;

        const userMsg = {
            id: Date.now().toString(),
            content: content.trim() || 'Analyze this image',
            sender: 'user',
            timestamp: new Date(),
            image: imagePreview,
            isVoice,
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        const currentImage = selectedImage;
        const currentInput = content.trim() || 'Please analyze this image in detail.';
        setInputValue('');
        removeImage();

        try {
            const response = await groqService.generateResponse(currentInput, domain, language, currentImage);

            const assistantMsg = {
                id: (Date.now() + 1).toString(),
                content: response,
                sender: 'assistant',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMsg]);

            // If voice input was used, auto-speak the response
            if (isVoice && speechManager.current) {
                try {
                    setIsSpeaking(true);
                    await speechManager.current.speak(response, language);
                } catch (err) {
                    console.error('Speech synthesis error:', err);
                } finally {
                    setIsSpeaking(false);
                }
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                content: error.message || 'Sorry, an error occurred.',
                sender: 'assistant',
                timestamp: new Date(),
                isError: true,
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSendMessage(inputValue);
    };

    // Voice Input
    const handleVoiceInput = async () => {
        if (!speechManager.current || !speechManager.current.isSupported()) {
            alert('Voice input is not supported in your browser.');
            return;
        }

        try {
            setIsListening(true);
            const transcript = await speechManager.current.startListening(language);
            setIsListening(false);

            if (transcript.trim()) {
                // Show transcript in input briefly, then send
                setInputValue(transcript);
                await handleSendMessage(transcript, true);
            }
        } catch (error) {
            console.error('Voice input error:', error);
            setIsListening(false);
        }
    };

    const handleStopListening = () => {
        if (speechManager.current) {
            speechManager.current.stopListening();
            setIsListening(false);
        }
    };

    const handleStopSpeaking = () => {
        if (speechManager.current) {
            speechManager.current.stopSpeaking();
            setIsSpeaking(false);
        }
    };

    // Speak any AI message on click
    const handleSpeakMessage = async (text) => {
        if (!speechManager.current) return;
        if (isSpeaking) {
            handleStopSpeaking();
            return;
        }
        try {
            setIsSpeaking(true);
            await speechManager.current.speak(text, language);
        } catch (err) {
            console.error('TTS error:', err);
        } finally {
            setIsSpeaking(false);
        }
    };

    const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-icon gradient-blue-purple">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="page-title">AI Chatbot</h1>
                    <p className="page-subtitle">
                        {currentDomainInfo?.name} • {currentLangInfo?.nativeName} • Voice enabled
                    </p>
                </div>
            </div>

            {/* Chat Container */}
            <div className="chat-container">
                {/* Chat Header */}
                <div className="chat-header">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                {currentDomainInfo?.name} Assistant <Sparkles className="w-4 h-4 animate-pulse" />
                            </h3>
                            <p className="text-white/70 text-xs flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Online • {currentLangInfo?.nativeName} • Powered by Groq AI
                            </p>
                        </div>
                    </div>
                    {/* Speak Toggle in header */}
                    {isSpeaking && (
                        <button onClick={handleStopSpeaking} className="voice-header-btn" id="stop-speaking-btn" title="Stop speaking">
                            <VolumeX className="w-5 h-5 text-white" />
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div className="chat-messages" id="chat-messages-area">
                    {messages.length === 0 && (
                        <div className="empty-chat">
                            <div className="empty-chat-icon">
                                <Bot className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mt-4">How can I help you today?</h3>
                            <p className="text-gray-500 text-sm mt-2 max-w-md">
                                Ask about {currentDomainInfo?.name.toLowerCase()}, upload an image with ➕, or tap 🎤 to speak in {currentLangInfo?.nativeName}.
                            </p>
                            <div className="quick-actions">
                                {domain === 'agriculture' && ['Crop rotation techniques', 'Soil health tips', 'Organic farming'].map((q, i) => (
                                    <button key={i} onClick={() => setInputValue(q)} className="quick-action-btn" id={`quick-action-${i}`}>{q}</button>
                                ))}
                                {domain === 'engineering' && ['Explain thermodynamics', 'Steel vs aluminum', 'Circuit design basics'].map((q, i) => (
                                    <button key={i} onClick={() => setInputValue(q)} className="quick-action-btn" id={`quick-action-${i}`}>{q}</button>
                                ))}
                                {domain === 'medicine' && ['Common cold remedies', 'Blood pressure info', 'Healthy diet plan'].map((q, i) => (
                                    <button key={i} onClick={() => setInputValue(q)} className="quick-action-btn" id={`quick-action-${i}`}>{q}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`msg-row ${msg.sender === 'user' ? 'msg-row-user' : 'msg-row-ai'}`}>
                            {msg.sender === 'assistant' && (
                                <div className="msg-avatar gradient-blue-purple">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div className={`msg-bubble ${msg.sender === 'user' ? 'msg-bubble-user' :
                                    msg.isError ? 'msg-bubble-error' : 'msg-bubble-ai'
                                }`}>
                                {msg.image && (
                                    <img src={msg.image} alt="Uploaded" className="msg-image" />
                                )}
                                {msg.sender === 'assistant' ? (
                                    <MarkdownRenderer content={msg.content} />
                                ) : (
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                )}
                                <div className="msg-footer">
                                    {msg.isVoice && (
                                        <span className="voice-badge">
                                            <Mic className="w-3 h-3" /> Voice
                                        </span>
                                    )}
                                    <p className="msg-time">{formatTime(msg.timestamp)}</p>
                                    {/* Speak button for AI messages */}
                                    {msg.sender === 'assistant' && !msg.isError && (
                                        <button
                                            onClick={() => handleSpeakMessage(msg.content)}
                                            className="speak-msg-btn"
                                            title="Listen to this response"
                                            id={`speak-msg-${msg.id}`}
                                        >
                                            <Volume2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {msg.sender === 'user' && (
                                <div className="msg-avatar gradient-purple-pink">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="msg-row msg-row-ai">
                            <div className="msg-avatar gradient-blue-purple">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="msg-bubble msg-bubble-ai">
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                    <span className="text-sm font-medium text-gray-600">Thinking...</span>
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Listening Overlay */}
                {isListening && (
                    <div className="listening-overlay" id="listening-overlay">
                        <div className="listening-circle">
                            <Mic className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm font-bold text-blue-400 mt-3">Listening in {currentLangInfo?.nativeName}...</p>
                        <p className="text-xs text-gray-500 mt-1">Speak now</p>
                        <button onClick={handleStopListening} className="stop-listening-btn" id="stop-listening-btn">
                            Stop
                        </button>
                    </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                    <div className="image-preview-bar">
                        <div className="image-preview-thumb">
                            <img src={imagePreview} alt="Preview" />
                            <button onClick={removeImage} className="image-remove-btn" id="remove-image-btn">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Image attached</span>
                    </div>
                )}

                {/* Input */}
                <div className="chat-input-area">
                    <form onSubmit={handleSubmit} className="chat-form">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                            id="chat-image-upload"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="plus-btn"
                            title="Upload image for analysis"
                            id="upload-image-btn"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={`Ask about ${currentDomainInfo?.name.toLowerCase()} in ${currentLangInfo?.nativeName}...`}
                            className="chat-input"
                            disabled={isLoading}
                            id="chat-input-field"
                        />
                        {/* Voice Input Button */}
                        <button
                            type="button"
                            onClick={isListening ? handleStopListening : handleVoiceInput}
                            className={`voice-btn ${isListening ? 'voice-btn-active' : ''}`}
                            title={isListening ? 'Stop listening' : `Speak in ${currentLangInfo?.nativeName}`}
                            disabled={isLoading}
                            id="voice-input-btn"
                        >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        <button
                            type="submit"
                            disabled={(!inputValue.trim() && !selectedImage) || isLoading}
                            className="send-btn"
                            id="send-message-btn"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
