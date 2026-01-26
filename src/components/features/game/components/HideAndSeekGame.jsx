import { useState, useEffect } from 'react';

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
};

export default function HideAndSeekGame({ onScoreUpdate, onEndGame }) {
    const [currentRoom, setCurrentRoom] = useState(null);
    const [foundItems, setFoundItems] = useState([]);
    const [targetItem, setTargetItem] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [phase, setPhase] = useState('playing'); // playing, review

    // Initialize Game
    useEffect(() => {
        const rooms = Object.keys(GAME_ROOMS);
        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
        setCurrentRoom(GAME_ROOMS[randomRoom]);
        setFoundItems([]);
        setTargetItem(GAME_ROOMS[randomRoom].items[0]);
    }, []);

    const handleItemClick = (item) => {
        if (foundItems.includes(item.id)) return;

        if (item.id === targetItem?.id) {
            // Correct!
            const newFound = [...foundItems, item.id];
            setFoundItems(newFound);
            onScoreUpdate(100); // Add score
            setFeedback({ type: 'correct', message: `Found ${item.word}! 🎉` });

            setTimeout(() => {
                setFeedback(null);
                const remaining = currentRoom.items.filter(i => !newFound.includes(i.id) && i.id !== item.id);
                if (remaining.length > 0) {
                    setTargetItem(remaining[0]);
                } else {
                    // All found!
                    setPhase('review');
                }
            }, 1000);
        } else {
            setFeedback({ type: 'wrong', message: 'Try again! 💪' });
            setTimeout(() => setFeedback(null), 800);
        }
    };

    if (!currentRoom) return <div>Loading Room...</div>;

    if (phase === 'review') {
        return (
            <div className="review-screen animate-in zoom-in duration-300">
                <h2>Vocabulary Review</h2>
                <div className="review-header">
                    <span className="mission-badge">MISSION COMPLETE</span>
                    <span>{foundItems.length}/{currentRoom.items.length} Found</span>
                </div>
                <p className="review-subtitle">
                    Great job! You found all the hidden items in the {currentRoom.name}.
                    Now, let's practice speaking them out loud.
                </p>

                <div className="vocabulary-list">
                    {currentRoom.items.map(item => (
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

                <button className="finish-btn" onClick={onEndGame}>
                    Finish Review ✨
                </button>
            </div>
        );
    }

    return (
        <div className="hide-seek-screen animate-in fade-in duration-300">
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
                <div className="target-banner animate-bounce-subtle">
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

            {/* Feedback Popup */}
            {feedback && (
                <div className={`feedback-popup ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
}
