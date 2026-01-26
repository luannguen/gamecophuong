import React, { useState } from 'react';
import { useWatchAndLearn } from '../hooks/useWatchAndLearn';
import { Icon } from '../../../ui/AnimatedIcon';
import UnitList from './UnitList';
import AdminLessonList from './AdminLessonList';
import LessonEditor from './LessonEditor';
import EnhancedModal from '../../../shared/ui/EnhancedModal';

export default function AdminVideoManager() {
    const { units, categories, isLoading, createUnit, updateUnit, deleteUnit, addLesson, updateLesson, deleteLesson } = useWatchAndLearn();
    const [view, setView] = useState('list'); // 'list', 'editor'
    const [subView, setSubView] = useState('lessons'); // 'lessons', 'units'
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('all'); // all, published, drafts
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortOption, setSortOption] = useState('newest'); // newest, oldest, alpha-asc, alpha-desc

    // Modal State
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });
    const [formData, setFormData] = useState({ title: '', description: '', unitId: '', category_id: '' });

    // --- Modal Handlers ---
    const openModal = (type, data = null) => {
        // Safe defaults for unitId and category_id
        const defaultUnitId = units.length > 0 ? units[0].id : '';
        const defaultCategoryId = (categories && categories.length > 0) ? categories[0].id : '';

        let initialForm = { title: '', description: '', unitId: defaultUnitId, category_id: defaultCategoryId };

        if (type === 'create_lesson') {
            initialForm.unitId = data?.unitId || defaultUnitId;
        } else if (type === 'edit_lesson') {
            initialForm = {
                title: data.lesson.title,
                description: data.lesson.description,
                unitId: data.unit.id
            };
        } else if (type === 'edit_unit') {
            initialForm = {
                title: data.title,
                description: data.description,
                category_id: data.category_id || defaultCategoryId
            };
        }

        setFormData(initialForm);
        setModalConfig({ isOpen: true, type, data });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, type: null, data: null });
        setFormData({ title: '', description: '', unitId: '', category_id: '' });
    };

    const handleModalSubmit = async () => {
        const { type, data } = modalConfig;
        try {
            if (type === 'create_unit') {
                if (!formData.title) {
                    alert('Please enter a title');
                    return;
                }
                await createUnit({
                    title: formData.title,
                    description: formData.description,
                    category_id: formData.category_id || categories[0]?.id
                });
            } else if (type === 'edit_unit') {
                await updateUnit(data.id, {
                    title: formData.title,
                    description: formData.description,
                    category_id: formData.category_id
                });
            } else if (type === 'create_lesson') {
                if (!formData.unitId) {
                    alert("Please select a unit");
                    return;
                }
                await addLesson(formData.unitId, { title: formData.title, description: formData.description });
            } else if (type === 'edit_lesson') {
                await updateLesson(data.unit.id, data.lesson.id, { title: formData.title, description: formData.description });
            } else if (type === 'delete_lesson') {
                await deleteLesson(data.unit.id, data.lesson.id);
            }
            closeModal();
        } catch (error) {
            console.error("Action failed", error);
        }
    };


    // Actions
    const handleEditLesson = (unit, lesson) => {
        setSelectedUnit(unit);
        setSelectedLesson(lesson);
        setView('editor');
    };

    const handleBack = () => {
        setView('list');
        setSelectedLesson(null);
    };

    if (isLoading) return <div className="p-10 text-center"><Icon.Spinner className="w-10 h-10 mx-auto text-blue-600" /></div>;

    // --- Filtering & Sorting Logic ---
    const filteredAndSortedUnits = units
        .filter(u => {
            // View Mode Filter
            if (viewMode === 'drafts') return u.is_published === false;
            if (viewMode === 'published') return u.is_published !== false;
            return true;
        })
        .filter(u => {
            // Category Filter
            if (selectedCategory === 'all') return true;
            return u.category_id === selectedCategory;
        })
        .filter(u => {
            // Search Filter
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (
                u.title.toLowerCase().includes(q) ||
                (u.description && u.description.toLowerCase().includes(q))
            );
        })
        .sort((a, b) => {
            // Sorting
            switch (sortOption) {
                case 'newest':
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                case 'oldest':
                    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                case 'alpha-asc':
                    return a.title.localeCompare(b.title);
                case 'alpha-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

    return (
        <div className="flex flex-col h-full bg-[#f5f8f8] dark:bg-[#102222] min-h-screen font-display">
            {view === 'list' && (
                <>
                    {/* Header */}
                    <header className="bg-white dark:bg-[#152a2a] border-b border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex flex-wrap justify-between items-center gap-4 max-w-7xl mx-auto">
                            <div className="flex flex-col">
                                <h2 className="text-[#0d1c1c] dark:text-white text-3xl font-black leading-tight tracking-tight">Unit Manager</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Reviewing {filteredAndSortedUnits.length} units ({units.length} total).</p>
                            </div>
                            <button
                                onClick={() => openModal('create_unit')}
                                className="flex items-center gap-2 bg-[#0df2f2] hover:bg-opacity-90 text-[#0d1c1c] font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all text-sm"
                            >
                                <Icon.Plus className="text-[20px]" />
                                <span>Add New Unit</span>
                            </button>
                        </div>
                    </header>

                    {/* Controls Bar */}
                    <div className="bg-white dark:bg-[#152a2a] border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#f5f8f8] dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#0df2f2]/50 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                        placeholder="Search units by title, description..."
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {/* Category Filter */}
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">filter_list</span>
                                    <select
                                        className="appearance-none pl-10 pr-8 py-2.5 bg-[#f5f8f8] dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0df2f2]"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">expand_more</span>
                                </div>

                                {/* Sort Filter */}
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">sort</span>
                                    <select
                                        className="appearance-none pl-10 pr-8 py-2.5 bg-[#f5f8f8] dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0df2f2]"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="alpha-asc">A-Z</option>
                                        <option value="alpha-desc">Z-A</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="px-6 py-3 bg-slate-50/50 dark:bg-[#102222]/50 border-b border-slate-200 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
                            <div
                                onClick={() => setViewMode('all')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center shrink-0 cursor-pointer transition-colors ${viewMode === 'all' ? 'bg-[#0df2f2]/20 text-[#0d1c1c] dark:text-[#0df2f2] border-[#0df2f2]/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                All Units
                            </div>
                            <div
                                onClick={() => setViewMode('published')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center shrink-0 cursor-pointer transition-colors ${viewMode === 'published' ? 'bg-[#0df2f2]/20 text-[#0d1c1c] dark:text-[#0df2f2] border-[#0df2f2]/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                Published ({units.filter(u => u.is_published !== false).length})
                            </div>
                            <div
                                onClick={() => setViewMode('drafts')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center shrink-0 cursor-pointer transition-colors ${viewMode === 'drafts' ? 'bg-[#0df2f2]/20 text-[#0d1c1c] dark:text-[#0df2f2] border-[#0df2f2]/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                Drafts ({units.filter(u => u.is_published === false).length})
                            </div>
                        </div>
                    </div>

                    {/* Content Table */}
                    <div className="flex-1 px-6 py-4 overflow-auto">
                        <div className="max-w-7xl mx-auto">
                            <UnitList
                                units={filteredAndSortedUnits}
                                categories={categories}
                                onCreateUnit={createUnit}
                                onUpdateUnit={updateUnit}
                                onDeleteUnit={deleteUnit}
                                onCreateLesson={addLesson}
                                onUpdateLesson={updateLesson}
                                onDeleteLesson={deleteLesson}
                                onEditLesson={handleEditLesson}
                                onOpenModal={openModal}
                            />
                        </div>
                    </div>
                </>
            )}

            {view === 'editor' && selectedUnit && selectedLesson && (
                <div className="space-y-6 p-6 max-w-7xl mx-auto w-full">
                    <div className="bg-white dark:bg-[#152a2a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-black text-[#0d1c1c] dark:text-white flex items-center gap-2">
                                <Icon.Edit className="text-[#0df2f2]" />
                                Edit Lesson
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                                {selectedLesson.title}
                            </p>
                        </div>
                        <button onClick={handleBack} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-2 transition-all">
                            <Icon.ArrowLeft /> Back to Units
                        </button>
                    </div>
                    <LessonEditor
                        unit={selectedUnit}
                        lesson={selectedLesson}
                        onBack={handleBack}
                    />
                </div>
            )}

            {/* Centralized Modal */}
            <EnhancedModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={
                    modalConfig.type === 'create_unit' ? 'Create New Unit' :
                        modalConfig.type === 'edit_unit' ? 'Edit Unit Details' :
                            modalConfig.type === 'create_lesson' ? 'Add New Lesson' :
                                modalConfig.type === 'edit_lesson' ? 'Edit Lesson Details' :
                                    modalConfig.type === 'delete_lesson' ? 'Confirm Delete' : ''
                }
                maxWidth="md"
                showControls={false}
                footer={
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={closeModal} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                        <button
                            onClick={handleModalSubmit}
                            className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg transition-all ${modalConfig.type?.includes('delete')
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                : 'bg-[#0df2f2] hover:bg-cyan-400 text-[#0d1c1c] shadow-cyan-500/20'
                                }`}
                        >
                            {modalConfig.type?.includes('delete') ? 'Delete' : 'Save Changes'}
                        </button>
                    </div>
                }
            >
                <div className="space-y-4 py-2 text-slate-800 dark:text-slate-200">
                    {modalConfig.type === 'delete_lesson' ? (
                        <div className="text-slate-600 dark:text-slate-300">
                            Are you sure you want to delete <span className="font-bold text-[#0d1c1c] dark:text-white">{modalConfig.data?.lesson?.title}</span>?
                            <br />This action cannot be undone.
                        </div>
                    ) : (
                        <>
                            {/* Create/Edit Unit Form */}
                            {(modalConfig.type === 'create_unit' || modalConfig.type === 'edit_unit') && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Unit Title</label>
                                        <input
                                            autoFocus
                                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter unit title..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Target Category</label>
                                        <select
                                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                                            value={formData.category_id || (categories[0]?.id || '')}
                                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                        >
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                        <textarea
                                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400"
                                            rows="3"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter brief description..."
                                        />
                                    </div>
                                </>
                            )}
                            {/* Unit Selection (Only for Create Lesson) */}
                            {modalConfig.type === 'create_lesson' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Target Unit</label>
                                    <select
                                        className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                                        value={formData.unitId}
                                        onChange={e => setFormData({ ...formData, unitId: e.target.value })}
                                    >
                                        <option value="" disabled>Select a Unit...</option>
                                        {units.map(u => (
                                            <option key={u.id} value={u.id}>{u.title} (Unit {u.order})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(modalConfig.type === 'create_lesson' || modalConfig.type === 'edit_lesson') && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Lesson Title</label>
                                        <input
                                            autoFocus={modalConfig.type !== 'create_unit'}
                                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter lesson title..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                        <textarea
                                            className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400"
                                            rows="3"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter brief description..."
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </EnhancedModal>
        </div>
    );
}
