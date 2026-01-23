import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserRole, USER_ROLES } from '../../../hooks/useUserRole';
import { supabase } from '../../../data/supabaseClient';

export const TeacherDashboardPage = () => {
    const { profile, logout } = useUserRole();
    const [stats, setStats] = useState({ studentCount: 0, classCount: 0 });
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Get teacher's classes
            const { data: classes } = await supabase
                .from('classes')
                .select('id, name')
                .eq('is_active', true);

            // Get students in those classes
            if (classes && classes.length > 0) {
                const classIds = classes.map(c => c.id);
                const { data: studentsData } = await supabase
                    .from('students')
                    .select('id, display_name, avatar_url, total_score, total_stars')
                    .in('class_id', classIds)
                    .eq('is_active', true)
                    .limit(5);

                setStudents(studentsData || []);

                // Count total
                const { count } = await supabase
                    .from('students')
                    .select('id', { count: 'exact', head: true })
                    .in('class_id', classIds)
                    .eq('is_active', true);

                setStats({
                    studentCount: count || 0,
                    classCount: classes.length
                });
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-space">
            {/* Welcome Section */}
            <div className="welcome-banner">
                <h1>
                    Welcome, {profile?.full_name || 'Teacher'}! 👩‍🏫
                </h1>
                <p>
                    Manage your classes and track student progress.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👨‍🎓</div>
                    <p className="stat-value">{stats.studentCount}</p>
                    <p className="stat-label">Students</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <p className="stat-value">{stats.classCount}</p>
                    <p className="stat-label">Classes</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🎮</div>
                    <p className="stat-value">12</p>
                    <p className="stat-label">Active Games</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <p className="stat-value">85%</p>
                    <p className="stat-label">Avg. Score</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-grid">
                <Link
                    to="/teacher/students"
                    className="action-card teal"
                >
                    <div className="stat-icon mb-3">👨‍🎓</div>
                    <h2>My Students</h2>
                    <p>View and manage class students</p>
                </Link>

                <Link
                    to="/student/games"
                    className="action-card green"
                >
                    <div className="stat-icon mb-3">🎮</div>
                    <h2>Play Games</h2>
                    <p>Try the learning games</p>
                </Link>

                <div className="action-card" style={{ borderLeftColor: '#d1d5db' }}>
                    <div className="stat-icon mb-3">📊</div>
                    <h2>Reports</h2>
                    <p>Coming soon...</p>
                </div>
            </div>

            {/* Recent Students */}
            {students.length > 0 && (
                <div className="recent-section">
                    <div className="section-header">
                        <h2>Recent Students</h2>
                        <Link to="/teacher/students" className="view-all">
                            View all →
                        </Link>
                    </div>
                    <div className="student-list">
                        {students.map(student => (
                            <div key={student.id} className="student-item">
                                <div className="student-info">
                                    <div className="student-avatar">
                                        {student.display_name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 500, color: '#1f2937' }}>{student.display_name}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>⭐ {student.total_stars || 0} stars</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p style={{ fontWeight: 600, color: '#0d9488' }}>{student.total_score || 0}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>points</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboardPage;
