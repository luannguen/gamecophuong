import React, { useState, useEffect } from 'react';
import '../admin.css';

export default function ClassFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting = false,
    teachers = []
}) {
    const isEdit = !!initialData;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        teacher_id: '',
        academic_year: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
        grade_level: 1,
        is_active: true
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    description: initialData.description || '',
                    teacher_id: initialData.teacher_id || '',
                    academic_year: initialData.academic_year || (new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString()),
                    grade_level: initialData.grade_level || 1,
                    is_active: initialData.is_active ?? true
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    teacher_id: '',
                    academic_year: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
                    grade_level: 1,
                    is_active: true
                });
            }
            setError('');
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) return setError('Please enter class name');

        // Convert grade_level to integer
        const payload = {
            ...formData,
            grade_level: parseInt(formData.grade_level, 10),
            // Handle empty teacher string as null
            teacher_id: formData.teacher_id || null
        };

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-v2">
            <div className="modal-content-v2">
                {/* Header */}
                <div className="modal-header-v2">
                    <h2 className="modal-title-v2">{isEdit ? 'Edit Class' : 'Add New Class'}</h2>
                    <button type="button" onClick={onClose} className="btn-close-v2">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body-v2">
                    {error && (
                        <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="form-stack-v2">
                        {/* Class Name */}
                        <div className="form-group-v2">
                            <label className="form-label-v2">Class Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input-v2"
                                placeholder="e.g. Grade 1A"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Grade & Year */}
                        <div className="form-row-v2">
                            <div className="form-group-v2">
                                <label className="form-label-v2">Grade Level</label>
                                <div className="select-wrapper-v2">
                                    <select
                                        name="grade_level"
                                        value={formData.grade_level}
                                        onChange={handleChange}
                                        className="form-select-v2"
                                        disabled={isSubmitting}
                                    >
                                        {[1, 2, 3, 4, 5].map(g => (
                                            <option key={g} value={g}>Grade {g}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined select-arrow-v2">expand_more</span>
                                </div>
                            </div>

                            <div className="form-group-v2">
                                <label className="form-label-v2">Academic Year</label>
                                <input
                                    type="text"
                                    name="academic_year"
                                    value={formData.academic_year}
                                    onChange={handleChange}
                                    className="form-input-v2"
                                    placeholder="2023-2024"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Teacher Assignment */}
                        <div className="form-group-v2">
                            <label className="form-label-v2">Homeroom Teacher</label>
                            <div className="select-wrapper-v2">
                                <select
                                    name="teacher_id"
                                    value={formData.teacher_id}
                                    onChange={handleChange}
                                    className="form-select-v2"
                                    disabled={isSubmitting}
                                >
                                    <option value="">-- No Teacher Assigned --</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined select-arrow-v2">expand_more</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group-v2">
                            <label className="form-label-v2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input-v2"
                                rows="3"
                                placeholder="Details about this class..."
                                disabled={isSubmitting}
                                style={{ minHeight: '80px', resize: 'vertical' }}
                            />
                        </div>

                        {/* Status Toggle */}
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
                                <span className="ms-3 text-sm font-medium text-slate-700">Active</span>
                            </label>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="modal-footer-v2">
                    <button onClick={handleSubmit} disabled={isSubmitting} className="btn-save-v2">
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={onClose} disabled={isSubmitting} className="btn-cancel-v2">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
