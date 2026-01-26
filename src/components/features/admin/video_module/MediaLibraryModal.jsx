
import React, { useState, useEffect } from 'react';
import { Icon } from '../../../ui/AnimatedIcon';
import { storageRepository } from '../../../../data/storageRepository';
import { useToast } from '../../../shared/hooks/useToast';
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog';

export default function MediaLibraryModal({ isOpen, onClose, onSelect }) {
    const { toast } = useToast();
    const { showConfirm: confirm } = useConfirmDialog();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadVideos();
        }
    }, [isOpen]);

    const loadVideos = async () => {
        setLoading(true);
        const result = await storageRepository.listVideos();
        if (result.success) {
            setVideos(result.data);
        } else {
            setVideos([]);
            // Don't toast error on 404/empty bucket, just show empty state
            if (!result.error?.includes('Bucket not found')) {
                toast.error('Failed to load videos: ' + result.error);
            }
        }
        setLoading(false);
    };

    const handleDelete = async (file) => {
        const isConfirmed = await confirm({
            title: 'Delete Video?',
            message: `Are you sure you want to delete "${file.name}"? This cannot be undone.`,
            confirmText: 'Delete',
            type: 'danger'
        });

        if (isConfirmed) {
            setDeletingId(file.name);
            const result = await storageRepository.deleteVideo(file.name);
            if (result.success) {
                toast.success('Video deleted');
                setVideos(videos.filter(v => v.name !== file.name));
            } else {
                toast.error(result.error);
            }
            setDeletingId(null);
        }
    };

    const handleCopyUrl = (url) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard');
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#102323] border border-[#316868] rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl animate-scaleIn">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-[#224949]">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Icon.Video className="w-6 h-6 text-[#0df2f2]" />
                            Media Library
                        </h2>
                        <p className="text-[#90cbcb] text-sm mt-1">Manage validation videos uploaded to server</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#183434] rounded-full text-[#90cbcb] transition-colors">
                        <Icon.X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-[#90cbcb] gap-3">
                            <Icon.Spinner className="w-8 h-8 text-[#0df2f2]" />
                            <p>Loading videos...</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-[#5c8b8b] gap-2 border-2 border-dashed border-[#224949] rounded-xl">
                            <Icon.VideoOff className="w-12 h-12 opacity-50" />
                            <p>No videos found in library</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {videos.map((file) => (
                                <div key={file.id || file.name} className="group relative bg-[#0a1515] border border-[#224949] rounded-lg overflow-hidden hover:border-[#0df2f2] transition-colors">
                                    {/* Video Preview / Icon */}
                                    <div className="aspect-video bg-[#050a0a] flex items-center justify-center relative">
                                        <video
                                            src={file.publicUrl}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                            controls={false} // No controls for thumbnails
                                            muted
                                            onMouseOver={e => e.target.play().catch(() => { })}
                                            onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                                        />
                                        <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                                            {formatSize(file.metadata?.size)}
                                        </div>
                                    </div>

                                    {/* Actions Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end h-full">
                                        <div className="flex gap-2 justify-center mb-2">
                                            <button
                                                onClick={() => setPreviewVideo(file)}
                                                className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors border border-white/20"
                                            >
                                                Preview
                                            </button>
                                            <button
                                                onClick={() => onSelect(file.publicUrl)}
                                                className="bg-[#0df2f2] text-[#102323] px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 shadow-lg shadow-[#0df2f2]/20"
                                            >
                                                <Icon.Check className="w-4 h-4" />
                                                Select
                                            </button>
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleCopyUrl(file.publicUrl)}
                                                className="bg-[#183434] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#224949] transition-colors border border-[#316868]"
                                            >
                                                Copy URL
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(file)}
                                            disabled={deletingId === file.name}
                                            className="text-red-400 text-xs hover:text-red-300 flex items-center justify-center gap-1 mt-2 disabled:opacity-50"
                                        >
                                            {deletingId === file.name ? <Icon.Spinner className="w-3 h-3" /> : <Icon.Trash className="w-3 h-3" />}
                                            Delete File
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <p className="text-white text-xs truncate font-mono" title={file.name}>
                                            {file.name.substring(0, 20)}...
                                        </p>
                                        <p className="text-[#5c8b8b] text-[10px]">
                                            {new Date(file.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#224949] flex justify-end gap-2 bg-[#0d1c1c]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[#90cbcb] hover:text-white transition-colors text-sm"
                    >
                        Close
                    </button>
                    <button
                        onClick={loadVideos}
                        className="px-4 py-2 bg-[#183434] text-[#0df2f2] border border-[#316868] rounded-lg hover:bg-[#224949] transition-colors text-sm font-bold flex items-center gap-2"
                    >
                        <Icon.Refresh className="w-4 h-4" />
                        Refresh List
                    </button>
                </div>
            </div>

            {/* Preview Overlay */}
            {previewVideo && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn" onClick={() => setPreviewVideo(null)}>
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-[#316868]" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setPreviewVideo(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black/80 rounded-full transition-colors"
                        >
                            <Icon.X className="w-6 h-6" />
                        </button>
                        <video
                            src={previewVideo.publicUrl}
                            className="w-full h-full"
                            controls
                            autoPlay
                        />
                        <div className="absolute top-4 left-4 z-10">
                            <h3 className="text-white font-bold bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                                {previewVideo.name}
                            </h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

