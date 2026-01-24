import { useState, useEffect } from 'react';
import { categoryRepository } from '../data/categoryRepository';
import { ICON_LIBRARY } from '../data/iconLibrary';
import { useToast } from '../../../shared/hooks/useToast';
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog';

export default function CategoryManagerModal({ isOpen, onClose, onUpdate }) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', icon: '', color: '#26d9d9' });
    const [activeTab, setActiveTab] = useState('create'); // 'create' | 'list'
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [iconSearch, setIconSearch] = useState('');
    const { showToast } = useToast();
    const { confirm } = useConfirmDialog();

    // Common icons for Quick Pick
    const commonIcons = ['pets', 'restaurant', 'menu_book', 'music_note', 'family_history', 'science', 'sports_soccer', 'school', 'movie', 'star', 'language', 'flight'];

    useEffect(() => {
        if (isOpen) {
            loadCategories();
            setIsIconPickerOpen(false);
            setIconSearch('');
            setActiveTab('create');
        }
    }, [isOpen]);

    const loadCategories = async () => {
        setIsLoading(true);
        const result = await categoryRepository.getAll();
        if (result.success) {
            setCategories(result.data);
        }
        setIsLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCategory.name || !newCategory.icon) {
            showToast('Please fill in Name and Icon', 'error');
            return;
        }

        const result = await categoryRepository.create(newCategory);
        if (result.success) {
            showToast('Category created!', 'success');
            setNewCategory({ name: '', icon: '', color: '#26d9d9' });
            loadCategories();
            if (onUpdate) onUpdate();
            // setActiveTab('list'); // Optional: switch to list
        } else {
            showToast('Failed to create category', 'error');
        }
    };

    const handleDelete = async (id, name) => {
        const confirmed = await confirm({
            title: 'Delete Category',
            message: `Delete "${name}"? This might affect videos using it.`,
            type: 'danger',
            confirmText: 'Delete'
        });

        if (confirmed) {
            const result = await categoryRepository.delete(id);
            if (result.success) {
                showToast('Category deleted', 'success');
                loadCategories();
                if (onUpdate) onUpdate();
            } else {
                showToast('Failed to delete', 'error');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 relative" onClick={e => e.stopPropagation()}>

                {/* Header with Tabs */}
                <div className="shrink-0 border-b border-slate-100">
                    <div className="p-6 pb-2 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Manage Categories</h2>
                            <p className="text-slate-500 text-sm">Create and organize video topics</p>
                        </div>
                        <button onClick={onClose} className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-6 gap-6">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'create' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                        >
                            Create New
                        </button>
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'list' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                        >
                            Existing Categories
                            <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">{categories.length}</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative min-h-[400px]">
                    {/* TAB CONTENT: CREATE */}
                    {activeTab === 'create' && (
                        <div className="h-full overflow-y-auto custom-scrollbar p-6 animate-in fade-in slide-in-from-left-4 duration-200">
                            <form onSubmit={handleCreate} className="space-y-6">
                                {/* Inputs Row */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Science"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-lg font-medium text-slate-700"
                                            value={newCategory.name}
                                            onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                            autoFocus
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Selected Icon</label>
                                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
                                                <span className="material-symbols-outlined text-2xl text-blue-600">
                                                    {newCategory.icon || 'help'}
                                                </span>
                                                <span className="text-sm font-mono text-slate-600 truncate flex-1">
                                                    {newCategory.icon || 'No Icon'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Color Theme</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    className="h-[46px] w-14 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                                                    value={newCategory.color}
                                                    onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                                                />
                                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-sm font-mono text-slate-500 uppercase">
                                                    {newCategory.color}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Icons Section */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Select Icon</label>
                                    <div className="flex gap-3 flex-wrap">
                                        {commonIcons.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setNewCategory({ ...newCategory, icon })}
                                                className={`size-11 rounded-xl border flex items-center justify-center transition-all ${newCategory.icon === icon ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-110' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:scale-105'}`}
                                                title={icon}
                                            >
                                                <span className="material-symbols-outlined text-2xl">{icon}</span>
                                            </button>
                                        ))}

                                        {/* Open Modal Button */}
                                        <button
                                            type="button"
                                            onClick={() => setIsIconPickerOpen(true)}
                                            className="px-4 h-11 rounded-xl border border-dashed border-blue-300 flex items-center gap-2 transition-all bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-sm"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">grid_view</span>
                                            More Icons
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                                    Create Category
                                </button>
                            </form>
                        </div>
                    )}

                    {/* TAB CONTENT: LIST */}
                    {activeTab === 'list' && (
                        <div className="h-full overflow-y-auto custom-scrollbar p-6 animate-in fade-in slide-in-from-right-4 duration-200">
                            <div className="space-y-3">
                                {categories.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="bg-slate-50 size-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">category</span>
                                        </div>
                                        <p className="text-slate-400">No categories created yet.</p>
                                        <button onClick={() => setActiveTab('create')} className="text-blue-600 font-bold mt-2 hover:underline">Create one now</button>
                                    </div>
                                ) : (
                                    categories.map(cat => (
                                        <div key={cat.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                            <div className="size-12 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0" style={{ backgroundColor: cat.color }}>
                                                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-slate-800 text-lg truncate leading-tight">{cat.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{cat.icon}</span>
                                                    <span>{cat.color}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                                className="size-10 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 flex items-center justify-center transition-colors"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ICON PICKER OVERLAY MODAL */}
                {isIconPickerOpen && (
                    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Overlay Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white shadow-sm shrink-0">
                            <button
                                onClick={() => setIsIconPickerOpen(false)}
                                className="size-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <div className="flex-1">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                                    <input
                                        type="text"
                                        placeholder="Search 200+ icons (e.g. food, pet, school)..."
                                        autoFocus
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium text-slate-700"
                                        value={iconSearch}
                                        onChange={e => setIconSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Overlay Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            {Object.entries(ICON_LIBRARY).map(([category, icons]) => {
                                const filteredIcons = icons.filter(icon => icon.includes(iconSearch.toLowerCase()));
                                if (filteredIcons.length === 0) return null;

                                return (
                                    <div key={category} className="mb-8 last:mb-0">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                            <span className="material-symbols-outlined text-base">
                                                {category.includes('Animals') ? 'pets' :
                                                    category.includes('Food') ? 'restaurant' :
                                                        category.includes('School') ? 'school' : 'grid_view'}
                                            </span>
                                            {category}
                                        </h4>
                                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                                            {filteredIcons.map(icon => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewCategory(prev => ({ ...prev, icon }));
                                                        setIsIconPickerOpen(false); // Close on select
                                                    }}
                                                    className={`aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 overflow-hidden ${newCategory.icon === icon
                                                            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200'
                                                            : 'bg-slate-50 text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-md border border-slate-100'
                                                        }`}
                                                    title={icon}
                                                >
                                                    <span className="material-symbols-outlined text-2xl w-full text-center truncate select-none">{icon}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Empty State */}
                            {iconSearch && Object.values(ICON_LIBRARY).flat().filter(i => i.includes(iconSearch)).length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <span className="material-symbols-outlined text-6xl mb-4 text-slate-200">sentiment_dissatisfied</span>
                                    <p>No icons found for "{iconSearch}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
