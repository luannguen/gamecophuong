import { Link } from 'react-router-dom';
import './StudentCard.css';

/**
 * StudentCard - Reusable student display card
 */
export default function StudentCard({ student, showStats = true, onAction }) {
    const { id, display_name, avatar_url, class_name, total_stars, games_played, is_active } = student;

    return (
        <div className="student-card-ui">
            <div className="card-header">
                <div className="student-info">
                    <div
                        className="student-avatar"
                        style={{ backgroundImage: avatar_url ? `url(${avatar_url})` : 'none' }}
                    >
                        {!avatar_url && '👤'}
                    </div>
                    <div className="student-details">
                        <h4>{display_name}</h4>
                        <p className="class-info">{class_name || 'No class'}</p>
                    </div>
                </div>
                {is_active !== undefined && (
                    <span className={`status-badge ${is_active ? 'active' : 'inactive'}`}>
                        {is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                )}
            </div>

            {showStats && (
                <div className="stats-row">
                    <div className="stat">
                        <span className="stat-icon">⭐</span>
                        <span className="stat-value">{(total_stars || 0).toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-icon">🎮</span>
                        <span className="stat-value">{games_played || 0} games</span>
                    </div>
                </div>
            )}

            {onAction && (
                <button className="action-btn" onClick={() => onAction(student)}>
                    View Details
                </button>
            )}
        </div>
    );
}
