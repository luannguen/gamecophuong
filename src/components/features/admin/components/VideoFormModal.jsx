import { useState, useEffect } from 'react';
import { VIDEO_CATEGORIES } from '../../../../data/designAssets';

export default function VideoFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        duration: '',
        level: 'Beginner',
        category: 'Animals', // Default
        thumbnail_url: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                video_url: initialData.video_url || '',
                duration: initialData.duration || '',
                level: initialData.level || 'Beginner',
                category: initialData.category || 'Animals',
                thumbnail_url: initialData.thumbnail_url || '',
                description: initialData.description || '',
                is_featured: initialData.is_featured || false
            });
        } else {
            setFormData({
                title: '',
                video_url: '',
                duration: '',
                level: 'Beginner',
                category: 'Animals',
                thumbnail_url: '',
                description: '',
                is_featured: false
            });
        }
        setError(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Simple validation
        if (!formData.title || !formData.video_url) {
            setError('Title and URL are required');
            return;
        }

        const success = await onSubmit(formData);
        if (success) {
            onClose();
        } else {
            setError('Failed to save video');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Edit Video' : 'Add New Video'}
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
                        <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="e.g. Learning Colors"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Video URL (Youtube/MP4)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="https://..."
                            value={formData.video_url}
                            onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Duration</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                                placeholder="e.g. 5 mins"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Level</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
                                value={formData.level}
                                onChange={e => setFormData({ ...formData, level: e.target.value })}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {VIDEO_CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Thumbnail URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                                placeholder="https://..."
                                value={formData.thumbnail_url}
                                onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none h-24"
                            placeholder="Brief description of the lesson content..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer" onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}>
                        <div className={`size-5 rounded border flex items-center justify-center transition-colors ${formData.is_featured ? 'bg-yellow-400 border-yellow-400' : 'bg-white border-slate-300'}`}>
                            {formData.is_featured && <span className="material-symbols-outlined text-sm text-yellow-900 font-bold">check</span>}
                        </div>
                        <span className="text-sm font-bold text-slate-700">Mark as Featured Video</span>
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
                            {initialData ? 'Save Changes' : 'Create Video'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
