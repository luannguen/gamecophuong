import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Icon } from '../../../ui/AnimatedIcon';
import { useVocabularyManagement } from '../hooks/useVocabularyManagement'; // Should probably move to shared if used here

export default function LessonPreviewPage() {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [duration, setDuration] = useState(0);

    // Context for Vocab (mocking or fetching logic needed here in real app)
    // For now, we simulate fetching since this is a preview page.
    // In a real app, this should call an API.
    // We will attempt to retrieve from localStorage if available (simple dev fallback) or mock for now.

    useEffect(() => {
        // Mock Fetch for Preview (Replace with real API call)
        const loadLesson = () => {
            // In real app: const data = await api.getLesson(lessonId);
            // For Admin Preview, we often pass data via window or local storage if not fully persisted yet.
            // But following "Safe Preview" spec, this page should be able to load independent of editor state if persisted.

            // For this task, I'll assume we have a way to get the lesson, 
            // but since I don't have the backend active, I'll show a placeholder or try to read from a global store.

            // ... actually, to make this work effectively without backend right now, 
            // I will modify the Router to accept `state` from the navigation, 
            // BUT "New Tab" loses state. 
            // So, sticking to the "Truth": The robust way is fetching.
            // I will leave the fetch logic abstract/mocked for this specific file creation step
            // so the User can fill in the API hook later, or I can refine it if I see the API service file.
            // However, for the IMMEDIATE "Preview" button action, we can use `localStorage` as a temporary bridge for the preview content.

            const storedPreview = localStorage.getItem(`preview_lesson_${lessonId}`);
            if (storedPreview) {
                setLesson(JSON.parse(storedPreview));
            }
            setLoading(false);
        };
        loadLesson();
    }, [lessonId]);

    const playerRef = useRef(null);

    const getCleanVideoUrl = (url) => {
        if (!url) return '';
        let input = url.trim();
        // Regex as defined in useLessonEditor
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = input.match(youtubeRegex);
        if (match && match[1]) return `https://www.youtube.com/watch?v=${match[1]}`;
        return input;
    };

    if (loading) return <div className="p-8 text-white">Loading Preview...</div>;
    if (!lesson) return <div className="p-8 text-white text-center">Preview Data Not Found. <br /> Please save the lesson before previewing.</div>;

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-display">
            {/* Header */}
            <div className="w-full bg-[#102323] border-b border-[#224949] p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="bg-[#0df2f2] text-[#102323] text-xs font-bold px-2 py-1 rounded">PREVIEW WORKSPACE</span>
                    <h1 className="text-white font-bold ml-2">{lesson.title}</h1>
                </div>
                <div className="text-[#90cbcb] text-sm">
                    Admin Preview Mode • Progress Not Recorded
                </div>
            </div>

            {/* Video Container (Restricted Width for Realism) */}
            <div className="flex-1 w-full max-w-5xl p-8 flex flex-col justify-center">
                <div className="relative aspect-video bg-[#0a1515] rounded-xl overflow-hidden border border-[#224949] shadow-2xl">
                    <ReactPlayer
                        ref={playerRef}
                        url={getCleanVideoUrl(lesson.videoUrl || '')}
                        width="100%"
                        height="100%"
                        controls={true}
                        playing={playing}
                        onPlay={() => setPlaying(true)}
                        onPause={() => setPlaying(false)}
                        onReady={() => console.log('Preview Ready')}
                        onError={(e) => {
                            console.error("Preview Error:", e);
                            setVideoError(true);
                        }}
                        config={{
                            youtube: {
                                playerVars: {
                                    showinfo: 0,
                                    modestbranding: 1,
                                    origin: window.location.origin,
                                    rel: 0
                                }
                            }
                        }}
                    />

                    {/* Error State */}
                    {videoError && (
                        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-6">
                            <Icon.VideoOff className="w-16 h-16 text-red-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Unavailable in Preview</h3>
                            <a
                                href={getCleanVideoUrl(lesson.videoUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 bg-[#224949] hover:bg-[#316868] text-white px-4 py-2 rounded font-bold transition-colors"
                            >
                                Open on YouTube
                            </a>
                        </div>
                    )}
                </div>

                {/* Overlays / Checkpoints would go here */}
                <div className="mt-6 p-4 bg-[#102323] rounded-lg border border-[#224949]">
                    <h3 className="text-[#0df2f2] font-bold mb-2">Lesson Details</h3>
                    <p className="text-white text-sm mb-2">{lesson.description || 'No description provided.'}</p>
                    <div className="flex gap-4 text-xs text-[#90cbcb]">
                        <span>Level: {lesson.difficultyLevel}</span>
                        <span>Video Source: {lesson.videoUrl}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
