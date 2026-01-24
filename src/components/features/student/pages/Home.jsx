import { Link } from 'react-router-dom';
import { IMAGES } from '../../../../data/designAssets';
import { useSoundEffects } from '../hooks/useSoundEffects'; // Import Hook

export default function StudentHome() {
    const { playHover, playClick, playSuccess } = useSoundEffects();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Hero Banner */}
            <section
                className="relative w-full h-[320px] rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-teal-400 to-emerald-400 shadow-xl shadow-teal-500/20 group hover-pop-sm transition-transform"
                onMouseEnter={playHover}
            >
                {/* Sparkle Overlay */}
                <div className="absolute inset-0 bg-shimmer opacity-30 pointer-events-none"></div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[60%] h-full bg-white/10 skew-x-12 translate-x-1/4 rounded-bl-[100px]"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center px-16 z-10">
                    <div className="max-w-lg space-y-8">
                        <h1 className="text-5xl font-black text-white leading-[1.15] drop-shadow-sm text-shadow-lg">
                            Let's Play & Learn
                            <br />
                            English!
                        </h1>
                        <button
                            onClick={playSuccess}
                            onMouseEnter={playHover}
                            className="bg-white text-teal-600 px-8 py-3.5 rounded-2xl font-black text-lg shadow-lg shadow-teal-700/20 hover:scale-110 hover:bg-teal-50 hover:text-teal-700 transition-all flex items-center gap-2 group-hover:shadow-xl hover-pop"
                        >
                            <span className="material-symbols-outlined filled animate-pulse">rocket_launch</span>
                            Start Adventure
                        </button>
                    </div>
                </div>

                {/* Mascot Image (Right) */}
                <div className="absolute bottom-0 right-16 z-10 w-[400px] h-[350px] flex items-end justify-center pointer-events-none animate-float">
                    {/* Using background image to contain/cover properly if image isn't perfectly transparent */}
                    <img
                        src={IMAGES.heroMascot}
                        alt="Mascot"
                        className="h-full w-auto object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2 group-hover:rotate-1"
                    />
                </div>
            </section>

            {/* Miss Phuong's Choice */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500 filled animate-spin-slow">star</span>
                        Miss Phượng's Choice
                    </h2>
                    <Link to="/student/games" onClick={playClick} className="text-sm font-bold text-cyan-500 hover:text-cyan-600 hover:underline">View All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Game Card */}
                    <Link
                        to="/student/games"
                        onClick={playClick}
                        onMouseEnter={playHover}
                        className="group relative h-[300px] bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all overflow-hidden flex items-center hover-pop game-card-glow"
                    >
                        <div className="w-1/2 p-10 flex flex-col justify-center gap-4 relative z-10">
                            <div className="size-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500 mb-2 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-cyan-500/50">
                                <span className="material-symbols-outlined text-3xl">sports_esports</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Play Games</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">AI-powered interactive English puzzles.</p>
                            </div>
                            <div className="mt-2 inline-flex items-center gap-1 text-cyan-500 font-bold bg-cyan-50 w-fit px-4 py-2 rounded-xl group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                Play Now <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </div>
                        </div>
                        <div className="w-1/2 h-full bg-cyan-50/50 flex items-center justify-center relative overflow-hidden">
                            {/* Decorative Blob */}
                            <div className="absolute size-40 bg-cyan-200/50 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700 animate-pulse"></div>
                            {/* Icon Placeholder or Image */}
                            <div className="size-24 bg-white rounded-[2rem] shadow-lg flex items-center justify-center z-10 group-hover:rotate-12 transition-transform duration-500 text-cyan-500 border-4 border-white/50">
                                <span className="material-symbols-outlined text-5xl">gamepad</span>
                            </div>
                        </div>
                    </Link>

                    {/* Video Card */}
                    <Link
                        to="/student/videos"
                        onClick={playClick}
                        onMouseEnter={playHover}
                        className="group relative h-[300px] bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all overflow-hidden flex items-center hover-pop video-card-glow"
                    >
                        <div className="w-1/2 p-10 flex flex-col justify-center gap-4 relative z-10">
                            <div className="size-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 mb-2 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-pink-500/50">
                                <span className="material-symbols-outlined text-3xl">smart_display</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Watch & Learn</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">Animated lessons and stories with subs.</p>
                            </div>
                            <div className="mt-2 inline-flex items-center gap-1 text-pink-500 font-bold bg-pink-50 w-fit px-4 py-2 rounded-xl group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                Watch <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </div>
                        </div>
                        <div className="w-1/2 h-full bg-pink-50/50 flex items-center justify-center relative overflow-hidden">
                            {/* Decorative Blob */}
                            <div className="absolute size-40 bg-pink-200/50 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700 animate-pulse"></div>
                            <div className="size-24 bg-white rounded-[2rem] shadow-lg flex items-center justify-center z-10 group-hover:-rotate-12 transition-transform duration-500 text-pink-500 border-4 border-white/50">
                                <span className="material-symbols-outlined text-5xl">monitor</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Footer Banner - Quest */}
            <section
                className="relative w-full h-32 rounded-[2rem] overflow-hidden bg-yellow-400 shadow-lg shadow-yellow-500/20 flex items-center justify-between px-10 group cursor-pointer hover:brightness-105 transition-all hover-pop animate-neon-pulse"
                onMouseEnter={playHover}
                onClick={playSuccess}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10"></div>

                {/* Left: Info */}
                <div className="flex items-center gap-6 z-10">
                    <div className="size-16 rounded-full bg-yellow-300/50 flex items-center justify-center border-4 border-yellow-200 text-white shadow-inner animate-bounce-slow">
                        <span className="material-symbols-outlined text-3xl font-bold">emoji_events</span>
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-yellow-800 mb-1 opacity-70">Active Challenge</div>
                        <h3 className="text-3xl font-black text-slate-900 leading-none">Grammar Master Quest</h3>
                    </div>
                </div>

                {/* Center: Timer (Hidden on small screens) */}
                <div className="hidden md:flex items-center gap-2 bg-yellow-500/30 px-4 py-2 rounded-full border border-yellow-500/20">
                    <span className="material-symbols-outlined text-yellow-900 text-lg animate-spin-slow">schedule</span>
                    <span className="text-sm font-bold text-yellow-900">2d 14h left</span>
                </div>

                {/* Right: Button */}
                <div className="z-10">
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2 border-2 border-transparent hover:border-yellow-300">
                        Join Now
                    </button>
                </div>

                {/* Decor Overlay */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-yellow-300 to-transparent opacity-50"></div>
            </section>

            {/* Spacer */}
            <div className="h-8"></div>
        </div>
    );
}
