import './VocabCard.css';

/**
 * VocabCard - Reusable vocabulary display card
 */
export default function VocabCard({
    vocab,
    onPlay,
    onEdit,
    onDelete,
    showActions = false
}) {
    const { word, meaning, difficulty_level, image_url, audio_url } = vocab;

    const getDifficultyColor = (level) => {
        switch (level) {
            case 'easy': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'hard': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    const handlePlayAudio = () => {
        if (audio_url) {
            const audio = new Audio(audio_url);
            audio.play();
        }
    };

    return (
        <div className="vocab-card-ui">
            <div className="vocab-main">
                {image_url ? (
                    <div
                        className="vocab-image"
                        style={{ backgroundImage: `url(${image_url})` }}
                    />
                ) : (
                    <div className="vocab-placeholder">📚</div>
                )}
                <div className="vocab-content">
                    <h4 className="vocab-word">{word}</h4>
                    <p className="vocab-meaning">{meaning}</p>
                    <span
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(difficulty_level) }}
                    >
                        {difficulty_level}
                    </span>
                </div>
            </div>

            <div className="vocab-actions">
                {audio_url && (
                    <button className="action-btn audio" onClick={handlePlayAudio}>
                        <span className="material-symbols-outlined">volume_up</span>
                    </button>
                )}
                {onPlay && (
                    <button className="action-btn play" onClick={() => onPlay(vocab)}>
                        <span className="material-symbols-outlined">play_arrow</span>
                    </button>
                )}
                {showActions && onEdit && (
                    <button className="action-btn edit" onClick={() => onEdit(vocab)}>
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                )}
                {showActions && onDelete && (
                    <button className="action-btn delete" onClick={() => onDelete(vocab.id)}>
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                )}
            </div>
        </div>
    );
}
