import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabaseClient'
import './AdminStudents.css'

// Fallback students data
const FALLBACK_STUDENTS = [
    { id: 1, display_name: 'Nguyen An', class_name: '5A', total_stars: 2450, games_played: 142, is_active: true, avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6eYpxofCjixVGXFcDg3xYu7B9ewk6RR6OW3ZIeckjvaJDDdJSiPRvzj-vokd12l-nigzgYwpUt2KIzPvNxqCjWAb6rv3S_W5X0TqLSYe6Ogy2vLw_H4PaWV-bz4raQ74WKIPxATKymae-g2Ci6i8zE6QP2N_kz5e8eiyQTAxvHeLL2HuJCQ1pHSBPl0QE8Q_6zZY0yBHEZhu-kkuzDRJsLIXTy23HNmmQbGzq66loHBJWx1gCmz_Ca1GqAzL1sqis0tCcv3zs8D4' },
    { id: 2, display_name: 'Le Minh Thu', class_name: 'Eve-Eng', total_stars: 890, games_played: 24, is_active: false, avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsBcfFng3h5RZnNOdW8UOiSYnhRbXBnpZszSul67-RQrA7mf4vBO8vKpY7Gu1XN-8axPpRMEvqpbqcgO5a94tX60ACR6KuM7unY59oAmWLbdgTDKeNgiyZhcaaQTYLNjykMbl_WJQWWQzFtFyWwoHU0gNVb3Ll3q7aj_Bp6De_MeL01XKxDC338qmI_7086VUkICX9F0Czy8YprV-1pBJcd87678G2reLr6NL93fjQ8aBMTbPyVDais0QgNMzPHelYp8G0T4o3n6M' },
    { id: 3, display_name: 'Phan Quoc Bao', class_name: '5B', total_stars: 1820, games_played: 98, is_active: true, avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRQyF-sWRZheYxJiLxcL3nPc6QEHMcpbTJseVM8kSSP2Rb4cICGEdI5aS9uu2Y1s9Ma8GLtj0_8RY4O8lzy4QCKwlQK0JsV46tk-tg3YvftVvBFPGXsBOqWblfAH2VBroOUJAL6HNJDAmpatJioM6Hyl6C-1iTjZVzC8wr4DIts_qUGOuibdloIPCRF7uOq6rgegcGSx-mS7bhkb37XTGDaGQeEaveocYY_dIlDV5rFS9XKc3Jx8j8O3GH0TuFAU6D3gRo7S0sH6E' },
]

const CLASS_FILTERS = ['All Classes', 'Grade 5A', 'Grade 5B', 'Grade 4A', 'Evening English']

export default function AdminStudents() {
    const [students, setStudents] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState('All Classes')
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const adminData = localStorage.getItem('current_admin')
        if (!adminData) {
            navigate('/admin/login')
            return
        }
        loadStudents()
    }, [navigate])

    const loadStudents = async () => {
        try {
            const { data } = await supabase
                .from('students')
                .select('*')
                .order('display_name')

            setStudents(data?.length ? data : FALLBACK_STUDENTS)
            setIsLoading(false)
        } catch (error) {
            console.error('Error loading students:', error)
            setStudents(FALLBACK_STUDENTS)
            setIsLoading(false)
        }
    }

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = activeFilter === 'All Classes' ||
            student.class_name?.toLowerCase().includes(activeFilter.toLowerCase().replace('grade ', ''))
        return matchesSearch && matchesFilter
    })

    const handleDelete = async (studentId) => {
        if (!confirm('Bạn có chắc muốn xóa học sinh này?')) return
        try {
            await supabase.from('students').delete().eq('id', studentId)
            loadStudents()
        } catch (error) {
            console.error('Error deleting student:', error)
        }
    }

    if (isLoading) {
        return <div className="loading"><div className="spinner"></div></div>
    }

    return (
        <div className="admin-students-page">
            {/* Header */}
            <header className="students-header">
                <div className="header-left">
                    <div className="header-icon">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h1>Students</h1>
                </div>
                <button className="add-btn" onClick={() => setShowAddModal(true)}>
                    <span className="material-symbols-outlined">person_add</span>
                </button>
            </header>

            {/* Search & Filter */}
            <div className="search-filter-section">
                <div className="search-box">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-chips">
                    {CLASS_FILTERS.map(filter => (
                        <button
                            key={filter}
                            className={`chip ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                            {filter !== 'All Classes' && (
                                <span className="material-symbols-outlined">expand_more</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section Header */}
            <div className="section-header">
                <h3>Student Directory ({filteredStudents.length})</h3>
                <button className="sort-btn">
                    <span className="material-symbols-outlined">sort</span>
                </button>
            </div>

            {/* Student Cards */}
            <main className="students-list">
                {filteredStudents.map(student => (
                    <div key={student.id} className="student-card">
                        <div className="card-header">
                            <div className="student-info">
                                <div
                                    className="student-avatar"
                                    style={{ backgroundImage: `url(${student.avatar_url || ''})` }}
                                >
                                    {!student.avatar_url && '👤'}
                                </div>
                                <div className="student-details">
                                    <h4>{student.display_name}</h4>
                                    <p className="student-id">ID: MS-2024-{String(student.id).padStart(3, '0')}</p>
                                </div>
                            </div>
                            <span className={`status-badge ${student.is_active ? 'active' : 'inactive'}`}>
                                {student.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-label">CLASS</span>
                                <span className="stat-value">{student.class_name || 'N/A'}</span>
                            </div>
                            <div className="stat-item gold">
                                <span className="stat-label">POINTS</span>
                                <span className="stat-value">{(student.total_stars || 0).toLocaleString()}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">GAMES</span>
                                <span className="stat-value">{student.games_played || 0}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="card-actions">
                            <button className="action-btn stats">
                                <span className="material-symbols-outlined">bar_chart</span>
                                Stats
                            </button>
                            <button className="action-btn edit">
                                <span className="material-symbols-outlined">edit</span>
                                Edit
                            </button>
                            <button
                                className="action-btn delete"
                                onClick={() => handleDelete(student.id)}
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </main>

            {/* Bottom Navigation */}
            <nav className="admin-nav">
                <Link to="/admin/dashboard" className="nav-item">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span>Home</span>
                </Link>
                <Link to="/admin/students" className="nav-item active">
                    <span className="material-symbols-outlined">group</span>
                    <span>Students</span>
                </Link>
                <Link to="/admin/games" className="nav-item">
                    <span className="material-symbols-outlined">joystick</span>
                    <span>Games</span>
                </Link>
                <Link to="/admin/vocabulary" className="nav-item">
                    <span className="material-symbols-outlined">translate</span>
                    <span>Words</span>
                </Link>
                <Link to="/admin/dashboard" className="nav-item">
                    <span className="material-symbols-outlined">settings</span>
                    <span>Admin</span>
                </Link>
            </nav>
        </div>
    )
}
