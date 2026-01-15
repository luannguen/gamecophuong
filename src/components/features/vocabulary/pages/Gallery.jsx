import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IMAGES, VIDEO_CATEGORIES, RECOMMENDED_VIDEOS } from '../../../../data/designAssets'
import './Gallery.css'

export default function VideoGallery() {
    const [selectedVideo, setSelectedVideo] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const student = localStorage.getItem('current_student')
        if (!student) {
            navigate('/student/login')
        }
    }, [navigate])

    return (
        <div className="videos-page">
            {/* Background Gradient */}
            <div className="bg-gradient-effect"></div>

            {/* Header */}
            <header className="videos-header">
                <div className="header-content">
                    <h1>Watch & Learn</h1>
                    <p className="header-subtitle">Lessons with Miss Phượng</p>
                </div>
                <button className="icon-btn toy-shadow">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </header>

            <main className="videos-main">
                {/* New Lessons Section */}
                <section className="lessons-section">
                    <div className="section-header">
                        <h2>New Lessons</h2>
                        <span className="see-all">See All</span>
                    </div>

                    {/* Horizontal Scroll Carousel */}
                    <div className="lessons-carousel no-scrollbar">
                        <div className="lesson-card featured" style={{ backgroundColor: 'var(--color-primary)' }}>
                            <div
                                className="lesson-bg"
                                style={{ backgroundImage: `url(${IMAGES.tvPlay})` }}
                            ></div>
                            <div className="lesson-overlay"></div>
                            <div className="play-button">
                                <span className="material-symbols-outlined">play_arrow</span>
                            </div>
                            <div className="lesson-info">
                                <span className="featured-badge">Featured</span>
                                <h3>Adventure in the Jungle</h3>
                            </div>
                        </div>

                        <div className="lesson-card" style={{ backgroundColor: 'var(--color-secondary-pink)' }}>
                            <div
                                className="lesson-bg"
                                style={{ backgroundImage: `url(${IMAGES.gameController})`, opacity: 0.8 }}
                            ></div>
                            <div className="lesson-overlay"></div>
                            <div className="lesson-info">
                                <h3>Numbers & Colors Party</h3>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="categories-section">
                    <div className="section-header">
                        <h2>Categories</h2>
                    </div>
                    <div className="categories-scroll no-scrollbar">
                        {VIDEO_CATEGORIES.map(cat => (
                            <div key={cat.id} className="category-item">
                                <div className="category-icon toy-shadow">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ color: cat.color }}
                                    >{cat.icon}</span>
                                </div>
                                <span className="category-name">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommended Section */}
                <section className="recommended-section">
                    <h2>Recommended for You</h2>
                    <div className="recommended-list">
                        {RECOMMENDED_VIDEOS.map(video => (
                            <div
                                key={video.id}
                                className="video-card toy-shadow"
                                onClick={() => setSelectedVideo(video)}
                            >
                                <div className="video-thumbnail">
                                    <div
                                        className="thumbnail-bg"
                                        style={{ backgroundImage: `url(${video.image})` }}
                                    ></div>
                                    <div className="thumbnail-overlay">
                                        <span className="material-symbols-outlined">play_circle</span>
                                    </div>
                                </div>
                                <div className="video-info">
                                    <h4>{video.title}</h4>
                                    <p className="video-duration">
                                        <span className="material-symbols-outlined">schedule</span>
                                        {video.duration}
                                    </p>
                                    <div className="video-meta">
                                        <span
                                            className="level-badge"
                                            style={{
                                                backgroundColor: `${video.levelColor}1A`,
                                                color: video.levelColor
                                            }}
                                        >{video.level}</span>
                                        {video.status === 'watched' ? (
                                            <div className="status-watched">
                                                <span className="material-symbols-outlined">check_circle</span>
                                                <span>Watched</span>
                                            </div>
                                        ) : (
                                            <button className="play-now-btn">Play Now</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div className="video-modal" onClick={() => setSelectedVideo(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {/* Video Player */}
                        <div className="video-player" style={{ backgroundImage: `url(${selectedVideo.image})` }}>
                            <div className="player-overlay">
                                <button className="settings-btn">
                                    <span className="material-symbols-outlined">settings</span>
                                </button>
                                <div className="player-controls">
                                    <button className="control-btn">
                                        <span className="material-symbols-outlined">replay_10</span>
                                    </button>
                                    <button className="play-btn">
                                        <span className="material-symbols-outlined">play_arrow</span>
                                    </button>
                                    <button className="control-btn">
                                        <span className="material-symbols-outlined">forward_10</span>
                                    </button>
                                </div>
                                <div className="progress-section">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '35%' }}>
                                            <div className="progress-handle"></div>
                                        </div>
                                    </div>
                                    <div className="time-display">
                                        <span>02:14</span>
                                        <span>06:45</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Details */}
                        <div className="video-details">
                            <div className="details-header">
                                <button className="back-btn" onClick={() => setSelectedVideo(null)}>
                                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                                </button>
                                <div>
                                    <h2>Watch & Learn</h2>
                                    <p className="unit-label">Unit 1: Family</p>
                                </div>
                            </div>

                            <h1 className="video-title">Lesson 1: My Happy Family</h1>
                            <p className="video-description">
                                Learn common words for family members with Miss Phượng and her friends!
                            </p>

                            <div className="vocabulary-section">
                                <div className="vocab-header">
                                    <h3>Vocabulary List</h3>
                                    <span className="listen-all">Listen All</span>
                                </div>
                                <div className="vocab-chips">
                                    {['Mom', 'Dad', 'Brother', 'Sister', 'Grandma'].map(word => (
                                        <button key={word} className="vocab-chip">
                                            <span className="material-symbols-outlined">volume_up</span>
                                            <span>{word}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <Link to="/student/home" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>home</span>
                    <span>Home</span>
                </Link>
                <Link to="/student/games" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>sports_esports</span>
                    <span>Games</span>
                </Link>
                <div className="nav-fab-container">
                    <Link to="/student/games" className="nav-fab">
                        <span className="material-symbols-outlined">add</span>
                    </Link>
                </div>
                <Link to="/student/videos" className="nav-item active">
                    <span className="material-symbols-outlined">movie</span>
                    <span>Videos</span>
                </Link>
                <Link to="/student/rankings" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>leaderboard</span>
                    <span>Ranking</span>
                </Link>
            </nav>
        </div>
    )
}
