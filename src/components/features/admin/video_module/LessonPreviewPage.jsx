import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Icon } from '../../../ui/AnimatedIcon';
import { useVocabularyManagement } from '../hooks/useVocabularyManagement';

export default function LessonPreviewPage() {
    const { lessonId } = useParams();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'full'; // 'video' or 'full'

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [duration, setDuration] = useState(0);

    // Simulation Mode State
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    const [simulatedProgress, setSimulatedProgress] = useState(0); // 0-100%
    const [simulatedTime, setSimulatedTime] = useState(0); // seconds

    useEffect(() => {
        const loadLesson = () => {
            const storedPreview = localStorage.getItem(`preview_lesson_${lessonId}`);
            if (storedPreview) {
                setLesson(JSON.parse(storedPreview));
            }
            setLoading(false);
        };
        loadLesson();
    }, [lessonId]);

    // --- Simulation Logic ---
    useEffect(() => {
        let interval;
        if (isSimulationMode && playing) {
            interval = setInterval(() => {
                setSimulatedTime(prev => {
                    const nextTime = prev + 1;
                    const maxTime = lesson?.durationSec || 600; // Default 10m if missing
                    if (nextTime >= maxTime) {
                        setPlaying(false);
                        return maxTime;
                    }
                    return nextTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSimulationMode, playing, lesson]);

    // Sync progress bar in simulation
    useEffect(() => {
        if (isSimulationMode && lesson) {
            const max = lesson.durationSec || 600;
            setSimulatedProgress((simulatedTime / max) * 100);
        }
    }, [simulatedTime, isSimulationMode, lesson]);

    const playerRef = useRef(null);

    const getCleanVideoUrl = (url) => {
        if (!url) return '';
        let input = url.trim();

        // 0. Pass through Blob or Supabase URLs
        if (input.startsWith('blob:') || input.includes('supabase.co') || input.endsWith('.mp4')) {
            return input;
        }

        // Robust Regex for all YouTube formats including shorts, m.youtube, youtu.be
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = input.match(youtubeRegex);
        if (match && match[1]) return `https://www.youtube.com/watch?v=${match[1]}`;

        // Handle raw ID (11 chars) ONLY if not a known URL format
        if (!input.includes('/') && !input.includes('.') && /^[a-zA-Z0-9_-]{11}$/.test(input)) {
            return `https://www.youtube.com/watch?v=${input}`;
        }

        return input;
    };

    const handleSimulationSeek = (e) => {
        const percent = parseFloat(e.target.value);
        const max = lesson.durationSec || 600;
        setSimulatedTime((percent / 100) * max);
        setSimulatedProgress(percent);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
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
                <div className="flex items-center gap-4">
                    {mode === 'full' && (
                        <button
                            onClick={() => {
                                setIsSimulationMode(!isSimulationMode);
                                setPlaying(false);
                                setVideoError(false);
                            }}
                            className={`text-xs px-3 py-1.5 rounded border transition-colors ${isSimulationMode
                                ? 'bg-[#0df2f2] text-[#102323] border-[#0df2f2] font-bold'
                                : 'text-[#90cbcb] border-[#316868] hover:border-[#0df2f2]'
                                }`}
                        >
                            {isSimulationMode ? 'Simulation Active' : 'Enable Simulation Mode'}
                        </button>
                    )}
                    <div className="text-[#90cbcb] text-sm hidden md:block">
                        {mode === 'video' ? 'Video Check Mode' : 'Interactive Preview'}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-5xl p-8 flex flex-col justify-center">

                {/* Visualizer Container */}
                <div className="relative aspect-video bg-[#0a1515] rounded-xl overflow-hidden border border-[#224949] shadow-2xl">

                    {isSimulationMode ? (
                        // --- SIMULATION PLAYER ---
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1c1c] p-10">
                            <Icon.Settings className="w-16 h-16 text-[#0df2f2] mb-4 opacity-50 animate-pulse" />
                            <h3 className="text-2xl font-bold text-white mb-2">Simulation Mode</h3>
                            <p className="text-[#90cbcb] mb-8 text-center max-w-md text-sm">
                                Testing logic without video stream. <br />
                                Checkpoints will trigger based on the timer below.
                            </p>

                            <div className="w-full max-w-lg bg-[#183434] p-6 rounded-xl border border-[#316868]">
                                <div className="flex items-center justify-between text-[#0df2f2] font-mono text-xl font-bold mb-4">
                                    <span>{formatTime(simulatedTime)}</span>
                                    <span>{formatTime(lesson.durationSec || 600)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={simulatedProgress}
                                    onChange={handleSimulationSeek}
                                    className="w-full h-2 bg-[#0a1515] rounded-lg appearance-none cursor-pointer accent-[#0df2f2]"
                                />
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => setPlaying(!playing)}
                                        className="w-12 h-12 rounded-full bg-[#0df2f2] flex items-center justify-center text-[#102323] hover:scale-110 transition-transform"
                                    >
                                        {playing ? <Icon.Pause className="w-6 h-6" /> : <Icon.Play className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // --- REAL PLAYER ---
                        <>
                            <ReactPlayer
                                ref={playerRef}
                                url={getCleanVideoUrl(lesson.videoUrl || '')}
                                width="100%"
                                height="100%"
                                controls={true}
                                playing={playing}
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                                onReady={() => {
                                    console.log('Preview Ready');
                                    setVideoError(false);
                                }}
                                onError={(e) => {
                                    console.error("Preview Error:", e);
                                    setVideoError(true);
                                }}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            showinfo: 0,
                                            modestbranding: 1,
                                            rel: 0
                                        }
                                    }
                                }}
                            />

                            {/* Error Fallback */}
                            {videoError && (
                                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-6 z-10">
                                    <Icon.VideoOff className="w-16 h-16 text-red-500 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Video Unavailable for Embedding</h3>
                                    <p className="text-[#90cbcb] mb-6 max-w-sm text-sm">
                                        The playback was blocked by the provider. <br />
                                        Use <strong>Simulation Mode</strong> to test checkpoints, or open directly on YouTube.
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                setIsSimulationMode(true);
                                                setVideoError(false);
                                            }}
                                            className="bg-[#224949] hover:bg-[#316868] text-white px-4 py-2 rounded font-bold transition-colors text-sm"
                                        >
                                            Switch to Simulation
                                        </button>
                                        <a
                                            href={getCleanVideoUrl(lesson.videoUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition-colors text-sm flex items-center gap-2"
                                        >
                                            <span>Open on YouTube</span>
                                            <Icon.ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Overlays / Checkpoints would go here */}
                {mode === 'full' && (
                    <div className="mt-6 p-4 bg-[#102323] rounded-lg border border-[#224949]">
                        <h3 className="text-[#0df2f2] font-bold mb-2">Lesson Details</h3>
                        <p className="text-white text-sm mb-2">{lesson.description || 'No description provided.'}</p>
                        <div className="flex gap-4 text-xs text-[#90cbcb]">
                            <span>Level: {lesson.difficultyLevel}</span>
                            <span>Mode: {isSimulationMode ? 'Logic Simulation' : 'Live Preview'}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
