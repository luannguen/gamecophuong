import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './WordMatch.css'

// Vocabulary pairs
const VOCABULARY_PAIRS = [
    { english: 'Cat', vietnamese: 'Con mèo', emoji: '🐱' },
    { english: 'Dog', vietnamese: 'Con chó', emoji: '🐕' },
    { english: 'Bird', vietnamese: 'Con chim', emoji: '🐦' },
    { english: 'Fish', vietnamese: 'Con cá', emoji: '🐟' },
    { english: 'Cow', vietnamese: 'Con bò', emoji: '🐄' },
    { english: 'Pig', vietnamese: 'Con heo', emoji: '🐷' },
    { english: 'Horse', vietnamese: 'Con ngựa', emoji: '🐴' },
    { english: 'Sheep', vietnamese: 'Con cừu', emoji: '🐑' },
    { english: 'Duck', vietnamese: 'Con vịt', emoji: '🦆' },
    { english: 'Chicken', vietnamese: 'Con gà', emoji: '🐔' },
]

export default function WordMatchGame() {
    const navigate = useNavigate()
    const [gameState, setGameState] = useState('intro') // intro, playing, result
    const [currentRound, setCurrentRound] = useState(0)
    const [totalRounds] = useState(5)
    const [score, setScore] = useState(0)
    const [stars, setStars] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)

    // Match game state
    const [leftCards, setLeftCards] = useState([])
    const [rightCards, setRightCards] = useState([])
    const [selectedLeft, setSelectedLeft] = useState(null)
    const [selectedRight, setSelectedRight] = useState(null)
    const [matchedPairs, setMatchedPairs] = useState([])
    const [feedback, setFeedback] = useState(null)

    // Timer
    useEffect(() => {
        if (gameState !== 'playing') return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [gameState])

    const startGame = () => {
        setGameState('playing')
        setCurrentRound(0)
        setScore(0)
        setTimeLeft(60)
        setMatchedPairs([])
        setupRound()
    }

    const setupRound = () => {
        // Pick 4 random pairs
        const shuffled = [...VOCABULARY_PAIRS].sort(() => Math.random() - 0.5)
        const roundPairs = shuffled.slice(0, 4)

        // Create shuffled cards
        setLeftCards(roundPairs.map((p, i) => ({
            id: i,
            text: p.english,
            emoji: p.emoji,
            pairId: i
        })).sort(() => Math.random() - 0.5))

        setRightCards(roundPairs.map((p, i) => ({
            id: i,
            text: p.vietnamese,
            pairId: i
        })).sort(() => Math.random() - 0.5))

        setSelectedLeft(null)
        setSelectedRight(null)
        setMatchedPairs([])
    }

    const handleLeftClick = (card) => {
        if (matchedPairs.includes(card.pairId)) return
        setSelectedLeft(card)

        if (selectedRight) {
            checkMatch(card, selectedRight)
        }
    }

    const handleRightClick = (card) => {
        if (matchedPairs.includes(card.pairId)) return
        setSelectedRight(card)

        if (selectedLeft) {
            checkMatch(selectedLeft, card)
        }
    }

    const checkMatch = (left, right) => {
        if (left.pairId === right.pairId) {
            // Match!
            setMatchedPairs([...matchedPairs, left.pairId])
            setScore(prev => prev + 50)
            setFeedback({ type: 'correct', message: 'Match! ✨' })

            setTimeout(() => {
                setFeedback(null)
                setSelectedLeft(null)
                setSelectedRight(null)

                // Check if all matched
                if (matchedPairs.length + 1 >= 4) {
                    // Next round or end
                    const nextRound = currentRound + 1
                    setCurrentRound(nextRound)
                    if (nextRound < totalRounds) {
                        setupRound()
                    } else {
                        endGame()
                    }
                }
            }, 800)
        } else {
            // No match
            setFeedback({ type: 'wrong', message: 'Try again!' })

            setTimeout(() => {
                setFeedback(null)
                setSelectedLeft(null)
                setSelectedRight(null)
            }, 600)
        }
    }

    const endGame = () => {
        const maxScore = totalRounds * 4 * 50 // 4 pairs per round
        const percentage = score / maxScore
        const earnedStars = percentage >= 0.9 ? 3 : percentage >= 0.6 ? 2 : percentage > 0 ? 1 : 0
        setStars(earnedStars)
        setGameState('result')
    }

    return (
        <div className="word-match-page">
            {/* Header */}
            <header className="game-header">
                <button className="back-btn" onClick={() => navigate('/student/games')}>←</button>
                <div className="game-title">
                    <h1>Word Match</h1>
                    <p>ANIMALS THEME</p>
                </div>
                {gameState === 'playing' && (
                    <div className={`timer-badge ${timeLeft <= 10 ? 'warning' : ''}`}>
                        ⏱ {timeLeft}s
                    </div>
                )}
                {gameState !== 'playing' && (
                    <div className="score-badge">⭐ {score}</div>
                )}
            </header>

            <div className="game-content">
                {/* INTRO */}
                {gameState === 'intro' && (
                    <div className="intro-section">
                        <div className="intro-icon">🎯</div>
                        <h2>Match the Words!</h2>
                        <p>Connect English words with Vietnamese translations. Tap pairs to match them!</p>

                        <div className="example-match">
                            <div className="example-card left">Cat 🐱</div>
                            <div className="match-line"></div>
                            <div className="example-card right">Con mèo</div>
                        </div>

                        <button className="start-btn" onClick={startGame}>
                            🎯 Start Matching
                        </button>
                    </div>
                )}

                {/* PLAYING */}
                {gameState === 'playing' && (
                    <div className="playing-section">
                        {/* Progress */}
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}></div>
                        </div>
                        <div className="round-info">
                            <span>Round {currentRound + 1} of {totalRounds}</span>
                            <span className="matches-count">{matchedPairs.length}/4 matched</span>
                        </div>

                        {/* Match Area */}
                        <div className="match-area">
                            {/* Left Column - English */}
                            <div className="match-column">
                                <h3>English</h3>
                                {leftCards.map(card => (
                                    <button
                                        key={card.id}
                                        className={`match-card ${selectedLeft?.id === card.id ? 'selected' : ''} ${matchedPairs.includes(card.pairId) ? 'matched' : ''}`}
                                        onClick={() => handleLeftClick(card)}
                                        disabled={matchedPairs.includes(card.pairId)}
                                    >
                                        <span className="card-emoji">{card.emoji}</span>
                                        <span className="card-text">{card.text}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Right Column - Vietnamese */}
                            <div className="match-column">
                                <h3>Tiếng Việt</h3>
                                {rightCards.map(card => (
                                    <button
                                        key={card.id}
                                        className={`match-card ${selectedRight?.id === card.id ? 'selected' : ''} ${matchedPairs.includes(card.pairId) ? 'matched' : ''}`}
                                        onClick={() => handleRightClick(card)}
                                        disabled={matchedPairs.includes(card.pairId)}
                                    >
                                        <span className="card-text">{card.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Score */}
                        <div className="bottom-score">
                            ⭐ {score} pts
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
                            {stars >= 3 ? 'Perfect Match!' : stars >= 2 ? 'Great Job!' : 'Keep Trying!'}
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
                                <span className="stat-value">{currentRound * 4}</span>
                                <span className="stat-label">Pairs Matched</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{60 - timeLeft}s</span>
                                <span className="stat-label">Time Used</span>
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
