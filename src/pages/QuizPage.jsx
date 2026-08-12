import React, { useState } from 'react';
import { BrainCircuit, Loader2, RotateCcw, Sparkles, CheckCircle2, XCircle, Trophy, ArrowRight, PlayCircle } from 'lucide-react';
import { GroqService } from '../services/groqService.js';

const groqService = new GroqService();

const QUESTION_COUNTS = [5, 10, 15, 30];

export default function QuizPage() {
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(10);
    const [questions, setQuestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    // Quiz state
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setQuestions([]);
        setQuizStarted(false);
        setCurrentQ(0);
        setSelectedAnswers({});
        setShowResult(false);

        try {
            const result = await groqService.generateQuiz(topic.trim(), numQuestions);
            if (!Array.isArray(result) || result.length === 0) {
                throw new Error('No questions generated. Please try again.');
            }
            setQuestions(result);
            setQuizStarted(true);
        } catch (err) {
            setError(err.message || 'Failed to generate quiz.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectAnswer = (qIndex, optionIndex) => {
        if (selectedAnswers[qIndex] !== undefined) return; // Already answered
        setSelectedAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
        setShowExplanation(true);
    };

    const handleNext = () => {
        setShowExplanation(false);
        if (currentQ < questions.length - 1) {
            setCurrentQ(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const getScore = () => {
        let correct = 0;
        questions.forEach((q, i) => {
            if (selectedAnswers[i] === q.correct) correct++;
        });
        return correct;
    };

    const getScorePercentage = () => Math.round((getScore() / questions.length) * 100);

    const getGrade = () => {
        const pct = getScorePercentage();
        if (pct >= 90) return { label: 'Excellent!', color: 'text-green-500', emoji: '🏆' };
        if (pct >= 70) return { label: 'Great Job!', color: 'text-blue-500', emoji: '🎉' };
        if (pct >= 50) return { label: 'Good Effort!', color: 'text-amber-500', emoji: '👍' };
        return { label: 'Keep Learning!', color: 'text-rose-500', emoji: '📚' };
    };

    const handleReset = () => {
        setTopic('');
        setQuestions([]);
        setQuizStarted(false);
        setCurrentQ(0);
        setSelectedAnswers({});
        setShowResult(false);
        setShowExplanation(false);
        setError(null);
    };

    const handleRetry = () => {
        setCurrentQ(0);
        setSelectedAnswers({});
        setShowResult(false);
        setShowExplanation(false);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-icon gradient-amber-orange">
                    <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="page-title">Quiz Generator</h1>
                    <p className="page-subtitle">AI-generated quizzes to test your knowledge</p>
                </div>
            </div>

            {/* Quiz Setup (shown when no quiz active) */}
            {!quizStarted && !showResult && (
                <div className="quiz-setup" id="quiz-setup">
                    <div className="panel-card quiz-card">
                        <div className="quiz-setup-header">
                            <BrainCircuit className="w-8 h-8 text-amber-500" />
                            <h2 className="text-xl font-bold text-gray-800">Create Your Quiz</h2>
                            <p className="text-sm text-gray-500">Enter a topic and number of questions</p>
                        </div>

                        <div className="quiz-form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="quiz-topic">Topic / Subject / Skill</label>
                                <input
                                    id="quiz-topic"
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Python Programming, World History, Biology..."
                                    className="form-input"
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Number of Questions</label>
                                <div className="question-count-grid">
                                    {QUESTION_COUNTS.map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => setNumQuestions(n)}
                                            className={`count-btn ${numQuestions === n ? 'count-btn-active' : ''}`}
                                            id={`count-btn-${n}`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="error-msg" id="quiz-error-message">
                                    <XCircle className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !topic.trim()}
                                className="analyze-btn gradient-amber-orange quiz-generate-btn"
                                id="generate-quiz-btn"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating {numQuestions} Questions...
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle className="w-5 h-5" />
                                        Generate Quiz
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Quick Topics */}
                        <div className="quick-topics">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Popular Topics</p>
                            <div className="quick-topics-grid">
                                {['JavaScript', 'Data Science', 'World History', 'Human Biology', 'Physics', 'Machine Learning', 'React.js', 'Cybersecurity'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTopic(t)}
                                        className="quick-topic-btn"
                                        id={`topic-${t.replace(/[^a-zA-Z]/g, '')}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Quiz */}
            {quizStarted && !showResult && questions.length > 0 && (
                <div className="quiz-active" id="quiz-active">
                    {/* Progress Bar */}
                    <div className="quiz-progress" id="quiz-progress">
                        <div className="quiz-progress-info">
                            <span className="text-sm font-bold text-gray-700">
                                Question {currentQ + 1} of {questions.length}
                            </span>
                            <span className="text-sm font-semibold text-amber-600">
                                {Object.keys(selectedAnswers).length} answered
                            </span>
                        </div>
                        <div className="quiz-progress-bar">
                            <div
                                className="quiz-progress-fill"
                                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="question-card" id="question-card">
                        <div className="question-number">Q{currentQ + 1}</div>
                        <h3 className="question-text">{questions[currentQ]?.question}</h3>

                        <div className="options-grid">
                            {questions[currentQ]?.options.map((opt, i) => {
                                const isSelected = selectedAnswers[currentQ] === i;
                                const isCorrect = questions[currentQ].correct === i;
                                const isAnswered = selectedAnswers[currentQ] !== undefined;

                                let optionClass = 'option-btn';
                                if (isAnswered) {
                                    if (isCorrect) optionClass += ' option-correct';
                                    else if (isSelected && !isCorrect) optionClass += ' option-wrong';
                                    else optionClass += ' option-disabled';
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleSelectAnswer(currentQ, i)}
                                        className={optionClass}
                                        disabled={isAnswered}
                                        id={`option-${currentQ}-${i}`}
                                    >
                                        <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                                        <span className="option-text">{opt.replace(/^[A-D]\)\s*/, '')}</span>
                                        {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />}
                                        {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        {showExplanation && selectedAnswers[currentQ] !== undefined && questions[currentQ]?.explanation && (
                            <div className="explanation-box" id="explanation-box">
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Explanation</p>
                                <p className="text-sm text-gray-700">{questions[currentQ].explanation}</p>
                            </div>
                        )}

                        {/* Navigation */}
                        {selectedAnswers[currentQ] !== undefined && (
                            <div className="quiz-nav">
                                <button onClick={handleNext} className="next-btn" id="next-question-btn">
                                    {currentQ < questions.length - 1 ? (
                                        <>Next Question <ArrowRight className="w-4 h-4" /></>
                                    ) : (
                                        <>View Results <Trophy className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Results Screen */}
            {showResult && (
                <div className="quiz-results" id="quiz-results">
                    <div className="results-card">
                        <div className="results-header">
                            <span className="results-emoji">{getGrade().emoji}</span>
                            <h2 className={`text-3xl font-black ${getGrade().color}`}>{getGrade().label}</h2>
                            <p className="text-gray-500 text-sm mt-1">Quiz on: {topic}</p>
                        </div>

                        <div className="score-display">
                            <div className="score-circle">
                                <svg className="score-svg" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                    <circle
                                        cx="50" cy="50" r="42" fill="none"
                                        stroke={getScorePercentage() >= 70 ? '#22c55e' : getScorePercentage() >= 50 ? '#f59e0b' : '#ef4444'}
                                        strokeWidth="8"
                                        strokeDasharray={`${getScorePercentage() * 2.64} 264`}
                                        strokeDashoffset="0"
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                        className="score-circle-fill"
                                    />
                                </svg>
                                <div className="score-text">
                                    <span className="text-3xl font-black">{getScorePercentage()}%</span>
                                </div>
                            </div>
                            <p className="text-lg font-bold text-gray-700 mt-3">
                                {getScore()} / {questions.length} correct
                            </p>
                        </div>

                        {/* Answer Summary */}
                        <div className="answer-summary">
                            <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Answer Summary</h4>
                            <div className="summary-grid">
                                {questions.map((q, i) => (
                                    <div
                                        key={i}
                                        className={`summary-item ${selectedAnswers[i] === q.correct ? 'summary-correct' : 'summary-wrong'
                                            }`}
                                        title={`Q${i + 1}: ${selectedAnswers[i] === q.correct ? 'Correct' : 'Wrong'}`}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="results-actions">
                            <button onClick={handleRetry} className="analyze-btn gradient-amber-orange" id="retry-quiz-btn">
                                <RotateCcw className="w-5 h-5" /> Retry Quiz
                            </button>
                            <button onClick={handleReset} className="reset-btn" id="new-quiz-btn">
                                <Sparkles className="w-4 h-4" /> New Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
