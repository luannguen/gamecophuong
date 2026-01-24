import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSoundEffects } from '../../student/hooks/useSoundEffects'
import { categoryRepository } from '../../admin/data/categoryRepository'
import './Selection.css'

export default function GameSelection() {
    const navigate = useNavigate()
    const { playHover, playClick } = useSoundEffects()
    const [searchTerm, setSearchTerm] = useState('')
    const [topics, setTopics] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Manual Featured Games (Static for now)
    const FEATURED_GAMES = [
        {
            id: 'hide-seek',
            name: 'Hide & Seek',
            subtitle: 'Find Objects',
            skill: 'FOCUS',
            skillIcon: 'search',
            color: 'purple',
            stars: 150,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9qfvP-s5D03U6yTCv7V3tecRTxBjPSGMOlSj7RnzUM7gtGZ4d0i8gIZppNzNkYOtWpt8SPAU3OTSqv8BB9BGNbQrg_In1bEyVtmAUStSVxG8u5F8lMteCI7fuk_vxi0pPK7iDzpFXkzG_KmhaI6JwR3dGOsVt4geJXRrvKofipMp1gt3vclRavn_Yk5z8OEuXUUuhVz2XyMASXnvtL-83UEJdA98m5dPNz0vUiOyGZhd_33UtfPbO74IZNNHB1qG4LZ1NiSJVZO4',
        },
        {
            id: 'word-match',
            name: 'Word Match',
            subtitle: 'Vocabulary',
            skill: 'VOCAB',
            skillIcon: 'style',
            color: 'blue',
            stars: 120,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ2_7s6grA6ry3ml6FnypYXXQskL_MTgbfc_G5aKTAO0Cw26yPGdVmcLp_Ia201A1XwhGhSw1qNRLNMPxPRY_b4DeeIxN6ZREo7AELuC5ROGbqcbm87nOPiHhBJ7KSi5dkgS-RdMhu510MJVyfOWXO5p3FHBolD_eSFwld6sX-fcQg0brGjTJs_xwnxxxXbZRMhEfFxrt0B8qGgborb3-qITl7PtM7yzSHdonHLKUiOg2jqQYMlz7i4SY0uX0jNeSzMLDwgIwZroY',
        }
    ]

    useEffect(() => {
        loadTopics()
    }, [])

    const loadTopics = async () => {
        setIsLoading(true)
        // Ensure we get image_url if schema update is applied
        const result = await categoryRepository.getAll()
        if (result.success) {
            setTopics(result.data)
        }
        setIsLoading(false)
    }

    const getColorClass = (hexColor) => {
        if (!hexColor) return 'primary'
        const lower = hexColor.toLowerCase()
        if (lower.includes('pink') || lower === '#ff8cbe') return 'accent-pink'
        if (lower.includes('yellow') || lower === '#fccd2b') return 'accent-yellow'
        if (lower.includes('purple') || lower === '#a855f7') return 'accent-purple'
        if (lower.includes('orange') || lower === '#f97316') return 'accent-orange'
        return 'primary'
    }

    const filteredTopics = topics.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="game-selection-page">
            {/* Header */}
            <header className="selection-header">
                <div className="avatar-circle">
                    <div
                        className="avatar-img"
                        style={{
                            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAENY7W2ZLjFE5dt6rBLkkTYwoDNTKKq-qweCaDBCYXz5j5QLk2N4eLTNvUjIIqhmQdC-VUr2E8bORWvnHyj31umYK_6BSSwOO7MOV5BX4Pl-OyLR90iqYunAwL5uua2Y50yjfaWfuh7EleQ0Z-VfAkzsunWQGTGFpROoWM-qPkz25Oqj5QkTHlvLY2thOe-aUhYQ1dUFupTEac619fFNPl_ja5BsRgslndSq94clrnFWl77vz5raDDHyEV2Jp_XozMSl4TlW-hS98")`
                        }}
                    />
                </div>
                <h1 className="header-title">Game Time!</h1>
                <button className="notification-btn toy-shadow">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
            </header>

            {/* Search */}
            <div className="search-container">
                <div className="search-box toy-shadow">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* MAIN TOPICS GRID */}
            <section className="games-section">
                <div className="section-header">
                    <h2>Explore Topics</h2>
                </div>

                {isLoading ? (
                    <div className="text-center py-10 opacity-50">Loading Topics...</div>
                ) : (
                    // CHANGED FROM HORIZONTAL SCROLL TO GRID
                    <div className="topics-grid">
                        {filteredTopics.map(topic => {
                            const colorClass = getColorClass(topic.color);
                            return (
                                <Link
                                    key={topic.id}
                                    to={`/student/topic/${topic.id}`}
                                    onClick={playClick}
                                    onMouseEnter={playHover}
                                    className={`topic-card toy-shadow border-${colorClass}`}
                                >
                                    {/* USE IMAGE AS BACKGROUND (GRAPHIC STYLE) */}
                                    <div className={`card-image bg-${colorClass}`}>
                                        {topic.image_url ? (
                                            <div
                                                className="topic-illustration"
                                                style={{ backgroundImage: `url(${topic.image_url})` }}
                                            />
                                        ) : (
                                            // Fallback to Icon if no image
                                            <div className="flex items-center justify-center size-full">
                                                <span className="material-symbols-outlined text-6xl text-white drop-shadow-md">
                                                    {topic.icon}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`star-badge text-${colorClass}`}>
                                            <span className="material-symbols-outlined">star</span>
                                            <span>Start</span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <p className="card-name">{topic.name}</p>
                                        <p className="card-subtitle">Topic Journey</p>

                                        <div className={`skill-badge bg-${colorClass}`}>
                                            <span className={`material-symbols-outlined text-${colorClass}`}>
                                                category
                                            </span>
                                            <span className={`text-${colorClass}`}>
                                                Mixed
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* FEATURED GAMES */}
            <section className="games-section">
                <div className="section-header">
                    <h2>Popular Games</h2>
                </div>
                <div className="topics-grid">
                    {FEATURED_GAMES.map(game => (
                        <Link
                            key={game.id}
                            to={`/student/game/${game.id}`}
                            onClick={playClick}
                            className={`topic-card toy-shadow border-${game.color}`}
                        >
                            <div className={`card-image bg-${game.color}`}>
                                <div
                                    className="topic-illustration"
                                    style={{ backgroundImage: `url(${game.image})` }}
                                />
                                <div className={`star-badge text-${game.color}`}>
                                    <span className="material-symbols-outlined">star</span>
                                    <span>{game.stars}</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <p className="card-name">{game.name}</p>
                                <p className="card-subtitle">{game.subtitle}</p>
                                <div className={`skill-badge bg-${game.color}`}>
                                    <span className={`material-symbols-outlined text-${game.color}`}>
                                        {game.skillIcon}
                                    </span>
                                    <span className={`text-${game.color}`}>
                                        {game.skill}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                <Link to="/student/home" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>home</span>
                    <span>HOME</span>
                </Link>
                <Link to="/student/games" className="nav-item active">
                    <span className="material-symbols-outlined">videogame_asset</span>
                    <span>GAMES</span>
                </Link>
                <Link to="/student/videos" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>movie</span>
                    <span>VIDEOS</span>
                </Link>
                <Link to="/student/rankings" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>leaderboard</span>
                    <span>RANK</span>
                </Link>
            </nav>
        </div>
    )
}
