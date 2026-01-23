import React from 'react';
import '../admin.css';

const AdminClassesPage = () => {
    return (
        <div className="admin-page-container">
            <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', marginBottom: '32px' }}>
                <h1>Class Management 🏫</h1>
                <p>Organize students into classes</p>
            </div>

            <div className="card-placeholder" style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1' }}>engineering</span>
                <h3 style={{ marginTop: '16px', color: '#64748b' }}>Feature Under Development</h3>
                <p style={{ color: '#94a3b8' }}>Class management interface is coming soon.</p>
            </div>
        </div>
    );
};

export default AdminClassesPage;
