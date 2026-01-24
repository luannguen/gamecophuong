import { Routes, Route, Navigate } from 'react-router-dom'

// Feature Module Imports
import {
    StudentHomePage,
    StudentLoginPage,
    StudentProfilePage,
    TopicDetailPage,
} from './components/features/student'

import {

    AdminDashboardPage,
    AdminStudentsPage,
    AdminTeachersPage,
    AdminClassesPage,
    AdminParentsPage,
    AdminGamesPage,
    AdminVocabularyPage,
    AdminVideosPage,
} from './components/features/admin'

import {
    TeacherDashboardPage,
    StudentManagerPage,
    TeacherParentsPage,
} from './components/features/teacher'

import {
    ParentLayout,
    ParentLoginPage,
    ParentDashboardPage,
} from './components/features/parent'

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
import TeacherLayout from './components/features/teacher/TeacherLayout'

function App() {
    return (
        <div className="app">
            <Routes>
                {/* Student Routes */}
                <Route path="/" element={<Navigate to="/student/login" replace />} />
                <Route path="/student/login" element={<StudentLoginPage />} />

                <Route element={<ResponsiveStudentLayout />}>
                    <Route path="/student/home" element={<StudentHomePage />} />
                    <Route path="/student/topic/:topicId" element={<TopicDetailPage />} />
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
                <Route path="/admin/login" element={<Navigate to="/student/login" replace />} />

                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/students" element={<AdminStudentsPage />} />
                    <Route path="/admin/teachers" element={<AdminTeachersPage />} />
                    <Route path="/admin/classes" element={<AdminClassesPage />} />
                    <Route path="/admin/parents" element={<AdminParentsPage />} />
                    <Route path="/admin/games" element={<AdminGamesPage />} />
                    <Route path="/admin/vocabulary" element={<AdminVocabularyPage />} />
                    <Route path="/admin/videos" element={<AdminVideosPage />} />
                </Route>

                {/* Teacher Routes */}
                <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
                <Route element={<TeacherLayout />}>
                    <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
                    <Route path="/teacher/students" element={<StudentManagerPage />} />
                    <Route path="/teacher/parents" element={<TeacherParentsPage />} />
                </Route>

                {/* Parent Routes */}
                <Route path="/parent/login" element={<ParentLoginPage />} />
                <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />
                <Route element={<ParentLayout />}>
                    <Route path="/parent/dashboard" element={<ParentDashboardPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App
