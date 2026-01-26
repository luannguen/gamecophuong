import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Icon } from '../../../ui/AnimatedIcon';
import CheckpointTimeline from './CheckpointTimeline';
import CheckpointTable from './CheckpointTable';
import LessonMetadataSidebar from './LessonMetadataSidebar';
import CheckpointEditorModal from './CheckpointEditorModal';
import { useWatchAndLearn } from '../hooks/useWatchAndLearn';
import { v4 as uuidv4 } from 'uuid';
import { useVocabularyManagement } from '../hooks/useVocabularyManagement';

import { useToast } from '../../../shared/hooks/useToast';

export default function LessonEditor({ unit, lesson, onBack }) {
    const { saveCheckpoints, updateLessonVersion, updateLesson, categories } = useWatchAndLearn();
    const { vocabulary } = useVocabularyManagement();
    const { toast } = useToast();
    // State
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(lesson?.durationSec || 0);
    const [playing, setPlaying] = useState(false);
    const [checkpoints, setCheckpoints] = useState(lesson?.version?.checkpoints || []);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCheckpoint, setEditingCheckpoint] = useState(null);

    const [currentLesson, setCurrentLesson] = useState(lesson || {});

    const playerRef = useRef(null);

    // Sync state internally
    useEffect(() => {
        if (lesson) {
            setCheckpoints(lesson.version?.checkpoints || []);

            // Hydrate Vocabulary IDs to Objects for UI
            let hydratedVocab = [];
            if (lesson.vocab_ids && Array.isArray(lesson.vocab_ids) && vocabulary.length > 0) {
                hydratedVocab = lesson.vocab_ids
                    .map(id => vocabulary.find(v => v.id === id))
                    .filter(Boolean);
            } else if (lesson.target_vocabulary) {
                hydratedVocab = lesson.target_vocabulary;
            }

            setCurrentLesson({ ...lesson, target_vocabulary: hydratedVocab });
        }
    }, [lesson, vocabulary]);

    if (!lesson) return null;

    const handleProgress = (state) => {
        setCurrentTime(state.playedSeconds);
    };

    const handleSeek = (time) => {
        if (playerRef.current) {
            playerRef.current.seekTo(time, 'seconds');
            setCurrentTime(time);
        }
    };

    const handleAddCheckpoint = (time, type) => {
        setPlaying(false); // Pause
        const newCp = {
            id: `cp_${uuidv4()}`,
            timeSec: Math.floor(time || currentTime),
            type: type || 'vocab',
            vocabId: '',
            content: { question: '', options: ['', '', '', ''], answer: '', note: '' }
        };
        setEditingCheckpoint(newCp);
        setIsModalOpen(true);
    };

    const handleEditCheckpoint = (cp) => {
        setPlaying(false);
        setEditingCheckpoint(cp);
        setIsModalOpen(true);
    };

    const handleSaveCheckpointFromModal = (updatedCp) => {
        // Find if exists or new
        const exists = checkpoints.find(c => c.id === updatedCp.id);
        let newCheckpoints;
        if (exists) {
            newCheckpoints = checkpoints.map(c => c.id === updatedCp.id ? updatedCp : c);
        } else {
            newCheckpoints = [...checkpoints, updatedCp];
        }

        newCheckpoints.sort((a, b) => a.timeSec - b.timeSec);
        setCheckpoints(newCheckpoints);
        setIsModalOpen(false);
        setEditingCheckpoint(null);
    };

    // Confirm Delete State
    const [checkpointToDelete, setCheckpointToDelete] = useState(null);

    const handleConfirmDelete = () => {
        if (checkpointToDelete) {
            const updated = checkpoints.filter(cp => cp.id !== checkpointToDelete);
            setCheckpoints(updated);
            setCheckpointToDelete(null);
        }
    };

    const handleDeleteCheckpoint = (id) => {
        setCheckpointToDelete(id);
    };

    const getDifficultyValue = (level) => {
        if (typeof level === 'number') return level;
        switch (level) {
            case 'Beginner': return 1;
            case 'Intermediate': return 2;
            case 'Advanced': return 3;
            case 'Professional': return 4;
            default: return 2; // Default to Intermediate
        }
    };

    const handleSave = async () => {
        let isSuccess = true;
        console.log("Saving lesson...", { currentLesson, checkpoints });

        try {
            // 1. Save Checkpoints
            const cpRes = await saveCheckpoints(unit.id, lesson.id, checkpoints);
            if (!cpRes.success) {
                console.error("Checkpoint save failed:", cpRes.error);
                isSuccess = false;
            }

            // 2. Save Lesson Version (Video, Difficulty)
            if (currentLesson.version?.id) {
                const updates = {
                    video_url: currentLesson.videoUrl,
                    difficulty: getDifficultyValue(currentLesson.difficultyLevel),
                    vocab_ids: currentLesson.target_vocabulary?.map(v => v.id) || []
                };
                console.log("Updating version:", updates);
                const verRes = await updateLessonVersion(currentLesson.version.id, updates);
                if (!verRes.success) {
                    console.error("Version update failed:", verRes.error);
                    isSuccess = false;
                }
            }

            // 3. Save Lesson Details (Title)
            if (currentLesson.title !== lesson.title) {
                const lessonRes = await updateLesson(unit.id, lesson.id, {
                    title: currentLesson.title
                });
                if (!lessonRes.success) {
                    console.error("Lesson update failed:", lessonRes.error);
                    isSuccess = false;
                }
            }

            if (isSuccess) toast.success('Lesson saved successfully!');
            else toast.error('Check console for save errors.');

        } catch (e) {
            console.error("Unexpected error in handleSave:", e);
            toast.error('Unexpected error saving lesson.');
        }
    };

    const handleMetadataUpdate = (newData) => {
        setCurrentLesson(newData);
    };

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
                    <div className="flex items-center gap-4">
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
                    <div className="relative w-full max-w-5xl aspect-video bg-[#0a1515] rounded-xl overflow-hidden shadow-2xl border border-[#224949] group">
                        {currentLesson.videoUrl ? (
                            <ReactPlayer
                                ref={playerRef}
                                url={currentLesson.videoUrl}
                                width="100%"
                                height="100%"
                                controls={true}
                                playing={playing}
                                onProgress={handleProgress}
                                onReady={() => {
                                    if (playerRef.current) {
                                        setDuration(playerRef.current.getDuration());
                                    }
                                }}
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                <Icon.Video className="text-6xl mb-4 opacity-20" />
                                <p className="font-bold">No Video Selected</p>
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
