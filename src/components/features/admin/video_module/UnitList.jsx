import React, { useState } from 'react';
import { Icon } from '../../../ui/AnimatedIcon';
import EnhancedModal from '../../../shared/ui/EnhancedModal';

export default function UnitList({ units, categories, onCreateUnit, onUpdateUnit, onDeleteUnit, onEditLesson, onCreateLesson, onUpdateLesson, onDeleteLesson }) {
    const [expandedUnits, setExpandedUnits] = useState({});

    // Sort categories by sort_order
    const sortedCategories = [...(categories || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    // Modal States
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: null, // 'create_unit', 'edit_unit', 'create_lesson', 'edit_lesson', 'delete_lesson' 
        data: null
    });
    const [formData, setFormData] = useState({ title: '', description: '', categoryId: '' });

    const toggleUnit = (unitId) => {
        setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
    };

    // --- Modal Handlers ---
    const openModal = (type, data = null) => {
        let title = data?.title || '';
        let description = data?.description || '';

        // Extract from nested lesson object if available
        if (type === 'edit_lesson' && data?.lesson) {
            title = data.lesson.title;
            description = data.lesson.description;
        }

        setFormData({
            title,
            description,
            categoryId: data?.category_id || (categories?.[0]?.id || '')
        });
        setModalConfig({ isOpen: true, type, data });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, type: null, data: null });
        setFormData({ title: '', description: '', categoryId: '' });
    };

    const handleSubmit = async () => {
        const { type, data } = modalConfig;

        try {
            if (type === 'create_unit') {
                await onCreateUnit({
                    title: formData.title,
                    description: formData.description,
                    category_id: formData.categoryId
                });
            } else if (type === 'edit_unit') {
                await onUpdateUnit(data.id, {
                    title: formData.title,
                    description: formData.description,
                    category_id: formData.categoryId
                });
            } else if (type === 'create_lesson') {
                await onCreateLesson(data.unitId, {
                    title: formData.title,
                    description: formData.description,
                    videoUrl: '',
                    initialVersion: { status: 'draft' }
                });
            } else if (type === 'edit_lesson') {
                await onUpdateLesson(data.unitId, data.lessonId, {
                    title: formData.title,
                    description: formData.description
                });
            } else if (type === 'delete_lesson') {
                await onDeleteLesson(data.unitId, data.lessonId);
            } else if (type === 'delete_unit') {
                await onDeleteUnit(data.id);
            }
            closeModal();
        } catch (error) {
            console.error("Action failed", error);
            alert("Action failed: " + error.message); // Fallback if no toast
        }
    };

    return (
        <div className="bg-white dark:bg-[#152a2a] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-fadeIn">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-2/5">Unit Details</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stats</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {units.map((unit) => {
                        const category = categories.find(c => c.id === unit.category_id);
                        return (
                            <React.Fragment key={unit.id}>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-20 aspect-video rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                                                {/* Placeholder for Unit Thumbnail */}
                                                <span className="material-symbols-outlined text-slate-400 text-2xl">school</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{unit.title}</span>
                                                <span className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{unit.description || 'No description'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: category?.color_code || '#cbd5e1' }}
                                            />
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{category?.name || 'Uncategorized'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {unit.is_published !== false ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wide">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 uppercase tracking-wide">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                            {unit.lessons?.length || 0} Lessons
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => toggleUnit(unit.id)}
                                                className={`p-1.5 rounded transition-colors ${expandedUnits[unit.id] ? 'bg-[#0df2f2]/10 text-[#0df2f2]' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-[#0df2f2]'}`}
                                                title="View Lessons"
                                            >
                                                <Icon.ChevronRight className={`w-5 h-5 transition-transform ${expandedUnits[unit.id] ? 'rotate-90' : ''}`} />
                                            </button>
                                            <button
                                                onClick={() => openModal('create_lesson', { unitId: unit.id })}
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-[#0df2f2] transition-colors"
                                                title="Add Lesson"
                                            >
                                                <Icon.Plus className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openModal('edit_unit', unit)}
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-blue-500 transition-colors"
                                                title="Edit Unit"
                                            >
                                                <Icon.Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openModal('delete_unit', unit)}
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete Unit"
                                            >
                                                <Icon.Trash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Expanded View - Lesson List */}
                                {expandedUnits[unit.id] && (
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/10">
                                        <td colSpan="5" className="px-6 py-4">
                                            <div className="pl-12 space-y-2">
                                                {unit.lessons?.length === 0 && (
                                                    <p className="text-sm text-slate-400 italic">No lessons yet.</p>
                                                )}
                                                {unit.lessons?.sort((a, b) => a.order - b.order).map((lesson, idx) => (
                                                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-white dark:bg-[#152a2a] rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm max-w-3xl">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center text-slate-500 dark:text-slate-400">
                                                                {idx + 1}
                                                            </div>
                                                            <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{lesson.title}</span>
                                                            <span className="text-xs text-slate-400 truncate max-w-[300px] hidden sm:block"> &bull; {lesson.description}</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => openModal('edit_lesson', { unitId: unit.id, lessonId: lesson.id, lesson, unit })}
                                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-blue-500"
                                                                title="Edit Details"
                                                            >
                                                                <Icon.Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => onEditLesson(unit, lesson)}
                                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-[#0df2f2]"
                                                                title="Open Content Builder"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">build</span>
                                                            </button>
                                                            <button
                                                                onClick={() => onDeleteLesson(unit.id, lesson.id)}
                                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-red-500"
                                                            >
                                                                <Icon.Trash className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => openModal('create_lesson', { unitId: unit.id })}
                                                    className="w-full max-w-3xl py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-400 hover:text-[#0df2f2] hover:border-[#0df2f2] flex items-center justify-center gap-1 transition-all"
                                                >
                                                    <Icon.Plus className="w-4 h-4" /> Add New Lesson to Unit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                    {/* Add New Unit Row */}
                    <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                            <button
                                onClick={() => openModal('create_unit', { category_id: categories?.[0]?.id || '' })}
                                className="group flex items-center justify-center gap-2 py-3 px-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:border-[#0df2f2] hover:text-[#0df2f2] transition-all duration-300"
                            >
                                <Icon.Plus className="w-5 h-5" />
                                <span className="font-bold">Create New Unit</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* General Action Modal */}
            <EnhancedModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={
                    modalConfig.type === 'create_unit' ? 'Create New Unit' :
                        modalConfig.type === 'edit_unit' ? 'Edit Unit Details' :
                            modalConfig.type === 'create_lesson' ? 'Add New Lesson' :
                                modalConfig.type === 'edit_lesson' ? 'Edit Lesson' :
                                    modalConfig.type?.includes('delete') ? 'Confirm Delete' : ''
                }
                maxWidth="md"
                showControls={false}
                footer={
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={closeModal} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg transition-all ${modalConfig.type?.includes('delete')
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                : 'bg-[#0df2f2] hover:bg-cyan-400 text-[#0d1c1c] shadow-cyan-500/20'
                                }`}
                        >
                            {modalConfig.type?.includes('delete') ? 'Delete' : 'Save'}
                        </button>
                    </div>
                }
            >
                <div className="space-y-4 py-2 text-slate-800 dark:text-slate-200">
                    {modalConfig.type?.includes('delete') ? (
                        <div className="text-slate-600 dark:text-slate-300">
                            Are you sure you want to delete <span className="font-bold text-[#0d1c1c] dark:text-white">{modalConfig.data?.title}</span>?
                            <br />This action cannot be undone.
                        </div>
                    ) : (
                        <>
                            {/* Combined Form for Unit/Lesson Types */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                <input
                                    autoFocus
                                    className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter title..."
                                />
                            </div>

                            {(modalConfig.type === 'create_unit' || modalConfig.type === 'edit_unit') && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                    <select
                                        className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                                        value={formData.categoryId || (categories[0]?.id || '')}
                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                                <textarea
                                    className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400"
                                    rows="3"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter description..."
                                />
                            </div>
                        </>
                    )}
                </div>
            </EnhancedModal>
        </div>
    );
}

