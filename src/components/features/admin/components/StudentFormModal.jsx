import React, { useState, useEffect, useRef } from 'react';
import { classRepository } from '../../admin/data/classRepository';
import { useImageUpload } from '../../../shared/hooks/useImageUpload';
import '../admin.css'; // Ensure V2 styles are available

export default function StudentFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting = false,
    allStudents = []
}) {
    const isEdit = !!initialData;
    const { uploadImage, isUploading: isUploadingImage } = useImageUpload();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        display_name: '',
        class_id: '',
        pin_code: '',
        gender: 'male',
        avatar_url: ''
    });

    const [classes, setClasses] = useState([]);
    const [error, setError] = useState('');
    const [pendingFile, setPendingFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchClasses();
            if (initialData) {
                setFormData({
                    display_name: initialData.display_name || '',
                    class_id: initialData.class_id || '',
                    pin_code: initialData.pin_code || '',
                    gender: initialData.gender || 'male',
                    avatar_url: initialData.avatar_url || ''
                });
                setPreviewUrl(initialData.avatar_url || '');
            } else {
                setFormData({
                    display_name: '',
                    class_id: '',
                    pin_code: '',
                    gender: 'male',
                    avatar_url: ''
                });
                setPreviewUrl('');
            }
            setPendingFile(null);
            setError('');
        }
    }, [isOpen, initialData]);

    const fetchClasses = async () => {
        try {
            const { data } = await classRepository.getActiveClasses();
            if (data) setClasses(data);
        } catch (err) {
            console.error("Failed to load classes", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate locally (optional, also handled in repository)
            if (!file.type.startsWith('image/')) {
                setError("Only image files are allowed");
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB
                setError("Image must be smaller than 2MB");
                return;
            }

            setPendingFile(file);
            // Create local preview
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

        // Validation
        if (!formData.display_name.trim()) return setError('Please enter student name');
        if (!formData.class_id) return setError('Please select a class');
        if (!formData.pin_code.trim()) return setError('Please enter a PIN code');
        if (formData.pin_code.length < 4) return setError('PIN must be at least 4 digits');

        // Check for Duplicate PIN
        const isDuplicate = allStudents.some(s =>
            s.pin_code === formData.pin_code &&
            (!initialData || s.id !== initialData.id)
        );

        if (isDuplicate) {
            return setError('This PIN is already taken. Please choose another one.');
        }

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
            avatar_url: finalAvatarUrl,
            qr_code: formData.pin_code // Default logic
        };

        onSubmit(payload);
    };

    const generatePin = () => {
        let pin;
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 10) {
            pin = Math.floor(1000 + Math.random() * 9000).toString();
            // eslint-disable-next-line no-loop-func
            const exists = allStudents.some(s => s.pin_code === pin);
            if (!exists) isUnique = true;
            attempts++;
        }
        setFormData(prev => ({ ...prev, pin_code: pin }));
        setError('');
    };

    if (!isOpen) return null;

    const isBusy = isSubmitting || isUploadingImage;

    return (
        <div className="modal-overlay-v2">
            <div className="modal-content-v2">
                {/* Header */}
                <div className="modal-header-v2">
                    <h2 className="modal-title-v2">{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
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
                                    <span className="material-symbols-outlined avatar-placeholder-icon-v2">person</span>
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
                                name="display_name"
                                value={formData.display_name}
                                onChange={handleChange}
                                className="form-input-v2"
                                placeholder="Student Name"
                                disabled={isBusy}
                            />
                        </div>

                        {/* Class & Gender Row */}
                        <div className="form-row-v2">
                            <div className="form-group-v2">
                                <label className="form-label-v2">Class</label>
                                <div className="select-wrapper-v2">
                                    <select
                                        name="class_id"
                                        value={formData.class_id}
                                        onChange={handleChange}
                                        className="form-select-v2"
                                        disabled={isBusy}
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined select-arrow-v2">expand_more</span>
                                </div>
                            </div>

                            <div className="form-group-v2">
                                <label className="form-label-v2">Gender</label>
                                <div className="gender-toggle-v2">
                                    {['male', 'female'].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, gender: g }))}
                                            className={`gender-btn-v2 ${formData.gender === g ? 'active' : ''}`}
                                            disabled={isBusy}
                                        >
                                            {g.charAt(0).toUpperCase() + g.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Access PIN */}
                        <div className="form-group-v2">
                            <label className="form-label-v2">Access PIN</label>
                            <div className="pin-input-container-v2">
                                <div className="pin-wrapper-v2">
                                    <span className="material-symbols-outlined pin-icon-v2">lock</span>
                                    <input
                                        type="text"
                                        name="pin_code"
                                        value={formData.pin_code}
                                        onChange={handleChange}
                                        className="form-input-v2 has-icon"
                                        placeholder="0000"
                                        maxLength={6}
                                        disabled={isBusy}
                                    />
                                </div>
                                <button ref={null} type="button" onClick={generatePin} className="btn-generate-v2" disabled={isBusy}>
                                    <span className="material-symbols-outlined text-lg">refresh</span>
                                    <span className="hidden sm:inline">Generate</span>
                                </button>
                            </div>
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
