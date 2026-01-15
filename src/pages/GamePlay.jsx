import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../data/supabaseClient'
import './GamePlay.css'

// Game Rooms with hidden items
const GAME_ROOMS = {
    bedroom: {
        name: 'Bedroom',
        background: '🛏️',
        items: [
            { id: 1, word: 'Bed', translation: 'Giường', emoji: '🛏️', position: { top: '40%', left: '50%' } },
            { id: 2, word: 'Lamp', translation: 'Đèn', emoji: '💡', position: { top: '25%', left: '20%' } },
            { id: 3, word: 'Pillow', translation: 'Gối', emoji: '🛋️', position: { top: '35%', left: '65%' } },
            { id: 4, word: 'Clock', translation: 'Đồng hồ', emoji: '⏰', position: { top: '15%', left: '80%' } },
            { id: 5, word: 'Book', translation: 'Sách', emoji: '📕', position: { top: '60%', left: '30%' } },
        ]
    },
    kitchen: {
        name: 'Kitchen',
        background: '🍳',
        items: [
            { id: 1, word: 'Cup', translation: 'Cốc', emoji: '☕', position: { top: '30%', left: '25%' } },
            { id: 2, word: 'Plate', translation: 'Đĩa', emoji: '🍽️', position: { top: '50%', left: '50%' } },
            { id: 3, word: 'Spoon', translation: 'Thìa', emoji: '🥄', position: { top: '45%', left: '70%' } },
            { id: 4, word: 'Apple', translation: 'Táo', emoji: '🍎', position: { top: '35%', left: '40%' } },
            { id: 5, word: 'Banana', translation: 'Chuối', emoji: '🍌', position: { top: '55%', left: '20%' } },
        ]
    },
    livingroom: {
        name: 'Living Room',
        background: '🛋️',
        items: [
            { id: 1, word: 'Sofa', translation: 'Ghế sofa', emoji: '🛋️', position: { top: '50%', left: '45%' } },
            { id: 2, word: 'TV', translation: 'Ti vi', emoji: '📺', position: { top: '20%', left: '50%' } },
            { id: 3, word: 'Plant', translation: 'Cây', emoji: '🌱', position: { top: '40%', left: '15%' } },
            { id: 4, word: 'Window', translation: 'Cửa sổ', emoji: '🪟', position: { top: '15%', left: '80%' } },
            { id: 5, word: 'Carpet', translation: 'Thảm', emoji: '🧶', position: { top: '70%', left: '50%' } },
        ]
    }
}

const VOCABULARY_MATCHING = [
    { word: 'Tiger', image: '🐯', translation: 'Con hổ' },
    { word: 'Lion', image: '🦁', translation: 'Sư tử' },
    { word: 'Elephant', image: '🐘', translation: 'Con voi' },
    { word: 'Monkey', image: '🐵', translation: 'Con khỉ' },
    { word: 'Giraffe', image: '🦒', translation: 'Hươu cao cổ' },
    { word: 'Zebra', image: '🦓', translation: 'Ngựa vằn' },
    { word: 'Bear', image: '🐻', translation: 'Con gấu' },
    { word: 'Rabbit', image: '🐰', translation: 'Con thỏ' },
]

export default function GamePlay() {
    const { gameId } = useParams()
    const navigate = useNavigate()
    const [game, setGame] = useState(null)
    const [student, setStudent] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [gameState, setGameState] = useState('intro') // intro, playing, review, result
    const [gameType, setGameType] = useState('hide_and_seek') // hide_and_seek, word_match, listen_click

    // Hide and Seek state
    const [currentRoom, setCurrentRoom] = useState(null)
    const [foundItems, setFoundItems] = useState([])
    const [targetItem, setTargetItem] = useState(null)
    const [showHint, setShowHint] = useState(false)

    // General game state
    const [score, setScore] = useState(0)
    const [stars, setStars] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)
    const [feedback, setFeedback] = useState(null)

    // Word Match state
    const [vocabulary, setVocabulary] = useState([])
    const [currentRound, setCurrentRound] = useState(0)
    const [totalRounds] = useState(5)
    const [options, setOptions] = useState([])

    useEffect(() => {
        const studentData = localStorage.getItem('current_student')
        if (studentData) setStudent(JSON.parse(studentData))
        loadGame()
    }, [gameId])

    const loadGame = async () => {
        try {
            const { data } = await supabase
                .from('mini_games')
                .select('*')
                .eq('id', gameId)
                .single()

            if (data) {
                setGame(data)
                setGameType(data.game_type || 'hide_and_seek')
            } else {
                // Fallback
                setGame({ id: gameId, name: 'Hide and Seek', game_type: 'hide_and_seek' })
                setGameType('hide_and_seek')
            }
            setIsLoading(false)
        } catch (error) {
            setGame({ id: gameId, name: 'Mini Game', game_type: 'hide_and_seek' })
            setIsLoading(false)
        }
    }

    // Timer
    useEffect(() => {
        if (gameState !== 'playing') return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    endGame()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [gameState])

    const startGame = () => {
        if (gameType === 'hide_and_seek') {
            const rooms = Object.keys(GAME_ROOMS)
            const randomRoom = rooms[Math.floor(Math.random() * rooms.length)]
            setCurrentRoom(GAME_ROOMS[randomRoom])
            setFoundItems([])
            setTargetItem(GAME_ROOMS[randomRoom].items[0])
        } else {
            setVocabulary([...VOCABULARY_MATCHING].sort(() => Math.random() - 0.5))
            setCurrentRound(0)
            setupWordMatchRound(0)
        }
        setGameState('playing')
        setScore(0)
        setTimeLeft(60)
    }

    const setupWordMatchRound = (round) => {
        const vocab = [...VOCABULARY_MATCHING].sort(() => Math.random() - 0.5)
        const target = vocab[round % vocab.length]
        setTargetItem(target)
        setOptions(vocab.slice(0, 4).sort(() => Math.random() - 0.5))
    }

    // Hide and Seek: Click on hidden item
    const handleItemClick = (item) => {
        if (foundItems.includes(item.id)) return

        if (item.id === targetItem?.id) {
            // Correct!
            setFoundItems([...foundItems, item.id])
            setScore(prev => prev + 100)
            setFeedback({ type: 'correct', message: `Found ${item.word}! 🎉` })

            setTimeout(() => {
                setFeedback(null)
                const remaining = currentRoom.items.filter(i => !foundItems.includes(i.id) && i.id !== item.id)
                if (remaining.length > 0) {
                    setTargetItem(remaining[0])
                } else {
                    // All found!
                    setGameState('review')
                }
            }, 1000)
        } else {
            setFeedback({ type: 'wrong', message: 'Try again! 💪' })
            setTimeout(() => setFeedback(null), 800)
        }
    }

    // Word Match: Select answer
    const handleWordMatchAnswer = (selected) => {
        if (feedback) return

        const isCorrect = selected.word === targetItem?.word

        if (isCorrect) {
            setScore(prev => prev + 100 + timeLeft)
            setFeedback({ type: 'correct', message: 'Great! 🎉' })
        } else {
            setFeedback({ type: 'wrong', message: 'Try again! 💪' })
        }

        setTimeout(() => {
            setFeedback(null)
            const nextRound = currentRound + 1
            setCurrentRound(nextRound)
            if (nextRound < totalRounds) {
                setupWordMatchRound(nextRound)
            } else {
                endGame()
            }
        }, 1000)
    }

    const endGame = () => {
        const maxScore = gameType === 'hide_and_seek' ? 500 : totalRounds * 150
        const percentage = score / maxScore
        const earnedStars = percentage >= 0.8 ? 3 : percentage >= 0.5 ? 2 : percentage > 0 ? 1 : 0
        setStars(earnedStars)
        setGameState('result')
        saveScore(earnedStars)
    }

    const saveScore = async (earnedStars) => {
        if (!student?.id) return
        try {
            await supabase.from('scores').insert({
                student_id: student.id,
                game_id: gameId,
                score,
                stars_earned: earnedStars,
                time_spent_seconds: 60 - timeLeft,
            })
        } catch (error) {
            console.error('Error saving score:', error)
        }
    }

    const playAgain = () => {
        startGame()
    }

    if (isLoading) {
        return <div className="loading"><div className="spinner"></div></div>
    }

    return (
        <div className="game-play-page">
            {/* Header */}
            <header className="game-header">
                <button className="back-btn" onClick={() => navigate('/student/games')}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="game-title">
                    <h1>{game?.name || 'Hide & Seek'}</h1>
                    {gameState === 'playing' && <p>MY HOUSE THEME</p>}
                </div>
                {gameState === 'playing' && (
                    <div className={`timer-badge ${timeLeft <= 10 ? 'warning' : ''}`}>
                        <span className="timer-icon">⏱</span>
                        <span className="timer-value">{timeLeft.toString().padStart(2, '0')}</span>
                    </div>
                )}
                {gameState !== 'playing' && (
                    <div className="game-score">
                        <span className="score-value">{score}</span>
                        <span className="score-label">pts</span>
                    </div>
                )}
            </header>

            <div className="game-content">
                {/* INTRO SCREEN */}
                {gameState === 'intro' && (
                    <div className="intro-screen">
                        <div className="intro-mascot">
                            <div className="mascot-circle">
                                {gameType === 'hide_and_seek' ? '🔍' : gameType === 'word_match' ? '🎯' : '🔊'}
                            </div>
                        </div>
                        <h2>Find 5 hidden items!</h2>
                        <p className="intro-description">
                            Listen to the names and tap them! Use your magnifying glass to spot the clues.
                        </p>

                        <div className="intro-stats">
                            <div className="stat-box">
                                <span className="stat-icon">⭐</span>
                                <div>
                                    <span className="stat-value">1,240</span>
                                    <span className="stat-label">BEST SCORE</span>
                                </div>
                            </div>
                            <div className="stat-box">
                                <span className="stat-icon">⚡</span>
                                <div>
                                    <span className="stat-value">5 Days</span>
                                    <span className="stat-label">STREAK</span>
                                </div>
                            </div>
                        </div>

                        <div className="locked-rooms">
                            <div className="room-badge unlocked">🏠</div>
                            <div className="room-badge locked">🔒</div>
                            <div className="room-badge locked">🔒</div>
                            <div className="room-badge locked">🔒</div>
                            <div className="room-badge locked">🔒</div>
                            <span className="room-count">0/5</span>
                        </div>

                        <button className="start-button" onClick={startGame}>
                            🔍 GO EXPLORE!
                        </button>
                    </div>
                )}

                {/* HIDE AND SEEK GAMEPLAY */}
                {gameState === 'playing' && gameType === 'hide_and_seek' && currentRoom && (
                    <div className="hide-seek-screen">
                        {/* Items to find */}
                        <div className="items-header">
                            <span>Find the hidden items:</span>
                            <span className="found-count">{foundItems.length}/{currentRoom.items.length} FOUND</span>
                        </div>
                        <div className="items-list">
                            {currentRoom.items.map(item => (
                                <button
                                    key={item.id}
                                    className={`item-chip ${foundItems.includes(item.id) ? 'found' : ''} ${targetItem?.id === item.id ? 'target' : ''}`}
                                >
                                    {foundItems.includes(item.id) ? '✓' : '○'} {item.word}
                                </button>
                            ))}
                        </div>

                        {/* Current target with translation */}
                        {targetItem && (
                            <div className="target-banner">
                                <span className="target-icon">🔊</span>
                                <span>{targetItem.word}: {targetItem.translation}</span>
                            </div>
                        )}

                        {/* Room scene */}
                        <div className="room-scene">
                            <div className="room-background">
                                {currentRoom.items.map(item => (
                                    <button
                                        key={item.id}
                                        className={`hidden-item ${foundItems.includes(item.id) ? 'found' : ''}`}
                                        style={{ top: item.position.top, left: item.position.left }}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <span className="item-emoji">{item.emoji}</span>
                                        {foundItems.includes(item.id) && (
                                            <span className="item-label">{item.word}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tip */}
                        <div className="tip-bar">
                            <span>TIP: {showHint ? `Look for the ${targetItem?.word}!` : 'Tap items to find them!'}</span>
                            <button className="hint-btn" onClick={() => setShowHint(!showHint)}>
                                🔍
                            </button>
                        </div>

                        {/* Score */}
                        <div className="bottom-score">
                            <span className="coin-icon">⭐</span>
                            <span>{score}</span>
                        </div>
                    </div>
                )}

                {/* WORD MATCH GAMEPLAY */}
                {gameState === 'playing' && gameType === 'word_match' && (
                    <div className="word-match-screen">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}></div>
                        </div>
                        <span className="progress-text">Round {currentRound + 1} of {totalRounds}</span>

                        <div className="question-section">
                            <h2>Find the: <strong>{targetItem?.word}</strong></h2>
                            <button className="sound-btn">🔊 Hear it</button>
                        </div>

                        <div className="options-grid">
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option-card ${feedback && option.word === targetItem.word ? 'correct' : ''}`}
                                    onClick={() => handleWordMatchAnswer(option)}
                                    disabled={!!feedback}
                                >
                                    <span className="option-image">{option.image}</span>
                                    <span className="option-word">{option.word}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* VOCABULARY REVIEW */}
                {gameState === 'review' && (
                    <div className="review-screen">
                        <h2>Vocabulary Review</h2>
                        <div className="review-header">
                            <span className="mission-badge">MISSION COMPLETE</span>
                            <span>{foundItems.length}/{currentRoom?.items.length || 5} Found</span>
                        </div>
                        <p className="review-subtitle">
                            Great job! You found all the hidden items in the {currentRoom?.name || 'Room'}.
                            Now, let's practice speaking them out loud.
                        </p>

                        <div className="vocabulary-list">
                            {(currentRoom?.items || []).map(item => (
                                <div key={item.id} className="vocab-card">
                                    <span className="vocab-emoji">{item.emoji}</span>
                                    <div className="vocab-info">
                                        <span className="vocab-word">{item.word}</span>
                                        <span className="vocab-pronunciation">/{item.word.toLowerCase()}/</span>
                                    </div>
                                    <div className="vocab-actions">
                                        <button className="listen-btn">🔊 Listen</button>
                                        <button className="hint-btn">💡 {item.translation}</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="finish-btn" onClick={endGame}>
                            Finish Review ✨
                        </button>
                    </div>
                )}

                {/* RESULT SCREEN */}
                {gameState === 'result' && (
                    <div className="result-screen">
                        <div className="result-mascot">
                            <div className="mascot-image">
                                {stars >= 2 ? '🎉' : '🤖'}
                            </div>
                        </div>

                        <h2 className="result-title">
                            {stars >= 3 ? 'Super Finder!' : stars >= 2 ? 'Great Job!' : timeLeft > 0 ? 'Good Try!' : "Time's Up!"}
                        </h2>
                        <p className="result-subtitle">
                            {stars >= 2 ? 'You found all the hidden items!' : "Don't worry, you can try again!"}
                        </p>

                        <div className="result-stats">
                            <div className="result-stat">
                                <span className="stat-icon">⏱</span>
                                <div>
                                    <span className="stat-label">TOTAL TIME</span>
                                    <span className="stat-value">{Math.floor((60 - timeLeft) / 60)}:{((60 - timeLeft) % 60).toString().padStart(2, '0')}</span>
                                </div>
                            </div>
                            <div className="result-stat">
                                <span className="stat-icon">⭐</span>
                                <div>
                                    <span className="stat-label">SCORE</span>
                                    <span className="stat-value highlight">{score} XP</span>
                                </div>
                            </div>
                        </div>

                        {stars >= 2 && (
                            <div className="sticker-unlock">
                                <span className="sticker-badge">NEW STICKER UNLOCKED</span>
                                <div className="sticker-card">
                                    <span className="sticker-icon">🗝️</span>
                                    <div>
                                        <span className="sticker-name">Golden Key</span>
                                        <span className="sticker-desc">Added to your collection</span>
                                    </div>
                                    <span className="sticker-check">✓</span>
                                </div>
                            </div>
                        )}

                        <div className="stars-display">
                            {[1, 2, 3].map(i => (
                                <span key={i} className={`star ${i <= stars ? 'earned' : 'empty'}`}>⭐</span>
                            ))}
                        </div>

                        <div className="result-actions">
                            <button className="next-room-btn" onClick={playAgain}>
                                Next Room →
                            </button>
                            <button className="play-again-btn" onClick={playAgain}>
                                🔄 Play Again
                            </button>
                            <Link to="/student/games" className="go-back-btn">
                                GO BACK
                            </Link>
                        </div>
                    </div>
                )}

                {/* Feedback Popup */}
                {feedback && (
                    <div className={`feedback-popup ${feedback.type}`}>
                        {feedback.message}
                    </div>
                )}
            </div>
        </div>
    )
}
