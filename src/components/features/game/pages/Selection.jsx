import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Selection.css'

// Animal mini-games - each is a separate game with its own skill type
const ANIMAL_GAMES = [
    {
        id: 'elephant',
        name: 'Elephant',
        subtitle: 'Trumpet Sound',
        skill: 'LISTENING',
        skillIcon: 'hearing',
        color: 'purple',
        stars: 180,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9qfvP-s5D03U6yTCv7V3tecRTxBjPSGMOlSj7RnzUM7gtGZ4d0i8gIZppNzNkYOtWpt8SPAU3OTSqv8BB9BGNbQrg_In1bEyVtmAUStSVxG8u5F8lMteCI7fuk_vxi0pPK7iDzpFXkzG_KmhaI6JwR3dGOsVt4geJXRrvKofipMp1gt3vclRavn_Yk5z8OEuXUUuhVz2XyMASXnvtL-83UEJdA98m5dPNz0vUiOyGZhd_33UtfPbO74IZNNHB1qG4LZ1NiSJVZO4',
        gameType: 'listen-click'
    },
    {
        id: 'lion-king',
        name: 'Lion King',
        subtitle: 'Roar Challenge',
        skill: 'SPEAKING',
        skillIcon: 'record_voice_over',
        color: 'orange',
        stars: 250,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ2_7s6grA6ry3ml6FnypYXXQskL_MTgbfc_G5aKTAO0Cw26yPGdVmcLp_Ia201A1XwhGhSw1qNRLNMPxPRY_b4DeeIxN6ZREo7AELuC5ROGbqcbm87nOPiHhBJ7KSi5dkgS-RdMhu510MJVyfOWXO5p3FHBolD_eSFwld6sX-fcQg0brGjTJs_xwnxxxXbZRMhEfFxrt0B8qGgborb3-qITl7PtM7yzSHdonHLKUiOg2jqQYMlz7i4SY0uX0jNeSzMLDwgIwZroY',
        gameType: 'speak-match'
    },
    {
        id: 'cat',
        name: 'Cat & Kitten',
        subtitle: 'Word Puzzle',
        skill: 'VOCABULARY',
        skillIcon: 'menu_book',
        color: 'pink',
        stars: 320,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKidgnAxowO1QfYZ_dDe-FTxUQxWbic6eQVAjb-hGsy8Ab_Lx-63cpjYAels3ZRAvOFkh9yx59g_Y8zA_ZgUpbcXcmdRNyS537yMAeAqbZPP9zbvQbXo_ePu3OuigQ-PXsFkWswOi6my0ZkFTRHB6iHJlbK3vDv07bVVBJnTZb1aWVP-_rRPy5cVbPOeujI3nRLZD_yW5zdA559Y514NVAoj7Qm_1vFmgCwuA_scDi888loFnxxgXrx1v221ZCa5e-IpyCfjPlJCk',
        gameType: 'word-match'
    },
    {
        id: 'bunny',
        name: 'Bunny Hop',
        subtitle: 'Listen & Click',
        skill: 'LISTENING',
        skillIcon: 'hearing',
        color: 'primary',
        stars: 120,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2kT-byY3bM7YlgtQjXq7QjY_QgOGNpewACSIyNodDLsgiWghaKsnA8soJV91nS1HwFAf9W6QSJGhfC_T5M4MKkajXzDVdXvvkSiNy5G2tlyIUcB1HjQmesCP5ycdgAW_25gKcTawX-LtkD1SWkEQegDLv270KoeR7OUzSRuWp4yQGj0CHRq4XnDst1-xJxx71u6Ruij6spd1vrm89uDU_hqF48SKUCC3DHhFqBmf873h8a4uhbLtkzCoUuzjy_vUXdQ4GGOe3I0',
        gameType: 'listen-click'
    }
]

// More topics - other vocabulary categories
const MORE_TOPICS = [
    {
        id: 'family',
        name: 'My Family',
        subtitle: 'Word Match',
        skill: 'VOCABULARY',
        skillIcon: 'menu_book',
        color: 'pink',
        stars: 85,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa-D_16tkmmLlQK6de_4ARj0fGpfsFTEKg2dgMX2f9V42cOaGhpMwslqMo1JALBSiuZfokKVhPLe9Vlz-5lcXH9qBL9deTI7MLwg3AHw_C2aYEOnagdLvmDdn7X34riT023UnkNp6vIe44m7yodoFQrXvOXvqhxyrUxL9fD1EUZ_3z2liM1xP-Q87W-KDf66sa-MyC2MmVMCY-V7Rp7I1FCosQob6vpHCCuB14_tlqlZEA0-gtnR7YTkaCMjB3JXlAjgajaNiexpQ',
        gameType: 'word-match'
    },
    {
        id: 'routines',
        name: 'Daily Routines',
        subtitle: 'Sentence Builder',
        skill: 'GRAMMAR',
        skillIcon: 'edit',
        color: 'yellow',
        stars: 40,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqEAi1c6fc-n4BsihOb3lE-Pbe8MKVixuHLe2-KXzSIL-Fu5fHX_lIOxu_31rtLqyN5vyaR_KaUEPUBiLKo7VuzNJvfd11YsbaDAb_Mxe2dLxUH1bJCHn-AiSHCOkIeNX5tkzgxuoJjUUO44cgBwFanp5rRjY5am68IkRmHo0wx64RhPgiLoOthjjaWIgADnAEc4hOxlqmGYTi9-zliEWfUW8PyZrGvQKlZ3szoMKSvptneh-SdpIXZq0AbtsI0GuMciU5tfOwGtA',
        gameType: 'sentence-builder'
    },
    {
        id: 'house',
        name: 'My House',
        subtitle: 'Speak Match',
        skill: 'SPEAKING',
        skillIcon: 'record_voice_over',
        color: 'primary',
        stars: 210,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxmRMVM5Til8HoSOgyoa7DZJBTMXAEr6-7Cjy8w8QAIE9X6pIq50Wti7FmqnO8cnGPoNN8P4z0LzZZ5xE5IJmw5DV3nTxBA4Cf-nlLJVkOGAW-Xnecdqd73fAqfjEeeIVN0zXELpKcz5cAU2O0lFv5NIsW1cIHlNLN2_kdZoyYrzpsSdKgED3tVeIw-aRId3yOPa-UvW8zJn6VpPHUwI4OQniRiJvTgof3g4q7nWvyzCoTd0DCpovg2IDSaxC3hD025QlkkR4EGjs',
        gameType: 'speak-match'
    }
]

// Miss Phuong's Favorites
const FAVORITES = [
    { id: 'space', name: 'Space Adventure', subtitle: 'AI Grammar Quest', icon: 'rocket_launch', color: 'primary' },
    { id: 'sing', name: 'Sing Along', subtitle: 'Phonics Karaoke', icon: 'music_note', color: 'pink' }
]

export default function GameSelection() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const student = localStorage.getItem('current_student')
        if (!student) {
            navigate('/student/login')
        }
    }, [navigate])

    const getColorClass = (color) => {
        switch (color) {
            case 'pink': return 'accent-pink'
            case 'yellow': return 'accent-yellow'
            case 'purple': return 'accent-purple'
            case 'orange': return 'accent-orange'
            default: return 'primary'
        }
    }

    // Filter games by search
    const filteredAnimalGames = ANIMAL_GAMES.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredTopics = MORE_TOPICS.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
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

            {/* Search Bar */}
            <div className="search-container">
                <div className="search-box toy-shadow">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input
                        type="text"
                        placeholder="Search for a game..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Animals Adventure Section */}
            <section className="games-section">
                <div className="section-header">
                    <h2>Animals Adventure</h2>
                    <span className="view-all">View All</span>
                </div>
                <div className="horizontal-scroll no-scrollbar">
                    {filteredAnimalGames.map(game => (
                        <Link
                            key={game.id}
                            to={`/student/game/${game.id}/detail`}
                            className={`mini-game-card toy-shadow border-${getColorClass(game.color)}`}
                        >
                            <div className={`card-image bg-${getColorClass(game.color)}`}>
                                <img src={game.image} alt={game.name} />
                                <div className={`star-badge text-${getColorClass(game.color)}`}>
                                    <span className="material-symbols-outlined">star</span>
                                    <span>{game.stars}</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <p className="card-name">{game.name}</p>
                                <p className="card-subtitle">{game.subtitle}</p>
                                <div className={`skill-badge bg-${getColorClass(game.color)}`}>
                                    <span className={`material-symbols-outlined text-${getColorClass(game.color)}`}>
                                        {game.skillIcon}
                                    </span>
                                    <span className={`text-${getColorClass(game.color)}`}>
                                        {game.skill}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* More Topics Section */}
            <section className="games-section">
                <div className="section-header">
                    <h2>More Topics</h2>
                </div>
                <div className="topics-grid">
                    {filteredTopics.map(topic => (
                        <Link
                            key={topic.id}
                            to={`/student/game/${topic.id}/detail`}
                            className={`topic-card toy-shadow border-${getColorClass(topic.color)}`}
                        >
                            <div className={`card-image bg-${getColorClass(topic.color)}`}>
                                <div
                                    className="topic-illustration"
                                    style={{ backgroundImage: `url(${topic.image})` }}
                                />
                                <div className={`star-badge text-${getColorClass(topic.color)}`}>
                                    <span className="material-symbols-outlined">star</span>
                                    <span>{topic.stars}</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <p className="card-name">{topic.name}</p>
                                <p className="card-subtitle">{topic.subtitle}</p>
                                <div className={`skill-badge bg-${getColorClass(topic.color)}`}>
                                    <span className={`material-symbols-outlined text-${getColorClass(topic.color)}`}>
                                        {topic.skillIcon}
                                    </span>
                                    <span className={`text-${getColorClass(topic.color)}`}>
                                        {topic.skill}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Miss Phuong's Favorites */}
            <section className="games-section">
                <div className="section-header">
                    <h2>Miss Phượng's Favorites</h2>
                </div>
                <div className="horizontal-scroll no-scrollbar">
                    {FAVORITES.map(fav => (
                        <div
                            key={fav.id}
                            className={`favorite-card toy-shadow bg-${getColorClass(fav.color)}`}
                        >
                            <div className={`fav-icon bg-${getColorClass(fav.color)}-dark`}>
                                <span className={`material-symbols-outlined text-${getColorClass(fav.color)}`}>
                                    {fav.icon}
                                </span>
                            </div>
                            <div className="fav-content">
                                <p className="fav-name">{fav.name}</p>
                                <p className="fav-subtitle">{fav.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Floating Surprise Button */}
            <button className="surprise-btn">
                <span className="material-symbols-outlined">casino</span>
            </button>

            {/* Bottom Navigation */}
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
