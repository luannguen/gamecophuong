import { useState, useEffect } from 'react';
import { categoryRepository } from '../data/categoryRepository';
import { gameRepository } from '../../game/data/gameRepository';
import { useToast } from '../../../shared/hooks/useToast';

const GAME_TYPES = [
    { value: 'listening', label: 'Listening', icon: 'hearing' },
    { value: 'speaking', label: 'Speaking', icon: 'record_voice_over' },
    { value: 'vocabulary', label: 'Vocabulary', icon: 'menu_book' },
    { value: 'puzzle', label: 'Puzzle', icon: 'extension' }
];

export default function GameFormModal({ isOpen, onClose, onUpdate, initialData = null }) {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        topic_id: '',
        type: 'listening',
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
                setFormData(initialData);
            } else {
                setFormData({
                    title: '',
                    subtitle: '',
                    topic_id: '',
                    type: 'listening',
                    star_reward: 10,
                    is_active: true
                });
            }
        }
    }, [isOpen, initialData]);

    const loadCategories = async () => {
        const result = await categoryRepository.getAll();
        if (result.success) {
            setCategories(result.data);
            // Default to first category if creating new
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
        if (initialData?.id) {
            // Update logic would go here if repository supported it directly,
            // or we repurpose create for now (assuming repository handles upsert or we add update mostly)
            // For now, let's assume create for new. 
            // TODO: Add update method to repository if missing.
            showToast('Update not fully implemented yet', 'info');
            result = { success: false }; // Placeholder
        } else {
            result = await gameRepository.create(formData);
        }

        if (result.success) {
            showToast(initialData ? 'Game updated' : 'Game created successfully!', 'success');
            onUpdate();
            onClose();
        } else if (result !== undefined) { // Check if we attempted
            showToast('Failed to save game', 'error');
        }

        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">sports_esports</span>
                        {initialData ? 'Edit Game' : 'Create New Game'}
                    </h2>
                    <button onClick={onClose} className="size-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                    {/* Topic & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Topic</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                                value={formData.topic_id}
                                onChange={e => setFormData({ ...formData, topic_id: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Game Type</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                {GAME_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
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
