import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameRepository } from '../data/gameRepository';
import { calculateStars, getMaxScore } from '../domain/scoringEngine';
import { GameStates, createGameSession } from '../types/GameDTO';

/**
 * useGameSession - Hook for managing game state
 */
export function useGameSession(gameId) {
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(60);

    // Load game data
    useEffect(() => {
        const loadGame = async () => {
            const result = await gameRepository.getById(gameId);
            if (result.success) {
                setGame(result.data);
            } else {
                // Fallback
                setGame({ id: gameId, name: 'Mini Game', game_type: 'hide_and_seek' });
            }
            setIsLoading(false);
        };

        if (gameId) loadGame();
    }, [gameId]);

    // Get current student from localStorage
    const getStudent = useCallback(() => {
        const stored = localStorage.getItem('current_student');
        return stored ? JSON.parse(stored) : null;
    }, []);

    // Start game session
    const startGame = useCallback(() => {
        const student = getStudent();
        const newSession = createGameSession(gameId, student?.id);
        setSession(newSession);
        setTimeLeft(60);
    }, [gameId, getStudent]);

    // Update score
    const addScore = useCallback((points) => {
        setSession(prev => prev ? { ...prev, score: prev.score + points } : prev);
    }, []);

    // Update game state
    const setGameState = useCallback((state) => {
        setSession(prev => prev ? { ...prev, state } : prev);
    }, []);

    // End game and save score
    const endGame = useCallback(async () => {
        if (!session) return;

        const maxScore = getMaxScore(game?.game_type, 5);
        const stars = calculateStars(session.score, maxScore);
        const timeSpent = 60 - timeLeft;

        const updatedSession = {
            ...session,
            state: GameStates.RESULT,
            stars_earned: stars,
            time_spent_seconds: timeSpent,
        };
        setSession(updatedSession);

        // Save to database
        const student = getStudent();
        if (student?.id) {
            await gameRepository.saveScore({
                student_id: student.id,
                game_id: gameId,
                score: session.score,
                stars_earned: stars,
                time_spent_seconds: timeSpent,
            });
        }

        return { stars, score: session.score, timeSpent };
    }, [session, game, timeLeft, gameId, getStudent]);

    // Exit game
    const exitGame = useCallback(() => {
        navigate('/student/games');
    }, [navigate]);

    return {
        game,
        session,
        isLoading,
        timeLeft,
        setTimeLeft,
        startGame,
        addScore,
        setGameState,
        endGame,
        exitGame,
    };
}
