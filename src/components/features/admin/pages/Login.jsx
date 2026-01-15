import { useState, useEffect } from 'react'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { IMAGES } from '../../../../data/designAssets'
import './Login.css'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    // Use the custom hook
    const { login, isLoading, admin } = useAdminAuth();

    // If already logged in, the hook (or useEffect here) might redirect, 
    // but the hook is designed more for protecting routes. 
    // We can check if admin exists and redirect if so, but usually login page stays until explicit action.
    // However, for better UX, if already logged in, go to dashboard.
    // Note: navigate is used inside hook usually or here. 
    // The hook I wrote previously does navigate on success.

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu')
            return
        }

        setError(null)

        // Pass to hook
        const result = await login(email, password);

        if (!result.success) {
            setError(result.error || 'Email hoặc mật khẩu không đúng')
        }
        // Success redirection is handled in the hook's login function
    }

    // For demo purposes - quick login
    const handleDemoLogin = async () => {
        // We can reuse login from hook if we want, or creating a specific demo method in hook/repo.
        // For now, let's just mock the login via the hook if possible, or manually set it.
        // To stay clean, let's treat it as a "special" login or just standard login with demo credentials if checking backend.
        // Since the previous code just set localStorage:

        // Let's assume we use the hook to "set" the session for modularity, 
        // but since hook logic is tied to repo, maybe just calling login with 'demo' credentials 
        // that the repo accepts would be better? 
        // For now, I'll manually trigger a "success" state via a new method in hook if needed, 
        // or just emulate it here by using the hook's logic.
        // Actually, let's just stick to the pattern:
        // The hook should probably expose a way to 'hydrate' or 'set' user if we do forced login.
        // BUT, for now, let's just use the same `login` function but with a hardcoded demo flag or similar if needed.
        // Simpler: Just call login with specific demo creds if the repo supports it, 
        // OR update repo to support demo. The repo I wrote mocks login anyway.

        const result = await login('demo', 'demo');
        if (!result.success) {
            setError('Demo login failed');
        }
    }

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-card">
                    {/* Header */}
                    <div className="admin-login-header">
                        <div className="admin-logo">👩‍🏫</div>
                        <h1>Admin Portal</h1>
                        <p>Miss Phương's Learning App</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="admin-login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="text"
                                placeholder="admin@missphuong.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="admin-login-btn" disabled={isLoading}>
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    {/* Demo Login */}
                    <div className="demo-section">
                        <p>For testing:</p>
                        <button onClick={handleDemoLogin} className="demo-btn" disabled={isLoading}>
                            Demo Login (No Auth) →
                        </button>
                    </div>

                    {/* Back Link */}
                    <div className="back-link">
                        <a href="/student/login">← Back to Student Login</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
