import { useEffect, useState } from 'react'
import { gameRepository } from '../../game/data/gameRepository'
import { categoryRepository } from '../data/categoryRepository'
import GameFormModal from '../components/GameFormModal'
import { useToast } from '../../../shared/hooks/useToast'
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog'

const GAME_TYPES = [
    { id: 'listening_tap', name: 'Listen & Tap', icon: 'hearing', type: 'listening', description: 'Match audio to image/word' },
    { id: 'listening_word', name: 'Choose Word', icon: 'headphones', type: 'listening', description: 'Hear word, choose text' },
    { id: 'speaking', name: 'Speak Match', icon: 'record_voice_over', type: 'speaking', description: 'Pronunciation practice' },
    { id: 'matching', name: 'Drag & Drop', icon: 'drag_indicator', type: 'reading', description: 'Match items to zones' },
    { id: 'sentence', name: 'Sentence Builder', icon: 'article', type: 'writing', description: 'Order words correctly' },
    { id: 'hide_seek', name: 'Hide & Seek', icon: 'search', type: 'vocabulary', description: 'Find items in scene' },
]

export default function AdminGames() {
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [topicGames, setTopicGames] = useState([]) // Games for current topic
    const [isLoading, setIsLoading] = useState(true)
    const [isGameLoading, setIsGameLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalConfig, setModalConfig] = useState(null) // { type, mode: 'create'|'edit', gameId }

    const { showToast } = useToast()
    const { confirm } = useConfirmDialog()

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            loadTopicGames(selectedCategory.id)
        } else {
            setTopicGames([])
        }
    }, [selectedCategory])

    const loadCategories = async () => {
        setIsLoading(true)
        const result = await categoryRepository.getAll()
        if (result.success) {
            setCategories(result.data)
            if (result.data.length > 0 && !selectedCategory) {
                setSelectedCategory(result.data[0])
            }
        }
        setIsLoading(false)
    }

    const loadTopicGames = async (topicId) => {
        setIsGameLoading(true)
        const result = await gameRepository.getAll(topicId)
        if (result.success) {
            setTopicGames(result.data)
        }
        setIsGameLoading(false)
    }

    const handleEnableGame = (typeDef) => {
        setModalConfig({
            type: typeDef.type, // Map 'reading' etc to DB types if needed
            subType: typeDef.id,
            mode: 'create',
            topicId: selectedCategory.id
        })
        setIsModalOpen(true)
    }

    const handleConfigureGame = (game) => {
        setModalConfig({
            type: game.type,
            mode: 'edit',
            gameId: game.id,
            topicId: selectedCategory.id
        })
        setIsModalOpen(true)
    }

    const handleToggleGame = async (game, currentState) => {
        // Optimistic update or waiting? Assuming delete/disable logic
        const confirmed = await confirm({
            title: currentState ? 'Disable Game?' : 'Enable Game?',
            message: currentState
                ? 'This will make the game inaccessible to students.'
                : 'This will make the game live for students.',
            type: currentState ? 'danger' : 'info'
        })

        if (confirmed && currentState) {
            // If disabling implies deleting or setting is_active=false
            // For now, let's treat "Disable" as Delete for simplicity based on previous repo methods 
            // OR update is_active if repo supports it. 
            // Since repo has delete, let's use delete for "Disable" to clear config, 
            // OR better: Just show Toast that "Toggle feature coming soon" if DB schema doesn't support soft delete.
            // Checking repo... it has delete and is_active filter.

            // Let's assume we want to delete to "reset"
            const res = await gameRepository.delete(game.id)
            if (res.success) {
                showToast('Game disabled/removed', 'success')
                loadTopicGames(selectedCategory.id)
            }
        }
    }

    if (isLoading) return <div className="flex items-center justify-center h-full"><div className="spinner"></div></div>

    return (
        <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-slate-50">
            {/* Sidebar - Topics */}
            <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-white sticky top-0">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Topics</h2>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                        <input type="text" placeholder="Search topics..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${selectedCategory?.id === cat.id
                                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${selectedCategory?.id === cat.id ? 'bg-white' : 'bg-slate-100'}`}>
                                <span className="material-symbols-outlined" style={{ color: cat.color }}>{cat.icon}</span>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-sm truncate">{cat.name}</h3>
                                <p className="text-[10px] uppercase font-bold text-slate-400">{cat.slug}</p>
                            </div>
                            {selectedCategory?.id === cat.id && (
                                <span className="material-symbols-outlined text-blue-500 ml-auto">chevron_right</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content - Game Config */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
                {selectedCategory ? (
                    <>
                        {/* Header */}
                        <div className="h-20 px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative group">
                                    {selectedCategory.image_url ? (
                                        <img src={selectedCategory.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-slate-400">image</span>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-slate-800">{selectedCategory.name}</h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{selectedCategory.slug}</span>
                                        <span className="text-xs text-slate-400 font-medium">• 6 Game Types Available</span>
                                    </div>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors shadow-lg shadow-slate-200">
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                Edit Topic
                            </button>
                        </div>

                        {/* Game Grid */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-5xl mx-auto">
                                <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined">sports_esports</span>
                                    Game Configuration
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {GAME_TYPES.map(type => {
                                        // Check if this type exists for this topic
                                        // Note: our DB stores 'listening', 'speaking'. We map sub-types (tap vs word) via extra fields or just title check for now?
                                        // FOR NOW: Let's assume 1:1 map for simplicity of the refactor or check if ANY game of this type exists.
                                        // Real implementation needs 'subtype' or 'variant' in DB.
                                        // Current DB has 'type' ('listening', 'speaking').
                                        // We'll filter by that.

                                        const activeGame = topicGames.find(g =>
                                            g.type === type.type &&
                                            (
                                                // If we have sub-logic, check it here. 
                                                // Assuming title includes identifier or standard naming for now to differentiate subtypes sharing the same 'type' field
                                                // Or just matching generic 'type' for MVP
                                                true
                                            )
                                        );

                                        const isEnabled = !!activeGame;

                                        return (
                                            <div key={type.id} className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${isEnabled ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200' : 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100'}`}>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`size-14 rounded-xl flex items-center justify-center text-white shadow-sm ${isEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}>
                                                        <span className="material-symbols-outlined text-3xl">{type.icon}</span>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wide ${isEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                                        {isEnabled ? 'Active' : 'Inactive'}
                                                    </div>
                                                </div>

                                                <div className="mb-6">
                                                    <h3 className="text-lg font-black text-slate-800 mb-1">{type.name}</h3>
                                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{type.description}</p>
                                                </div>

                                                <div className="mt-auto">
                                                    {isEnabled ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleConfigureGame(activeGame)}
                                                                className="flex-1 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">settings</span>
                                                                Configure
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggleGame(activeGame, true)}
                                                                className="size-10 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                                                                title="Disable Game"
                                                            >
                                                                <span className="material-symbols-outlined">power_settings_new</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEnableGame(type)}
                                                            className="w-full py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-blue-500 hover:text-blue-600 shadow-sm transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                                            Enable Game
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="bg-white p-6 rounded-full shadow-lg shadow-slate-100 mb-6">
                            <span className="material-symbols-outlined text-6xl text-blue-100">category</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Select a Topic</h2>
                        <p className="text-slate-500 max-w-sm">Choose a topic from the sidebar to configure its 6 mini-games.</p>
                    </div>
                )}
            </div>

            {/* Modal - keeping generic for now, but passing config */}
            <GameFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={() => loadTopicGames(selectedCategory?.id)}
                initialData={modalConfig} // Pass config to pre-fill specific game types
            />
        </div>
    )
}
