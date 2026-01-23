import { useEffect, useState } from 'react'
import { adminRepository } from '../data/adminRepository'
import './Dashboard.css'

const CHART_PATH = "M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"

const FALLBACK_ACTIVITY = [
    { id: 1, type: 'score', student: 'Alex', detail: "In 'Animals' Vocabulary Game", score: 980, time: '2m ago', icon: 'emoji_events', color: 'blue' },
    { id: 2, type: 'register', student: 'Minh', detail: 'New student joining Class 3A', time: '15m ago', icon: 'person_add', color: 'green' },
    { id: 3, type: 'update', student: 'Library', detail: "20 new words added to 'Kitchen' set", time: '1h ago', icon: 'library_books', color: 'orange' },
]

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 1240,
        activeGames: 12,
        avgScore: 85,
        engagement: 450,
    })
    const [activities, setActivities] = useState(FALLBACK_ACTIVITY)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            const result = await adminRepository.getDashboardStats();
            if (result.success) {
                setStats(prev => ({
                    ...prev,
                    totalStudents: result.data.totalStudents || 1240,
                    activeGames: result.data.activeGames || 12,
                }));
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Error loading dashboard:', error)
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="dashboard-content">
            {/* Page Header */}
            <header className="page-header">
                <div className="header-content">
                    <h1>Dashboard</h1>
                    <p>Welcome back, Miss Phượng. Here's what's happening today.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-icon">
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                    <button className="btn-icon">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <button className="btn-primary">
                        <span className="material-symbols-outlined">download</span>
                        Export Report
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Total Students</span>
                        <span className="material-symbols-outlined stat-icon">school</span>
                    </div>
                    <div className="stat-value-wrapper">
                        <span className="stat-number">{stats.totalStudents.toLocaleString()}</span>
                        <span className="stat-badge">+5%</span>
                    </div>
                    <div className="stat-trend trend-up">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>Active this month</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Active Games</span>
                        <span className="material-symbols-outlined stat-icon">sports_esports</span>
                    </div>
                    <div className="stat-value-wrapper">
                        <span className="stat-number">{stats.activeGames}</span>
                        <span className="stat-badge">Live</span>
                    </div>
                    <div className="stat-trend trend-up">
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        <span>Running smoothly</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Avg. Score</span>
                        <span className="material-symbols-outlined stat-icon">analytics</span>
                    </div>
                    <div className="stat-value-wrapper">
                        <span className="stat-number">{stats.avgScore}%</span>
                        <span className="stat-badge">+2.1%</span>
                    </div>
                    <div className="stat-trend trend-up">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>Better than last week</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Engagement</span>
                        <span className="material-symbols-outlined stat-icon">group</span>
                    </div>
                    <div className="stat-value-wrapper">
                        <span className="stat-number">{stats.engagement}</span>
                        <span className="stat-badge">+12%</span>
                    </div>
                    <div className="stat-trend trend-up">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>High activity</span>
                    </div>
                </div>
            </section>

            {/* Charts & Activity */}
            <section className="chart-section">
                {/* Main Component: Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div className="chart-title">
                            <h3>Weekly Engagement</h3>
                            <p>Student activity across all modules</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-gray-800">450</span>
                            <span className="text-xs text-gray-500 block uppercase font-bold">Last 7 Days</span>
                        </div>
                    </div>
                    <div className="chart-area">
                        <svg className="w-full h-full" viewBox="0 0 472 150" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <path d={`${CHART_PATH}V150H0V109Z`} fill="url(#chartGradient)"></path>
                            <path d={CHART_PATH} fill="none" stroke="#0ea5e9" strokeLinecap="round" strokeWidth="3"></path>
                        </svg>
                    </div>
                    <div className="flex justify-between mt-8 px-2">
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                            <span key={day} className="text-xs font-bold text-gray-400">{day}</span>
                        ))}
                    </div>
                </div>

                {/* Side Component: Activity */}
                <div className="activity-card">
                    <div className="activity-header">
                        <h3>Recent Activity</h3>
                        <button className="view-all">View all</button>
                    </div>
                    <div className="activity-list">
                        {activities.map(activity => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-icon-wrapper ${activity.color}`}>
                                    <span className="material-symbols-outlined">{activity.icon}</span>
                                </div>
                                <div className="activity-info">
                                    <p className="activity-text">
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
                </div>
            </section>
        </div>
    )
}
