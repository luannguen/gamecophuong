import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../data/supabaseClient'
import { IMAGES } from '../data/designAssets'
import './StudentLogin.css'

export default function StudentLogin() {
    const [name, setName] = useState('')
    const [studentClass, setStudentClass] = useState('')
    const [pin, setPin] = useState('')
    const [loginMode, setLoginMode] = useState('quick') // 'quick' or 'pin'
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleQuickLogin = async (e) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('Vui lòng nhập tên của bạn')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Try to find student by name (case insensitive)
            const { data: students, error: queryError } = await supabase
                .from('students')
                .select('*')
                .ilike('display_name', name.trim())
                .eq('is_active', true)

            if (queryError) throw queryError

            if (!students || students.length === 0) {
                // Create new student if not exists (guest mode)
                const guestStudent = {
                    display_name: name.trim(),
                    student_class: studentClass || null,
                    total_score: 0,
                    total_stars: 0,
                }
                localStorage.setItem('current_student', JSON.stringify(guestStudent))
                localStorage.setItem('is_guest', 'true')
                navigate('/student/home')
                return
            }

            // Found existing student
            localStorage.setItem('current_student', JSON.stringify(students[0]))
            localStorage.removeItem('is_guest')
            navigate('/student/home')
        } catch (err) {
            console.error('Login error:', err)
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
            setIsLoading(false)
        }
    }

    const handlePinLogin = async (e) => {
        e.preventDefault()

        if (pin.length !== 4) {
            setError('Vui lòng nhập đầy đủ 4 số PIN')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const { data: student, error: queryError } = await supabase
                .from('students')
                .select('*')
                .eq('pin_code', pin)
                .eq('is_active', true)
                .single()

            if (queryError || !student) {
                setError('Mã PIN không đúng. Vui lòng thử lại.')
                setPin('')
                setIsLoading(false)
                return
            }

            localStorage.setItem('current_student', JSON.stringify(student))
            localStorage.removeItem('is_guest')
            navigate('/student/home')
        } catch (err) {
            console.error('Login error:', err)
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
            setIsLoading(false)
        }
    }

    return (
        <div className="login-page">
            {/* Background Gradient Effect */}
            <div className="bg-gradient-effect"></div>

            {/* Decorative Circles */}
            <div className="deco-circle deco-1"></div>
            <div className="deco-circle deco-2"></div>
            <div className="deco-circle deco-3"></div>

            {/* Back button */}
            <button className="back-btn" onClick={() => window.history.back()}>
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>

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

                {/* Mascot Speech Bubble */}
                <div className="mascot-speech">
                    <div className="speech-avatar">
                        <div
                            className="avatar-image"
                            style={{ backgroundImage: `url(${IMAGES.missPhuong})` }}
                        ></div>
                    </div>
                    <div className="speech-content">
                        <p className="speech-greeting">Hi there! 👋</p>
                        <p className="speech-message">I'm Miss Phượng's helper. Let's get you ready for the game!</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="login-card toy-shadow">
                    {/* Tab Toggle */}
                    <div className="login-tabs">
                        <button
                            className={`tab ${loginMode === 'quick' ? 'active' : ''}`}
                            onClick={() => { setLoginMode('quick'); setError(null) }}
                        >
                            <span className="material-symbols-outlined">bolt</span>
                            Quick Start
                        </button>
                        <button
                            className={`tab ${loginMode === 'pin' ? 'active' : ''}`}
                            onClick={() => { setLoginMode('pin'); setError(null) }}
                        >
                            <span className="material-symbols-outlined">lock</span>
                            PIN Login
                        </button>
                    </div>

                    {loginMode === 'quick' ? (
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
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Loading...
                                    </>
                                ) : (
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
                    ) : (
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
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Loading...
                                    </>
                                ) : (
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
                </div>

                {/* Footer */}
                <div className="login-footer">
                    <a href="/admin/login" className="admin-link">
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                        Admin Login
                    </a>
                    <p className="copyright">© 2024 Miss Phượng Learning App</p>
                </div>
            </div>
        </div>
    )
}
