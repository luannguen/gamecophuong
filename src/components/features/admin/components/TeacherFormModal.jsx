import React, { useState, useEffect, useRef } from 'react';
import { useImageUpload } from '../../../shared/hooks/useImageUpload';
import '../admin.css';

export default function TeacherFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting = false
}) {
    const isEdit = !!initialData;
    const { uploadImage, isUploading: isUploadingImage } = useImageUpload();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        school_name: '',
        avatar_url: '',
        is_active: true
    });

    const [error, setError] = useState('');
    const [pendingFile, setPendingFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    full_name: initialData.full_name || '',
                    email: initialData.email || '',
                    phone_number: initialData.phone_number || '',
                    school_name: initialData.school_name || '',
                    avatar_url: initialData.avatar_url || '',
                    is_active: initialData.is_active ?? true
                });
                setPreviewUrl(initialData.avatar_url || '');
            } else {
                setFormData({
                    full_name: '',
                    email: '',
                    phone_number: '',
                    school_name: '',
                    avatar_url: '',
                    is_active: true
                });
                setPreviewUrl('');
            }
            setPendingFile(null);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError("Only image files are allowed");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError("Image must be smaller than 10MB");
                return;
            }
            setPendingFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setError('');
        }
    };

    const handleTriggerFile = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.full_name.trim()) return setError('Please enter teacher name');
        if (!formData.email.trim()) return setError('Please enter email address');

        let finalAvatarUrl = formData.avatar_url;

        // Upload image if selected
        if (pendingFile) {
            const uploadedUrl = await uploadImage(pendingFile);
            if (!uploadedUrl) {
                setError('Failed to upload avatar image. Please try again.');
                return;
            }
            finalAvatarUrl = uploadedUrl;
        }

        const payload = {
            ...formData,
            avatar_url: finalAvatarUrl
        };

        if (!isEdit) {
            payload.auth_user_id = crypto.randomUUID();
        }

        onSubmit(payload);
    };

    if (!isOpen) return null;

    const isBusy = isSubmitting || isUploadingImage;

    return (
        <div className="modal-overlay-v2">
            <div className="modal-content-v2">
                {/* Header */}
                <div className="modal-header-v2">
                    <h2 className="modal-title-v2">{isEdit ? 'Edit Teacher' : 'Add New Teacher'}</h2>
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

                    {/* Avatar Section */}
                    <div className="modal-avatar-section-v2">
                        <div className="avatar-wrapper-v2 group">
                            <div className="avatar-circle-v2">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Avatar" className="avatar-img-v2" />
                                ) : (
                                    <span className="material-symbols-outlined avatar-placeholder-icon-v2">school</span>
                                )}
                            </div>
                            <button
                                type="button"
                                className="btn-camera-v2"
                                title="Change Avatar"
                                onClick={handleTriggerFile}
                                disabled={isBusy}
                            >
                                <span className="material-symbols-outlined text-sm">photo_camera</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={handleFileChange}
                            />
                        </div>
                        <span className="avatar-label-v2">Profile Photo</span>
                    </div>

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
                                placeholder="Teacher Name"
                                disabled={isBusy}
                            />
                        </div>

                        {/* Email & Phone */}
                        <div className="form-row-v2">
                            <div className="form-group-v2">
                                <label className="form-label-v2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input-v2"
                                    placeholder="teacher@school.com"
                                    disabled={isBusy}
                                />
                            </div>

                            <div className="form-group-v2">
                                <label className="form-label-v2">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="form-input-v2"
                                    placeholder="+84..."
                                    disabled={isBusy}
                                />
                            </div>
                        </div>

                        {/* School Name */}
                        <div className="form-group-v2">
                            <label className="form-label-v2">School / Department</label>
                            <input
                                type="text"
                                name="school_name"
                                value={formData.school_name}
                                onChange={handleChange}
                                className="form-input-v2"
                                placeholder="e.g. Primary School, English Dept..."
                                disabled={isBusy}
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
                                    disabled={isBusy}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary"></div>
                                <span className="ms-3 text-sm font-medium text-slate-700">Active Account</span>
                            </label>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="modal-footer-v2">
                    <button onClick={handleSubmit} disabled={isBusy} className="btn-save-v2">
                        {isBusy ? (isUploadingImage ? 'Uploading...' : 'Saving...') : 'Save Changes'}
                    </button>
                    <button onClick={onClose} disabled={isBusy} className="btn-cancel-v2">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
