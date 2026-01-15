import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IMAGES, GAME_CATEGORIES } from '../../../../data/designAssets'
import './Selection.css'

export default function MinigameSelection() {
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const student = localStorage.getItem('current_student')
        if (!student) {
            navigate('/student/login')
        }
    }, [navigate])

    return (
        <div className="games-page">
            {/* Top App Bar */}
            <header className="games-header">
                <div className="header-avatar">
                    <div
                        className="avatar-sm"
                        style={{ backgroundImage: `url(${IMAGES.missPhuong})` }}
                    ></div>
                </div>
                <h1>Game Time!</h1>
                <button className="icon-btn toy-shadow">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
            </header>

            {/* Search Bar */}
            <div className="search-container">
                <label className="search-box toy-shadow">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input
                        type="text"
                        placeholder="Search for a game..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </label>
            </div>

            {/* Section Header */}
            <div className="section-header">
                <h2>Choose a Category</h2>
                <span className="view-all">View All</span>
            </div>

            {/* Category Grid */}
            <div className="category-grid">
                {GAME_CATEGORIES.map(category => (
                    <Link
                        key={category.id}
                        to={`/student/game/${category.id}`}
                        className="category-tile toy-shadow"
                        style={{ '--cat-color': category.color }}
                    >
                        <div
                            className="tile-image"
                            style={{
                                backgroundColor: `${category.color}1A`,
                                backgroundImage: `url(${category.image})`
                            }}
                        >
                            <div className="tile-stars">
                                <span className="material-symbols-outlined">star</span>
                                {category.stars}
                            </div>
                        </div>
                        <div className="tile-info">
                            <p className="tile-name">{category.name}</p>
                            <p className="tile-subtitle">{category.subtitle}</p>
                            <div className="tile-badge" style={{ backgroundColor: `${category.color}1A` }}>
                                <span className="material-symbols-outlined" style={{ color: category.color }}>{category.icon}</span>
                                <span style={{ color: category.color }}>{category.skillType}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Miss Phuong's Favorites Section */}
            <div className="section-header favorites-header">
                <h3>Miss Phượng's Favorites</h3>
            </div>

            {/* Horizontal Scroll Section */}
            <div className="favorites-scroll no-scrollbar">
                <div className="favorite-card toy-shadow" style={{ backgroundColor: 'rgba(38, 217, 217, 0.1)' }}>
                    <div className="fav-icon" style={{ backgroundColor: 'rgba(38, 217, 217, 0.2)' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>rocket_launch</span>
                    </div>
                    <div className="fav-info">
                        <p className="fav-name">Space Adventure</p>
                        <p className="fav-subtitle">AI Grammar Quest</p>
                    </div>
                </div>
                <div className="favorite-card toy-shadow" style={{ backgroundColor: 'rgba(255, 140, 190, 0.1)' }}>
                    <div className="fav-icon" style={{ backgroundColor: 'rgba(255, 140, 190, 0.2)' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary-pink)' }}>music_note</span>
                    </div>
                    <div className="fav-info">
                        <p className="fav-name">Sing Along</p>
                        <p className="fav-subtitle">Phonics Karaoke</p>
                    </div>
                </div>
            </div>

            {/* Floating Surprise Button */}
            <button className="surprise-fab">
                <span className="material-symbols-outlined">casino</span>
            </button>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <Link to="/student/home" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>home</span>
                    <span>Home</span>
                </Link>
                <Link to="/student/games" className="nav-item active">
                    <span className="material-symbols-outlined">videogame_asset</span>
                    <span>Games</span>
                </Link>
                <Link to="/student/videos" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>movie</span>
                    <span>Videos</span>
                </Link>
                <Link to="/student/rankings" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>leaderboard</span>
                    <span>Rank</span>
                </Link>
            </nav>
        </div>
    )
}
