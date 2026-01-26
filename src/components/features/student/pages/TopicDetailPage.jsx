import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryRepository } from '../../admin/data/categoryRepository';
import { gameRepository } from '../../game/data/gameRepository';
import { useSoundEffects } from '../hooks/useSoundEffects';
import GameIntroModal from '../../game/components/GameIntroModal';

export default function TopicDetailPage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const { playHover, playClick } = useSoundEffects();

    const [topic, setTopic] = useState(null);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(null);

    useEffect(() => {
        loadData();
    }, [topicId]);

    const loadData = async () => {
        setIsLoading(true);
        const [topicRes, gamesRes] = await Promise.all([
            categoryRepository.getAll().then(res => res.data?.find(c => c.id === topicId)),
            gameRepository.getAll(topicId)
        ]);

        if (topicRes) {
            setTopic(topicRes);
        }

        if (gamesRes.success) {
            const gameItems = gamesRes.data.map(g => ({
                id: g.id,
                type: 'game',
                gameType: g.type,
                subtype: g.subtype || 'default',
                title: g.title,
                subtitle: g.subtitle || getDescriptionForType(g.type),
                icon: getIconForType(g.type),
                color: getColorForType(g.type),
                stars: g.star_reward || 10
            }));
            setItems(gameItems);
        }
        setIsLoading(false);
    };

    const handleGameClick = (game) => {
        playClick();
        setSelectedGame(game);
    };

    const handlePlayGame = () => {
        if (selectedGame) {
            // Navigate to generic runner or specific if needed
            navigate(`/student/game/${selectedGame.id}`);
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'listening': return 'hearing';
            case 'speaking': return 'record_voice_over';
            case 'vocabulary': return 'menu_book';
            case 'reading': return 'visibility';
            case 'writing': return 'edit';
            default: return 'extension';
        }
    };

    const getColorForType = (type) => {
        switch (type) {
            case 'listening': return 'text-indigo-500 bg-indigo-50 border-indigo-100';
            case 'speaking': return 'text-rose-500 bg-rose-50 border-rose-100';
            case 'vocabulary': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
            case 'reading': return 'text-sky-500 bg-sky-50 border-sky-100';
            case 'writing': return 'text-amber-500 bg-amber-50 border-amber-100';
            default: return 'text-slate-500 bg-slate-50 border-slate-100';
        }
    };

    const getDescriptionForType = (type) => {
        switch (type) {
            case 'listening': return 'Listen carefully';
            case 'speaking': return 'Say it loud';
            case 'vocabulary': return 'New Words';
            default: return 'Play & Learn';
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin size-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>;
    if (!topic) return <div className="text-center py-20 text-slate-400">Topic not found</div>;

    return (
        <div className="min-h-screen pb-20 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                {/* Header */}
                <header className="mb-12">
                    <button
                        onClick={() => navigate('/student/home')}
                        onMouseEnter={playHover}
                        onClickCapture={playClick}
                        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
                    >
                        <div className="size-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </div>
                        <span>Back to Home</span>
                    </button>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                        <div className="size-32 md:size-40 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center text-8xl shrink-0 border-4 border-white rotate-3 relative z-10">
                            <span className="material-symbols-outlined filled" style={{ color: topic.color }}>{topic.icon}</span>
                            {/* Decorative badge */}
                            <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-black border-4 border-white shadow-sm">
                                {items.length} GAMES
                            </div>
                        </div>
                        <div className="flex-1 pt-4">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-none mb-4 drop-shadow-sm">
                                {topic.name}
                            </h1>
                            <p className="text-xl text-slate-500 font-medium max-w-2xl">
                                Explore fun games and activities to master this topic!
                            </p>
                        </div>
                    </div>
                </header>

                {/* Game Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleGameClick(item)}
                                onMouseEnter={playHover}
                                className="group relative bg-white rounded-[2rem] p-6 shadow-sm border-2 border-transparent hover:border-indigo-100 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 overflow-hidden"
                            >
                                {/* Hover Effect BG */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${item.color.split(' ')[1]}`}></div>

                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className={`size-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${item.color}`}>
                                        <span className="material-symbols-outlined filled">{item.icon}</span>
                                    </div>
                                    <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border border-yellow-100">
                                        <span className="material-symbols-outlined text-base">star</span>
                                        {item.stars}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-slate-800 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-400 font-medium text-sm">
                                        {item.subtitle}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center justify-between relative z-10">
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{item.gameType}</span>
                                    <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                                        <span className="material-symbols-outlined">play_arrow</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white/50 rounded-[3rem] border-4 border-dashed border-slate-200">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">sports_esports</span>
                            <h3 className="text-xl font-bold text-slate-500">No games added yet</h3>
                            <p className="text-slate-400">Ask your teacher to add some games!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <GameIntroModal
                isOpen={!!selectedGame}
                onClose={() => setSelectedGame(null)}
                game={selectedGame || {}}
                onPlay={handlePlayGame}
            />
        </div>
    );
}
