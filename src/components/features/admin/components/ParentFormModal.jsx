import React, { useState, useEffect } from 'react';
import { parentRepository } from '../data/parentRepository';
import { studentRepository as adminStudentRepository } from '../../../features/student/data/studentRepository';
import { classRepository } from '../data/classRepository';
import '../admin.css';

export default function ParentFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting = false,
    defaultTab = 'info'
}) {
    const isEdit = !!initialData;

    // Parent Info State
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        is_active: true
    });

    // Children Management State
    const [children, setChildren] = useState([]);

    // New Dropdown State
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);

    const [error, setError] = useState('');
    const [linkError, setLinkError] = useState('');
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (isOpen) {
            // Reset States
            setSelectedClassId('');
            setAvailableStudents([]);
            setSelectedStudentId('');
            setLinkError('');

            // Load Classes
            fetchClasses();

            if (initialData) {
                setFormData({
                    full_name: initialData.full_name || '',
                    email: initialData.email || '',
                    phone_number: initialData.phone_number || '',
                    address: initialData.address || '',
                    is_active: initialData.is_active ?? true
                });
                loadChildren(initialData.id);
                // Use defaultTab if provided, else 'info'
                setActiveTab(defaultTab);
            } else {
                setFormData({
                    full_name: '',
                    email: '',
                    phone_number: '',
                    address: '',
                    is_active: true
                });
                setChildren([]);
                setActiveTab('info');
            }
            setError('');
        }
    }, [isOpen, initialData, defaultTab]);

    const fetchClasses = async () => {
        try {
            const { data } = await classRepository.getActiveClasses();
            if (data) setClasses(data);
        } catch (err) {
            console.error("Failed to load classes", err);
        }
    };

    const loadChildren = async (parentId) => {
        const result = await parentRepository.getChildren(parentId);
        if (result.success) {
            setChildren(result.data);
        }
    };

    const handleClassChange = async (e) => {
        const classId = e.target.value;
        setSelectedClassId(classId);
        setSelectedStudentId('');
        setAvailableStudents([]);

        if (classId) {
            setIsLoadingStudents(true);
            try {
                // Using existing repo function that supports class filtering
                const result = await adminStudentRepository.getFiltered({ classFilter: classId });
                if (result.success) {
                    setAvailableStudents(result.data || []);
                }
            } catch (err) {
                console.error("Failed to load students", err);
            } finally {
                setIsLoadingStudents(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddChild = async () => {
        if (!selectedStudentId || !initialData?.id) return;

        // Check if already added
        if (children.some(c => c.id === selectedStudentId)) {
            setLinkError('This student is already linked.');
            return;
        }

        const result = await parentRepository.linkStudent(initialData.id, selectedStudentId);
        if (result.success) {
            loadChildren(initialData.id);
            // Reset selection to allow adding another from same class easily
            setSelectedStudentId('');
            setLinkError('');
        } else {
            setLinkError('Failed to link student.');
        }
    };

    const handleRemoveChild = async (studentId) => {
        if (!initialData?.id) return;
        if (!window.confirm('Remove this child?')) return;

        const result = await parentRepository.unlinkStudent(initialData.id, studentId);
        if (result.success) {
            loadChildren(initialData.id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.full_name.trim()) return setError('Please enter parent name');
        if (!formData.email.trim()) return setError('Please enter email');

        const payload = {
            ...formData,
        };

        if (!isEdit) {
            payload.auth_user_id = crypto.randomUUID();
        }

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-v2">
            <div className="modal-content-v2" style={{ maxWidth: '600px' }}>
                {/* Header */}
                <div className="modal-header-v2">
                    <h2 className="modal-title-v2">{isEdit ? 'Edit Parent' : 'Add New Parent'}</h2>
                    <button type="button" onClick={onClose} className="btn-close-v2">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                {isEdit && (
                    <div className="flex border-b border-gray-200 mb-4 px-6">
                        <button
                            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('info')}
                        >
                            Parent Info
                        </button>
                        <button
                            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'children' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('children')}
                        >
                            Children ({children.length})
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="modal-body-v2">
                    {error && (
                        <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {activeTab === 'info' ? (
                        <form onSubmit={handleSubmit} className="form-stack-v2">
                            {/* Full Name */}
                            <div className="form-group-v2">
                                <label className="form-label-v2">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="form-input-v2"
                                    placeholder="Parent Name"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Email */}
                            <div className="form-group-v2">
                                <label className="form-label-v2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input-v2"
                                    placeholder="parent@email.com"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Phone */}
                            <div className="form-group-v2">
                                <label className="form-label-v2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="form-input-v2"
                                    placeholder="+84..."
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Address */}
                            <div className="form-group-v2">
                                <label className="form-label-v2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="form-input-v2"
                                    placeholder="Home Address"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                        disabled={isSubmitting}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary"></div>
                                    <span className="ms-3 text-sm font-medium text-slate-700">Active Account</span>
                                </label>
                            </div>

                            {!isEdit && (
                                <p className="text-xs text-slate-500 mt-4 text-center">
                                    Create the parent profile first, then you can add children.
                                </p>
                            )}
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {/* Link Student Section */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <h4 className="text-sm font-bold text-slate-700 mb-3">Link Student</h4>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Class</label>
                                        <div className="select-wrapper-v2">
                                            <select
                                                value={selectedClassId}
                                                onChange={handleClassChange}
                                                className="form-select-v2 text-sm"
                                            >
                                                <option value="">Select Class</option>
                                                {classes.map(cls => (
                                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                ))}
                                            </select>
                                            <span className="material-symbols-outlined select-arrow-v2">expand_more</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Student</label>
                                        <div className="select-wrapper-v2">
                                            <select
                                                value={selectedStudentId}
                                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                                className="form-select-v2 text-sm"
                                                disabled={!selectedClassId || isLoadingStudents}
                                            >
                                                <option value="">
                                                    {isLoadingStudents ? 'Loading...' : 'Select Student'}
                                                </option>
                                                {availableStudents.map(std => (
                                                    <option key={std.id} value={std.id}>
                                                        {std.display_name || std.full_name} ({std.pin_code})
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="material-symbols-outlined select-arrow-v2">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddChild}
                                    className="w-full btn-primary-v2 justify-center py-2"
                                    disabled={!selectedStudentId}
                                >
                                    <span className="material-symbols-outlined text-sm">link</span>
                                    Link Selected Student
                                </button>

                                {linkError && <p className="text-red-500 text-xs mt-2 text-center">{linkError}</p>}
                            </div>

                            {/* List */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-slate-700">Linked Children</h4>
                                {children.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic text-center py-4">No children linked yet.</p>
                                ) : (
                                    children.map(child => (
                                        <div key={child.link_id || child.id} className="p-3 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-lg">
                                                    <span className="material-symbols-outlined text-[20px]">child_care</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800">{child.display_name}</p>
                                                    <p className="text-xs text-slate-500">PIN: {child.pin_code}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveChild(child.id)}
                                                className="text-slate-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove Link"
                                            >
                                                <span className="material-symbols-outlined text-lg">link_off</span>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer-v2">
                    {activeTab === 'info' && (
                        <button onClick={handleSubmit} disabled={isSubmitting} className="btn-save-v2">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                    <button onClick={onClose} disabled={isSubmitting} className="btn-cancel-v2">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
