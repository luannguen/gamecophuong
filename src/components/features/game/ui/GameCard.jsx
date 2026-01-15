import { Link } from 'react-router-dom';
import './GameCard.css';

/**
 * GameCard - Reusable game display card
 */
export default function GameCard({
    game,
    showStats = true,
    compact = false
}) {
    const { id, name, game_type, skill_focus, thumbnail_url, word_count } = game;

    const getSkillIcon = (skill) => {
        switch (skill?.toLowerCase()) {
            case 'listening': return 'hearing';
            case 'speaking': return 'record_voice_over';
            case 'reading': return 'auto_stories';
            default: return 'star';
        }
    };

    return (
        <Link
            to={`/student/game/${id}`}
            className={`game-card-ui ${compact ? 'compact' : ''}`}
        >
            <div
                className="game-thumbnail"
                style={{ backgroundImage: thumbnail_url ? `url(${thumbnail_url})` : 'none' }}
            >
                {!thumbnail_url && <span className="placeholder-icon">🎮</span>}
            </div>
            <div className="game-content">
                <h3 className="game-name">{name}</h3>
                {showStats && (
                    <div className="game-meta">
                        {skill_focus && (
                            <span className="skill-tag">
                                <span className="material-symbols-outlined">
                                    {getSkillIcon(skill_focus)}
                                </span>
                                {skill_focus}
                            </span>
                        )}
                        {word_count !== undefined && (
                            <span className="word-count">
                                <span className="material-symbols-outlined">menu_book</span>
                                {word_count} words
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
