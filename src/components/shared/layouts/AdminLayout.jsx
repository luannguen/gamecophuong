import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../features/admin/hooks/useAdminAuth';
import '../../features/admin/admin.css'; // Uses new V2 styles

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { admin, isLoading, logout } = useAdminAuth();

    // Protect route provided by Auth Hook checks
    if (!admin && !isLoading) {
        // Redirection handled by useEffect in original code, simplified here
        return null;
    }

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    if (!admin) return null; // Or generic loading

    return (
        <div className="admin-layout-v2">
            {/* Sidebar V2 */}
            <aside className="sidebar-v2">
                <div className="sidebar-header-v2">
                    <div className="logo-box-v2">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h1 className="app-title-v2">EduManage</h1>
                </div>

                <nav className="nav-v2">
                    <div className="nav-label-v2">Management</div>
                    <Link to="/admin/dashboard" className={`nav-link-v2 ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/students" className={`nav-link-v2 ${isActive('/admin/students') ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">people</span>
                        <span>Students</span>
                    </Link>
                    <Link to="/admin/parents" className={`nav-link-v2 ${isActive('/admin/parents') ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">groups</span>
                        <span>Parents</span>
                    </Link>
                    <Link to="/admin/teachers" className={`nav-link-v2 ${isActive('/admin/teachers') ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">badge</span>
                        <span>Teachers</span>
                    </Link>
                    <Link to="/admin/classes" className={`nav-link-v2 ${isActive('/admin/classes') ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">class</span>
                        <span>Classes</span>
                    </Link>

                    <div className="nav-label-v2" style={{ marginTop: '16px' }}>Content</div>
                    <Link to="/admin/games" className={`nav-link-v2 ${isActive('/admin/games') ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">videogame_asset</span>
                        <span>Game Library</span>
                    </Link>
                    <Link to="/admin/vocabulary" className={`nav-link-v2 ${isActive('/admin/vocabulary') ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">menu_book</span>
                        <span>Vocabulary</span>
                    </Link>
                </nav>

                <div className="sidebar-footer-v2">
                    <div className="user-card-v2">
                        <div className="user-avatar-v2">
                            {/* Placeholder Avatar */}
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Administrator</p>
                            <p style={{ fontSize: '0.625rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span> Online
                            </p>
                        </div>
                        <button className="logout-btn-v2" onClick={logout} title="Sign Out">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>power_settings_new</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content V2 */}
            <main className="main-content-v2">
                <Outlet />
            </main>
        </div>
    );
}
