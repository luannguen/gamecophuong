import { Link } from 'react-router-dom'
import { IMAGES } from '../../../../data/designAssets'
import './Home.css'

export default function StudentHome() {
    // We can access student data from context or hook if needed, 
    // but Layout handles the main user info display.
    // If we need student data here for logic, we can use useStudentProfile.

    return (
        <div className="home-page-content">
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
        </div>
    )
}
