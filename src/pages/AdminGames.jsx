import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabaseClient'
import { IMAGES } from '../data/designAssets'
import './AdminGames.css'

// Game modules with images from mockup
const GAME_MODULES = [
    { id: 1, name: 'Animals', skill: 'Listening', skillIcon: 'hearing', wordCount: 24, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP2B_YKvQjZpPdgqhYeb3JEpLdTiWl8MYqG7igxGJIocsDqVAfcfRF9XKRfoPY1xNQ88SiPh61XjCGjq1GA_Tt94TEXI6N0w_odP72ra9uCehJ-8qp9xDENRcAFP0uvYO9LxrMuEgCtRBnhOGtpY0jcJv51V8N6yLub703wAaMqEzraHmcyUt1U1v5rUuEQxa0Y5M-w9IQcGuX8eMK5FedfAxK7fkff8SO9FxyaqT3Mz1oAQ6jaroZKkMTCG54qDdRWC361aUzQDU' },
    { id: 2, name: 'Family', skill: 'Speaking', skillIcon: 'record_voice_over', wordCount: 15, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlDxR7C3_vLQN95kUCHrufcJeu7orvvTEscElUJzFX-j3hxAvDxPl8D1n_nkQ1qxKEERZMKdWTuxKMqF0xWNjbNQ14kTRlWB7NNKYhtRuBfamYmgbahUzdAdRP2UMeLqGFf5KwegkmksmrlhRVzDzwH04UQ7lN8pm_B1oSMC_PqJaxtzHX1mdwVGtU8tIS-CNP-9vzuInWl5XFP7DG_SOUi2Hcqlcrk0Mo_hlVlgi6Zrg69nRrvGJEVyAVuQ0Lkbc47k6LUFko35w' },
    { id: 3, name: 'Fruits', skill: 'Reading', skillIcon: 'auto_stories', wordCount: 12, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx6-N2rAXSrwFq-26Y55lmm2tMKnfML6QL6SDUScpCMSUbHZheQhausPbtrNwtisiifpfQrCAPn9DFE52N8oNQvmPzd45JapdGqY2YUtdkkPuZJ6-sgreHoWdNN-bZCDXju8ayZl3-Ynw7Pkuc_Jg6hz0KzsStusaq8eu56A_YBE42ZYvz4QFJdImdNPPJTgWBn8FXgtYYCp2A0QYcRLCqsffisEosd-rw6d9yiXfhv7WBI7sbNsJTqjs6rQxIFqNH65b5a3kMqF4' },
    { id: 4, name: 'School', skill: 'General', skillIcon: 'star', wordCount: 30, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs4UEenaAPcJeTtGieLaRAKUqXuA_ExjnAmGOna36XFwyMBEztsyvTdVlXTO4P2DJ0BByyqDk5ppEqIbMjOfOsYu2VaOdbmxNjOeCxPgBUTiyRRt-H1j1bvEswgXZnKQZCR1iaFubCOOWFquHD0y9YQz6DOOc7uT_6WttcLd_Z5IcLkVyTSeAHOe2mkcHDDBGbuZ7AovO48iUaEKCX6MZj6YxmJOzogNpmn9ACg5AYmUK6CmYyynv5kWjMsgROXVRILvOP8WL7q4U' },
]

const QUICK_ACTIONS = [
    { id: 1, title: 'Edit Game Flow', desc: 'Adjust difficulty & rewards', icon: 'account_tree' },
    { id: 2, title: 'Engagement Reports', desc: 'See which games are popular', icon: 'analytics' },
]

export default function AdminGames() {
    const [modules, setModules] = useState(GAME_MODULES)
    const [stats, setStats] = useState({ totalGames: 12, activeVocab: 142 })
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const adminData = localStorage.getItem('current_admin')
        if (!adminData) {
            navigate('/admin/login')
            return
        }
        loadGames()
    }, [navigate])

    const loadGames = async () => {
        try {
            const { data, count: gamesCount } = await supabase
                .from('mini_games')
                .select('*', { count: 'exact' })

            const { count: vocabCount } = await supabase
                .from('vocabulary')
                .select('*', { count: 'exact', head: true })

            if (data?.length) {
                setModules(data.map(g => ({
                    ...g,
                    skill: g.skill_focus || 'General',
                    skillIcon: 'star',
                    wordCount: 0,
                    image: g.thumbnail_url || GAME_MODULES[0].image
                })))
            }

            setStats({
                totalGames: gamesCount || 12,
                activeVocab: vocabCount || 142
            })
            setIsLoading(false)
        } catch (error) {
            console.error('Error loading games:', error)
            setIsLoading(false)
        }
    }

    const handleDelete = async (gameId) => {
        if (!confirm('Bạn có chắc muốn xóa game này?')) return
        try {
            await supabase.from('mini_games').delete().eq('id', gameId)
            loadGames()
        } catch (error) {
            console.error('Error deleting game:', error)
        }
    }

    if (isLoading) {
        return <div className="loading"><div className="spinner"></div></div>
    }

    return (
        <div className="admin-games-page">
            {/* Header */}
            <header className="games-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <h1>Game Management</h1>
                </div>
                <div className="header-right">
                    <button className="settings-btn">
                        <span className="material-symbols-outlined">settings_suggest</span>
                    </button>
                    <div
                        className="profile-avatar"
                        style={{ backgroundImage: `url(${IMAGES.missPhuong})` }}
                    ></div>
                </div>
            </header>

            <main className="games-main">
                {/* Stats Cards */}
                <section className="stats-row">
                    <div className="stat-card">
                        <p className="stat-label">TOTAL GAMES</p>
                        <p className="stat-number">{stats.totalGames}</p>
                    </div>
                    <div className="stat-card primary">
                        <p className="stat-label">ACTIVE VOCAB</p>
                        <p className="stat-number">{stats.activeVocab}</p>
                    </div>
                </section>

                {/* Section Header */}
                <div className="section-header">
                    <h2>Current Modules</h2>
                    <button className="view-all-btn">
                        View All <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>

                {/* Game Modules Grid */}
                <section className="modules-grid">
                    {modules.map(module => (
                        <div key={module.id} className="module-card">
                            <div
                                className="module-image"
                                style={{ backgroundImage: `url(${module.image})` }}
                            >
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(module.id)}
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                            <div className="module-content">
                                <h3>{module.name}</h3>
                                <div className="module-meta">
                                    <div className="skill-tag">
                                        <span className="material-symbols-outlined">{module.skillIcon}</span>
                                        <span>Skill: {module.skill}</span>
                                    </div>
                                    <div className="word-count">
                                        <span className="material-symbols-outlined">menu_book</span>
                                        <span>{module.wordCount} Words</span>
                                    </div>
                                </div>
                            </div>
                            <div className="module-actions">
                                <button className="manage-btn">Manage</button>
                                <button className="settings-btn-small">
                                    <span className="material-symbols-outlined">settings</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Quick Actions */}
                <section className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="actions-list">
                        {QUICK_ACTIONS.map(action => (
                            <div key={action.id} className="action-item">
                                <div className="action-left">
                                    <div className="action-icon">
                                        <span className="material-symbols-outlined">{action.icon}</span>
                                    </div>
                                    <div className="action-text">
                                        <p className="action-title">{action.title}</p>
                                        <p className="action-desc">{action.desc}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined chevron">chevron_right</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Fixed Bottom Action */}
            <div className="bottom-action">
                <button className="create-btn">
                    <span className="material-symbols-outlined">add_circle</span>
                    Create New Game
                </button>
            </div>
        </div>
    )
}
