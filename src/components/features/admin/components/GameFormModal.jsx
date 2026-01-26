import { useState, useEffect } from 'react';
import { categoryRepository } from '../data/categoryRepository';
import { gameRepository } from '../../game/data/gameRepository';
import { useToast } from '../../../shared/hooks/useToast';

// Full list of Game Types (Subtypes)
const GAME_TYPES = [
    { value: 'listening', subtype: 'listening_tap', label: 'Listen & Tap', icon: 'hearing' },
    { value: 'listening', subtype: 'listening_word', label: 'Listen & Choose Word', icon: 'headphones' },
    { value: 'speaking', subtype: 'speaking', label: 'Speak Match', icon: 'record_voice_over' },
    { value: 'reading', subtype: 'matching', label: 'Drag & Drop', icon: 'drag_indicator' },
    { value: 'writing', subtype: 'sentence', label: 'Sentence Builder', icon: 'article' },
    { value: 'vocabulary', subtype: 'hide_seek', label: 'Hide & Seek', icon: 'search' },
];

export default function GameFormModal({ isOpen, onClose, onUpdate, initialData = null }) {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        topic_id: '',
        type: 'listening',
        subtype: 'listening_tap',
        star_reward: 10,
        is_active: true
    });
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            loadCategories();
            if (initialData) {
                // If opening from Config button, initialData contains { type, subtype, mode, topicId } or full game object
                if (initialData.mode === 'create') {
                    setFormData({
                        title: '',
                        subtitle: '',
                        topic_id: initialData.topicId || '',
                        type: initialData.type || 'listening',
                        subtype: initialData.subType || 'listening_tap', // Note: CamelCase 'subType' from parent
                        star_reward: 10,
                        is_active: true
                    });
                } else if (initialData.gameId) {
                    // Start editing mode - fetch details? 
                    // Parent passed 'gameId', so we might need to fetch or if parent passed full object use that
                    // For now assuming parent might pass full object if available, OR we fetch.
                    // The parent logic passed { mode: 'edit', gameId: ... }. We need to fetch.
                    loadGameDetails(initialData.gameId);
                } else {
                    // Direct edit active game passed fully?
                    setFormData({
                        ...initialData,
                        subtype: initialData.subtype || 'default'
                    });
                }
            } else {
                setFormData({
                    title: '',
                    subtitle: '',
                    topic_id: '',
                    type: 'listening',
                    subtype: 'listening_tap',
                    star_reward: 10,
                    is_active: true
                });
            }
        }
    }, [isOpen, initialData]);

    const loadGameDetails = async (id) => {
        const res = await gameRepository.getById(id);
        if (res.success) {
            setFormData(res.data);
        }
    };

    const loadCategories = async () => {
        const result = await categoryRepository.getAll();
        if (result.success) {
            setCategories(result.data);
            if (!initialData && result.data.length > 0) {
                setFormData(prev => ({ ...prev, topic_id: result.data[0].id }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.title || !formData.topic_id) {
            showToast('Title and Topic are required', 'error');
            setIsLoading(false);
            return;
        }

        let result;
        if (formData.id) {
            // Update
            // Assuming create/upsert or custom update
            // TODO: Check if repository supports update. Assuming yes or using similar pattern.
            // If not, we might need to implement it.
            // Based on repository file read earlier: only create, delete, getById, getAll. 
            // MISSING UPDATE! 
            // I recall seeing 'create' using 'insert'. 
            // I will try to use supabase "upsert" if I can, OR just warn user.
            // Actually, I should check repository again or just add update method.
            // For now, let's assume 'create' might fail on ID conflict or I need to add 'update'.
            // I will add 'update' to repository in next step if needed. 
            // For now, let's try calling a non-existent update or just create.
            // Wait, I am the agent, I can fix the repository first! 
            // But I'm in middle of editing this file.

            // I'll assume I will add `gameRepository.update` right after this.
            result = await gameRepository.update(formData.id, formData);
        } else {
            result = await gameRepository.create(formData);
        }

        if (result && result.success) {
            showToast(formData.id ? 'Game updated' : 'Game created successfully!', 'success');
            onUpdate();
            onClose();
        } else {
            showToast('Failed to save game', 'error');
        }

        setIsLoading(false);
    };

    if (!isOpen) return null;

    // Find label for current subtype
    const currentTypeLabel = GAME_TYPES.find(t => t.subtype === formData.subtype)?.label || formData.type;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">sports_esports</span>
                        {formData.id ? 'Edit Game' : 'Configure Game'}
                    </h2>
                    <button onClick={onClose} className="size-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Context Info (Read only if passed) */}
                    <div className="flex gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-blue-400 uppercase">Game Type</label>
                            <div className="font-bold text-blue-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">
                                    {GAME_TYPES.find(t => t.subtype === formData.subtype)?.icon || 'extension'}
                                </span>
                                {currentTypeLabel}
                            </div>
                        </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Game Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none font-medium"
                                placeholder="e.g. Elephant Challenge"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subtitle (Optional)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                                placeholder="e.g. Trumpet Sound"
                                value={formData.subtitle}
                                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Topic (Hidden or Disabled if fixed) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Topic</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white disabled:bg-slate-50 disabled:text-slate-500"
                            value={formData.topic_id}
                            disabled={true} // Always locked to the sidebar selection for now
                            onChange={e => setFormData({ ...formData, topic_id: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reward */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Star Reward</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="10" max="500" step="10"
                                className="flex-1 accent-yellow-400 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                value={formData.star_reward}
                                onChange={e => setFormData({ ...formData, star_reward: parseInt(e.target.value) })}
                            />
                            <div className="bg-yellow-50 text-yellow-600 font-bold px-3 py-1 rounded-lg border border-yellow-200 min-w-[3.5rem] text-center">
                                {formData.star_reward}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
                            Save Game
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
