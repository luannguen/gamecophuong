import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabaseClient'
import './AdminLogin.css'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                setError('Email hoặc mật khẩu không đúng')
                setIsLoading(false)
                return
            }

            // Check if user is admin (has admin role in metadata or is in admin table)
            const { data: adminData } = await supabase
                .from('admins')
                .select('*')
                .eq('user_id', data.user.id)
                .single()

            if (!adminData) {
                await supabase.auth.signOut()
                setError('Bạn không có quyền truy cập Admin')
                setIsLoading(false)
                return
            }

            // Store admin info
            localStorage.setItem('current_admin', JSON.stringify(adminData))
            navigate('/admin/dashboard')
        } catch (err) {
            console.error('Login error:', err)
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
            setIsLoading(false)
        }
    }

    // For demo purposes - quick login
    const handleDemoLogin = () => {
        localStorage.setItem('current_admin', JSON.stringify({
            id: 'demo',
            display_name: 'Miss Phương',
            email: 'admin@missphuong.com',
            role: 'teacher'
        }))
        navigate('/admin/dashboard')
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
                                type="email"
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
                        <button onClick={handleDemoLogin} className="demo-btn">
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
