import React from 'react';
import '../admin.css';

const AdminParentsPage = () => {
    return (
        <div className="admin-page-container">
            <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #db2777, #ec4899)', marginBottom: '32px' }}>
                <h1>Parent Management 👪</h1>
                <p>Connect with student families</p>
            </div>

            <div className="card-placeholder" style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1' }}>family_restroom</span>
                <h3 style={{ marginTop: '16px', color: '#64748b' }}>Feature Under Development</h3>
                <p style={{ color: '#94a3b8' }}>Parent management interface is coming soon.</p>
            </div>
        </div>
    );
};

export default AdminParentsPage;
