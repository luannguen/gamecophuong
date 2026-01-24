import { useState } from 'react';
import { useClassList } from '../hooks/useClassList';
import ClassFormModal from '../components/ClassFormModal';
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog';
import { useToast } from '../../../shared/hooks/useToast';
import '../admin.css';

export default function AdminClassesPage() {
    const {
        classes,
        teachers, // Pass to modal
        searchQuery,
        setSearchQuery,
        isLoading,
        handleDelete,
        createClass,
        updateClass
    } = useClassList();

    const { showConfirm } = useConfirmDialog();
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = () => {
        setEditingClass(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cls) => {
        setEditingClass(cls);
        setIsModalOpen(true);
    };

    const onDeleteClick = async (classId) => {
        const confirmed = await showConfirm({
            title: 'Delete Class',
            message: 'Are you sure? This will not delete students, but they will be unassigned.',
            confirmText: 'Delete',
            type: 'danger'
        });
        if (confirmed) {
            const success = await handleDelete(classId);
            if (success) addToast('Class deleted', 'success');
            else addToast('Failed to delete class', 'error');
        }
    };

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        const result = editingClass ?
            await updateClass(editingClass.id, formData) :
            await createClass(formData);

        setIsSubmitting(false);
        if (result.success) {
            addToast('Success', 'success');
            setIsModalOpen(false);
        } else {
            addToast(result.error || 'Failed', 'error');
        }
    };

    return (
        <div>
            {/* Header V2 */}
            <header className="page-header-v2">
                <div className="page-title-v2">
                    <h2>Classes</h2>
                    <p>Organize students and assign homeroom teachers.</p>
                </div>
                <div className="header-actions-v2">
                    <button className="btn-icon-v2">
                        <span className="material-symbols-outlined">description</span>
                    </button>
                    <button className="btn-primary-v2" onClick={handleCreate}>
                        <span className="material-symbols-outlined">add</span>
                        Add Class
                    </button>
                </div>
            </header>

            {/* Search Bar V2 */}
            <div className="search-bar-v2">
                <div className="search-input-wrapper-v2">
                    <span className="material-symbols-outlined search-icon-v2">search</span>
                    <input
                        type="text"
                        className="search-input-v2"
                        placeholder="Search class name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid V2 */}
            <div className="grid-v2">
                {classes.map(cls => (
                    <div key={cls.id} className="card-v2 group">
                        <div className="card-header-v2">
                            <div className="card-user-v2">
                                <div className="card-avatar-v2 bg-amber-100" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                                    <span className="material-symbols-outlined text-2xl">school</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{cls.name}</h3>
                                    <p className="text-xs text-slate-500">{cls.academic_year}</p>
                                </div>
                            </div>
                            <span
                                className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                                style={{
                                    backgroundColor: cls.is_active ? '#dcfce7' : '#f1f5f9',
                                    color: cls.is_active ? '#166534' : '#64748b'
                                }}
                            >
                                {cls.is_active ? 'Active' : 'Archived'}
                            </span>
                        </div>

                        <div className="card-stats-grid-v2">
                            <div className="stat-box-v2 gray col-span-2">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Teacher</p>
                                <p className="text-xs font-semibold leading-tight line-clamp-1">
                                    {cls.teacher_name || 'Unassigned'}
                                </p>
                            </div>
                            <div className="stat-box-v2 blue">
                                <p className="text-[10px] uppercase font-bold mb-1" style={{ color: '#2563eb' }}>Grade</p>
                                <p className="text-lg font-bold" style={{ color: '#2563eb' }}>{cls.grade_level}</p>
                            </div>
                        </div>

                        <div className="px-4 pb-2">
                            <p className="text-xs text-slate-400 line-clamp-2 min-h-[2.5em]">
                                {cls.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="card-actions-v2">
                            <button className="btn-action-v2 primary">
                                <span className="material-symbols-outlined text-lg">groups</span>
                                Students
                            </button>
                            <button className="btn-action-v2 secondary" onClick={() => handleEdit(cls)}>
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Edit
                            </button>
                            <button className="btn-delete-v2" onClick={() => onDeleteClick(cls.id)}>
                                <span className="material-symbols-outlined text-lg">delete_outline</span>
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <button
                    className="card-v2"
                    onClick={handleCreate}
                    style={{
                        border: '2px dashed #cbd5e1',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '240px',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(255,255,255,0.5)'
                    }}
                >
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <span className="material-symbols-outlined text-2xl">add_home_work</span>
                    </div>
                    <p className="font-bold text-slate-600">Add New Class</p>
                </button>
            </div>

            <ClassFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingClass}
                isSubmitting={isSubmitting}
                teachers={teachers}
            />
        </div>
    );
}
