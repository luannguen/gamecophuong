import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../../../data/supabaseClient'
import './Play.css'

// Game Components
import HideAndSeekGame from '../components/HideAndSeekGame';
import WordMatchGame from '../components/WordMatchGame';
import SentenceBuilderGame from '../components/SentenceBuilderGame';

export default function GamePlay() {
    const { gameId } = useParams()
    const navigate = useNavigate()
    const [game, setGame] = useState(null)
    const [student, setStudent] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [gameState, setGameState] = useState('playing') // intro (handled by modal), playing, result

    // Global Score State
    const [score, setScore] = useState(0)
    const [stars, setStars] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)

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
            } else {
                // Fallback for tests/mocks
                setGame({ id: gameId, name: 'Mini Game', game_type: 'hide_seek' })
            }
            setIsLoading(false)
        } catch (error) {
            console.error(error);
            setGame({ id: gameId, name: 'Mini Game', game_type: 'hide_seek' })
            setIsLoading(false)
        }
    }

    // Timer Logic
    useEffect(() => {
        if (gameState !== 'playing') return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleGameEnd() // Force end if time runs out
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [gameState])

    const handleScoreUpdate = (points) => {
        setScore(prev => prev + points)
        // Bonus time logic could go here
    }

    const handleGameEnd = () => {
        // Calculate stars
        const percentage = score / 500
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
        setScore(0)
        setTimeLeft(60)
        setGameState('playing')
        // Force re-mount of game component if needed (key change)
    }

    // DISPATCHER
    const renderGameComponent = () => {
        if (!game) return null;

        // Check subtype first, then fallback to type
        const type = game.subtype || game.game_type || game.type;

        switch (type) {
            case 'hide_seek':
            case 'hide_and_seek':
            case 'vocabulary':
            case 'subtype_hide_seek':
                return <HideAndSeekGame onScoreUpdate={handleScoreUpdate} onEndGame={handleGameEnd} />;

            case 'listening_tap':
            case 'listening_word':
            case 'speaking':
            case 'matching':
            case 'word_match':
            case 'type_speaking':
            case 'listening':
                // Pass subtype as mode for variations if needed
                return <WordMatchGame mode={type} onScoreUpdate={handleScoreUpdate} onEndGame={handleGameEnd} />;

            case 'sentence':
            case 'writing':
                return <SentenceBuilderGame onScoreUpdate={handleScoreUpdate} onEndGame={handleGameEnd} />;

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-2">construction</span>
                        <p>Game Type: <strong>{type}</strong> is under development.</p>
                        <button onClick={handleGameEnd} className="mt-4 px-4 py-2 bg-slate-200 rounded-lg">Skip to Result (Debug)</button>
                    </div>
                );
        }
    }

    if (isLoading) {
        return <div className="loading"><div className="spinner"></div></div>
    }

    return (
        <div className="game-play-page">
            {/* Header */}
            <header className="game-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="game-title">
                    <h1>{game?.name || game?.title || 'Game'}</h1>
                    {gameState === 'playing' && <p>{game?.subtitle || 'Let\'s Play!'}</p>}
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

            <div className="game-content relative">
                {gameState === 'playing' && renderGameComponent()}

                {/* RESULT SCREEN */}
                {gameState === 'result' && (
                    <div className="result-screen animate-in zoom-in duration-300">
                        <div className="result-mascot">
                            <div className="mascot-image bounce">
                                {stars >= 2 ? '🎉' : '🤖'}
                            </div>
                        </div>

                        <h2 className="result-title">
                            {stars >= 3 ? 'Super Star!' : stars >= 2 ? 'Great Job!' : 'Good Try!'}
                        </h2>
                        <p className="result-subtitle">
                            You earned {stars} star{stars !== 1 ? 's' : ''}!
                        </p>

                        <div className="stars-display my-6">
                            {[1, 2, 3].map(i => (
                                <span key={i} className={`star text-4xl mx-1 ${i <= stars ? 'earned grayscale-0' : 'empty grayscale opacity-30'}`}>⭐</span>
                            ))}
                        </div>

                        <div className="result-stats">
                            <div className="result-stat">
                                <span className="stat-icon">⏱</span>
                                <div>
                                    <span className="stat-label">TIME</span>
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

                        <div className="result-actions mt-8 space-y-3">
                            <button className="play-again-btn w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition" onClick={playAgain}>
                                🔄 Play Again
                            </button>
                            <button onClick={() => navigate(-1)} className="go-back-btn w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition">
                                Go Back
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
