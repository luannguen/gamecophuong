import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSoundEffects } from '../../student/hooks/useSoundEffects';

export default function GameIntroModal({ isOpen, onClose, game, onPlay }) {
    const navigate = useNavigate();
    const { playClick, playHover } = useSoundEffects();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimate(true);
        } else {
            setAnimate(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePlay = () => {
        playClick();
        onPlay();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'listening': return 'hearing';
            case 'speaking': return 'record_voice_over';
            case 'reading': return 'visibility';
            case 'writing': return 'edit';
            default: return 'sports_esports';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div
                className={`w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative transform transition-all duration-500 ${animate ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-10 opacity-0'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-blue-400 to-indigo-600">
                    <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-20"></div>
                    <div className="absolute -bottom-10 -right-10 size-40 bg-white/20 blur-3xl rounded-full"></div>
                    <div className="absolute -top-10 -left-10 size-40 bg-white/20 blur-3xl rounded-full"></div>
                </div>

                {/* Content */}
                <div className="relative pt-12 pb-8 px-8 flex flex-col items-center text-center">
                    {/* Icon Badge */}
                    <div className="size-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-5xl text-indigo-600 mb-6 relative z-10 border-4 border-white animate-bounce-slow">
                        <span className="material-symbols-outlined filled" style={{ fontSize: '48px' }}>
                            {getIcon(game.type)}
                        </span>
                        {/* Star Badge */}
                        <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">star</span>
                            {game.star_reward || 10}
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-800 mb-2 leading-tight">
                        {game.title}
                    </h2>
                    <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto leading-relaxed">
                        {game.subtitle || "Ready to challenge yourself? Let's play and learn!"}
                    </p>

                    {/* Stats / Info */}
                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Type</span>
                            <span className="font-bold text-slate-700 capitalize">{game.type}</span>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time</span>
                            <span className="font-bold text-slate-700">~2 mins</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full space-y-3">
                        <button
                            onClick={handlePlay}
                            onMouseEnter={playHover}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <span className="material-symbols-outlined">play_circle</span>
                            Start Game
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 size-10 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}
