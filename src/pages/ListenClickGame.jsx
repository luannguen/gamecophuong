import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './ListenClickGame.css'

// Vocabulary with audio (using Web Speech API for now)
const VOCABULARY = [
    { word: 'Apple', translation: 'Quả táo', image: '🍎' },
    { word: 'Banana', translation: 'Quả chuối', image: '🍌' },
    { word: 'Orange', translation: 'Quả cam', image: '🍊' },
    { word: 'Grape', translation: 'Nho', image: '🍇' },
    { word: 'Strawberry', translation: 'Dâu tây', image: '🍓' },
    { word: 'Watermelon', translation: 'Dưa hấu', image: '🍉' },
    { word: 'Pineapple', translation: 'Dứa', image: '🍍' },
    { word: 'Cherry', translation: 'Anh đào', image: '🍒' },
    { word: 'Lemon', translation: 'Chanh', image: '🍋' },
    { word: 'Peach', translation: 'Đào', image: '🍑' },
]

export default function ListenClickGame() {
    const navigate = useNavigate()
    const [gameState, setGameState] = useState('intro') // intro, playing, result
    const [currentRound, setCurrentRound] = useState(0)
    const [totalRounds] = useState(8)
    const [score, setScore] = useState(0)
    const [stars, setStars] = useState(0)
    const [targetWord, setTargetWord] = useState(null)
    const [options, setOptions] = useState([])
    const [feedback, setFeedback] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [streak, setStreak] = useState(0)
    const synthRef = useRef(null)

    useEffect(() => {
        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis
        }
    }, [])

    const speak = (text) => {
        if (!synthRef.current) return

        // Cancel any ongoing speech
        synthRef.current.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        utterance.rate = 0.8 // Slow down for kids
        utterance.pitch = 1.1

        setIsPlaying(true)
        utterance.onend = () => setIsPlaying(false)

        synthRef.current.speak(utterance)
    }

    const startGame = () => {
        setGameState('playing')
        setCurrentRound(0)
        setScore(0)
        setStreak(0)
        setupRound(0)
    }

    const setupRound = (round) => {
        // Shuffle and pick 4 options
        const shuffled = [...VOCABULARY].sort(() => Math.random() - 0.5)
        const roundOptions = shuffled.slice(0, 4)
        const target = roundOptions[Math.floor(Math.random() * roundOptions.length)]

        setOptions(roundOptions)
        setTargetWord(target)
        setFeedback(null)

        // Auto-play the word after a short delay
        setTimeout(() => speak(target.word), 500)
    }

    const handleAnswer = (selected) => {
        if (feedback) return

        const isCorrect = selected.word === targetWord?.word

        if (isCorrect) {
            const streakBonus = streak >= 3 ? 50 : 0
            setScore(prev => prev + 100 + streakBonus)
            setStreak(prev => prev + 1)
            setFeedback({ type: 'correct', message: streak >= 3 ? 'COMBO! 🔥' : 'Correct! 🎉' })
        } else {
            setStreak(0)
            setFeedback({ type: 'wrong', message: 'Try again!' })
        }

        setTimeout(() => {
            const nextRound = currentRound + 1
            setCurrentRound(nextRound)

            if (nextRound < totalRounds) {
                setupRound(nextRound)
            } else {
                endGame()
            }
        }, 1200)
    }

    const endGame = () => {
        const maxScore = totalRounds * 100
        const percentage = score / maxScore
        const earnedStars = percentage >= 0.9 ? 3 : percentage >= 0.6 ? 2 : percentage > 0 ? 1 : 0
        setStars(earnedStars)
        setGameState('result')
    }

    const replayAudio = () => {
        if (targetWord) {
            speak(targetWord.word)
        }
    }

    return (
        <div className="listen-click-page">
            {/* Header */}
            <header className="game-header">
                <button className="back-btn" onClick={() => navigate('/student/games')}>←</button>
                <div className="game-title">
                    <h1>Listen & Click</h1>
                    <p>FRUITS THEME</p>
                </div>
                <div className="score-badge">⭐ {score}</div>
            </header>

            <div className="game-content">
                {/* INTRO */}
                {gameState === 'intro' && (
                    <div className="intro-section">
                        <div className="intro-icon">🔊</div>
                        <h2>Listen Carefully!</h2>
                        <p>Hear the word and tap the correct picture. Build combos for bonus points!</p>

                        <div className="how-to-play">
                            <div className="step">
                                <span className="step-num">1</span>
                                <span>Listen to the word 🔊</span>
                            </div>
                            <div className="step">
                                <span className="step-num">2</span>
                                <span>Tap the correct picture 👆</span>
                            </div>
                            <div className="step">
                                <span className="step-num">3</span>
                                <span>Get 3+ correct for combo! 🔥</span>
                            </div>
                        </div>

                        <button className="start-btn" onClick={startGame}>
                            🎯 Start Game
                        </button>
                    </div>
                )}

                {/* PLAYING */}
                {gameState === 'playing' && (
                    <div className="playing-section">
                        {/* Progress */}
                        <div className="progress-container">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
                                ></div>
                            </div>
                            <span className="progress-text">{currentRound + 1} / {totalRounds}</span>
                        </div>

                        {/* Streak indicator */}
                        {streak >= 2 && (
                            <div className="streak-badge">🔥 {streak} streak!</div>
                        )}

                        {/* Audio Button */}
                        <div className="audio-section">
                            <button
                                className={`audio-btn ${isPlaying ? 'playing' : ''}`}
                                onClick={replayAudio}
                                disabled={isPlaying}
                            >
                                <span className="audio-icon">🔊</span>
                                <span className="audio-waves">
                                    <span></span><span></span><span></span>
                                </span>
                            </button>
                            <p className="audio-hint">Tap to hear again</p>
                        </div>

                        {/* Options Grid */}
                        <div className="options-grid">
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option-card ${feedback && option.word === targetWord.word ? 'correct' : ''
                                        } ${feedback && feedback.type === 'wrong' && option.word !== targetWord.word ? 'dimmed' : ''
                                        }`}
                                    onClick={() => handleAnswer(option)}
                                    disabled={!!feedback}
                                >
                                    <span className="option-image">{option.image}</span>
                                    {feedback && option.word === targetWord.word && (
                                        <span className="option-label">{option.word}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Feedback */}
                        {feedback && (
                            <div className={`feedback-toast ${feedback.type}`}>
                                {feedback.message}
                            </div>
                        )}
                    </div>
                )}

                {/* RESULT */}
                {gameState === 'result' && (
                    <div className="result-section">
                        <div className="result-icon">
                            {stars >= 2 ? '🏆' : '💪'}
                        </div>

                        <h2 className="result-title">
                            {stars >= 3 ? 'Perfect Listener!' : stars >= 2 ? 'Great Ears!' : 'Keep Practicing!'}
                        </h2>

                        <div className="stars-container">
                            {[1, 2, 3].map(i => (
                                <span key={i} className={`star ${i <= stars ? 'earned' : ''}`}>⭐</span>
                            ))}
                        </div>

                        <div className="result-score">
                            <span className="score-number">{score}</span>
                            <span className="score-label">points</span>
                        </div>

                        <div className="result-stats">
                            <div className="stat">
                                <span className="stat-value">{currentRound}</span>
                                <span className="stat-label">Questions</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{Math.round((score / (totalRounds * 100)) * 100)}%</span>
                                <span className="stat-label">Accuracy</span>
                            </div>
                        </div>

                        <div className="result-actions">
                            <button className="play-again-btn" onClick={startGame}>
                                🔄 Play Again
                            </button>
                            <Link to="/student/games" className="back-btn-link">
                                ← Back to Games
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
