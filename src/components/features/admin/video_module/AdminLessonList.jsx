import React, { useState, useMemo } from 'react';
import { Icon } from '../../../ui/AnimatedIcon';

export default function AdminLessonList({ units, categories, onEditLesson, onOpenModal }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All Lessons'); // 'All Lessons', 'Published', 'Drafts', 'Archived'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Flatten units to lessons with unit info
    const allLessons = useMemo(() => {
        return units.flatMap(unit =>
            (unit.lessons || []).map(lesson => ({
                ...lesson,
                unitTitle: unit.title,
                unitCategory: unit.categoryName,
                // Add fallback status/version if not present
                status: lesson.version?.status || lesson.status || 'draft',
                versionNumber: lesson.version?.version_number ? `v${lesson.version.version_number}.0.0` : 'v1.0.0',
                thumbnailUrl: lesson.videoUrl || lesson.version?.video_url || null, // Fallback logic
                duration: lesson.durationSec ? `${Math.floor(lesson.durationSec / 60)}:${(lesson.durationSec % 60).toString().padStart(2, '0')}` : '00:00'
            }))
        );
    }, [units]);

    // Filter Logic
    const filteredLessons = useMemo(() => {
        let result = allLessons;

        // Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(l =>
                l.title.toLowerCase().includes(lowerTerm) ||
                l.unitTitle.toLowerCase().includes(lowerTerm)
            );
        }

        // Tabs
        if (activeTab !== 'All Lessons') {
            const statusMap = {
                'Published': 'published',
                'Drafts': 'draft',
                'Archived': 'archived'
            };
            const targetStatus = statusMap[activeTab];
            if (targetStatus) {
                result = result.filter(l => l.status === targetStatus);
            }
        }

        return result;
    }, [allLessons, searchTerm, activeTab]);

    // Pagination
    const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
    const paginatedLessons = filteredLessons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Stats
    const totalCount = allLessons.length;
    const publishedCount = allLessons.filter(l => l.status === 'published').length;
    const draftCount = allLessons.filter(l => l.status === 'draft').length;
    const archivedCount = allLessons.filter(l => l.status === 'archived').length;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#152a2a] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Page Heading */}
            <header className="bg-white dark:bg-[#152a2a] border-b border-slate-200 dark:border-slate-800 p-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-[#0d1c1c] dark:text-white text-3xl font-black leading-tight tracking-tight">Lesson Management</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Reviewing {totalCount} educational modules across all units.</p>
                    </div>
                    <button
                        onClick={() => onOpenModal('create_lesson')}
                        className="flex items-center gap-2 bg-[#0df2f2] hover:bg-opacity-90 text-[#0d1c1c] font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all text-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Add New Lesson</span>
                    </button>
                </div>
            </header>

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-[#152a2a] border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 bg-[#f5f8f8] dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#0df2f2]/50 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                placeholder="Search lessons by title, unit, or version..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f8f8] dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-[18px]">filter_list</span>
                            <span>Category</span>
                            <span className="material-symbols-outlined text-[18px]">expand_more</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f8f8] dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-[18px]">sort</span>
                            <span>Sort By</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Chips / Filters */}
            <div className="px-6 py-3 bg-slate-50/50 dark:bg-[#102222]/50">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {[
                        { name: 'All Lessons', count: totalCount, activeClass: 'bg-[#0df2f2]/20 text-[#0d1c1c] border-[#0df2f2]/30' },
                        { name: 'Published', count: publishedCount, activeClass: 'bg-green-100 text-green-800 border-green-200' },
                        { name: 'Drafts', count: draftCount, activeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
                        { name: 'Archived', count: archivedCount, activeClass: 'bg-slate-100 text-slate-600 border-slate-200' },
                    ].map(tab => (
                        <div
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center shrink-0 cursor-pointer transition-colors ${activeTab === tab.name
                                ? tab.activeClass
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {tab.name} ({tab.count})
                        </div>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto px-6 py-4">
                <div className="bg-white dark:bg-[#152a2a] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-2/5">Lesson Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Version</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deps</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {paginatedLessons.map(lesson => {
                                const unit = units.find(u => u.title === lesson.unitTitle);
                                return (
                                    <tr key={lesson.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-20 aspect-video rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-inner group-hover:ring-2 ring-offset-1 ring-[#0df2f2]/50 transition-all">
                                                    {lesson.thumbnailUrl && (
                                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${lesson.thumbnailUrl}')` }}></div>
                                                    )}
                                                    {!lesson.thumbnailUrl && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                                                            <span className="material-symbols-outlined text-slate-400">image</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                                                        <span className="material-symbols-outlined text-white text-sm filled-icon">
                                                            {lesson.status === 'draft' ? 'lock' : 'play_circle'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight line-clamp-1" title={lesson.title}>{lesson.title}</span>
                                                    <span className="text-xs text-slate-500 mt-0.5">Duration: {lesson.duration} • HD</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{lesson.unitTitle}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${lesson.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                lesson.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                {lesson.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{lesson.versionNumber}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="material-symbols-outlined text-green-500 filled-icon" title="Dependencies Healthy">check_circle</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-[#0df2f2] transition-colors" title="Preview">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => onEditLesson(unit, lesson)}
                                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-[#0df2f2] transition-colors"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit_note</span>
                                                </button>
                                                <button
                                                    onClick={() => onOpenModal('delete_lesson', { unit, lesson })} /* Use Modal for Delete */
                                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-bold text-slate-800 dark:text-slate-100">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-800 dark:text-slate-100">{Math.min(currentPage * itemsPerPage, filteredLessons.length)}</span> of <span className="font-bold text-slate-800 dark:text-slate-100">{filteredLessons.length}</span> lessons
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>

                        {/* Simplified Pagination Logic */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Logic to show generic page numbers around current
                            let p = i + 1;
                            if (totalPages > 5 && currentPage > 3) {
                                p = currentPage - 2 + i;
                            }
                            if (p > totalPages) return null;

                            return (
                                <button
                                    key={p}
                                    onClick={() => setCurrentPage(p)}
                                    className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === p
                                        ? 'bg-[#0df2f2] text-[#0d1c1c] font-bold'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                        }`}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
