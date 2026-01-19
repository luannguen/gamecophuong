import { Routes, Route, Navigate } from 'react-router-dom'

// Feature Module Imports
import {
    StudentHomePage,
    StudentLoginPage,
    StudentProfilePage,
} from './components/features/student'

import {
    AdminLoginPage,
    AdminDashboardPage,
    AdminStudentsPage,
    AdminGamesPage,
    AdminVocabularyPage,
    AdminVideosPage,
} from './components/features/admin'

import {
    GamePlayPage,
    GameSelectionPage,
    GameDetailPage,
    GameRankingPage,
    ListenClickGamePage,
    WordMatchGamePage,
} from './components/features/game'

import {
    VideoGalleryPage,
} from './components/features/vocabulary'

// Layouts
import ResponsiveStudentLayout from './components/shared/layouts/ResponsiveStudentLayout'
import AdminLayout from './components/shared/layouts/AdminLayout'

function App() {
    return (
        <div className="app">
            <Routes>
                {/* Student Routes */}
                <Route path="/" element={<Navigate to="/student/login" replace />} />
                <Route path="/student/login" element={<StudentLoginPage />} />

                <Route element={<ResponsiveStudentLayout />}>
                    <Route path="/student/home" element={<StudentHomePage />} />
                    <Route path="/student/profile" element={<StudentProfilePage />} />
                    <Route path="/student/games" element={<GameSelectionPage />} />
                    <Route path="/student/game/:gameId/detail" element={<GameDetailPage />} />
                    <Route path="/student/game/:gameId" element={<GamePlayPage />} />
                    <Route path="/student/game/listen-click" element={<ListenClickGamePage />} />
                    <Route path="/student/game/word-match" element={<WordMatchGamePage />} />
                    <Route path="/student/videos" element={<VideoGalleryPage />} />
                    <Route path="/student/rankings" element={<GameRankingPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/students" element={<AdminStudentsPage />} />
                    <Route path="/admin/games" element={<AdminGamesPage />} />
                    <Route path="/admin/vocabulary" element={<AdminVocabularyPage />} />
                    <Route path="/admin/videos" element={<AdminVideosPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App
