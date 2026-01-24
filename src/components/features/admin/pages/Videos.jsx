import { useState } from 'react';
import { useVideoList } from '../hooks/useVideoList';
import VideoFormModal from '../components/VideoFormModal';
import VideoPreviewModal from '../components/VideoPreviewModal';
import { useToast } from '../../../shared/hooks/useToast';
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog';

export default function AdminVideosPage() {
    const {
        videos,
        searchQuery,
        setSearchQuery,
        isLoading,
        createVideo,
        updateVideo,
        handleDelete
    } = useVideoList();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const { showToast } = useToast();
    const { confirm } = useConfirmDialog();

    // Handlers
    const handleCreate = async (data) => {
        const result = await createVideo(data);
        if (result.success) {
            showToast('Video created successfully', 'success');
            return true;
        } else {
            showToast(result.error || 'Failed to create', 'error');
            return false;
        }
    };

    const handleUpdate = async (data) => {
        if (!editingVideo) return false;
        const result = await updateVideo(editingVideo.id, data);
        if (result.success) {
            showToast('Video updated successfully', 'success');
            return true;
        } else {
            showToast(result.error || 'Failed to update', 'error');
            return false;
        }
    };

    const onDeleteClick = async (video) => {
        const confirmed = await confirm({
            title: 'Delete Video',
            message: `Are you sure you want to delete "${video.title}" ? `,
            type: 'danger',
            confirmText: 'Delete'
        });

        if (confirmed) {
            const success = await handleDelete(video.id);
            if (success) {
                showToast('Video deleted', 'success');
            } else {
                showToast('Failed to delete', 'error');
            }
        }
    };

    const openEditModal = (video) => {
        setEditingVideo(video);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingVideo(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Video Management</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        {videos.length} videos currently in your library
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search Input (Integrated) */}
                    <div className="relative hidden md:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all w-64 font-medium"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Add New Video
                    </button>
                </div>
            </div>

            {/* Mobile Search (visible only on small screens) */}
            <div className="md:hidden">
                <input
                    type="text"
                    placeholder="Search videos..."
                    className="w-full pl-4 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center p-20">
                        <div className="animate-spin size-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-20 text-center text-slate-400 border border-slate-100 shadow-sm">
                        <span className="material-symbols-outlined text-6xl mb-4 text-slate-200">movie</span>
                        <h3 className="text-lg font-bold text-slate-600 mb-2">No videos yet</h3>
                        <p className="max-w-md mx-auto mb-6">Start building your library by adding your first video lesson.</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            Add First Video
                        </button>
                    </div>
                ) : (
                    videos.map(video => (
                        <div key={video.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                            {/* Thumbnail Section - Click to Preview */}
                            <div
                                onClick={() => setPreviewVideo(video)}
                                className="relative aspect-video bg-slate-100 overflow-hidden group-hover:brightness-95 transition-all block cursor-pointer"
                            >
                                {video.thumbnail_url ? (
                                    <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                        <span className="material-symbols-outlined text-5xl opacity-50">play_circle</span>
                                    </div>
                                )}

                                {/* Play Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                                    <div className="size-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-3xl text-blue-600 ml-1">play_arrow</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                                    {video.duration || '0:00'}
                                </div>

                                {video.is_featured && (
                                    <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                        <span className="material-symbols-outlined text-[14px] filled">star</span> Featured
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] uppercase font-black tracking-widest border border-blue-100">
                                        {video.category || 'General'}
                                    </span>
                                    <span className={`text - [10px] font - bold px - 2 py - 0.5 rounded - full border ${video.level === 'Beginner' ? 'text-green-600 border-green-200 bg-green-50' :
                                        video.level === 'Intermediate' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' :
                                            'text-red-600 border-red-200 bg-red-50'
                                        } `}>
                                        {video.level}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors" title={video.title}>
                                    {video.title}
                                </h3>

                                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4 h-9">
                                    {video.description || 'No description provided.'}
                                </p>

                                {/* Actions Footer */}
                                <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between gap-2">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => openEditModal(video)}
                                            className="size-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => onDeleteClick(video)}
                                            className="size-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setPreviewVideo(video)}
                                        className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                    >
                                        PREVIEW <span className="material-symbols-outlined text-[14px]">play_circle</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <VideoFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingVideo ? handleUpdate : handleCreate}
                initialData={editingVideo}
            />

            <VideoPreviewModal
                isOpen={!!previewVideo}
                onClose={() => setPreviewVideo(null)}
                video={previewVideo}
            />
        </div>
    );
}
