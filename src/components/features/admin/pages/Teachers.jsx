import { useState } from 'react';
import { useTeacherList } from '../hooks/useTeacherList';
import TeacherFormModal from '../components/TeacherFormModal';
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog';
import { useToast } from '../../../shared/hooks/useToast';
import '../admin.css';

export default function AdminTeachersPage() {
    const {
        teachers,
        searchQuery,
        setSearchQuery,
        isLoading,
        handleDelete,
        createTeacher,
        updateTeacher
    } = useTeacherList();

    const { showConfirm } = useConfirmDialog();
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = () => {
        setEditingTeacher(null);
        setIsModalOpen(true);
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setIsModalOpen(true);
    };

    const onDeleteClick = async (teacherId) => {
        const confirmed = await showConfirm({
            title: 'Delete Teacher',
            message: 'Are you sure? This action cannot be undone.',
            confirmText: 'Delete',
            type: 'danger'
        });
        if (confirmed) {
            const success = await handleDelete(teacherId);
            if (success) addToast('Teacher deleted', 'success');
            else addToast('Failed to delete teacher', 'error');
        }
    };

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        const result = editingTeacher ?
            await updateTeacher(editingTeacher.id, formData) :
            await createTeacher(formData);

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
                    <h2>Teachers</h2>
                    <p>Manage teaching staff and their assignments.</p>
                </div>
                <div className="header-actions-v2">
                    <button className="btn-icon-v2">
                        <span className="material-symbols-outlined">mail</span>
                    </button>
                    <button className="btn-primary-v2" onClick={handleCreate}>
                        <span className="material-symbols-outlined">add</span>
                        Add Teacher
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
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid V2 */}
            <div className="grid-v2">
                {teachers.map(teacher => (
                    <div key={teacher.id} className="card-v2 group">
                        <div className="card-header-v2">
                            <div className="card-user-v2">
                                <div className="card-avatar-v2 bg-emerald-100" style={{ backgroundColor: '#d1fae5' }}>
                                    <img
                                        src={teacher.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.id}`}
                                        alt={teacher.display_name}
                                        className="card-avatar-img-v2"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{teacher.full_name}</h3>
                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{teacher.email}</p>
                                </div>
                            </div>
                            <span
                                className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                                style={{
                                    backgroundColor: teacher.is_active ? '#dcfce7' : '#f1f5f9',
                                    color: teacher.is_active ? '#166534' : '#64748b'
                                }}
                            >
                                {teacher.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="card-stats-grid-v2">
                            <div className="stat-box-v2 gray col-span-2">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">School / Dept</p>
                                <p className="text-xs font-semibold leading-tight line-clamp-2">
                                    {teacher.school_name || 'No details provided'}
                                </p>
                            </div>
                            <div className="stat-box-v2 blue">
                                <p className="text-[10px] uppercase font-bold mb-1" style={{ color: '#2563eb' }}>Phone</p>
                                <p className="text-xs font-bold" style={{ color: '#2563eb' }}>{teacher.phone_number || '--'}</p>
                            </div>
                        </div>

                        <div className="card-actions-v2">
                            <button className="btn-action-v2 primary">
                                <span className="material-symbols-outlined text-lg">school</span>
                                Classes
                            </button>
                            <button className="btn-action-v2 secondary" onClick={() => handleEdit(teacher)}>
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Edit
                            </button>
                            <button className="btn-delete-v2" onClick={() => onDeleteClick(teacher.id)}>
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
                        minHeight: '220px',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(255,255,255,0.5)'
                    }}
                >
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <span className="material-symbols-outlined text-2xl">group_add</span>
                    </div>
                    <p className="font-bold text-slate-600">Add New Teacher</p>
                </button>
            </div>

            <TeacherFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingTeacher}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}

