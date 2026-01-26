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

    // Checkpoint State
    const [checkpoints, setCheckpoints] = useState([]);
    const [activeCheckpoint, setActiveCheckpoint] = useState(null);
    const lastTriggeredTime = useRef(-1);

    // Initialize Checkpoints
    useEffect(() => {
        if (lesson) {
            console.log("Preview Loaded Lesson:", lesson);
            // Robust path: Direct check -> Version check -> Empty
            const loadedCheckpoints = lesson.version?.checkpoints || lesson.checkpoints || [];
            console.log("Loaded Checkpoints:", loadedCheckpoints);
            setCheckpoints(loadedCheckpoints);
        }
    }, [lesson]);

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

    // Checkpoint Checker
    const checkCheckpoints = (currentTime) => {
        if (!checkpoints.length) return;

        // Find checkpoint in the last processed window (prev -> current)
        // We use a small window to avoid skipping fast seeks, but prevent double triggers
        const cp = checkpoints.find(c =>
            c.timeSec <= currentTime &&
            c.timeSec > lastTriggeredTime.current &&
            Math.abs(currentTime - c.timeSec) < 2 // 2s window
        );

        if (cp) {
            console.log("Triggering Checkpoint:", cp);
            setActiveCheckpoint(cp);

            // LOGIC SPLIT: Only pause if Study Mode
            if (isStudyMode) {
                setPlaying(false);
            }

            lastTriggeredTime.current = currentTime;
        } else {
            // Update tracker if we moved forward significantly without triggering
            if (currentTime > lastTriggeredTime.current) {
                lastTriggeredTime.current = currentTime;
            }
        }
    };

    // --- Simulation Logic ---
    useEffect(() => {
        let interval;
        if (isSimulationMode && playing) {
            interval = setInterval(() => {
                setSimulatedTime(prev => {
                    const nextTime = prev + 1;
                    const maxTime = lesson?.durationSec || 600;

                    checkCheckpoints(nextTime);

                    if (nextTime >= maxTime) {
                        setPlaying(false);
                        return maxTime;
                    }
                    return nextTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSimulationMode, playing, lesson, checkpoints]);

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

        // Robust Regex
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = input.match(youtubeRegex);
        if (match && match[1]) return `https://www.youtube.com/watch?v=${match[1]}`;

        // Handle raw ID
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

    // Force Native Video Pause/Play Sync
    useEffect(() => {
        if (playerRef.current && playerRef.current instanceof HTMLVideoElement) {
            if (playing) {
                playerRef.current.play().catch(e => console.warn("Play interrupted", e));
            } else {
                playerRef.current.pause();
            }
        }
    }, [playing]);

    // Interaction Mode State
    const [isStudyMode, setIsStudyMode] = useState(true); // Default to Study Mode (Pause) for Preview

    if (loading) return <div className="p-8 text-white">Loading Preview...</div>;
    if (!lesson) return <div className="p-8 text-white text-center">Preview Data Not Found. <br /> Please save the lesson before previewing.</div>;

    // Helper to find vocab details
    const getVocabDetails = (vocabId) => {
        return lesson.target_vocabulary?.find(v => v.id === vocabId);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-display relative">

            {/* OVERLAY: Checkpoint Interaction */}
            {activeCheckpoint && (
                isStudyMode ? (
                    // --- STUDY MODE (Blocking) ---
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
                        <div className="bg-[#102323] border border-[#0df2f2] p-8 rounded-2xl shadow-[0_0_50px_rgba(13,242,242,0.3)] max-w-lg w-full text-center relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#0df2f2] to-transparent"></div>

                            {activeCheckpoint.type === 'vocab' ? (
                                // VOCAB CARD UI
                                (() => {
                                    const vocab = getVocabDetails(activeCheckpoint.vocabId);
                                    return (
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-[#0a1515] rounded-full flex items-center justify-center border-2 border-[#0df2f2] mb-6 shadow-lg">
                                                <Icon.Book className="w-8 h-8 text-[#0df2f2]" />
                                            </div>
                                            <h2 className="text-3xl font-bold text-white mb-1">{vocab?.term || 'Unknown Word'}</h2>
                                            <p className="text-[#90cbcb] font-mono mb-4 text-sm">{vocab?.ipa || '/.../'}</p>
                                            <p className="text-xl text-[#0df2f2] mb-8 font-medium">"{vocab?.definition || activeCheckpoint.content?.note || 'Definition...'}"</p>

                                            <button
                                                onClick={() => {
                                                    setActiveCheckpoint(null);
                                                    setPlaying(true);
                                                }}
                                                className="bg-[#0df2f2] hover:bg-[#0acaca] text-[#102323] px-10 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-[0_4px_15px_rgba(13,242,242,0.4)]"
                                            >
                                                Got it!
                                            </button>
                                        </div>
                                    );
                                })()
                            ) : (
                                // QUIZ UI
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-[#0a1515] rounded-full flex items-center justify-center border border-[#ffb020] mb-6">
                                        <Icon.HelpCircle className="w-8 h-8 text-[#ffb020]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-6">
                                        {activeCheckpoint.content?.question || "Quick Question"}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3 w-full mb-8">
                                        {activeCheckpoint.content?.options?.filter(o => o).map((opt, idx) => (
                                            <button
                                                key={idx}
                                                className="bg-[#0a1515] hover:bg-[#183434] border border-[#224949] hover:border-[#0df2f2] text-[#90cbcb] hover:text-white p-3 rounded-lg transition-all text-left"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActiveCheckpoint(null);
                                            setPlaying(true);
                                        }}
                                        className="text-[#90cbcb] hover:text-white text-sm hover:underline"
                                    >
                                        Skip for now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // --- NORMAL MODE (Non-Blocking Toast) ---
                    <div className="absolute top-8 right-8 z-50 animate-slideInRight">
                        <div className="bg-[#102323]/90 backdrop-blur border-l-4 border-[#0df2f2] p-4 rounded-r shadow-2xl max-w-sm flex items-start gap-3">
                            <div className="bg-[#0df2f2]/20 p-2 rounded-full shrink-0">
                                {activeCheckpoint.type === 'vocab' ? <Icon.Book className="w-5 h-5 text-[#0df2f2]" /> : <Icon.HelpCircle className="w-5 h-5 text-[#ffb020]" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">
                                    {activeCheckpoint.type === 'vocab' ? 'New Word' : 'Quick Quiz'}
                                </h4>
                                <p className="text-[#90cbcb] text-sm mb-3 line-clamp-2">
                                    {activeCheckpoint.type === 'vocab'
                                        ? (getVocabDetails(activeCheckpoint.vocabId)?.term || "Vocabulary Item")
                                        : (activeCheckpoint.content?.question || "Question Checkpoint")
                                    }
                                </p>
                                <button
                                    onClick={() => setActiveCheckpoint(null)}
                                    className="text-xs bg-[#224949] hover:bg-[#316868] text-white px-3 py-1.5 rounded transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )
            )}

            {/* Header */}
            <div className="w-full bg-[#102323] border-b border-[#224949] p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <span className="bg-[#0df2f2] text-[#102323] text-xs font-bold px-2 py-1 rounded">PREVIEW WORKSPACE</span>
                    <h1 className="text-white font-bold ml-2">{lesson?.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    {mode === 'full' && (
                        <>
                            {/* Interaction Mode Toggle */}
                            <button
                                onClick={() => setIsStudyMode(!isStudyMode)}
                                className={`text-xs px-3 py-1.5 rounded flex items-center gap-2 border transition-colors ${isStudyMode
                                    ? 'bg-[#224949] text-white border-[#316868]'
                                    : 'text-[#90cbcb] border-[#183434] hover:bg-[#102323]'
                                    }`}
                                title={isStudyMode ? "Study Mode: Pauses Video" : "Flow Mode: Non-blocking"}
                            >
                                {isStudyMode ? <Icon.Lock className="w-3 h-3" /> : <Icon.Unlock className="w-3 h-3" />}
                                {isStudyMode ? 'Study Mode' : 'Normal Mode'}
                            </button>

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
                        </>
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
                                    <span>{formatTime(lesson?.durationSec || 600)}</span>
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
                        // --- REAL PLAYER (HYBRID) ---
                        <>
                            {(() => {
                                const url = getCleanVideoUrl(lesson.videoUrl || '');
                                const isDirectFile = url.startsWith('blob:') || url.includes('supabase.co') || url.endsWith('.mp4');

                                if (isDirectFile) {
                                    return (
                                        <video
                                            ref={playerRef}
                                            src={url}
                                            className="w-full h-full object-contain bg-black"
                                            controls
                                            autoPlay={playing}
                                            onPlay={() => setPlaying(true)}
                                            onPause={() => setPlaying(false)}
                                            onTimeUpdate={(e) => {
                                                checkCheckpoints(e.target.currentTime);
                                            }}
                                            onError={(e) => {
                                                console.error("Native Video Error:", e);
                                                setVideoError(true);
                                            }}
                                        />
                                    );
                                }

                                return (
                                    <ReactPlayer
                                        ref={playerRef}
                                        url={url}
                                        width="100%"
                                        height="100%"
                                        controls={true}
                                        playing={playing}
                                        onPlay={() => setPlaying(true)}
                                        onPause={() => setPlaying(false)}
                                        onProgress={(state) => {
                                            checkCheckpoints(state.playedSeconds);
                                        }}
                                        onReady={() => {
                                            console.log('Preview Ready');
                                            setVideoError(false);
                                        }}
                                        onError={(e) => {
                                            console.error("ReactPlayer Error:", e);
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
                                );
                            })()}

                            {/* Error Fallback */}
                            {videoError && (
                                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-6 z-10">
                                    <Icon.VideoOff className="w-16 h-16 text-red-500 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Video Unavailable</h3>
                                    <p className="text-[#90cbcb] mb-6 max-w-sm text-sm">
                                        The playback was blocked. <br />
                                        Use <strong>Simulation Mode</strong> to test checkpoints.
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
                                            <span>Open Source</span>
                                            <Icon.ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Info Footer */}
                {mode === 'full' && (
                    <div className="mt-6 p-4 bg-[#102323] rounded-lg border border-[#224949]">
                        <h3 className="text-[#0df2f2] font-bold mb-2">Active Logic Monitor</h3>
                        <p className="text-white text-sm mb-2">{lesson.description || 'Checking for checkpoints...'}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-[#90cbcb]">
                            <span>Status: {playing ? 'Playing' : 'Paused'}</span>
                            <span>Points: {checkpoints.length}</span>
                            <span>Next: {checkpoints.find(c => c.timeSec > (lastTriggeredTime.current))?.type || 'None'}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
