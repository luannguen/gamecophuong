import { useNavigate } from 'react-router-dom'
import { useStudentList } from '../hooks/useStudentList'
import './Students.css'

export default function AdminStudents() {
    const navigate = useNavigate()
    const {
        students,
        classes,
        searchQuery,
        setSearchQuery,
        selectedClassId,
        setSelectedClassId,
        isLoading,
        handleDelete,
    } = useStudentList()

    const onDeleteClick = async (studentId) => {
        if (!window.confirm('Bạn có chắc muốn xóa học sinh này?')) return
        const success = await handleDelete(studentId)
        if (success) {
            // Toast or notification could be added here
        }
    }

    if (isLoading) {
        return <div className="loading"><div className="spinner"></div></div>
    }

    return (
        <div className="admin-students-page">
            <h1 style={{ display: 'none' }}>Students Management</h1> {/* Hidden h1 for SEO/Access */}

            {/* Search & Filter */}
            <div className="search-filter-section">
                <div className="search-box">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-dropdown-container">
                    <select
                        className="class-filter-select"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        <option value="all">All Classes</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Section Header */}
            <div className="section-header">
                <h3>Student Directory ({students.length})</h3>
                <button className="sort-btn">
                    <span className="material-symbols-outlined">sort</span>
                </button>
            </div>

            {/* Student Cards */}
            <div className="students-list">
                {students.length === 0 ? (
                    <div className="empty-state">No students found using these filters.</div>
                ) : (
                    students.map(student => (
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
                                    onClick={() => onDeleteClick(student.id)}
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
