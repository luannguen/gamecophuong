import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../../../data/supabaseClient'
import './Ranking.css'

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

    // Helper to render avatar (Image or Emoji)
    const renderAvatar = (avatarUrl) => {
        if (!avatarUrl) return '👤';
        // Check if it's a URL (simple check)
        if (avatarUrl.includes('/') || avatarUrl.includes('http')) {
            return <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />;
        }
        return <span className="text-2xl">{avatarUrl}</span>;
    }

    if (isLoading) {
        return <div className="loading"><div className="spinner"></div></div>
    }

    return (
        <div className="ranking-page bg-slate-50 min-h-full p-6">
            {/* Header */}
            <header className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-black text-slate-800">Weekly Ranking</h1>
            </header>

            {/* Podium */}
            <section className="podium-section mb-12">
                <div className="podium flex items-end justify-center gap-4 h-64">
                    {/* 2nd Place */}
                    {topThree[1] && (
                        <div className="podium-item second flex flex-col items-center">
                            <div className="relative mb-2">
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">🥈</span>
                                <div className="size-16 rounded-full border-4 border-slate-300 overflow-hidden bg-white shadow-md">
                                    {renderAvatar(topThree[1].avatar)}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-end w-24 h-32 bg-slate-300 rounded-t-xl p-2 shadow-inner">
                                <p className="font-bold text-slate-700 text-sm truncate w-full text-center">{topThree[1].name}</p>
                                <p className="text-xs font-bold text-slate-600 mb-1">⭐ {topThree[1].stars}</p>
                                <span className="text-3xl font-black text-white opacity-50">2</span>
                            </div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {topThree[0] && (
                        <div className="podium-item first flex flex-col items-center z-10">
                            <div className="relative mb-2">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</span>
                                <div className="size-24 rounded-full border-4 border-yellow-400 overflow-hidden bg-white shadow-lg ring-4 ring-yellow-400/30">
                                    {renderAvatar(topThree[0].avatar)}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-end w-28 h-40 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-xl p-2 shadow-lg">
                                <p className="font-bold text-white text-base truncate w-full text-center">{topThree[0].name}</p>
                                <p className="text-sm font-bold text-yellow-50 mb-1">⭐ {topThree[0].stars}</p>
                                <span className="text-4xl font-black text-white opacity-50">1</span>
                            </div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                        <div className="podium-item third flex flex-col items-center">
                            <div className="relative mb-2">
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">🥉</span>
                                <div className="size-16 rounded-full border-4 border-orange-300 overflow-hidden bg-white shadow-md">
                                    {renderAvatar(topThree[2].avatar)}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-end w-24 h-24 bg-orange-300 rounded-t-xl p-2 shadow-inner">
                                <p className="font-bold text-orange-900 text-sm truncate w-full text-center">{topThree[2].name}</p>
                                <p className="text-xs font-bold text-orange-800 mb-1">⭐ {topThree[2].stars}</p>
                                <span className="text-3xl font-black text-white opacity-50">3</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Rankings List */}
            <section className="rankings-list space-y-3 max-w-2xl mx-auto pb-20">
                {restRankings.map(student => (
                    <div
                        key={student.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow ${currentStudent?.id === student.id ? 'ring-2 ring-teal-500 bg-teal-50' : ''
                            }`}
                    >
                        <span className="font-black text-slate-400 w-8 text-center text-lg">{student.rank}</span>
                        <div className="size-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            {renderAvatar(student.avatar)}
                        </div>
                        <span className="font-bold text-slate-700 flex-1">{student.name}</span>
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                            <span className="text-yellow-500 text-xs">⭐</span>
                            <span className="font-bold text-yellow-700 text-sm">{student.stars}</span>
                        </div>
                    </div>
                ))}
            </section>
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
