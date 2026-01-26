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
    const [activeCluster, setActiveCluster] = useState(null); // Array of checkpoints
    const [clusterStep, setClusterStep] = useState(0); // Current step index
    const lastTriggeredTime = useRef(-1);

    // Quiz State (Per Step)
    const [quizState, setQuizState] = useState({ selected: null, isCorrect: false, submitted: false });

    // Reset Quiz State on Step Change
    useEffect(() => {
        setQuizState({ selected: null, isCorrect: false, submitted: false });
    }, [activeCluster, clusterStep]);

    const handleQuizAnswer = (option) => {
        if (quizState.submitted || !activeCluster) return;

        const currentItem = activeCluster[clusterStep];
        const correctAnswer = currentItem.content?.answer; // Assuming 'answer' holds the string
        const isCorrect = option === correctAnswer;

        setQuizState({
            selected: option,
            isCorrect,
            submitted: true
        });

        if (isCorrect) {
            // Optional: Auto-play sound or show celebration
            console.log("Correct Answer!");
        } else {
            console.log("Wrong Answer. Correct was:", correctAnswer);
        }
    };

    // Initialize Checkpoints & Grouping
    useEffect(() => {
        if (lesson) {
            console.log("Preview Loaded Lesson:", lesson);
            const rawCheckpoints = lesson.version?.checkpoints || lesson.checkpoints || [];

            // Sort by time, then order
            const sorted = [...rawCheckpoints].sort((a, b) => a.timeSec - b.timeSec || (a.order || 0) - (b.order || 0));
            console.log("Sorted Checkpoints:", sorted);
            setCheckpoints(sorted);
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

        // Detect Backward Seek (Replay)
        if (currentTime < lastTriggeredTime.current - 1) {
            console.log("Backward seek detected. Resetting tracker.");
            lastTriggeredTime.current = currentTime;
            return;
        }

        // Find ALL checkpoints in the current window that haven't been triggered
        const firstMatch = checkpoints.find(c =>
            c.timeSec <= currentTime &&
            c.timeSec > lastTriggeredTime.current &&
            Math.abs(currentTime - c.timeSec) < 2
        );

        if (firstMatch) {
            // Cluster all checkpoints with roughly the same timestamp (tolerance 0.5s)
            const cluster = checkpoints.filter(c => Math.abs(c.timeSec - firstMatch.timeSec) < 0.5);

            console.log("Triggering Cluster:", cluster);
            setActiveCluster(cluster);
            setClusterStep(0);

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

    // Handle Cluster Navigation
    const handleNextStep = () => {
        if (!activeCluster) return;
        if (clusterStep < activeCluster.length - 1) {
            setClusterStep(prev => prev + 1);
        } else {
            // Finished Cluster
            setActiveCluster(null);
            setClusterStep(0);
            setPlaying(true);
        }
    };

    const handlePrevStep = () => {
        if (clusterStep > 0) {
            setClusterStep(prev => prev - 1);
        }
    };

    const handleSkipCluster = () => {
        setActiveCluster(null);
        setClusterStep(0);
        setPlaying(true);
    };

    // Current Active Item
    const activeItem = activeCluster ? activeCluster[clusterStep] : null;

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

            {/* OVERLAY: Cluster Interaction */}
            {activeCluster && activeItem && (
                isStudyMode ? (
                    // --- STUDY MODE (Blocking - Multi Step) ---
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
                        <div className="bg-[#102323] border border-[#0df2f2] p-8 rounded-2xl shadow-[0_0_50px_rgba(13,242,242,0.3)] max-w-lg w-full text-center relative overflow-hidden flex flex-col">

                            {/* Header: Progress */}
                            <div className="flex justify-between items-center mb-6 text-[#90cbcb] text-sm font-mono uppercase tracking-wider">
                                <span>Key Moment</span>
                                {activeCluster.length > 1 && (
                                    <span>Step {clusterStep + 1} / {activeCluster.length}</span>
                                )}
                            </div>

                            {/* Progress Bar for Steps */}
                            {activeCluster.length > 1 && (
                                <div className="w-full bg-[#0a1515] h-1.5 rounded-full mb-8 overflow-hidden">
                                    <div
                                        className="h-full bg-[#0df2f2] transition-all duration-300 ease-out"
                                        style={{ width: `${((clusterStep + 1) / activeCluster.length) * 100}%` }}
                                    ></div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] animate-slideInRight" key={activeItem.id}>
                                {activeItem.type === 'vocab' ? (
                                    // VOCAB CARD UI
                                    (() => {
                                        const vocab = getVocabDetails(activeItem.vocabId);
                                        return (
                                            <>
                                                <div className="w-20 h-20 bg-[#0a1515] rounded-full flex items-center justify-center border-2 border-[#0df2f2] mb-6 shadow-lg">
                                                    <Icon.Book className="w-8 h-8 text-[#0df2f2]" />
                                                </div>
                                                <h2 className="text-3xl font-bold text-white mb-1">{vocab?.term || 'Unknown Word'}</h2>
                                                <p className="text-[#90cbcb] font-mono mb-4 text-sm">{vocab?.ipa || '/.../'}</p>
                                                <p className="text-xl text-[#0df2f2] mb-8 font-medium">"{vocab?.definition || activeItem.content?.note || 'Definition...'}"</p>
                                            </>
                                        );
                                    })()
                                ) : (
                                    // QUIZ UI
                                    <>
                                        <div className="w-16 h-16 bg-[#0a1515] rounded-full flex items-center justify-center border border-[#ffb020] mb-6">
                                            <Icon.HelpCircle className="w-8 h-8 text-[#ffb020]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-6">
                                            {activeItem.content?.question || "Quick Question"}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3 w-full mb-8">
                                            {activeItem.content?.options?.filter(o => o).map((opt, idx) => {
                                                const isSelected = quizState.selected === opt;
                                                const isCorrectAnswer = opt === activeItem.content?.answer;

                                                let btnClass = "bg-[#0a1515] border border-[#224949] text-[#90cbcb] p-3 rounded-lg transition-all text-left relative overflow-hidden group";

                                                if (quizState.submitted) {
                                                    if (isCorrectAnswer) {
                                                        btnClass = "bg-[#064e3b] border-[#10b981] text-white p-3 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold";
                                                    } else if (isSelected && !quizState.isCorrect) {
                                                        btnClass = "bg-[#450a0a] border-[#ef4444] text-white p-3 rounded-lg shake";
                                                    } else {
                                                        btnClass = "bg-[#0a1515] border-[#224949] text-[#555] p-3 rounded-lg opacity-50";
                                                    }
                                                } else {
                                                    btnClass += " hover:bg-[#183434] hover:border-[#0df2f2] hover:text-white cursor-pointer";
                                                }

                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleQuizAnswer(opt)}
                                                        disabled={quizState.submitted}
                                                        className={btnClass}
                                                    >
                                                        <div className="flex items-center justify-between z-10 relative">
                                                            <span>{opt}</span>
                                                            {quizState.submitted && isCorrectAnswer && (
                                                                <Icon.Check className="w-5 h-5 text-[#10b981] animate-bounce" />
                                                            )}
                                                            {quizState.submitted && isSelected && !isCorrectAnswer && (
                                                                <Icon.X className="w-5 h-5 text-[#ef4444]" />
                                                            )}
                                                        </div>
                                                        {!quizState.submitted && (
                                                            <div className="absolute inset-0 bg-[#0df2f2]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 pointer-events-none"></div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Footer: Navigation */}
                            <div className="flex items-center justify-between mt-4">
                                <button
                                    onClick={handlePrevStep}
                                    disabled={clusterStep === 0}
                                    className={`text-[#90cbcb] text-sm hover:text-white px-4 py-2 ${clusterStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                                >
                                    Back
                                </button>

                                <button
                                    onClick={handleNextStep}
                                    className="bg-[#0df2f2] hover:bg-[#0acaca] text-[#102323] px-10 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-[0_4px_15px_rgba(13,242,242,0.4)]"
                                >
                                    {clusterStep < activeCluster.length - 1 ? 'Next' : 'Continue'}
                                </button>

                                <button
                                    onClick={handleSkipCluster}
                                    className="text-[#90cbcb] text-sm hover:text-white px-4 py-2 opacity-50 hover:opacity-100"
                                >
                                    Skip
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- NORMAL MODE (Non-Blocking Toast) ---
                    <div className="absolute top-8 right-8 z-50 animate-slideInRight">
                        <div className="bg-[#102323]/90 backdrop-blur border-l-4 border-[#0df2f2] p-4 rounded-r shadow-2xl max-w-sm flex items-start gap-3">
                            <div className="bg-[#0df2f2]/20 p-2 rounded-full shrink-0">
                                {activeItem.type === 'vocab' ? <Icon.Book className="w-5 h-5 text-[#0df2f2]" /> : <Icon.HelpCircle className="w-5 h-5 text-[#ffb020]" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">
                                    {activeItem.type === 'vocab' ? 'New Word' : 'Quick Quiz'}
                                </h4>
                                <p className="text-[#90cbcb] text-sm mb-3 line-clamp-2">
                                    {activeItem.type === 'vocab'
                                        ? (getVocabDetails(activeItem.vocabId)?.term || "Vocabulary Item")
                                        : (activeItem.content?.question || "Question Checkpoint")
                                    }
                                </p>

                                <div className="flex gap-2">
                                    {clusterStep < activeCluster.length - 1 ? (
                                        <button
                                            onClick={handleNextStep}
                                            className="text-xs bg-[#0df2f2] text-[#102323] px-3 py-1.5 rounded font-bold hover:bg-[#0acaca] transition-colors"
                                        >
                                            Next Item
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNextStep}
                                            className="text-xs bg-[#224949] hover:bg-[#316868] text-white px-3 py-1.5 rounded transition-colors"
                                        >
                                            Dismiss
                                        </button>
                                    )}
                                </div>
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
                                            onSeeked={(e) => {
                                                console.log("Seeked to:", e.target.currentTime);
                                                lastTriggeredTime.current = e.target.currentTime;
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
                                        onSeek={(seconds) => {
                                            console.log("Seeked to:", seconds);
                                            lastTriggeredTime.current = seconds;
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
