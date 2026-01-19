import { useState } from 'react';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { IMAGES } from '../../../../data/designAssets';
import './Profile.css';

export function StudentProfilePage() {
    const { student, logout, isLoading } = useStudentProfile();
    const [activeTab, setActiveTab] = useState('achievements');

    if (isLoading) {
        return (
            <div className="profile-page loading">
                <div className="loader"></div>
            </div>
        );
    }

    // Mock data for demonstration
    const achievements = [
        { id: 1, icon: '🏆', title: 'First Win', description: 'Won your first game', unlocked: true },
        { id: 2, icon: '⭐', title: 'Star Collector', description: 'Collected 100 stars', unlocked: true },
        { id: 3, icon: '🔥', title: 'On Fire', description: '5 wins in a row', unlocked: true },
        { id: 4, icon: '📚', title: 'Vocabulary Master', description: 'Learned 50 words', unlocked: false },
        { id: 5, icon: '🎯', title: 'Perfect Score', description: 'Get 100% on any game', unlocked: false },
        { id: 6, icon: '👑', title: 'Weekly Champion', description: 'Rank #1 for a week', unlocked: false },
    ];

    const stats = {
        totalGames: 45,
        wins: 32,
        totalStars: student?.total_stars || 320,
        totalScore: student?.total_score || 1500,
        currentStreak: 3,
        bestStreak: 7,
        level: 5,
        xp: 750,
        xpToNext: 1000,
    };

    const recentGames = [
        { id: 1, name: 'Animals Quiz', score: 95, stars: 3, date: 'Today' },
        { id: 2, name: 'Word Match', score: 88, stars: 2, date: 'Today' },
        { id: 3, name: 'Listen & Click', score: 100, stars: 3, date: 'Yesterday' },
    ];

    return (
        <div className="profile-page">
            <div className="profile-page-content">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                    <div className="profile-header-bg"></div>
                    <div className="profile-header-content">
                        <div className="profile-avatar-section">
                            <div className="profile-avatar-large">
                                <div
                                    className="avatar-image"
                                    style={{ backgroundImage: `url(${IMAGES.mascotKoala})` }}
                                ></div>
                                <div className="avatar-level-badge">
                                    <span>{stats.level}</span>
                                </div>
                            </div>
                            <div className="profile-main-info">
                                <h1 className="profile-display-name">{student?.display_name || 'Student'}</h1>
                                <p className="profile-class">{student?.student_class ? `Class ${student.student_class}` : 'Explorer'}</p>
                                <div className="profile-xp-bar">
                                    <div className="xp-progress" style={{ width: `${(stats.xp / stats.xpToNext) * 100}%` }}></div>
                                    <span className="xp-text">{stats.xp} / {stats.xpToNext} XP</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-quick-stats">
                            <div className="quick-stat">
                                <span className="material-symbols-outlined">emoji_events</span>
                                <div className="stat-details">
                                    <span className="stat-value">{stats.totalScore}</span>
                                    <span className="stat-label">Points</span>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <span className="material-symbols-outlined">stars</span>
                                <div className="stat-details">
                                    <span className="stat-value">{stats.totalStars}</span>
                                    <span className="stat-label">Stars</span>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <span className="material-symbols-outlined">local_fire_department</span>
                                <div className="stat-details">
                                    <span className="stat-value">{stats.currentStreak}</span>
                                    <span className="stat-label">Streak</span>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <span className="material-symbols-outlined">videogame_asset</span>
                                <div className="stat-details">
                                    <span className="stat-value">{stats.totalGames}</span>
                                    <span className="stat-label">Games</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('achievements')}
                    >
                        <span className="material-symbols-outlined">military_tech</span>
                        Achievements
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <span className="material-symbols-outlined">history</span>
                        History
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <span className="material-symbols-outlined">settings</span>
                        Settings
                    </button>
                </div>

                {/* Tab Content */}
                <div className="profile-tab-content">
                    {activeTab === 'achievements' && (
                        <div className="achievements-grid">
                            {achievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                                >
                                    <div className="achievement-icon">{achievement.icon}</div>
                                    <div className="achievement-info">
                                        <h3>{achievement.title}</h3>
                                        <p>{achievement.description}</p>
                                    </div>
                                    {achievement.unlocked ? (
                                        <span className="achievement-status unlocked">✓</span>
                                    ) : (
                                        <span className="achievement-status locked">🔒</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="history-list">
                            {recentGames.map(game => (
                                <div key={game.id} className="history-item">
                                    <div className="game-icon">
                                        <span className="material-symbols-outlined">sports_esports</span>
                                    </div>
                                    <div className="game-info">
                                        <h4>{game.name}</h4>
                                        <p className="game-date">{game.date}</p>
                                    </div>
                                    <div className="game-score">
                                        <span className="score-value">{game.score}%</span>
                                        <div className="stars-display">
                                            {[1, 2, 3].map(star => (
                                                <span
                                                    key={star}
                                                    className={`star ${star <= game.stars ? 'filled' : ''}`}
                                                >⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="settings-section">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="material-symbols-outlined">volume_up</span>
                                    <span>Sound Effects</span>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="material-symbols-outlined">music_note</span>
                                    <span>Background Music</span>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span>Notifications</span>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <button className="logout-btn" onClick={logout}>
                                <span className="material-symbols-outlined">logout</span>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentProfilePage;
