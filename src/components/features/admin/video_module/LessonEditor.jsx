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

    const handleDeleteCheckpoint = (id) => {
        if (confirm('Delete this checkpoint?')) {
            const updated = checkpoints.filter(cp => cp.id !== id);
            setCheckpoints(updated);
        }
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
            await saveCheckpoints(unit.id, lesson.id, checkpoints);

            // 2. Save Lesson Version (Video, Difficulty)
            if (currentLesson.version?.id) {
                const updates = {
                    video_url: currentLesson.videoUrl,
                    difficulty: getDifficultyValue(currentLesson.difficultyLevel),
                    vocab_ids: currentLesson.target_vocabulary?.map(v => v.id) || []
                };
                console.log("Updating version:", updates);
                const verRes = await updateLessonVersion(currentLesson.version.id, updates);
                console.log("Version update result:", verRes);

                if (!verRes || !verRes.success) {
                    console.error("Version update failed:", verRes);
                    isSuccess = false;
                }
            }

            // 3. Save Lesson Details (Title)
            if (currentLesson.title !== lesson.title) {
                console.log("Updating lesson title:", currentLesson.title);
                const lessonRes = await updateLesson(unit.id, lesson.id, {
                    title: currentLesson.title
                });
                console.log("Lesson update result:", lessonRes);

                if (!lessonRes || !lessonRes.success) {
                    console.error("Lesson update failed:", lessonRes);
                    isSuccess = false;
                }
            }

            // 4. Save Vocabulary (Extract IDs)
            const vocabIds = currentLesson.target_vocabulary?.map(v => v.id) || [];
            console.log("Vocabulary IDs saved with Version:", vocabIds);

            if (isSuccess) toast.success('Lesson saved successfully!');
            else toast.error('Error saving lesson. Check console.');

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
                            <span className="text-[#90cbcb]">Lessons</span>
                            <span className="text-[#316868]">/</span>
                            <span className="text-[#90cbcb] font-bold">{unit.title}</span>
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
                        <div className="hidden lg:flex bg-center bg-no-repeat bg-cover rounded-full w-9 h-9 border-2 border-[#224949]" style={{ backgroundImage: 'url("https://i.pravatar.cc/150?img=12")' }} />
                    </div>
                </header>

                {/* VIDEO PLAYER SECTION (Fill remaining height above timeline) */}
                <div className="flex-1 flex flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
                    <div className="relative w-full max-w-5xl aspect-video bg-[#0a1515] rounded-xl overflow-hidden shadow-2xl border border-[#224949] group">
                        {currentLesson.videoUrl ? (
                            <ReactPlayer
                                key={currentLesson.videoUrl}
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
                                config={{
                                    youtube: { playerVars: { showinfo: 0, origin: window.location.origin } }
                                }}
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

                {/* MODAL */}
                <CheckpointEditorModal
                    isOpen={isModalOpen}
                    initialData={editingCheckpoint}
                    vocabulary={currentLesson.target_vocabulary || vocabulary}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveCheckpointFromModal}
                />

            </main>
        </div>
    );
}
