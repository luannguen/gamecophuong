import React, { useState } from 'react';
import { useVocabularyManagement } from '../hooks/useVocabularyManagement';
import { useToast } from '../../../shared/hooks/useToast';
import CategoryManager from '../components/CategoryManagerModal';
import VocabularyFormModal from '../components/VocabularyFormModal';


export default function AdminVocabularyPage() {
    // Logic extracted to Hook (Rule 3.1)
    const { vocabulary, categories, isLoading, actions } = useVocabularyManagement();
    const { showToast } = useToast();

    // Local UI State
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

    // Handlers
    const onSave = async (data) => {
        const success = await actions.saveItem(data, !!editingItem, editingItem?.id);
        if (success) setIsFormOpen(false);
    };

    const onDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this word?')) {
            await actions.deleteItem(id);
        }
    };

    const onPlayAudio = (url, e) => {
        e.stopPropagation();
        if (!url) {
            showToast('No audio available', 'error');
            return;
        }
        new Audio(url).play().catch(() => showToast('Audio playback error', 'error'));
    };

    // Helper: Filter
    const filteredVocabulary = vocabulary.filter(item => {
        const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
        const matchesSearch = !searchTerm ||
            item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getDifficultyStars = (level) => {
        const l = (level || 'beginner').toLowerCase();
        if (l === 'advanced') return 3;
        if (l === 'intermediate') return 2;
        return 1;
    };

    return (
        // REMOVED AdminLayout Wrapper to fix Blank Page issue
        <>
            {/* Custom Styles Injected Locally */}
            <style>{`
                .pattern-bg {
                    background-image: radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0);
                    background-size: 24px 24px;
                }
                .flashcard-hover {
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .flashcard-hover:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden relative pattern-bg bg-slate-50/50 -m-6 rounded-none">

                {/* Header */}
                <div className="h-20 flex items-center justify-between px-8 bg-white/60 backdrop-blur-md border-b border-slate-200 shrink-0">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-slate-800 hidden md:block">Vocabulary Cards</h2>
                        <p className="text-xs text-slate-500 hidden md:block">Manage interactive cards for children's learning</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-sky-400 w-64 text-sm outline-none transition-all shadow-sm"
                                placeholder="Search words..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
                            className="bg-sky-400 text-white px-5 py-2.5 rounded-xl font-display font-semibold text-sm shadow-lg shadow-sky-400/25 flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            New Card
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="px-8 py-4 bg-white/40 backdrop-blur-sm border-b border-slate-200/50 shrink-0">
                    <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full font-display font-semibold text-sm transition-all scale-105 ${selectedCategory === null
                                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                                : 'bg-white text-slate-600 border border-slate-200 hover:text-teal-500 hover:border-teal-500'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">apps</span>
                            All
                        </button>

                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-full font-display font-semibold text-sm transition-all whitespace-nowrap border ${selectedCategory === cat.id
                                    ? 'text-white shadow-lg border-transparent'
                                    : 'bg-white text-slate-600 border-slate-200'
                                    }`}
                                style={selectedCategory === cat.id
                                    ? { backgroundColor: cat.color }
                                    : { borderColor: selectedCategory === cat.id ? 'transparent' : '' }}
                            >
                                <span className="material-symbols-outlined text-lg opacity-70">{cat.icon || 'category'}</span>
                                {cat.name}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsCategoryManagerOpen(true)}
                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200 font-display font-semibold text-sm transition-all whitespace-nowrap ml-auto"
                        >
                            <span className="material-symbols-outlined text-lg">settings</span>
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">

                            {filteredVocabulary.map(item => {
                                const stars = getDifficultyStars(item.difficulty_level);
                                const itemColor = item.category_color || '#38BDF8';
                                const itemColorBg = `${itemColor}10`;
                                const itemColorBorder = `${itemColor}33`;

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white p-5 rounded-3xl border-4 shadow-xl shadow-slate-200/50 flashcard-hover flex flex-col items-center relative overflow-hidden group cursor-pointer"
                                        style={{ borderColor: itemColorBorder }}
                                        onClick={() => { setEditingItem(item); setIsFormOpen(true); }}
                                    >
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                                            <button
                                                onClick={(e) => onPlayAudio(item.audio_url, e)}
                                                className="w-8 h-8 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">volume_up</span>
                                            </button>
                                            <button
                                                onClick={(e) => onDelete(item.id, e)}
                                                className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>

                                        <div
                                            className="w-24 h-24 mb-4 rounded-full flex items-center justify-center ring-4 transition-transform group-hover:scale-110 duration-500 overflow-hidden"
                                            style={{
                                                backgroundColor: itemColorBg,
                                                color: itemColor,
                                                borderColor: `${itemColor}0d`
                                            }}
                                        >
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.word} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-5xl">{item.category_icon || 'image'}</span>
                                            )}
                                        </div>

                                        <h3 className="font-display text-2xl font-bold text-slate-900 text-center mb-1">{item.word}</h3>
                                        <p className="text-slate-500 font-medium mb-4 text-center line-clamp-1">{item.meaning}</p>

                                        <div className="mt-auto px-4 py-1.5 rounded-full bg-slate-100 flex items-center gap-1">
                                            <div className="flex gap-0.5">
                                                {[...Array(stars)].map((_, i) => (
                                                    <span key={i} className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                {item.difficulty_level || 'Beginner'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add New Card Button */}
                            <button
                                onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
                                className="bg-slate-50 border-4 border-dashed border-slate-200 p-5 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:bg-white hover:border-sky-400 hover:text-sky-400 transition-all group min-h-[250px]"
                            >
                                <span className="material-symbols-outlined text-5xl mb-2 group-hover:scale-110 transition-transform">add_circle_outline</span>
                                <span className="font-display font-bold">Add Word</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* FAB */}
                <div className="absolute bottom-8 right-8 z-20">
                    <button
                        onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
                        className="w-16 h-16 rounded-full bg-sky-400 text-white shadow-2xl shadow-sky-400/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-3xl">add</span>
                    </button>
                </div>
            </div>

            {/* Modals */}
            <CategoryManager
                isOpen={isCategoryManagerOpen}
                onClose={() => setIsCategoryManagerOpen(false)}
                onUpdate={actions.loadData}
            />
            <VocabularyFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={onSave}
                initialData={editingItem}
            />
        </>
    );
}
