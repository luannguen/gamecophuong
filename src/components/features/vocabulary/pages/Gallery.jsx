import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IMAGES, VIDEO_CATEGORIES } from '../../../../data/designAssets'
import { videoRepository } from '../../admin/data/videoRepository'
import { categoryRepository } from '../../admin/data/categoryRepository'
import './Gallery.css'

export default function VideoGallery() {
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [videos, setVideos] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null) // Filter state
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const student = localStorage.getItem('current_student')
        if (!student) {
            navigate('/student/login')
        }
        loadData()
    }, [navigate])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [videoResult, categoryResult] = await Promise.all([
                videoRepository.getAll(),
                categoryRepository.getAll()
            ])

            if (videoResult.success) {
                setVideos(videoResult.data || [])
            }
            if (categoryResult.success) {
                setCategories(categoryResult.data || [])
            }
        } catch (error) {
            console.error('Failed to load data', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="videos-page">
            {/* Background Gradient */}
            <div className="bg-gradient-effect"></div>

            {/* Header */}
            <header className="videos-header">
                <div className="header-content">
                    <h1>Watch & Learn</h1>
                    <p className="header-subtitle">Lessons with Miss Phượng</p>
                </div>
                <button className="icon-btn toy-shadow">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </header>

            <main className="videos-main">
                {/* New Lessons Section (Featured) */}
                <section className="lessons-section">
                    <div className="section-header">
                        <h2>New Lessons</h2>
                    </div>

                    {/* Horizontal Scroll Carousel */}
                    <div className="lessons-carousel no-scrollbar">
                        {videos.filter(v => v.is_featured).length > 0 ? (
                            videos.filter(v => v.is_featured).map(video => {
                                const catConfig = categories.find(c => c.name === video.category) || { color: '#ccc', icon: 'movie' };
                                return (
                                    <div
                                        key={video.id}
                                        className="lesson-card featured cursor-pointer hover:scale-95 transition-transform"
                                        style={{ backgroundColor: catConfig.color }}
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        <div
                                            className="lesson-bg"
                                            style={{ backgroundImage: `url(${video.thumbnail_url || IMAGES.tvPlay})` }}
                                        ></div>
                                        <div className="lesson-overlay"></div>
                                        <div className="play-button">
                                            <span className="material-symbols-outlined">play_arrow</span>
                                        </div>
                                        <div className="lesson-info">
                                            <span className="featured-badge">Featured</span>
                                            <h3>{video.title}</h3>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-slate-400 text-sm ml-4">No new lessons yet.</p>
                        )}
                    </div>
                </section>

                {/* Categories Section */}
                <section className="categories-section">
                    <div className="section-header">
                        <h2>Categories</h2>
                    </div>
                    <div className="categories-scroll no-scrollbar">
                        {/* 'All' Option */}
                        <div
                            className={`category-item ${selectedCategory === null ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(null)}
                        >
                            <div
                                className="category-icon toy-shadow"
                                style={{
                                    backgroundColor: selectedCategory === null ? '#1f2937' : 'white',
                                    color: selectedCategory === null ? 'white' : undefined
                                }}
                            >
                                <span className="material-symbols-outlined">grid_view</span>
                            </div>
                            <span className="category-name">All</span>
                        </div>

                        {categories.map(cat => (
                            <div
                                key={cat.id}
                                className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                <div className="category-icon toy-shadow" style={{
                                    backgroundColor: selectedCategory === cat.name ? cat.color : undefined,
                                    color: selectedCategory === cat.name ? 'white' : undefined
                                }}>
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ color: selectedCategory === cat.name ? 'white' : cat.color }}
                                    >{cat.icon}</span>
                                </div>
                                <span className="category-name">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommended Section (Dynamically Loaded) */}
                <section className="recommended-section">
                    <h2>Recommended for You</h2>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin size-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : (
                        <div className="recommended-list">
                            {videos.filter(v => !selectedCategory || v.category === selectedCategory).length === 0 ? (
                                <p className="text-slate-500 text-center col-span-3">No videos found for this category.</p>
                            ) : (
                                videos.filter(v => !selectedCategory || v.category === selectedCategory).map(video => {
                                    // Find category config for coloring
                                    const catConfig = categories.find(c => c.name === video.category) || { color: '#ccc', icon: 'movie' };

                                    return (
                                        <div
                                            key={video.id}
                                            className="video-card toy-shadow cursor-pointer hover:scale-105 transition-transform"
                                            onClick={() => setSelectedVideo(video)}
                                        >
                                            <div className="video-thumbnail">
                                                <div
                                                    className="thumbnail-bg"
                                                    style={{ backgroundImage: `url(${video.thumbnail_url || IMAGES.tvPlay})` }}
                                                ></div>
                                                <div className="thumbnail-overlay">
                                                    <span className="material-symbols-outlined">play_circle</span>
                                                </div>
                                            </div>
                                            <div className="video-info">
                                                <h4>{video.title}</h4>
                                                <p className="video-duration">
                                                    <span className="material-symbols-outlined">schedule</span>
                                                    {video.duration || 'N/A'}
                                                </p>
                                                <div className="video-meta">
                                                    {/* Category Badge */}
                                                    <span
                                                        className="level-badge flex items-center gap-1"
                                                        style={{
                                                            backgroundColor: `${catConfig.color}15`, // 15% opacity
                                                            color: catConfig.color
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined text-[14px]">{catConfig.icon}</span>
                                                        {video.category || 'General'}
                                                    </span>

                                                    {/* Play Text if available or keep generic */}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div className="video-modal" onClick={() => setSelectedVideo(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {/* Video Player */}
                        <div className="video-player">
                            {/* If it's a YouTube link, we might need an embed. For now, assuming direct or handling simple iframe if needed. 
                                 But since we are using MP4/files generally or simple links, let's keep it simple or use an iframe for youtube.
                                 Let's check if it is youtube. 
                             */}
                            {selectedVideo.video_url && (selectedVideo.video_url.includes('youtube') || selectedVideo.video_url.includes('youtu.be')) ? (
                                <iframe
                                    src={selectedVideo.video_url.replace('watch?v=', 'embed/').split('&')[0]}
                                    title={selectedVideo.title}
                                    className="w-full h-full aspect-video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video controls className="w-full h-full bg-black">
                                    <source src={selectedVideo.video_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>

                        {/* Video Details */}
                        <div className="video-details">
                            <div className="details-header">
                                <button className="back-btn" onClick={() => setSelectedVideo(null)}>
                                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                                </button>
                                <div>
                                    <h2>Watch & Learn</h2>
                                    <p className="unit-label">Unit 1: Family</p>
                                </div>
                            </div>

                            <h1 className="video-title">Lesson 1: My Happy Family</h1>
                            <p className="video-description">
                                Learn common words for family members with Miss Phượng and her friends!
                            </p>

                            <div className="vocabulary-section">
                                <div className="vocab-header">
                                    <h3>Vocabulary List</h3>
                                    <span className="listen-all">Listen All</span>
                                </div>
                                <div className="vocab-chips">
                                    {['Mom', 'Dad', 'Brother', 'Sister', 'Grandma'].map(word => (
                                        <button key={word} className="vocab-chip">
                                            <span className="material-symbols-outlined">volume_up</span>
                                            <span>{word}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <Link to="/student/home" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>home</span>
                    <span>Home</span>
                </Link>
                <Link to="/student/games" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>sports_esports</span>
                    <span>Games</span>
                </Link>
                <div className="nav-fab-container">
                    <Link to="/student/games" className="nav-fab">
                        <span className="material-symbols-outlined">add</span>
                    </Link>
                </div>
                <Link to="/student/videos" className="nav-item active">
                    <span className="material-symbols-outlined">movie</span>
                    <span>Videos</span>
                </Link>
                <Link to="/student/rankings" className="nav-item">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>leaderboard</span>
                    <span>Ranking</span>
                </Link>
            </nav>
        </div>
    )
}
