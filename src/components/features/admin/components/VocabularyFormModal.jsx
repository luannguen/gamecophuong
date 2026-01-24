import { useState, useEffect } from 'react';
import { categoryRepository } from '../data/categoryRepository';

export default function VocabularyFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        word: '',
        meaning: '',
        pronunciation: '',
        category: 'General',
        image_url: '',
        audio_url: '',
        is_active: true
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        const result = await categoryRepository.getAll();
        if (result.success && result.data.length > 0) {
            setCategories(result.data);
            // Only set default if not editing
            if (!initialData) {
                setFormData(prev => ({ ...prev, category_id: result.data[0].id }));
            }
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                word: initialData.word || '',
                meaning: initialData.meaning || '',
                pronunciation: initialData.pronunciation || '',
                category_id: initialData.category_id || (categories[0]?.id || ''),
                image_url: initialData.image_url || '',
                audio_url: initialData.audio_url || '',
                is_active: initialData.is_active ?? true
            });
        } else {
            setFormData({
                word: '',
                meaning: '',
                pronunciation: '',
                category_id: categories[0]?.id || '',
                image_url: '',
                audio_url: '',
                is_active: true
            });
        }
        setError(null);
    }, [initialData, isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Simple validation
        if (!formData.word || !formData.meaning) {
            setError('Word and Meaning are required');
            return;
        }

        const success = await onSubmit(formData);
        if (success) {
            onClose();
        } else {
            setError('Failed to save item');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Edit Word' : 'Add New Word'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Word (English)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="e.g. Elephant"
                            value={formData.word}
                            onChange={e => setFormData({ ...formData, word: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Meaning (Vietnamese)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="e.g. Con voi"
                            value={formData.meaning}
                            onChange={e => setFormData({ ...formData, meaning: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Pronunciation</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                                placeholder="/.../"
                                value={formData.pronunciation}
                                onChange={e => setFormData({ ...formData, pronunciation: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
                                value={formData.category_id}
                                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                            >
                                {categories.length > 0 ? (
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                ) : (
                                    <option value="">Loading...</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="https://..."
                            value={formData.image_url}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Audio URL</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="https://..."
                            value={formData.audio_url}
                            onChange={e => setFormData({ ...formData, audio_url: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl font-bold text-white bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-500/30 transition-all hover:scale-[1.02]"
                        >
                            {initialData ? 'Save Changes' : 'Add Word'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
