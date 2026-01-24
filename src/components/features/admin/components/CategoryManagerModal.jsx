import { useState, useEffect } from 'react';
import { categoryRepository } from '../data/categoryRepository';
import { ICON_LIBRARY } from '../data/iconLibrary';
import { useToast } from '../../../shared/hooks/useToast';
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog';

export default function CategoryManagerModal({ isOpen, onClose, onUpdate }) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', icon: '', color: '#26d9d9' });
    const [showAllIcons, setShowAllIcons] = useState(false);
    const [iconSearch, setIconSearch] = useState('');
    const { showToast } = useToast();
    const { confirm } = useConfirmDialog();

    // Common icons for Quick Pick
    const commonIcons = ['pets', 'restaurant', 'menu_book', 'music_note', 'family_history', 'science', 'sports_soccer', 'school', 'movie', 'star', 'language', 'flight'];

    useEffect(() => {
        if (isOpen) {
            loadCategories();
            setShowAllIcons(false); // Reset view
            setIconSearch('');
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
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Manage Categories</h2>
                        <p className="text-slate-500 text-sm">Create and organize video topics</p>
                    </div>
                    <button onClick={onClose} className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    {/* LEFT PANEL: Create Form & Icon Picker */}
                    <div className="w-full md:w-1/2 p-6 overflow-y-auto custom-scrollbar border-r border-slate-100 flex flex-col gap-6">
                        <form onSubmit={handleCreate} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 shrink-0 transition-all">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">add_circle</span>
                                Add New Category
                            </h3>
                            {/* Inputs Row */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Science"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                        value={newCategory.name}
                                        onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Selected Icon</label>
                                        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                                            <span className="material-symbols-outlined text-blue-600">
                                                {newCategory.icon || 'help'}
                                            </span>
                                            <span className="text-sm font-mono text-slate-600 truncate">
                                                {newCategory.icon || 'None'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                className="h-[42px] w-12 rounded cursor-pointer border border-slate-200"
                                                value={newCategory.color}
                                                onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Icons Section */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Icons:</label>
                                <div className="flex gap-2 flex-wrap">
                                    {commonIcons.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setNewCategory({ ...newCategory, icon })}
                                            className={`size-9 rounded-lg border flex items-center justify-center transition-all ${newCategory.icon === icon ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-110' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:scale-105'}`}
                                            title={icon}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{icon}</span>
                                        </button>
                                    ))}

                                    {/* Show More Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowAllIcons(!showAllIcons)}
                                        className={`size-9 rounded-lg border border-dashed border-slate-300 flex items-center justify-center transition-all bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-blue-600 ${showAllIcons ? 'bg-blue-50 border-blue-300 text-blue-600' : ''}`}
                                        title={showAllIcons ? "Hide Library" : "Show More Icons"}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{showAllIcons ? 'expand_less' : 'more_horiz'}</span>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                                Create Category
                            </button>
                        </form>

                        {/* Expanded Icon Library */}
                        {showAllIcons && (
                            <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-top-4 duration-300 border-t border-slate-100 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-slate-700">Icon Library</h3>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                        <input
                                            type="text"
                                            placeholder="Search icons..."
                                            className="pl-8 pr-3 py-1 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 w-40"
                                            value={iconSearch}
                                            onChange={e => setIconSearch(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 rounded-xl border border-slate-200 p-2">
                                    {Object.entries(ICON_LIBRARY).map(([category, icons]) => {
                                        // Filter
                                        const filteredIcons = icons.filter(icon => icon.includes(iconSearch.toLowerCase()));
                                        if (filteredIcons.length === 0) return null;

                                        return (
                                            <div key={category} className="mb-4">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 sticky top-0 bg-slate-50/95 backdrop-blur-sm py-1 z-10 border-b border-slate-100">
                                                    {category}
                                                </h4>
                                                <div className="grid grid-cols-6 sm:grid-cols-7 gap-1">
                                                    {filteredIcons.map(icon => (
                                                        <button
                                                            key={icon}
                                                            type="button"
                                                            onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                                                            className={`aspect-square rounded-lg flex items-center justify-center transition-all hover:scale-110 ${newCategory.icon === icon
                                                                    ? 'bg-blue-600 text-white shadow-md'
                                                                    : 'text-slate-500 hover:bg-white hover:shadow-sm'
                                                                }`}
                                                            title={icon}
                                                        >
                                                            <span className="material-symbols-outlined text-lg">{icon}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {iconSearch && Object.values(ICON_LIBRARY).flat().filter(i => i.includes(iconSearch)).length === 0 && (
                                        <p className="text-center text-slate-400 text-sm py-4">No icons found.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT PANEL: Existing Categories List */}
                    <div className="w-full md:w-1/2 p-6 overflow-y-auto custom-scrollbar bg-slate-50/50">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
                            <span>Existing Categories</span>
                            <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">{categories.length}</span>
                        </h3>
                        <div className="space-y-3">
                            {categories.length === 0 ? (
                                <p className="text-slate-400 text-center py-10 italic">No categories created yet.</p>
                            ) : (
                                categories.map(cat => (
                                    <div key={cat.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
                                        <div className="size-10 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: cat.color }}>
                                            <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 truncate leading-tight">{cat.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-mono truncate">{cat.icon} • {cat.color}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                                className="size-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
