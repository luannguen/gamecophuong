import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSoundEffects } from '../../student/hooks/useSoundEffects'
import { categoryRepository } from '../../admin/data/categoryRepository'
// import { useUser } from '../../auth/context/UserContext' // Temporarily removed
// import './Selection.css' // Removing old CSS import to rely on Tailwind

export default function GameSelection() {
    const navigate = useNavigate()
    const { playHover, playClick } = useSoundEffects()
    const [searchTerm, setSearchTerm] = useState('')
    const [topics, setTopics] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    // const { user } = useUser() // If needed for avatar

    // Manual Featured Games (Static for now, can be fetched later or mixed)
    const FEATURED_GAMES = [
        {
            id: 'space-adventure',
            name: 'Space Adventure',
            subtitle: 'AI Grammar Quest',
            skill: 'GRAMMAR',
            icon: 'rocket_launch',
            color: 'emerald',
            stars: 0,
            image: null // Use CSS/Icon for now or assets
        },
        {
            id: 'magic-words',
            name: 'Magic Words',
            subtitle: 'Vocabulary Master',
            skill: 'VOCAB',
            icon: 'auto_awesome',
            color: 'pink',
            stars: 0,
            image: null
        }
    ]

    useEffect(() => {
        loadTopics()
    }, [])

    const loadTopics = async () => {
        setIsLoading(true)
        const result = await categoryRepository.getAll()
        if (result.success) {
            setTopics(result.data)
        }
        setIsLoading(false)
    }

    // Helper to get Tailwind color classes based on DB color code or name
    // The reference uses specific colors: bg-emerald-50, bg-pink-50, etc.
    const getThemeColors = (hexOrName) => {
        if (!hexOrName) return { bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-100', badge: 'bg-emerald-100/50' }

        const lower = hexOrName.toLowerCase();
        if (lower.includes('pink') || lower === '#ff8cbe')
            return { bg: 'bg-pink-50', text: 'text-pink-500', border: 'border-pink-100', badge: 'bg-pink-100/50' }
        if (lower.includes('yellow') || lower === '#fccd2b')
            return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', badge: 'bg-yellow-100/50' }
        if (lower.includes('orange') || lower === '#f97316')
            return { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-100', badge: 'bg-orange-100/50' }
        if (lower.includes('blue') || lower === '#0ea5e9')
            return { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-100', badge: 'bg-blue-100/50' }
        if (lower.includes('cyan') || lower === '#06b6d4')
            return { bg: 'bg-cyan-50', text: 'text-cyan-500', border: 'border-cyan-100', badge: 'bg-cyan-100/50' }

        return { bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-100', badge: 'bg-emerald-100/50' }
    }

    return (
        <div className="flex-1 p-10 font-display bg-[#f8fafc] min-h-screen">
            {/* Main Content Area - We assume Layout provides Sidebar */}

            {/* Header / Search */}
            <header className="flex items-center justify-between mb-10">
                <div className="relative flex-1 max-w-2xl">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-[#00d1d1]/20 placeholder-slate-400 text-lg outline-none transition-all"
                        placeholder="Search for a game..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-6 ml-6">
                    <button className="relative w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
                        <span className="material-symbols-outlined text-slate-600 text-2xl">notifications</span>
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>
                    {/* User Avatar could go here if not in Sidebar */}
                </div>
            </header>

            {/* Categories Grid */}
            <section className="mb-14">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-4xl font-black text-slate-800">Choose a Category</h2>
                    {/* <a className="text-[#00d1d1] text-xl font-bold hover:underline" href="#">View All</a> */}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d1d1]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {topics.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(topic => {
                            const colors = getThemeColors(topic.color);
                            return (
                                <Link
                                    key={topic.id}
                                    to={`/student/topic/${topic.id}`}
                                    onClick={playClick}
                                    onMouseEnter={playHover}
                                    className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 cursor-pointer hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`relative ${colors.bg} rounded-[2rem] aspect-square flex items-center justify-center mb-6 overflow-hidden`}>
                                        <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm z-10">
                                            <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            Start
                                        </span>
                                        {topic.image_url ? (
                                            <img
                                                alt={topic.name}
                                                className="w-full h-full object-cover"
                                                src={topic.image_url.startsWith('http') || topic.image_url.startsWith('/') ? topic.image_url : `/assets/games/themes/${topic.image_url}`}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/assets/games/themes/animals.png'; // Fallback
                                                }}
                                            />
                                        ) : (
                                            <span className={`material-symbols-outlined !text-6xl ${colors.text}`}>
                                                {topic.icon}
                                            </span>
                                        )}
                                    </div>
                                    <div className="px-2">
                                        <h3 className="text-2xl font-black mb-1 text-slate-800 truncate" title={topic.name}>{topic.name}</h3>
                                        <p className="text-slate-500 font-medium mb-4">Topic Journey</p>
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 ${colors.badge} ${colors.text} rounded-xl text-xs font-black uppercase tracking-wider`}>
                                            <span className="material-symbols-outlined text-sm">category</span>
                                            Mixed Skills
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* Featured Section */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-4xl font-black text-slate-800">Miss Phuong's Favorites</h2>
                </div>
                <div className="flex overflow-x-auto gap-8 pb-6 custom-scrollbar">
                    {FEATURED_GAMES.map(game => (
                        <div key={game.id} className={`flex-shrink-0 w-[420px] bg-${game.color}-50 p-6 rounded-[2.5rem] flex items-center gap-6 group cursor-pointer hover:bg-${game.color}-100 transition-colors`}>
                            <div className={`w-24 h-24 bg-${game.color}-100 rounded-[1.5rem] flex items-center justify-center text-${game.color}-500`}>
                                <span className="material-symbols-outlined !text-5xl group-hover:scale-110 transition-transform">{game.icon}</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-1 text-slate-800">{game.name}</h3>
                                <p className={`text-${game.color}-600 font-bold text-lg`}>{game.subtitle}</p>
                            </div>
                            <div className="ml-auto">
                                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className={`material-symbols-outlined text-${game.color}-500`} style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
