import React, { useRef } from 'react';

export default function CheckpointTimeline({ duration, checkpoints, currentTime, onSeek, onAddCheckpoint, onSelectCheckpoint, playing }) {
    const timelineRef = useRef(null);

    const handleTimelineClick = (e) => {
        if (!timelineRef.current || duration === 0) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const clickPercent = Math.max(0, Math.min(1, x / rect.width));
        const time = clickPercent * duration;
        onSeek(time);
    };

    const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const formatTime = (seconds) => {
        if (!seconds && seconds !== 0) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="bg-[#102323] border-t border-[#224949] flex flex-col w-full font-display">
            {/* Timeline UI Container */}
            <div className="h-16 relative border-b border-[#224949] px-6 flex items-center justify-between gap-4">

                {/* Timeline Interactive Area */}
                <div
                    ref={timelineRef}
                    className="flex-1 h-8 flex items-center cursor-pointer group relative"
                    onClick={handleTimelineClick}
                >
                    {/* Background Track */}
                    <div className="w-full h-2 bg-[#183434] rounded-full relative overflow-visible">

                        {/* Played Progress (Optional, if we want a fill) */}
                        {/* <div className="absolute top-0 left-0 h-full bg-[#0df2f2]/20 rounded-full" style={{ width: `${percent}%` }} /> */}

                        {/* Playhead */}
                        <div
                            className="absolute h-12 w-0.5 bg-[#0df2f2] top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-75 ease-linear"
                            style={{ left: `${percent}%` }}
                        >
                            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-[#0df2f2] rounded-full shadow-[0_0_10px_rgba(13,242,242,0.5)]" />
                            {/* Current Time tooltip on playhead */}
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#224949] px-2 py-1 rounded text-[10px] text-[#0df2f2] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                {formatTime(currentTime)}
                            </div>
                        </div>

                        {/* Checkpoint Markers */}
                        {checkpoints.map(cp => {
                            const cpPercent = (cp.timeSec / duration) * 100;
                            let markerColor = 'bg-slate-400';
                            if (cp.type === 'vocab') markerColor = 'bg-[#0df2f2]';
                            if (cp.type === 'question') markerColor = 'bg-purple-500';
                            if (cp.type === 'note') markerColor = 'bg-amber-500';

                            return (
                                <div
                                    key={cp.id}
                                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#102323] shadow-lg z-10 cursor-pointer hover:scale-125 transition-transform ${markerColor}`}
                                    style={{ left: `${cpPercent}%` }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectCheckpoint(cp);
                                    }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#224949] px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-30">
                                        <span className="font-bold uppercase tracking-wider text-[8px] mr-1 opacity-70">{cp.type}</span>
                                        {formatTime(cp.timeSec)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Add Checkpoint Button */}
                <button
                    onClick={() => onAddCheckpoint(currentTime, 'vocab')}
                    className="ml-2 flex items-center gap-2 bg-[#0df2f2]/10 text-[#0df2f2] border border-[#0df2f2]/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0df2f2]/20 transition-all shrink-0"
                >
                    <span className="material-symbols-outlined text-sm font-bold">+</span>
                    Add Checkpoint
                </button>
            </div>
        </div>
    );
}
