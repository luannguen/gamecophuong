import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IMAGES } from '../data/designAssets'
import './StudentHome.css'

export default function StudentHome() {
    const [student, setStudent] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const stored = localStorage.getItem('current_student')
        if (stored) {
            setStudent(JSON.parse(stored))
        } else {
            navigate('/student/login')
        }
    }, [navigate])

    const studentName = student?.name?.split(' ')[0] || 'Student'

    return (
        <div className="home-page">
            {/* Background Gradient Effect */}
            <div className="bg-gradient-effect"></div>

            {/* Top App Bar */}
            <header className="top-bar">
                <div className="user-info">
                    <div className="avatar-ring">
                        <div
                            className="avatar-image"
                            style={{ backgroundImage: `url(${IMAGES.mascotKoala})` }}
                        ></div>
                    </div>
                    <div className="greeting">
                        <p className="greeting-subtitle">Hi {studentName}!</p>
                        <h2 className="greeting-title">Ready for Fun?</h2>
                    </div>
                </div>
                <button className="icon-btn">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
            </header>

            <main className="main-content">
                {/* Hero Banner Section */}
                <section className="hero-banner">
                    <div className="hero-decoration circle-1"></div>
                    <div className="hero-decoration circle-2"></div>
                    <div className="hero-content">
                        <h1 className="hero-title">Let's Play & Learn English!</h1>
                        <button className="hero-btn">
                            <span className="material-symbols-outlined">rocket_launch</span>
                            Start Adventure
                        </button>
                    </div>
                    <div
                        className="hero-mascot"
                        style={{ backgroundImage: `url(${IMAGES.heroMascot})` }}
                    ></div>
                </section>

                {/* Section Header */}
                <div className="section-header">
                    <h2>Miss Phượng's Choice</h2>
                    <span className="view-all">View All</span>
                </div>

                {/* Activity Grid */}
                <div className="activity-grid">
                    {/* Play Games Card */}
                    <Link to="/student/games" className="activity-card games-card">
                        <div className="card-info">
                            <div className="card-icon-row">
                                <div className="card-icon games-icon">
                                    <span className="material-symbols-outlined">sports_esports</span>
                                </div>
                                <p className="card-title">Play Games</p>
                            </div>
                            <p className="card-description">AI-powered interactive English games for fun learning.</p>
                            <button className="card-btn games-btn">
                                Play Now <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                        <div
                            className="card-image"
                            style={{ backgroundImage: `url(${IMAGES.gameController})` }}
                        ></div>
                    </Link>

                    {/* Watch & Learn Card */}
                    <Link to="/student/videos" className="activity-card videos-card">
                        <div className="card-info">
                            <div className="card-icon-row">
                                <div className="card-icon videos-icon">
                                    <span className="material-symbols-outlined">smart_display</span>
                                </div>
                                <p className="card-title">Watch & Learn</p>
                            </div>
                            <p className="card-description">Animated lessons and stories with Miss Phượng.</p>
                            <button className="card-btn videos-btn">
                                Watch <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                        <div
                            className="card-image"
                            style={{ backgroundImage: `url(${IMAGES.tvPlay})` }}
                        ></div>
                    </Link>

                    {/* Weekly Challenge Card */}
                    <div className="challenge-card">
                        <div className="challenge-blur"></div>
                        <div className="challenge-header">
                            <div className="challenge-info">
                                <div className="challenge-badge">
                                    <span className="material-symbols-outlined">trophy</span>
                                    <span className="challenge-label">Active Challenge</span>
                                </div>
                                <h3 className="challenge-title">Grammar Master Quest</h3>
                            </div>
                            <div className="challenge-timer">
                                <span className="material-symbols-outlined">schedule</span>
                                <span>2d 14h left</span>
                            </div>
                        </div>
                        <div className="challenge-footer">
                            <div className="challenge-avatars">
                                <div className="mini-avatar" style={{ backgroundImage: `url(${IMAGES.avatars[0]})` }}></div>
                                <div className="mini-avatar" style={{ backgroundImage: `url(${IMAGES.avatars[1]})` }}></div>
                                <div className="mini-avatar" style={{ backgroundImage: `url(${IMAGES.avatars[2]})` }}></div>
                                <div className="mini-avatar more">+42</div>
                            </div>
                            <button className="join-btn">Join Now</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Navigation Bar (iOS Style) */}
            <nav className="bottom-nav">
                <Link to="/student/home" className="nav-item active">
                    <span className="material-symbols-outlined">home</span>
                    <span>Home</span>
                </Link>
                <Link to="/student/games" className="nav-item">
                    <span className="material-symbols-outlined">sports_esports</span>
                    <span>Games</span>
                </Link>
                <div className="nav-fab-container">
                    <Link to="/student/games" className="nav-fab">
                        <span className="material-symbols-outlined">add</span>
                    </Link>
                </div>
                <Link to="/student/videos" className="nav-item">
                    <span className="material-symbols-outlined">movie</span>
                    <span>Videos</span>
                </Link>
                <Link to="/student/rankings" className="nav-item">
                    <span className="material-symbols-outlined">leaderboard</span>
                    <span>Ranking</span>
                </Link>
            </nav>
        </div>
    )
}
