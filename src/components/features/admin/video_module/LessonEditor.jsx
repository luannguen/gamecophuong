import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import { Icon } from '../../../ui/AnimatedIcon';
import CheckpointTimeline from './CheckpointTimeline';
import CheckpointTable from './CheckpointTable';
import LessonMetadataSidebar from './LessonMetadataSidebar';
import CheckpointEditorModal from './CheckpointEditorModal';
import { useVocabularyManagement } from '../hooks/useVocabularyManagement';
import { useLessonEditor } from '../hooks/useLessonEditor';

export default function LessonEditor({ unit, lesson, onBack, saveCheckpoints, updateLessonVersion, updateLesson, categories, onRefresh }) {
    const { vocabulary } = useVocabularyManagement();

    const {
        // State
        currentLesson,
        currentTime,
        duration,
        playing,
        checkpoints,
        videoError,
        isModalOpen,
        editingCheckpoint,
        checkpointToDelete,
        isEmbedded, // New state from hook

        // Actions
        setPlaying,
        setVideoError,
        setDuration,
        setIsModalOpen,
        setCheckpointToDelete,
        getCleanVideoUrl,

        // Handlers
        handleProgress,
        handleSeek,
        handleAddCheckpoint,
        handleEditCheckpoint,
        handleSaveCheckpointFromModal,
        handleDeleteCheckpoint,
        handleConfirmDelete,
        handleMetadataUpdate,
        handleSave,

        // Refs
        playerRef
    } = useLessonEditor({
        unit,
        lesson,
        saveCheckpoints,
        updateLessonVersion,
        updateLesson,
        vocabulary
    });

    if (!lesson) return null;

    return (
        <div className="flex h-screen -m-8 w-[calc(100%+4rem)] bg-[#f5f8f8] dark:bg-[#102222] overflow-hidden font-display">

            {/* LEFT SIDEBAR: Metadata */}
            <LessonMetadataSidebar
                lesson={currentLesson}
                vocabulary={vocabulary}
                categories={categories}
                onUpdate={handleMetadataUpdate}
            />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col bg-black relative min-w-0">

                {/* HEADER (Breadcrumbs & Actions) */}
                <header className="flex items-center justify-between border-b border-[#224949] px-6 py-3 bg-[#102323] shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="text-[#0df2f2] hover:text-white transition-colors">
                            <Icon.ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-[#224949] mx-2"></div>
                        <div className="flex flex-wrap gap-2 items-center text-sm">
                            <button onClick={onBack} className="text-[#90cbcb] hover:text-[#0df2f2] transition-colors">Lessons</button>
                            <span className="text-[#316868]">/</span>
                            <button onClick={onBack} className="text-[#90cbcb] font-bold hover:text-[#0df2f2] transition-colors">{unit.title}</button>
                            <span className="text-[#316868]">/</span>
                            <span className="text-white font-medium">{currentLesson.title}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                // Sync current state to local storage for preview
                                localStorage.setItem(`preview_lesson_${lesson.id}`, JSON.stringify(currentLesson));
                                window.open(`/admin/video/preview/${lesson.id}`, '_blank');
                            }}
                            className="flex items-center gap-2 text-[#90cbcb] hover:text-[#0df2f2] px-3 py-2 rounded-lg text-sm font-bold transition-colors border border-[#316868] hover:border-[#0df2f2]"
                        >
                            <Icon.ExternalLink className="w-4 h-4" />
                            <span>Preview Lesson</span>
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-[#0df2f2] text-[#102323] px-4 py-2 rounded-lg text-sm font-bold shadow-[0_4px_20px_rgba(13,242,242,0.4)] hover:scale-105 transition-transform"
                        >
                            <span>Save Changes</span>
                        </button>
                    </div>
                </header>

                {/* VIDEO PLAYER SECTION (Fill remaining height above timeline) */}
                <div className="flex-1 flex flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
                    {/* Debug Controls */}
                    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
                        {isEmbedded && (
                            <div className="bg-yellow-600/90 text-white px-3 py-2 rounded shadow-lg text-xs font-bold max-w-xs text-right animate-pulse">
                                ⚠️ Running in Iframe/Preview Mode. <br />
                                Video playback may be restricted by browser security.
                            </div>
                        )}
                    </div>

                    <div
                        id="video-container-wrapper"
                        className="relative w-full max-w-5xl aspect-video bg-[#0a1515] rounded-xl overflow-hidden shadow-2xl border border-[#224949]"
                        style={{ zIndex: 10, pointerEvents: 'all' }}
                    >
                        {currentLesson.videoUrl ? (
                            <ReactPlayer
                                key={currentLesson.videoUrl} // Force remount on URL change
                                ref={playerRef}
                                url={getCleanVideoUrl(currentLesson.videoUrl || '')}
                                width="100%"
                                height="100%"
                                controls={true}
                                playing={playing}
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                                onProgress={handleProgress}
                                onReady={() => {
                                    console.log("Player Ready. Duration:", playerRef.current?.getDuration());
                                    console.log("Internal Player:", playerRef.current?.getInternalPlayer?.()); // Debug log
                                    if (playerRef.current) {
                                        setDuration(playerRef.current.getDuration());
                                    }
                                }}
                                onError={(e) => {
                                    console.error("Video Load Error details:", e);
                                    setVideoError(true);
                                }}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            showinfo: 0,
                                            modestbranding: 1,
                                            origin: window.location.origin, // Fix for black screen on some browsers
                                            rel: 0 // Prevent related videos from other channels
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                <Icon.Video className="text-6xl mb-4 opacity-20" />
                                <p className="font-bold">No Video Selected</p>
                            </div>
                        )}

                        {/* Fallback UI for Restricted Videos */}
                        {videoError && currentLesson.videoUrl && (
                            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
                                <Icon.VideoOff className="w-16 h-16 text-red-500 mb-4 opacity-80" />
                                <h3 className="text-xl font-bold text-white mb-2">Video Cannot Be Played Here</h3>
                                <p className="text-[#90cbcb] mb-6 max-w-md">
                                    The video owner may have disabled embedding, or the URL is restricted.
                                    You can still watch it on YouTube.
                                </p>
                                <a
                                    href={getCleanVideoUrl(currentLesson.videoUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold transition-transform hover:scale-105 shadow-xl"
                                >
                                    <span>Open on YouTube</span>
                                    <Icon.ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* BOTTOM SECTION: Timeline + Table */}
                <div className="shrink-0 flex flex-col z-10 bg-[#102323] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <CheckpointTimeline
                        duration={duration}
                        currentTime={currentTime}
                        checkpoints={checkpoints}
                        onSeek={handleSeek}
                        onAddCheckpoint={handleAddCheckpoint}
                        onSelectCheckpoint={handleEditCheckpoint}
                    />

                    <CheckpointTable
                        checkpoints={checkpoints}
                        vocabulary={vocabulary}
                        onEdit={handleEditCheckpoint}
                        onDelete={handleDeleteCheckpoint}
                        onJumpTo={handleSeek}
                    />
                </div>

                {/* EDIT MODAL */}
                <CheckpointEditorModal
                    isOpen={isModalOpen}
                    initialData={editingCheckpoint}
                    vocabulary={currentLesson.target_vocabulary || vocabulary}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveCheckpointFromModal}
                />

                {/* DELETE CONFIRMATION MODAL */}
                {checkpointToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-[#102323] border border-[#224949] p-6 rounded-xl shadow-2xl max-w-sm w-full animate-scaleIn">
                            <h3 className="text-lg font-bold text-white mb-2">Delete Checkpoint?</h3>
                            <p className="text-[#90cbcb] text-sm mb-6">Are you sure you want to delete this checkpoint? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setCheckpointToDelete(null)}
                                    className="px-4 py-2 rounded-lg text-[#90cbcb] hover:bg-[#183434] transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all text-sm font-bold shadow-[0_2px_10px_rgba(239,68,68,0.2)]"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
