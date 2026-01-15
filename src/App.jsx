import { Routes, Route, Navigate } from 'react-router-dom'
import StudentLogin from './pages/StudentLogin'
import StudentHome from './pages/StudentHome'
import ListenClickGame from './pages/ListenClickGame'
import WordMatchGame from './pages/WordMatchGame'
import {
    MinigameSelection,
    GamePlay,
    VideoGallery,
    WeeklyRanking,
    AdminLogin,
    AdminDashboard,
    AdminStudents,
    AdminGames,
    AdminVocabulary,
    AdminVideos,
} from './pages/index.jsx'

function App() {
    return (
        <div className="app">
            <Routes>
                {/* Student Routes */}
                <Route path="/" element={<Navigate to="/student/login" replace />} />
                <Route path="/student/login" element={<StudentLogin />} />
                <Route path="/student/home" element={<StudentHome />} />
                <Route path="/student/games" element={<MinigameSelection />} />
                <Route path="/student/game/:gameId" element={<GamePlay />} />
                <Route path="/student/game/listen-click" element={<ListenClickGame />} />
                <Route path="/student/game/word-match" element={<WordMatchGame />} />
                <Route path="/student/videos" element={<VideoGallery />} />
                <Route path="/student/rankings" element={<WeeklyRanking />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<AdminStudents />} />
                <Route path="/admin/games" element={<AdminGames />} />
                <Route path="/admin/vocabulary" element={<AdminVocabulary />} />
                <Route path="/admin/videos" element={<AdminVideos />} />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App
