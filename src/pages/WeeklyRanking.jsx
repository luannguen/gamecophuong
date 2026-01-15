import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabaseClient'
import './WeeklyRanking.css'

// Fallback ranking data
const FALLBACK_RANKINGS = [
    { id: 1, name: 'Minh Anh', avatar: '👧', stars: 2450, rank: 1 },
    { id: 2, name: 'Gia Huy', avatar: '👦', stars: 2320, rank: 2 },
    { id: 3, name: 'Thảo My', avatar: '👩', stars: 2180, rank: 3 },
    { id: 4, name: 'Đức Anh', avatar: '🧑', stars: 2050, rank: 4 },
    { id: 5, name: 'Phương Linh', avatar: '👧', stars: 1920, rank: 5 },
    { id: 6, name: 'Quốc Bảo', avatar: '👦', stars: 1850, rank: 6 },
    { id: 7, name: 'Hà My', avatar: '👩', stars: 1780, rank: 7 },
    { id: 8, name: 'Tuấn Kiệt', avatar: '🧑', stars: 1650, rank: 8 },
]

export default function WeeklyRanking() {
    const [rankings, setRankings] = useState([])
    const [currentStudent, setCurrentStudent] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const stored = localStorage.getItem('current_student')
        if (stored) {
            setCurrentStudent(JSON.parse(stored))
        }
        loadRankings()
    }, [])

    const loadRankings = async () => {
        try {
            const { data } = await supabase
                .from('students')
                .select('id, display_name, avatar_url, total_stars')
                .order('total_stars', { ascending: false })
                .limit(10)

            if (data?.length) {
                setRankings(data.map((s, i) => ({
                    ...s,
                    name: s.display_name, // Map display_name to name
                    rank: i + 1,
                    avatar: s.avatar_url || '👤',
                    stars: s.total_stars || 0
                })))
            } else {
                setRankings(FALLBACK_RANKINGS)
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Error loading rankings:', error)
            setRankings(FALLBACK_RANKINGS)
            setIsLoading(false)
        }
    }

    const topThree = rankings.slice(0, 3)
    const restRankings = rankings.slice(3)

    if (isLoading) {
        return <div className="loading"><div className="spinner"></div></div>
    }

    return (
        <div className="ranking-page">
            {/* Header */}
            <header className="ranking-header">
                <button className="back-btn" onClick={() => navigate('/student/home')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1>Weekly Ranking</h1>
                <div className="header-spacer"></div>
            </header>

            {/* Podium */}
            <section className="podium-section">
                <div className="podium">
                    {/* 2nd Place */}
                    {topThree[1] && (
                        <div className="podium-item second">
                            <div className="podium-avatar">
                                <span className="crown">🥈</span>
                                <div className="avatar-circle">{topThree[1].avatar}</div>
                            </div>
                            <p className="podium-name">{topThree[1].name}</p>
                            <p className="podium-stars">⭐ {topThree[1].stars}</p>
                            <div className="podium-bar second-bar">2</div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {topThree[0] && (
                        <div className="podium-item first">
                            <div className="podium-avatar">
                                <span className="crown">👑</span>
                                <div className="avatar-circle winner">{topThree[0].avatar}</div>
                            </div>
                            <p className="podium-name">{topThree[0].name}</p>
                            <p className="podium-stars">⭐ {topThree[0].stars}</p>
                            <div className="podium-bar first-bar">1</div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                        <div className="podium-item third">
                            <div className="podium-avatar">
                                <span className="crown">🥉</span>
                                <div className="avatar-circle">{topThree[2].avatar}</div>
                            </div>
                            <p className="podium-name">{topThree[2].name}</p>
                            <p className="podium-stars">⭐ {topThree[2].stars}</p>
                            <div className="podium-bar third-bar">3</div>
                        </div>
                    )}
                </div>
            </section>

            {/* Rankings List */}
            <section className="rankings-list">
                {restRankings.map(student => (
                    <div
                        key={student.id}
                        className={`ranking-card ${currentStudent?.id === student.id ? 'current-user' : ''}`}
                    >
                        <span className="rank-number">{student.rank}</span>
                        <div className="rank-avatar">{student.avatar}</div>
                        <span className="rank-name">{student.name}</span>
                        <span className="rank-stars">⭐ {student.stars}</span>
                    </div>
                ))}
            </section>

            {/* Current User Card (if not in top rankings) */}
            {currentStudent && !rankings.find(r => r.id === currentStudent.id) && (
                <div className="current-user-card">
                    <div className="user-info">
                        <span className="user-rank">#{currentStudent.rank || '?'}</span>
                        <div className="user-avatar">👤</div>
                        <span className="user-name">{currentStudent.name} (You)</span>
                    </div>
                    <span className="user-stars">⭐ {currentStudent.total_stars || 0}</span>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <Link to="/student/home" className="nav-item">
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                    <span>HOME</span>
                </Link>
                <Link to="/student/games" className="nav-item">
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
                    </svg>
                    <span>GAMES</span>
                </Link>
                <div className="nav-fab-container">
                    <Link to="/student/games" className="nav-fab">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                    </Link>
                </div>
                <Link to="/student/videos" className="nav-item">
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z" />
                    </svg>
                    <span>VIDEOS</span>
                </Link>
                <Link to="/student/rankings" className="nav-item active">
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z" />
                    </svg>
                    <span>RANKING</span>
                </Link>
            </nav>
        </div>
    )
}
