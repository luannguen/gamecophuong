import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../../data/supabaseClient'
import './Videos.css'

export default function AdminVideos() {
    const [videos, setVideos] = useState([])
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingVideo, setEditingVideo] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video_url: '',
        category_id: '',
        duration_minutes: 5,
        is_featured: false,
    })
    const navigate = useNavigate()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [videosRes, categoriesRes] = await Promise.all([
                supabase.from('videos').select('*, categories(name)').order('created_at', { ascending: false }),
                supabase.from('categories').select('*').eq('is_active', true)
            ])

            setVideos(videosRes.data || [])
            setCategories(categoriesRes.data || [])
            setIsLoading(false)
        } catch (error) {
            console.error('Error loading videos:', error)
            setIsLoading(false)
        }
    }

    const openAddModal = () => {
        setEditingVideo(null)
        setFormData({ title: '', description: '', video_url: '', category_id: '', duration_minutes: 5, is_featured: false })
        setShowModal(true)
    }

    const openEditModal = (video) => {
        setEditingVideo(video)
        setFormData({
            title: video.title,
            description: video.description || '',
            video_url: video.video_url || '',
            category_id: video.category_id || '',
            duration_minutes: video.duration_minutes || 5,
            is_featured: video.is_featured || false,
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingVideo) {
                await supabase.from('videos').update(formData).eq('id', editingVideo.id)
            } else {
                await supabase.from('videos').insert(formData)
            }
            setShowModal(false)
            loadData()
        } catch (error) {
            console.error('Error saving video:', error)
        }
    }

    const deleteVideo = async (id) => {
        if (!confirm('Are you sure you want to delete this video?')) return
        try {
            await supabase.from('videos').delete().eq('id', id)
            loadData()
        } catch (error) {
            console.error('Error deleting video:', error)
        }
    }

    const getYouTubeId = (url) => {
        if (!url) return null
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
        return match ? match[1] : null
    }

    const getThumbnail = (video) => {
        if (video.thumbnail_url) return video.thumbnail_url
        const youtubeId = getYouTubeId(video.video_url)
        return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : null
    }

    if (isLoading) {
        return <div className="loading"><div className="spinner"></div></div>
    }

    return (
        <div className="admin-videos-page">
            <header className="videos-header">
                <div>
                    <h1>Video Management</h1>
                    <p className="text-secondary">{videos.length} videos in library</p>
                </div>
                <button className="add-btn" onClick={openAddModal}>
                    <span className="material-symbols-outlined">add</span>
                    Add Video
                </button>
            </header>

            <div className="videos-grid">
                {videos.map(video => (
                    <div key={video.id} className="video-admin-card">
                        <div className="video-thumbnail">
                            {getThumbnail(video) ? (
                                <img src={getThumbnail(video)} alt={video.title} />
                            ) : (
                                <div className="thumbnail-placeholder">
                                    <span className="material-symbols-outlined">movie</span>
                                </div>
                            )}
                            {video.is_featured && (
                                <span className="featured-badge">⭐ Featured</span>
                            )}
                            <span className="duration-badge">{video.duration_minutes || 5} min</span>
                        </div>
                        <div className="video-info">
                            <h3>{video.title}</h3>
                            <p>{video.description || 'No description'}</p>
                            <span className="video-category">{video.categories?.name || 'Uncategorized'}</span>
                        </div>
                        <div className="video-actions">
                            <button className="action-btn edit" onClick={() => openEditModal(video)}>
                                <span className="material-symbols-outlined">edit</span>
                                Edit
                            </button>
                            <button className="action-btn delete" onClick={() => deleteVideo(video.id)}>
                                <span className="material-symbols-outlined">delete</span>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingVideo ? 'Edit Video' : 'Add New Video'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>YouTube URL</label>
                                <input
                                    type="url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={formData.video_url}
                                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Duration (min)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={formData.duration_minutes}
                                        onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    />
                                    Featured Video
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="save-btn">{editingVideo ? 'Update' : 'Add Video'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
