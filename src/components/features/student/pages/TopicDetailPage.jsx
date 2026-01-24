import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryRepository } from '../../admin/data/categoryRepository';
import { gameRepository } from '../../game/data/gameRepository';
import { IMAGES } from '../../../../data/designAssets';
import { useSoundEffects } from '../hooks/useSoundEffects';

// Mock Videos until we update repository - or fetch all and filter
// Ideally, videoRepository should support getByCategory(topicId)
const MOCK_VIDEOS = [];

export default function TopicDetailPage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const { playHover, playClick } = useSoundEffects();

    const [topic, setTopic] = useState(null);
    const [items, setItems] = useState([]); // Mixed games and videos
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [topicId]);

    const loadData = async () => {
        setIsLoading(true);
        const [topicRes, gamesRes] = await Promise.all([
            categoryRepository.getAll().then(res => res.data?.find(c => c.id === topicId)),
            gameRepository.getAll(topicId)
        ]);

        // Fetch videos (Placeholder logic: in real app, fetch from videoRepository filtered by category name or id)
        // For now, only showing games from the database as requested

        if (topicRes) {
            setTopic(topicRes);
        }

        if (gamesRes.success) {
            // Map games to unified item structure
            const gameItems = gamesRes.data.map(g => ({
                id: g.id,
                type: 'game',
                gameType: g.type, // 'listening', 'speaking', etc.
                title: g.title,
                subtitle: g.subtitle || getDescriptionForType(g.type),
                icon: getIconForType(g.type),
                color: getColorForType(g.type),
                stars: g.star_reward
            }));
            setItems(gameItems);
        }
        setIsLoading(false);
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'listening': return 'hearing';
            case 'speaking': return 'record_voice_over';
            case 'vocabulary': return 'menu_book';
            case 'video': return 'play_circle';
            default: return 'extension';
        }
    };

    const getColorForType = (type) => {
        switch (type) {
            case 'listening': return 'text-indigo-500 bg-indigo-50';
            case 'speaking': return 'text-rose-500 bg-rose-50';
            case 'vocabulary': return 'text-emerald-500 bg-emerald-50';
            case 'video': return 'text-pink-500 bg-pink-50';
            default: return 'text-amber-500 bg-amber-50';
        }
    };

    const getDescriptionForType = (type) => {
        switch (type) {
            case 'listening': return 'Listen carefully';
            case 'speaking': return 'Say it loud';
            case 'vocabulary': return 'Learn new words';
            default: return 'Play & Learn';
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin size-10 border-4 border-teal-500 border-t-transparent rounded-full"></div></div>;
    if (!topic) return <div className="text-center py-20 text-slate-400">Topic not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <header className="relative h-[200px] rounded-[3rem] overflow-hidden shadow-lg flex items-center p-10 mb-8" style={{ backgroundColor: topic.color }}>
                <div className="absolute inset-0 bg-white/10 opacity-50 bg-[url('/pattern-grid.svg')]"></div>
                <div className="absolute -right-20 -bottom-20 size-64 rounded-full bg-white/20 blur-3xl"></div>

                <div className="relative z-10 flex items-center gap-6">
                    <button
                        onClick={() => navigate('/student/home')}
                        className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-800 transition-all shadow-lg"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="size-24 rounded-3xl bg-white text-slate-800 shadow-xl flex items-center justify-center text-5xl">
                        <span className="material-symbols-outlined filled" style={{ color: topic.color }}>{topic.icon}</span>
                    </div>
                    <div className="text-white">
                        <h1 className="text-5xl font-black drop-shadow-md">{topic.name}</h1>
                        <p className="text-white/90 font-bold text-lg opacity-90">{items.length} Activities Available</p>
                    </div>
                </div>
            </header>

            {/* Content List */}
            <div className="space-y-4">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div
                            key={item.id}
                            onMouseEnter={playHover}
                            onClick={() => {
                                playClick();
                                if (item.type === 'game') {
                                    // TODO: Navigate to specific game runner based on type
                                    // For now pointing to generic game detail to handle logic
                                    navigate(`/student/game/${item.id}`);
                                }
                            }}
                            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-6 hover:scale-[1.02] hover:shadow-xl transition-all cursor-pointer group hover-pop relative overflow-hidden"
                        >
                            {/* Number Badge */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-100 group-hover:bg-teal-400 transition-colors"></div>

                            {/* Icon */}
                            <div className={`size-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined filled">{item.icon}</span>
                            </div>

                            {/* Content Info */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">{item.title}</h3>
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">{item.subtitle}</p>
                            </div>

                            {/* Type Badge */}
                            <div className="hidden sm:flex flex-col items-end gap-1 text-right">
                                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{item.gameType}</span>
                                <div className="flex items-center gap-1 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20 text-yellow-600 font-black">
                                    <span className="material-symbols-outlined filled text-lg">star</span>
                                    <span>{item.stars}</span>
                                </div>
                            </div>

                            <span className="material-symbols-outlined text-slate-300 transform group-hover:translate-x-2 transition-transform text-3xl">chevron_right</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">sentiment_content</span>
                        <h3 className="text-xl font-bold text-slate-600">No activities yet</h3>
                        <p className="text-slate-400">Check back later for new games!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
