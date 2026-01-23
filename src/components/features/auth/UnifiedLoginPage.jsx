import { useState, useEffect } from 'react'
import { IMAGES } from '../../../data/designAssets'
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth'
import './UnifiedLoginPage.css'

export default function UnifiedLoginPage() {
    // Mode: 'quick' | 'pin' | 'admin'
    const [loginMode, setLoginMode] = useState('quick')
    const [error, setError] = useState(null)

    // Student Form State
    const [name, setName] = useState('')
    const [studentClass, setStudentClass] = useState('')
    const [pin, setPin] = useState('')

    // Admin/Teacher Form State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { loginWithPin, quickLogin, loginWithEmail, demoLogin, isLoading } = useUnifiedAuth()

    // Clear error when mode changes
    useEffect(() => {
        setError(null)
    }, [loginMode])

    const handleQuickLogin = async (e) => {
        e.preventDefault()
        if (!name.trim()) {
            setError('Vui lòng nhập tên của bạn')
            return
        }
        setError(null)
        const result = await quickLogin(name.trim(), studentClass)
        if (!result.success) setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    }

    const handlePinLogin = async (e) => {
        e.preventDefault()
        if (pin.length !== 4) {
            setError('Vui lòng nhập đầy đủ 4 số PIN')
            return
        }
        setError(null)
        const result = await loginWithPin(pin)
        if (!result.success) {
            setError(result.error || 'Mã PIN không đúng')
            setPin('')
        }
    }

    const handleAdminLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu')
            return
        }
        setError(null)
        const result = await loginWithEmail(email, password)
        if (!result.success) {
            setError(result.error)
        }
    }

    const handleDemoLogin = async () => {
        setError(null);
        await demoLogin('admin');
    }

    const toggleAdminMode = () => {
        if (loginMode === 'admin') {
            setLoginMode('quick')
        } else {
            setLoginMode('admin')
        }
    }

    const isStudentMode = loginMode === 'quick' || loginMode === 'pin';

    return (
        <div className="unified-login-page">
            {/* Background Gradient Effect */}
            <div className="bg-gradient-effect"></div>

            {/* Decorative Circles */}
            <div className="deco-circle deco-1"></div>
            <div className="deco-circle deco-2"></div>
            <div className="deco-circle deco-3"></div>

            {/* Back button (only if history exists, but here acts as reset or exit) 
                For now we keep it to match design, maybe to go back to home if landing exists 
            */}
            {/* <button className="back-btn" onClick={() => window.history.back()}>
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button> */}

            <div className="login-container">
                {/* Logo & Branding */}
                <div className="brand-section">
                    <div className="logo-container">
                        <div
                            className="logo-mascot"
                            style={{ backgroundImage: `url(${IMAGES.mascotKoala})` }}
                        ></div>
                        <div className="logo-ring"></div>
                    </div>
                    <h1 className="brand-title">English Fun with AI</h1>
                    <p className="brand-subtitle">Learn English with Miss Phượng</p>
                </div>

                {/* Mascot Speech Bubble - Changed text based on mode */}
                <div className="mascot-speech">
                    <div className="speech-avatar">
                        <div
                            className="avatar-image"
                            style={{ backgroundImage: `url(${IMAGES.missPhuong})` }}
                        ></div>
                    </div>
                    <div className="speech-content">
                        <p className="speech-greeting">Hi there! 👋</p>
                        <p className="speech-message">
                            {loginMode === 'admin'
                                ? "This area is for Teachers and Parents only."
                                : "I'm Miss Phượng's helper. Let's get you ready for the game!"}
                        </p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="login-card toy-shadow">

                    {/* TABS - Only visible in student modes */}
                    {isStudentMode && (
                        <div className="login-tabs">
                            <button
                                className={`tab ${loginMode === 'quick' ? 'active' : ''}`}
                                onClick={() => setLoginMode('quick')}
                            >
                                <span className="material-symbols-outlined">bolt</span>
                                Quick Start
                            </button>
                            <button
                                className={`tab ${loginMode === 'pin' ? 'active' : ''}`}
                                onClick={() => setLoginMode('pin')}
                            >
                                <span className="material-symbols-outlined">lock</span>
                                PIN Login
                            </button>
                        </div>
                    )}

                    {/* Admin Title - Only visible in admin mode */}
                    {!isStudentMode && (
                        <h3 className="form-title" style={{ marginBottom: '24px' }}>
                            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>admin_panel_settings</span>
                            Admin Access
                        </h3>
                    )}

                    {/* QUICK LOGIN FORM */}
                    {loginMode === 'quick' && (
                        <form onSubmit={handleQuickLogin} className="login-form">
                            <h3 className="form-title">What's your name?</h3>

                            <div className="input-group">
                                <label>
                                    <span className="material-symbols-outlined">person</span>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <span className="material-symbols-outlined">school</span>
                                    Your Class
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 4A"
                                    value={studentClass}
                                    onChange={(e) => setStudentClass(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {error && <div className="error-message">
                                <span className="material-symbols-outlined">error</span>
                                {error}
                            </div>}

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? <span className="spinner"></span> : (
                                    <>
                                        <span className="material-symbols-outlined">rocket_launch</span>
                                        Start Playing!
                                    </>
                                )}
                            </button>

                            <p className="login-hint">
                                <span className="material-symbols-outlined">info</span>
                                No password needed. Just have fun!
                            </p>
                        </form>
                    )}

                    {/* PIN LOGIN FORM */}
                    {loginMode === 'pin' && (
                        <form onSubmit={handlePinLogin} className="login-form">
                            <h3 className="form-title">Enter your secret PIN</h3>

                            <div className="input-group">
                                <label>
                                    <span className="material-symbols-outlined">pin</span>
                                    4-Digit PIN
                                </label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={4}
                                    placeholder="• • • •"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                    disabled={isLoading}
                                    autoFocus
                                    className="pin-input"
                                />
                            </div>

                            {error && <div className="error-message">
                                <span className="material-symbols-outlined">error</span>
                                {error}
                            </div>}

                            <button type="submit" className="submit-btn" disabled={isLoading || pin.length !== 4}>
                                {isLoading ? <span className="spinner"></span> : (
                                    <>
                                        <span className="material-symbols-outlined">stars</span>
                                        Jump In!
                                    </>
                                )}
                            </button>

                            <p className="login-hint">
                                <span className="material-symbols-outlined">help</span>
                                Forgot PIN? Ask your teacher!
                            </p>
                        </form>
                    )}

                    {/* ADMIN LOGIN FORM */}
                    {loginMode === 'admin' && (
                        <form onSubmit={handleAdminLogin} className="login-form">
                            <div className="input-group">
                                <label>
                                    <span className="material-symbols-outlined">mail</span>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="admin@school.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <span className="material-symbols-outlined">lock</span>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {error && <div className="error-message">
                                <span className="material-symbols-outlined">error</span>
                                {error}
                            </div>}

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? <span className="spinner"></span> : (
                                    <>
                                        <span className="material-symbols-outlined">login</span>
                                        Login
                                    </>
                                )}
                            </button>

                            {/* Demo Login for Admin because user had database error */}
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={handleDemoLogin}
                                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px' }}
                                >
                                    (Dev: Click here for Demo Login)
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer - Switch Mode */}
                <div className="login-footer">
                    <button onClick={toggleAdminMode} className="admin-link">
                        <span className="material-symbols-outlined">
                            {loginMode === 'admin' ? 'school' : 'admin_panel_settings'}
                        </span>
                        {loginMode === 'admin' ? 'Back to Student Login' : 'Admin Login'}
                    </button>
                    <p className="copyright">© 2024 Miss Phượng Learning App</p>
                </div>
            </div>
        </div>
    )
}
