import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authRepository } from '../../../data/authRepository';

export const ParentLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu');
            return;
        }

        setError(null);
        setIsLoading(true);

        const result = await authRepository.login(email, password);

        if (result.success) {
            const { role } = result.data;

            if (role === 'parent') {
                navigate('/parent/dashboard');
            } else if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                setError('Tài khoản này không phải phụ huynh.');
                await authRepository.logout();
            }
        } else {
            setError(result.error || 'Email hoặc mật khẩu không đúng');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">👨‍👩‍👧</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Parent Login</h1>
                        <p className="text-gray-500 mt-2">Track your child's learning journey</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="parent@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-3">
                        <p className="text-gray-500 text-sm">
                            Not a parent?{' '}
                            <Link to="/admin/login" className="text-purple-600 hover:underline">
                                Admin/Teacher Login
                            </Link>
                        </p>
                        <Link to="/student/login" className="block text-purple-600 hover:underline text-sm">
                            ← Student Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentLoginPage;
