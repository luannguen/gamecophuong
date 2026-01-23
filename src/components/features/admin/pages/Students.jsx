import { useState } from 'react';
import { useStudentList } from '../hooks/useStudentList';
import StudentFormModal from '../components/StudentFormModal';
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog';
import { useToast } from '../../../shared/hooks/useToast';
import '../admin.css'; // Ensure V2 styles are loaded

export default function AdminStudents() {
    // Data Hooks
    const {
        students,
        classes,
        searchQuery,
        setSearchQuery,
        selectedClassId,
        setSelectedClassId,
        isLoading,
        handleDelete,
        createStudent,
        updateStudent
    } = useStudentList();

    // UI Hooks
    const { showConfirm } = useConfirmDialog();
    const { addToast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handlers
    const handleCreate = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const onDeleteClick = async (studentId) => {
        const confirmed = await showConfirm({
            title: 'Delete Student',
            message: 'Are you sure?',
            confirmText: 'Delete',
            type: 'danger'
        });
        if (confirmed) {
            const success = await handleDelete(studentId);
            if (success) addToast('Student deleted', 'success');
            else addToast('Failed to delete', 'error');
        }
    };

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        const result = editingStudent ?
            await updateStudent(editingStudent.id, formData) :
            await createStudent(formData);

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
                    <h2>Students</h2>
                    <p>Manage and track your students' directory and performance.</p>
                </div>
                <div className="header-actions-v2">
                    <button className="btn-icon-v2">
                        <span className="material-symbols-outlined">dark_mode</span>
                    </button>
                    <button className="btn-icon-v2">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="btn-primary-v2" onClick={handleCreate}>
                        <span className="material-symbols-outlined">add</span>
                        Add Student
                    </button>
                </div>
            </header>

            {/* Search & Filter V2 */}
            <div className="search-bar-v2">
                <div className="search-input-wrapper-v2">
                    <span className="material-symbols-outlined search-icon-v2">search</span>
                    <input
                        type="text"
                        className="search-input-v2"
                        placeholder="Search by name, PIN, or class..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        className="bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 px-4 py-2 min-w-[160px] outline-none"
                        style={{ backgroundColor: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '0.75rem' }}
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        <option value="all">All Classes</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button className="btn-icon-v2" style={{ padding: '0 1rem', width: 'auto', gap: '0.5rem' }}>
                        <span className="material-symbols-outlined">filter_list</span>
                        Filters
                    </button>
                </div>
            </div>

            {/* Grid V2 */}
            <div className="grid-v2">
                {students.map(student => (
                    <div key={student.id} className="card-v2 group">
                        <div className="card-header-v2">
                            <div className="card-user-v2">
                                <div className={`card-avatar-v2 ${student.gender === 'female' ? 'bg-pink' : 'bg-blue'}`} style={{ backgroundColor: student.gender === 'female' ? '#fce7f3' : '#e0e7ff' }}>
                                    <img
                                        src={student.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.pin_code}`}
                                        alt={student.display_name}
                                        className="card-avatar-img-v2"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{student.display_name}</h3>
                                    <p className="text-xs font-mono" style={{ color: '#64748b' }}>PIN: {student.pin_code}</p>
                                </div>
                            </div>
                            <span
                                className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                                style={{
                                    backgroundColor: student.is_online ? '#dcfce7' : '#f1f5f9',
                                    color: student.is_online ? '#166534' : '#64748b'
                                }}
                            >
                                {student.is_online ? 'Online' : 'Offline'}
                            </span>
                        </div>

                        <div className="card-stats-grid-v2">
                            <div className="stat-box-v2 gray">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Class</p>
                                <p className="text-xs font-semibold leading-tight">{student.class_name || 'N/A'}</p>
                            </div>
                            <div className="stat-box-v2 amber">
                                <p className="text-[10px] uppercase font-bold mb-1" style={{ color: '#d97706' }}>Points</p>
                                <p className="text-sm font-bold" style={{ color: '#d97706' }}>{student.total_points || 0}</p>
                            </div>
                            <div className="stat-box-v2 blue">
                                <p className="text-[10px] uppercase font-bold mb-1" style={{ color: '#2563eb' }}>Games</p>
                                <p className="text-sm font-bold" style={{ color: '#2563eb' }}>{student.games_played || 0}</p>
                            </div>
                        </div>

                        <div className="card-actions-v2">
                            <button className="btn-action-v2 primary">
                                <span className="material-symbols-outlined text-lg">bar_chart</span>
                                Stats
                            </button>
                            <button className="btn-action-v2 secondary" onClick={() => handleEdit(student)}>
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Edit
                            </button>
                            <button className="btn-delete-v2" onClick={() => onDeleteClick(student.id)}>
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
                        minHeight: '260px',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(255,255,255,0.5)'
                    }}
                >
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <span className="material-symbols-outlined text-2xl">person_add_alt</span>
                    </div>
                    <p className="font-bold text-slate-600">Add New Student</p>
                </button>
            </div>

            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingStudent}
                isSubmitting={isSubmitting}
                allStudents={students}
            />
        </div>
    );
}
