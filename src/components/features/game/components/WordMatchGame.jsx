import { useState, useEffect } from 'react';

const VOCABULARY_MATCHING = [
    { word: 'Tiger', image: '🐯', translation: 'Con hổ' },
    { word: 'Lion', image: '🦁', translation: 'Sư tử' },
    { word: 'Elephant', image: '🐘', translation: 'Con voi' },
    { word: 'Monkey', image: '🐵', translation: 'Con khỉ' },
    { word: 'Giraffe', image: '🦒', translation: 'Hươu cao cổ' },
    { word: 'Zebra', image: '🦓', translation: 'Ngựa vằn' },
    { word: 'Bear', image: '🐻', translation: 'Con gấu' },
    { word: 'Rabbit', image: '🐰', translation: 'Con thỏ' },
];

export default function WordMatchGame({ onScoreUpdate, onEndGame, mode = 'default' }) {
    const [targetItem, setTargetItem] = useState(null);
    const [options, setOptions] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [totalRounds] = useState(5);
    const [feedback, setFeedback] = useState(null);

    // Initialize Game
    useEffect(() => {
        setCurrentRound(0);
        setupRound(0);
    }, []);

    const setupRound = (round) => {
        const vocab = [...VOCABULARY_MATCHING].sort(() => Math.random() - 0.5);
        const target = vocab[round % vocab.length];
        setTargetItem(target);
        // Create options: target + 3 random distractors
        const others = vocab.filter(v => v.word !== target.word).sort(() => Math.random() - 0.5).slice(0, 3);
        const roundOptions = [target, ...others].sort(() => Math.random() - 0.5);
        setOptions(roundOptions);
    };

    const handleAnswer = (selected) => {
        if (feedback) return;

        const isCorrect = selected.word === targetItem?.word;

        if (isCorrect) {
            onScoreUpdate(100); // Add score (time bonus logic is in Play.jsx usually, simplified here)
            setFeedback({ type: 'correct', message: 'Great! 🎉' });
        } else {
            setFeedback({ type: 'wrong', message: 'Try again! 💪' });
        }

        setTimeout(() => {
            setFeedback(null);
            const nextRound = currentRound + 1;
            setCurrentRound(nextRound);
            if (nextRound < totalRounds) {
                setupRound(nextRound);
            } else {
                onEndGame();
            }
        }, 1000);
    };

    if (!targetItem) return <div>Loading...</div>;

    return (
        <div className="word-match-screen animate-in fade-in duration-300">
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
                        onClick={() => handleAnswer(option)}
                        disabled={!!feedback}
                    >
                        {/* Logic: 
                            listening_tap: Show Image mainly (maybe text small or hidden) 
                            listening_word: Show Word mainly (Image hidden)
                            matching/default: Show Both
                        */}

                        {(mode === 'default' || mode === 'matching' || mode === 'listening_tap' || mode === 'speaking') && (
                            <span className="option-image">{option.image}</span>
                        )}

                        {(mode === 'default' || mode === 'matching' || mode === 'listening_word' || mode === 'speaking' || mode === 'word_match') && (
                            <span className={`option-word ${mode === 'listening_tap' ? 'text-sm text-gray-400' : ''}`}>
                                {option.word}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Feedback Popup */}
            {feedback && (
                <div className={`feedback-popup ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
}
