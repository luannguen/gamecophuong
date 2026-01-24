import { useState } from 'react';
import { useParentList } from '../hooks/useParentList';
import ParentFormModal from '../components/ParentFormModal';
import { useConfirmDialog } from '../../../shared/hooks/useConfirmDialog';
import { useToast } from '../../../shared/hooks/useToast';
import '../admin.css';

export default function AdminParentsPage() {
    const {
        parents,
        searchQuery,
        setSearchQuery,
        handleDelete,
        createParent,
        updateParent
    } = useParentList();

    const { showConfirm } = useConfirmDialog();
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParent, setEditingParent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalDefaultTab, setModalDefaultTab] = useState('info');

    const handleCreate = () => {
        setEditingParent(null);
        setModalDefaultTab('info');
        setIsModalOpen(true);
    };

    const handleEdit = (parent) => {
        setEditingParent(parent);
        setModalDefaultTab('info');
        setIsModalOpen(true);
    };

    const handleManageChildren = (parent) => {
        setEditingParent(parent);
        setModalDefaultTab('children');
        setIsModalOpen(true);
    };

    const onDeleteClick = async (parentId) => {
        const confirmed = await showConfirm({
            title: 'Delete Parent',
            message: 'Are you sure? This will remove the parent account and unlink all children.',
            confirmText: 'Delete',
            type: 'danger'
        });
        if (confirmed) {
            const success = await handleDelete(parentId);
            if (success) addToast('Parent deleted', 'success');
            else addToast('Failed to delete parent', 'error');
        }
    };

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        const result = editingParent ?
            await updateParent(editingParent.id, formData) :
            await createParent(formData);

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
                    <h2>Parents</h2>
                    <p>Manage family accounts and student connections.</p>
                </div>
                <div className="header-actions-v2">
                    <button className="btn-icon-v2">
                        <span className="material-symbols-outlined">group</span>
                    </button>
                    <button className="btn-primary-v2" onClick={handleCreate}>
                        <span className="material-symbols-outlined">add</span>
                        Add Parent
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
                        placeholder="Search parent name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid V2 */}
            <div className="grid-v2">
                {parents.map(parent => (
                    <div key={parent.id} className="card-v2 group">
                        <div className="card-header-v2">
                            <div className="card-user-v2">
                                <div className="card-avatar-v2 bg-pink-100" style={{ backgroundColor: '#fce7f3', color: '#db2777' }}>
                                    <span className="material-symbols-outlined text-2xl">family_restroom</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{parent.full_name}</h3>
                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{parent.email}</p>
                                </div>
                            </div>
                            <span
                                className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                                style={{
                                    backgroundColor: parent.is_active ? '#dcfce7' : '#f1f5f9',
                                    color: parent.is_active ? '#166534' : '#64748b'
                                }}
                            >
                                {parent.is_active ? 'Active' : 'Archived'}
                            </span>
                        </div>

                        <div className="card-stats-grid-v2">
                            <div className="stat-box-v2 gray col-span-2">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Phone</p>
                                <p className="text-xs font-semibold leading-tight">
                                    {parent.phone_number || '--'}
                                </p>
                            </div>
                            <div className="stat-box-v2 blue">
                                <p className="text-[10px] uppercase font-bold mb-1" style={{ color: '#2563eb' }}>Children</p>
                                <p className="text-sm font-bold truncate" style={{ color: '#2563eb' }}>
                                    {/* Show "View" or maybe count if we want to fix that too, but keeping simpler revert */}
                                    View
                                </p>
                            </div>
                        </div>

                        <div className="px-4 pb-2">
                            <p className="text-xs text-slate-400 line-clamp-1 min-h-[1.5em]">
                                {parent.address || 'No address provided.'}
                            </p>
                        </div>

                        <div className="card-actions-v2">
                            <button className="btn-action-v2 primary" onClick={() => handleManageChildren(parent)}>
                                <span className="material-symbols-outlined text-lg">child_care</span>
                                Children
                            </button>
                            <button className="btn-action-v2 secondary" onClick={() => handleEdit(parent)}>
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Edit
                            </button>
                            <button className="btn-delete-v2" onClick={() => onDeleteClick(parent.id)}>
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
                        <span className="material-symbols-outlined text-2xl">person_add</span>
                    </div>
                    <p className="font-bold text-slate-600">Add New Parent</p>
                </button>
            </div>

            <ParentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingParent}
                isSubmitting={isSubmitting}
                defaultTab={modalDefaultTab}
            />
        </div>
    );
}
