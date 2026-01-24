import { useEffect, useState } from 'react'
import { gameRepository } from '../../game/data/gameRepository'
import { categoryRepository } from '../data/categoryRepository'
import GameFormModal from '../components/GameFormModal'
import { useToast } from '../../../shared/hooks/useToast'
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog'

export default function AdminGames() {
    const [games, setGames] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stats, setStats] = useState({ total: 0, listening: 0, speaking: 0 })

    // Custom Hooks (assuming these exist from previous tasks)
    const { showToast } = useToast()
    const { confirm } = useConfirmDialog()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        const [gamesRes, catsRes] = await Promise.all([
            gameRepository.getAll(),
            categoryRepository.getAll()
        ])

        if (gamesRes.success) {
            setGames(gamesRes.data)
            // Calc stats
            const total = gamesRes.data.length
            const listening = gamesRes.data.filter(g => g.type === 'listening').length
            const speaking = gamesRes.data.filter(g => g.type === 'speaking').length
            setStats({ total, listening, speaking })
        }
        if (catsRes.success) {
            setCategories(catsRes.data)
        }
        setIsLoading(false)
    }

    const handleDelete = async (id, title) => {
        const confirmed = await confirm({
            title: 'Delete Game',
            message: `Are you sure you want to delete "${title}"?`,
            type: 'danger',
            confirmText: 'Delete'
        })

        if (confirmed) {
            const result = await gameRepository.delete(id)
            if (result.success) {
                showToast('Game deleted successfully', 'success')
                loadData()
            } else {
                showToast('Failed to delete game', 'error')
            }
        }
    }

    const filteredGames = selectedCategory === 'all'
        ? games
        : games.filter(g => g.topic_id === selectedCategory)

    if (isLoading) return <div className="flex items-center justify-center h-full"><div className="animate-spin size-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Game Management</h1>
                    <p className="text-slate-500 font-medium">Create and organize interactive learning activities</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                        <span className="block text-xs font-bold text-slate-400 uppercase">Total</span>
                        <span className="text-xl font-black text-slate-800">{stats.total}</span>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                        <span className="block text-xs font-bold text-blue-400 uppercase">Listening</span>
                        <span className="text-xl font-black text-blue-600">{stats.listening}</span>
                    </div>
                </div>
            </div>

            {/* Filter & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 sticky top-4 z-10 backdrop-blur-md bg-white/90">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                        All Topics
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-white ring-2 ring-offset-1 ring-blue-500 text-slate-800 shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]" style={{ color: cat.color }}>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    New Game
                </button>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.length > 0 ? (
                    filteredGames.map(game => (
                        <div key={game.id} className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden">
                            {/* Topic Badge */}
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg z-10">
                                <span className="material-symbols-outlined text-[16px]" style={{ color: game.video_categories?.color }}>
                                    {game.video_categories?.icon || 'category'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                                    {game.video_categories?.name || 'Unknown'}
                                </span>
                            </div>

                            {/* Icon / Content */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`size-14 rounded-2xl flex items-center justify-center text-white shadow-md ${game.type === 'listening' ? 'bg-indigo-500 shadow-indigo-200' :
                                        game.type === 'speaking' ? 'bg-rose-500 shadow-rose-200' :
                                            game.type === 'vocabulary' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-amber-500 shadow-amber-200'
                                    }`}>
                                    <span className="material-symbols-outlined text-3xl">
                                        {game.type === 'listening' ? 'hearing' :
                                            game.type === 'speaking' ? 'record_voice_over' :
                                                game.type === 'vocabulary' ? 'menu_book' : 'extension'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1 line-clamp-1">{game.title}</h3>
                                    <p className="text-sm text-slate-400 font-medium">{game.subtitle || 'Practice Game'}</p>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                                    <span className="material-symbols-outlined text-base">star</span>
                                    {game.star_reward} Stars
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="size-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                                        title="Edit (Coming Soon)"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(game.id, game.title)}
                                        className="size-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                                        title="Delete"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="bg-slate-50 size-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-5xl text-slate-300">sports_esports</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">No Games Found</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mt-2">Create a new game to get started with this topic.</p>
                    </div>
                )}
            </div>

            <GameFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={loadData}
            />
        </div>
    )
}
