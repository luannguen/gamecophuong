import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabaseClient'
import { IMAGES } from '../data/designAssets'
import './AdminDashboard.css'

// Chart data points for the SVG path
const CHART_PATH = "M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"

// Fallback activity data
const FALLBACK_ACTIVITY = [
    { id: 1, type: 'score', student: 'Alex', detail: "In 'Animals' Vocabulary Game", score: 980, time: '2m ago', icon: 'emoji_events', color: 'blue' },
    { id: 2, type: 'register', student: 'Minh', detail: 'New student joining Class 3A', time: '15m ago', icon: 'person_add', color: 'green' },
    { id: 3, type: 'update', student: 'Library', detail: "20 new words added to 'Kitchen' set", time: '1h ago', icon: 'library_books', color: 'orange' },
]

export default function AdminDashboard() {
    const [admin, setAdmin] = useState(null)
    const [stats, setStats] = useState({
        totalStudents: 1240,
        activeGames: 12,
        avgScore: 85,
        engagement: 450,
    })
    const [activities, setActivities] = useState(FALLBACK_ACTIVITY)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const adminData = localStorage.getItem('current_admin')
        if (!adminData) {
            navigate('/admin/login')
            return
        }
        setAdmin(JSON.parse(adminData))
        loadDashboardData()
    }, [navigate])

    const loadDashboardData = async () => {
        try {
            // Load students count
            const { count: studentsCount } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true)

            // Load games count
            const { count: gamesCount } = await supabase
                .from('mini_games')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true)

            // Load average score
            const { data: scoresData } = await supabase
                .from('scores')
                .select('score')
                .limit(100)

            const avgScore = scoresData?.length
                ? Math.round(scoresData.reduce((acc, s) => acc + s.score, 0) / scoresData.length)
                : 85

            setStats({
                totalStudents: studentsCount || 1240,
                activeGames: gamesCount || 12,
                avgScore: avgScore,
                engagement: 450,
            })
            setIsLoading(false)
        } catch (error) {
            console.error('Error loading dashboard:', error)
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('current_admin')
        supabase.auth.signOut()
        navigate('/admin/login')
    }

    if (isLoading) {
        return <div className="loading"><div className="spinner"></div></div>
    }

    return (
        <div className="admin-page">
            {/* Top App Bar */}
            <header className="admin-header">
                <div className="header-left">
                    <div className="avatar-container">
                        <div
                            className="header-avatar"
                            style={{ backgroundImage: `url(${IMAGES.missPhuong})` }}
                        ></div>
                    </div>
                    <div className="header-info">
                        <h2>Dashboard</h2>
                        <p className="header-subtitle">Admin Panel</p>
                    </div>
                </div>
                <button className="notification-btn">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="notification-dot"></span>
                </button>
            </header>

            <main className="admin-main">
                {/* Welcome Section */}
                <section className="welcome-section">
                    <h1>Welcome, Miss Phượng</h1>
                    <p>Here's what's happening today.</p>
                </section>

                {/* Stats Grid */}
                <section className="stats-grid">
                    <div className="stat-card">
                        <p className="stat-label">TOTAL STUDENTS</p>
                        <div className="stat-value">
                            <span className="stat-number">{stats.totalStudents.toLocaleString()}</span>
                            <span className="stat-change positive">+5%</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">ACTIVE GAMES</p>
                        <div className="stat-value">
                            <span className="stat-number">{stats.activeGames}</span>
                            <span className="stat-badge">LIVE</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">AVG. SCORE</p>
                        <div className="stat-value">
                            <span className="stat-number">{stats.avgScore}%</span>
                            <span className="stat-change positive">+2.1%</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">ENGAGEMENT</p>
                        <div className="stat-value">
                            <span className="stat-number">{stats.engagement}</span>
                            <span className="stat-change positive">+12%</span>
                        </div>
                    </div>
                </section>

                {/* Weekly Engagement Chart */}
                <section className="chart-section">
                    <div className="chart-card">
                        <div className="chart-header">
                            <div>
                                <h3>Weekly Engagement</h3>
                                <p className="chart-subtitle">Student activity across all modules</p>
                            </div>
                            <div className="chart-stat">
                                <span className="chart-number">450</span>
                                <span className="chart-label">LAST 7 DAYS</span>
                            </div>
                        </div>
                        <div className="chart-container">
                            <svg className="chart-svg" viewBox="0 0 472 150" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#1a545b" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#1a545b" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d={`${CHART_PATH}V150H0V109Z`} fill="url(#chartGradient)"></path>
                                <path d={CHART_PATH} fill="none" stroke="#1a545b" strokeLinecap="round" strokeWidth="3"></path>
                            </svg>
                        </div>
                        <div className="chart-days">
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                                <span key={day}>{day}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="activity-section">
                    <div className="section-header">
                        <h3>Recent Activity</h3>
                        <button className="view-all-btn">View all</button>
                    </div>
                    <div className="activity-list">
                        {activities.map(activity => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-icon ${activity.color}`}>
                                    <span className="material-symbols-outlined">{activity.icon}</span>
                                </div>
                                <div className="activity-content">
                                    <p className="activity-title">
                                        {activity.type === 'score' ? `${activity.student} scored ${activity.score}` :
                                            activity.type === 'register' ? `${activity.student} Registered` :
                                                `${activity.student} Updated`}
                                    </p>
                                    <p className="activity-detail">{activity.detail}</p>
                                </div>
                                <span className="activity-time">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Bottom Navigation */}
            <nav className="admin-nav">
                <Link to="/admin/dashboard" className="nav-item active">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span>Dashboard</span>
                </Link>
                <Link to="/admin/students" className="nav-item">
                    <span className="material-symbols-outlined">group</span>
                    <span>Students</span>
                </Link>
                <Link to="/admin/games" className="nav-item">
                    <span className="material-symbols-outlined">sports_esports</span>
                    <span>Games</span>
                </Link>
                <Link to="/admin/vocabulary" className="nav-item">
                    <span className="material-symbols-outlined">menu_book</span>
                    <span>Vocab</span>
                </Link>
                <Link to="/admin/settings" className="nav-item" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    <span className="material-symbols-outlined">settings</span>
                    <span>Settings</span>
                </Link>
            </nav>

            {/* Floating Action Button */}
            <button className="admin-fab">
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    )
}
