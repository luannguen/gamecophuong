import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../../../shared/hooks/useToast';

export function useLessonEditor({ unit, lesson, saveCheckpoints, updateLessonVersion, updateLesson, vocabulary }) {
    const { toast } = useToast();

    // --- State ---
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(lesson?.durationSec || 0);
    const [playing, setPlaying] = useState(false);
    const [checkpoints, setCheckpoints] = useState(lesson?.version?.checkpoints || []);
    const [videoError, setVideoError] = useState(false);
    const [isEmbedded, setIsEmbedded] = useState(false);

    // Editor State
    const [currentLesson, setCurrentLesson] = useState(lesson || {});

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCheckpoint, setEditingCheckpoint] = useState(null);
    const [checkpointToDelete, setCheckpointToDelete] = useState(null);

    // Refs
    const playerRef = useRef(null);
    const lastTriggeredCheckpointId = useRef(null);
    const lastProgressTime = useRef(0);

    // --- Effects ---
    // Sync props to internal state
    useEffect(() => {
        if (lesson) {
            setCheckpoints(lesson.version?.checkpoints || []);

            // Hydrate Vocab
            let hydratedVocab = [];
            if (lesson.vocab_ids && Array.isArray(lesson.vocab_ids) && vocabulary.length > 0) {
                hydratedVocab = lesson.vocab_ids
                    .map(id => vocabulary.find(v => v.id === id))
                    .filter(Boolean);
            } else if (lesson.target_vocabulary) {
                hydratedVocab = lesson.target_vocabulary;
            }

            setCurrentLesson({ ...lesson, target_vocabulary: hydratedVocab });
            setVideoError(false);
        }
    }, [lesson, vocabulary]);

    // Check for Iframe/Sandbox environment
    useEffect(() => {
        try {
            const embedded = window.self !== window.top;
            setIsEmbedded(embedded);
            if (embedded) console.warn("App is running inside an iframe. YouTube playback might be restricted.");
        } catch (e) {
            console.error("Error checking iframe status:", e);
        }
    }, []);


    // --- Helpers ---
    const getCleanVideoUrl = (url) => {
        if (!url) return '';
        let input = url.trim();

        // 0. Pass through Blob or Supabase URLs (or likely direct files)
        if (input.startsWith('blob:') || input.includes('supabase.co') || input.endsWith('.mp4')) {
            return input;
        }

        // 1. Handle Iframe Paste
        if (input.includes('<iframe')) {
            const srcMatch = input.match(/src=["'](.*?)["']/);
            if (srcMatch && srcMatch[1]) input = srcMatch[1];
        }

        // 2. Extract Video ID (Robust)
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = input.match(youtubeRegex);

        if (match && match[1]) {
            return `https://www.youtube.com/watch?v=${match[1]}`;
        }

        // 3. Handle raw ID (11 chars, only if NOT a URL)
        // If it looks like a URL (has / or .), don't treat as ID
        if (!input.includes('/') && !input.includes('.') && /^[a-zA-Z0-9_-]{11}$/.test(input)) {
            return `https://www.youtube.com/watch?v=${input}`;
        }

        return input;
    };

    const getDifficultyValue = (level) => {
        if (typeof level === 'number') return level;
        switch (level) {
            case 'Beginner': return 1;
            case 'Intermediate': return 2;
            case 'Advanced': return 3;
            case 'Professional': return 4;
            default: return 2;
        }
    };


    // --- Handlers: Video & Checkpoints ---
    const handleProgress = (state) => {
        const newTime = state.playedSeconds;
        const prevTime = lastProgressTime.current;

        // Checkpoint Logic (Time Window: prevTime -> newTime)
        if (playing && newTime > prevTime) {
            const cp = checkpoints.find(c =>
                c.timeSec > prevTime &&
                c.timeSec <= newTime + 0.25 // small buffer
            );

            if (cp) {
                if (lastTriggeredCheckpointId.current !== cp.id) {
                    console.log("Checkpoint triggered:", cp);
                    setPlaying(false);
                    toast.success(`Checkpoint: ${cp.type}`);
                    lastTriggeredCheckpointId.current = cp.id;
                }
            }
        }

        setCurrentTime(newTime);
        lastProgressTime.current = newTime;
    };

    const handleSeek = (time) => {
        if (playerRef.current) {
            if (typeof playerRef.current.seekTo === 'function') {
                // ReactPlayer
                playerRef.current.seekTo(time, 'seconds');
            } else {
                // Native Video
                playerRef.current.currentTime = time;
            }
            setCurrentTime(time);
            lastProgressTime.current = time; // Reset tracker
        }
    };

    const handleAddCheckpoint = (time, type) => {
        setPlaying(false);
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
        setCheckpointToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (checkpointToDelete) {
            const updated = checkpoints.filter(cp => cp.id !== checkpointToDelete);
            setCheckpoints(updated);
            setCheckpointToDelete(null);
        }
    };

    const handleMetadataUpdate = (newData) => {
        setCurrentLesson(newData);
        if (newData.videoUrl !== currentLesson.videoUrl) {
            setVideoError(false);
        }
    };

    // --- Handlers: Persistence ---
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

            // 2. Save Lesson Version
            if (currentLesson.version?.id) {
                const updates = {
                    video_url: getCleanVideoUrl(currentLesson.videoUrl || ''),
                    difficulty: getDifficultyValue(currentLesson.difficultyLevel),
                    vocab_ids: currentLesson.target_vocabulary?.map(v => v.id) || []
                };
                const verRes = await updateLessonVersion(currentLesson.version.id, updates);
                if (!verRes.success) {
                    console.error("Version update failed:", verRes.error);
                    isSuccess = false;
                }
            }

            // 3. Save Lesson Details (Title, Description)
            if (currentLesson.title !== lesson.title || currentLesson.description !== lesson.description) {
                const lessonRes = await updateLesson(unit.id, lesson.id, {
                    title: currentLesson.title,
                    description: currentLesson.description
                });
                if (!lessonRes.success) {
                    console.error("Lesson update failed:", lessonRes.error);
                    isSuccess = false;
                }
            }

            if (isSuccess) {
                toast.success('Lesson saved successfully!');
            } else {
                toast.error('Check console for save errors.');
            }

        } catch (e) {
            console.error("Unexpected error in handleSave:", e);
            toast.error('Unexpected error saving lesson.');
        }
    };

    return {
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
        isEmbedded,

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
    };
}
