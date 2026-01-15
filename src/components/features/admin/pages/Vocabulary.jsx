import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../../data/supabaseClient'
import './Vocabulary.css'

const CATEGORIES = [
    { value: 'animals', label: '🦁 Animals' },
    { value: 'food', label: '🍎 Food & Drinks' },
    { value: 'colors', label: '🎨 Colors' },
    { value: 'household', label: '🏠 Household Items' },
    { value: 'school', label: '📚 School' },
    { value: 'family', label: '👨‍👩‍👧 Family' },
]

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard']

export default function AdminVocabulary() {
    const [formData, setFormData] = useState({
        word: '',
        meaning: '',
        category: '',
        difficulty: 'Easy',
        imageUrl: '',
        audioUrl: '',
    })
    const [vocabularyList, setVocabularyList] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        loadVocabulary()
    }, [])

    const loadVocabulary = async () => {
        try {
            const { data } = await supabase
                .from('vocabulary')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20)
            setVocabularyList(data || [])
        } catch (error) {
            console.error('Error loading vocabulary:', error)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!formData.word || !formData.meaning) {
            alert('Vui lòng nhập từ và nghĩa!')
            return
        }

        setIsSaving(true)
        try {
            const { error } = await supabase.from('vocabulary').insert({
                word: formData.word,
                meaning: formData.meaning,
                category_id: formData.category || null,
                difficulty_level: formData.difficulty.toLowerCase(),
                image_url: formData.imageUrl || null,
                audio_url: formData.audioUrl || null,
            })

            if (error) throw error

            setFormData({ word: '', meaning: '', category: '', difficulty: 'Easy', imageUrl: '', audioUrl: '' })
            setShowAddForm(false)
            loadVocabulary()
        } catch (error) {
            console.error('Error saving vocabulary:', error)
            alert('Lỗi khi lưu từ vựng!')
        }
        setIsSaving(false)
    }

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa từ này?')) return
        try {
            await supabase.from('vocabulary').delete().eq('id', id)
            loadVocabulary()
        } catch (error) {
            console.error('Error deleting:', error)
        }
    }

    // Add Form View
    if (showAddForm) {
        return (
            <div className="admin-vocab-page">
                {/* Header for Form View (Internal) */}
                <header className="vocab-header internal">
                    <div className="header-left">
                        <button className="close-btn" onClick={() => setShowAddForm(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h2>Add Vocabulary</h2>
                    </div>
                    <span className="draft-badge">DRAFT MODE</span>
                </header>

                <main className="vocab-form">
                    {/* Basic Info */}
                    <section className="form-section">
                        <div className="form-field">
                            <label>Word (English)</label>
                            <input
                                type="text"
                                placeholder="e.g., Apple"
                                value={formData.word}
                                onChange={(e) => handleInputChange('word', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Meaning (Vietnamese)</label>
                            <input
                                type="text"
                                placeholder="e.g., Quả táo"
                                value={formData.meaning}
                                onChange={(e) => handleInputChange('meaning', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                            >
                                <option value="">Select a category...</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </section>

                    {/* Media Assets */}
                    <section className="form-section">
                        <h3 className="section-title primary">Media Assets</h3>

                        {/* Image Upload */}
                        <div className="media-field">
                            <p className="field-label">Illustration</p>
                            <div className="upload-area">
                                <span className="material-symbols-outlined">add_a_photo</span>
                                <p className="upload-text">Tap to upload image</p>
                                <p className="upload-hint">PNG, JPG up to 5MB</p>
                            </div>
                        </div>

                        {/* Audio Recording */}
                        <div className="media-field">
                            <p className="field-label">Pronunciation (Audio)</p>
                            <div className="audio-recorder">
                                <button
                                    className={`record-btn ${isRecording ? 'recording' : ''}`}
                                    onClick={() => setIsRecording(!isRecording)}
                                >
                                    <span className="material-symbols-outlined">
                                        {isRecording ? 'stop' : 'mic'}
                                    </span>
                                </button>
                                <div className="audio-status">
                                    <p className="status-text">
                                        {isRecording ? 'Recording...' : 'Ready to Record'}
                                    </p>
                                    <div className="progress-bar">
                                        <div className={`progress ${isRecording ? 'active' : ''}`}></div>
                                    </div>
                                </div>
                                <button className="upload-audio-btn">Upload</button>
                            </div>
                        </div>
                    </section>

                    {/* Difficulty Level */}
                    <section className="form-section">
                        <h3 className="section-title secondary">Difficulty Level</h3>
                        <div className="difficulty-buttons">
                            {DIFFICULTY_LEVELS.map(level => (
                                <button
                                    key={level}
                                    className={`diff-btn ${formData.difficulty === level ? 'active' : ''}`}
                                    onClick={() => handleInputChange('difficulty', level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </section>
                </main>

                {/* Footer Actions */}
                <footer className="form-footer">
                    <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                        Cancel
                    </button>
                    <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                        <span className="material-symbols-outlined">check_circle</span>
                        {isSaving ? 'Saving...' : 'Save Word'}
                    </button>
                </footer>
            </div>
        )
    }

    // List View
    return (
        <div className="admin-vocab-page list-view">
            <h1 style={{ display: 'none' }}>Vocabulary Management</h1>
            <div className="vocab-list-container">
                {/* Empty state or List */}
                {vocabularyList.length === 0 ? (
                    <div className="empty-state">
                        <span className="material-symbols-outlined">menu_book</span>
                        <p>No vocabulary yet</p>
                        <button className="add-first-btn" onClick={() => setShowAddForm(true)}>
                            Add your first word
                        </button>
                    </div>
                ) : (
                    <div className="vocab-grid">
                        {vocabularyList.map(vocab => (
                            <div key={vocab.id} className="vocab-item">
                                <div className="vocab-content">
                                    <h4>{vocab.word}</h4>
                                    <p>{vocab.meaning}</p>
                                    <span className={`difficulty ${vocab.difficulty_level}`}>
                                        {vocab.difficulty_level}
                                    </span>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(vocab.id)}
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FAB */}
            <button className="fab" onClick={() => setShowAddForm(true)}>
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    )
}
