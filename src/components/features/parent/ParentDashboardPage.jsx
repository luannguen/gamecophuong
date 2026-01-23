import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserRole } from '../../../hooks/useUserRole';
import { supabase } from '../../../data/supabaseClient';

export const ParentDashboardPage = () => {
    const { profile } = useUserRole();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChildren();
    }, []);

    const loadChildren = async () => {
        try {
            // Get parent's children with their scores
            const { data } = await supabase
                .from('parent_students')
                .select(`
                    relationship,
                    is_primary_contact,
                    students (
                        id, 
                        display_name, 
                        avatar_url, 
                        total_score, 
                        total_stars,
                        classes (name)
                    )
                `);

            if (data) {
                setChildren(data.map(item => ({
                    ...item.students,
                    relationship: item.relationship,
                    isPrimary: item.is_primary_contact,
                    className: item.students?.classes?.name || 'No class'
                })));
            }
        } catch (error) {
            console.error('Error loading children:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome, {profile?.full_name || 'Parent'}! 👋
                </h1>
                <p className="text-purple-100">
                    Track your children's learning progress and achievements.
                </p>
            </div>

            {/* Children Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children.length > 0 ? (
                    children.map((child) => (
                        <div
                            key={child.id}
                            className="bg-white rounded-2xl shadow-sm overflow-hidden"
                        >
                            {/* Child Header */}
                            <div className="bg-gradient-to-r from-purple-400 to-indigo-400 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-purple-600 shadow-md">
                                        {child.display_name?.charAt(0) || '?'}
                                    </div>
                                    <div className="text-white">
                                        <h3 className="text-xl font-bold">{child.display_name}</h3>
                                        <p className="text-purple-100 text-sm">{child.className}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-purple-600">{child.total_score || 0}</p>
                                        <p className="text-sm text-purple-500">Total Points</p>
                                    </div>
                                    <div className="bg-yellow-50 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-yellow-600">{child.total_stars || 0} ⭐</p>
                                        <p className="text-sm text-yellow-600">Stars Earned</p>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        to={`/student/rankings`}
                                        className="flex-1 py-2 px-4 bg-purple-100 text-purple-700 rounded-lg text-center text-sm font-medium hover:bg-purple-200 transition-colors"
                                    >
                                        📊 View Rankings
                                    </Link>
                                    <Link
                                        to="/student/games"
                                        className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-lg text-center text-sm font-medium hover:bg-green-200 transition-colors"
                                    >
                                        🎮 View Games
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div className="text-6xl mb-4">👶</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Children Linked</h3>
                        <p className="text-gray-500">
                            Please contact your school administrator to link your children to your account.
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Explore Learning Content</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/student/games"
                        className="flex flex-col items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                    >
                        <span className="text-3xl mb-2">🎮</span>
                        <span className="text-sm font-medium text-green-700">Games</span>
                    </Link>
                    <Link
                        to="/student/videos"
                        className="flex flex-col items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                        <span className="text-3xl mb-2">📹</span>
                        <span className="text-sm font-medium text-blue-700">Videos</span>
                    </Link>
                    <Link
                        to="/student/rankings"
                        className="flex flex-col items-center p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors"
                    >
                        <span className="text-3xl mb-2">🏆</span>
                        <span className="text-sm font-medium text-yellow-700">Rankings</span>
                    </Link>
                    <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 opacity-60">
                        <span className="text-3xl mb-2">📊</span>
                        <span className="text-sm font-medium text-gray-500">Reports</span>
                        <span className="text-xs text-gray-400">Coming Soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboardPage;
