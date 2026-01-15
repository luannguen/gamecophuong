import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import './GameDetail.css'

// All games data - combined from Animals and Topics
const ALL_GAMES = {
    // Animal mini-games
    elephant: {
        id: 'elephant',
        name: 'Elephant',
        category: 'Animals',
        gameType: 'Listen & Click',
        skillType: 'LISTENING',
        skillIcon: 'hearing',
        color: 'purple',
        highScore: 180,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9qfvP-s5D03U6yTCv7V3tecRTxBjPSGMOlSj7RnzUM7gtGZ4d0i8gIZppNzNkYOtWpt8SPAU3OTSqv8BB9BGNbQrg_In1bEyVtmAUStSVxG8u5F8lMteCI7fuk_vxi0pPK7iDzpFXkzG_KmhaI6JwR3dGOsVt4geJXRrvKofipMp1gt3vclRavn_Yk5z8OEuXUUuhVz2XyMASXnvtL-83UEJdA98m5dPNz0vUiOyGZhd_33UtfPbO74IZNNHB1qG4LZ1NiSJVZO4',
        description: 'Listen to the trumpet sound and tap the correct animal! How many can you get right?',
        duration: '2 Mins',
        difficulty: 'Easy',
        xp: 50,
        sampleWords: ['Elephant', 'Trunk', 'Big', 'Gray', 'Safari'],
        playRoute: 'listen-click'
    },
    'lion-king': {
        id: 'lion-king',
        name: 'Lion King',
        category: 'Animals',
        gameType: 'Speak Match',
        skillType: 'SPEAKING',
        skillIcon: 'record_voice_over',
        color: 'orange',
        highScore: 250,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ2_7s6grA6ry3ml6FnypYXXQskL_MTgbfc_G5aKTAO0Cw26yPGdVmcLp_Ia201A1XwhGhSw1qNRLNMPxPRY_b4DeeIxN6ZREo7AELuC5ROGbqcbm87nOPiHhBJ7KSi5dkgS-RdMhu510MJVyfOWXO5p3FHBolD_eSFwld6sX-fcQg0brGjTJs_xwnxxxXbZRMhEfFxrt0B8qGgborb3-qITl7PtM7yzSHdonHLKUiOg2jqQYMlz7i4SY0uX0jNeSzMLDwgIwZroY',
        description: 'Say the word and match it to the lion! Practice your roar!',
        duration: '3 Mins',
        difficulty: 'Medium',
        xp: 75,
        sampleWords: ['Lion', 'Roar', 'King', 'Mane', 'Pride'],
        playRoute: 'speak-match'
    },
    cat: {
        id: 'cat',
        name: 'Cat & Kitten',
        category: 'Animals',
        gameType: 'Word Match',
        skillType: 'VOCABULARY',
        skillIcon: 'menu_book',
        color: 'pink',
        highScore: 320,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKidgnAxowO1QfYZ_dDe-FTxUQxWbic6eQVAjb-hGsy8Ab_Lx-63cpjYAels3ZRAvOFkh9yx59g_Y8zA_ZgUpbcXcmdRNyS537yMAeAqbZPP9zbvQbXo_ePu3OuigQ-PXsFkWswOi6my0ZkFTRHB6iHJlbK3vDv07bVVBJnTZb1aWVP-_rRPy5cVbPOeujI3nRLZD_yW5zdA559Y514NVAoj7Qm_1vFmgCwuA_scDi888loFnxxgXrx1v221ZCa5e-IpyCfjPlJCk',
        description: 'Match the words to cute cats and kittens! Learn vocabulary.',
        duration: '2 Mins',
        difficulty: 'Easy',
        xp: 50,
        sampleWords: ['Cat', 'Kitten', 'Meow', 'Whiskers', 'Paw'],
        playRoute: 'word-match'
    },
    bunny: {
        id: 'bunny',
        name: 'Bunny Hop',
        category: 'Animals',
        gameType: 'Listen & Click',
        skillType: 'LISTENING',
        skillIcon: 'hearing',
        color: 'primary',
        highScore: 120,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2kT-byY3bM7YlgtQjXq7QjY_QgOGNpewACSIyNodDLsgiWghaKsnA8soJV91nS1HwFAf9W6QSJGhfC_T5M4MKkajXzDVdXvvkSiNy5G2tlyIUcB1HjQmesCP5ycdgAW_25gKcTawX-LtkD1SWkEQegDLv270KoeR7OUzSRuWp4yQGj0CHRq4XnDst1-xJxx71u6Ruij6spd1vrm89uDU_hqF48SKUCC3DHhFqBmf873h8a4uhbLtkzCoUuzjy_vUXdQ4GGOe3I0',
        description: 'Listen to the sound and tap the correct animal! How many can you get right?',
        duration: '2 Mins',
        difficulty: 'Easy',
        xp: 50,
        sampleWords: ['Rabbit', 'Bunny', 'Hop', 'Ears', 'Carrot'],
        playRoute: 'listen-click'
    },
    // Topic games
    family: {
        id: 'family',
        name: 'My Family',
        category: 'Topics',
        gameType: 'Word Match',
        skillType: 'VOCABULARY',
        skillIcon: 'menu_book',
        color: 'pink',
        highScore: 85,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa-D_16tkmmLlQK6de_4ARj0fGpfsFTEKg2dgMX2f9V42cOaGhpMwslqMo1JALBSiuZfokKVhPLe9Vlz-5lcXH9qBL9deTI7MLwg3AHw_C2aYEOnagdLvmDdn7X34riT023UnkNp6vIe44m7yodoFQrXvOXvqhxyrUxL9fD1EUZ_3z2liM1xP-Q87W-KDf66sa-MyC2MmVMCY-V7Rp7I1FCosQob6vpHCCuB14_tlqlZEA0-gtnR7YTkaCMjB3JXlAjgajaNiexpQ',
        description: 'Match the words to the family members! Learn family vocabulary.',
        duration: '3 Mins',
        difficulty: 'Easy',
        xp: 60,
        sampleWords: ['Father', 'Mother', 'Brother', 'Sister', 'Grandpa'],
        playRoute: 'word-match'
    },
    routines: {
        id: 'routines',
        name: 'Daily Routines',
        category: 'Topics',
        gameType: 'Sentence Builder',
        skillType: 'GRAMMAR',
        skillIcon: 'edit',
        color: 'yellow',
        highScore: 40,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqEAi1c6fc-n4BsihOb3lE-Pbe8MKVixuHLe2-KXzSIL-Fu5fHX_lIOxu_31rtLqyN5vyaR_KaUEPUBiLKo7VuzNJvfd11YsbaDAb_Mxe2dLxUH1bJCHn-AiSHCOkIeNX5tkzgxuoJjUUO44cgBwFanp5rRjY5am68IkRmHo0wx64RhPgiLoOthjjaWIgADnAEc4hOxlqmGYTi9-zliEWfUW8PyZrGvQKlZ3szoMKSvptneh-SdpIXZq0AbtsI0GuMciU5tfOwGtA',
        description: 'Build sentences about daily activities! Practice grammar.',
        duration: '4 Mins',
        difficulty: 'Medium',
        xp: 75,
        sampleWords: ['Wake up', 'Eat breakfast', 'Go to school', 'Study', 'Sleep'],
        playRoute: 'sentence-builder'
    },
    house: {
        id: 'house',
        name: 'My House',
        category: 'Topics',
        gameType: 'Speak Match',
        skillType: 'SPEAKING',
        skillIcon: 'record_voice_over',
        color: 'primary',
        highScore: 210,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxmRMVM5Til8HoSOgyoa7DZJBTMXAEr6-7Cjy8w8QAIE9X6pIq50Wti7FmqnO8cnGPoNN8P4z0LzZZ5xE5IJmw5DV3nTxBA4Cf-nlLJVkOGAW-Xnecdqd73fAqfjEeeIVN0zXELpKcz5cAU2O0lFv5NIsW1cIHlNLN2_kdZoyYrzpsSdKgED3tVeIw-aRId3yOPa-UvW8zJn6VpPHUwI4OQniRiJvTgof3g4q7nWvyzCoTd0DCpovg2IDSaxC3hD025QlkkR4EGjs',
        description: 'Say the words and match them to the items! Practice speaking.',
        duration: '3 Mins',
        difficulty: 'Medium',
        xp: 80,
        sampleWords: ['Bed', 'Chair', 'Table', 'Window', 'Door'],
        playRoute: 'speak-match'
    }
}

export default function GameDetail() {
    const { gameId } = useParams()
    const navigate = useNavigate()
    const [isFavorite, setIsFavorite] = useState(false)
    const { speak, isSpeaking } = useSpeechSynthesis()

    const game = ALL_GAMES[gameId]

    useEffect(() => {
        const student = localStorage.getItem('current_student')
        if (!student) {
            navigate('/student/login')
        }
    }, [navigate])

    if (!game) {
        return (
            <div className="game-detail-page">
                <div className="not-found">
                    <h2>Game not found</h2>
                    <Link to="/student/games">Back to Games</Link>
                </div>
            </div>
        )
    }

    const getColorClass = (color) => {
        switch (color) {
            case 'pink': return 'accent-pink'
            case 'yellow': return 'accent-yellow'
            case 'purple': return 'accent-purple'
            case 'orange': return 'accent-orange'
            default: return 'primary'
        }
    }

    const handlePlayPreview = () => {
        if (game.sampleWords && game.sampleWords.length > 0) {
            const randomWord = game.sampleWords[Math.floor(Math.random() * game.sampleWords.length)]
            speak(randomWord)
        }
    }

    const handleStartGame = () => {
        // Navigate to the appropriate game type
        navigate(`/student/game/${game.playRoute}?topic=${gameId}`)
    }

    return (
        <div className="game-detail-page">
            {/* Header */}
            <header className="detail-header">
                <button className="back-btn toy-shadow" onClick={() => navigate('/student/games')}>
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1>{game.name}</h1>
                <button
                    className={`fav-btn toy-shadow ${isFavorite ? 'active' : ''}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                >
                    <span className="material-symbols-outlined">
                        {isFavorite ? 'favorite' : 'favorite_border'}
                    </span>
                </button>
            </header>

            {/* Main Content */}
            <main className="detail-main">
                {/* Hero Image */}
                <div className={`hero-image ${getColorClass(game.color)}-bg`}>
                    <img src={game.image} alt={game.name} className="game-illustration" />
                    <div className="high-score-badge">
                        <span className="score-label">HIGH SCORE</span>
                        <div className="score-value">
                            <span className="material-symbols-outlined">star</span>
                            <span>{game.highScore.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Game Info */}
                <div className="game-info">
                    <div className={`skill-badge ${getColorClass(game.color)}-light`}>
                        <span className={`material-symbols-outlined ${getColorClass(game.color)}`}>
                            {game.skillIcon}
                        </span>
                        <span className={getColorClass(game.color)}>
                            {game.skillType} SKILL
                        </span>
                    </div>

                    <h2>{game.name} - {game.gameType}</h2>
                    <p className="game-description">{game.description}</p>

                    {/* AI Preview Button */}
                    <button
                        className={`ai-preview-btn ${isSpeaking ? 'speaking' : ''}`}
                        onClick={handlePlayPreview}
                        disabled={isSpeaking}
                    >
                        <span className="material-symbols-outlined">
                            {isSpeaking ? 'volume_up' : 'hearing'}
                        </span>
                        <span>{isSpeaking ? 'Playing...' : 'Preview Words with AI Voice'}</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card toy-shadow">
                        <span className="material-symbols-outlined primary">timer</span>
                        <span className="stat-value">{game.duration}</span>
                    </div>
                    <div className="stat-card toy-shadow">
                        <span className="material-symbols-outlined accent-pink">bolt</span>
                        <span className="stat-value">{game.difficulty}</span>
                    </div>
                    <div className="stat-card toy-shadow">
                        <span className="material-symbols-outlined accent-yellow">workspace_premium</span>
                        <span className="stat-value">XP +{game.xp}</span>
                    </div>
                </div>
            </main>

            {/* Play Button */}
            <div className="play-section">
                <button className="play-btn" onClick={handleStartGame}>
                    <span className="material-symbols-outlined">play_circle</span>
                    PLAY NOW
                </button>
                <p className="unlock-hint">Requires Level 2 to unlock hard mode</p>
            </div>

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
