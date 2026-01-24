// Types
export * from './types/AdminDTO';

// Domain
export * from './domain/statsAggregator';

// Data
export { adminRepository } from './data/adminRepository';

// Hooks
export { useAdminAuth } from './hooks/useAdminAuth';

// UI
export { default as StatsCard } from './ui/StatsCard';

// Pages
export { default as AdminDashboardPage } from './pages/Dashboard';
export { default as AdminStudentsPage } from './pages/Students';
export { default as AdminGamesPage } from './pages/Games';
export { default as AdminVocabularyPage } from './pages/AdminVocabularyPage';
export { default as AdminVideosPage } from './pages/Videos';
export { default as AdminTeachersPage } from './pages/Teachers';
export { default as AdminClassesPage } from './pages/Classes';
export { default as AdminParentsPage } from './pages/Parents';

