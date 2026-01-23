import React from 'react';
import './teacher.css';

const ParentsPage = () => {
    return (
        <div className="teacher-container">
            <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #db2777, #ec4899)', marginBottom: '32px' }}>
                <h1>Parent Communication 👪</h1>
                <p>Chat with parents and share reports</p>
            </div>

            <div className="card-placeholder" style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1' }}>forum</span>
                <h3 style={{ marginTop: '16px', color: '#64748b' }}>Messaging Coming Soon</h3>
                <p style={{ color: '#94a3b8' }}>You will be able to send notices to parents here.</p>
            </div>
        </div>
    );
};

export default ParentsPage;
