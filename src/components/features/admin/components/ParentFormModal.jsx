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
    isSubmitting = false
}) {
    const isEdit = !!initialData;

    // --- State: General Info ---
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        is_active: true
    });

    // --- State: Child Linking ---
    const [linkedChildren, setLinkedChildren] = useState([]);
    const [originalChildrenIds, setOriginalChildrenIds] = useState(new Set());

    // --- State: Student Discovery ---
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [searchStudentTerm, setSearchStudentTerm] = useState('');
    const [availableStudents, setAvailableStudents] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);

    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset
            setLinkedChildren([]);
            setOriginalChildrenIds(new Set());
            setAvailableStudents([]);
            setSelectedClassId('');
            setSearchStudentTerm('');
            setError('');

            if (initialData) {
                setFormData({
                    full_name: initialData.full_name || '',
                    email: initialData.email || '',
                    phone_number: initialData.phone_number || '',
                    address: initialData.address || '',
                    is_active: initialData.is_active ?? true
                });
                loadInitialChildren(initialData.id);
            } else {
                setFormData({
                    full_name: '',
                    email: '',
                    phone_number: '',
                    address: '',
                    is_active: true
                });
            }

            loadClasses();
        }
    }, [isOpen, initialData]);

    // Fetch students when filters change
    useEffect(() => {
        if (!isOpen) return;

        const fetchStudents = async () => {
            if (!selectedClassId && !searchStudentTerm) {
                setAvailableStudents([]);
                return;
            }

            setIsLoadingStudents(true);
            try {
                const result = await adminStudentRepository.getFiltered({
                    classFilter: selectedClassId,
                    search: searchStudentTerm
                });

                if (result.success) {
                    setAvailableStudents(result.data || []);
                }
            } catch (err) {
                console.error("Failed to search students", err);
            } finally {
                setIsLoadingStudents(false);
            }
        };

        const timer = setTimeout(fetchStudents, 300);
        return () => clearTimeout(timer);

    }, [selectedClassId, searchStudentTerm, isOpen]);

    const loadClasses = async () => {
        const { data } = await classRepository.getActiveClasses();
        if (data) setClasses(data);
    };

    const loadInitialChildren = async (parentId) => {
        const result = await parentRepository.getChildren(parentId);
        if (result.success && result.data) {
            setLinkedChildren(result.data);
            setOriginalChildrenIds(new Set(result.data.map(c => c.id)));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? type === 'radio' ? (value === 'true') : checked : value
        }));
    };

    const isLinked = (studentId) => linkedChildren.some(c => c.id === studentId);

    const toggleStudentLink = (student) => {
        if (isLinked(student.id)) {
            setLinkedChildren(prev => prev.filter(c => c.id !== student.id));
        } else {
            setLinkedChildren(prev => [...prev, student]);
        }
    };

    const removeLinkedChild = (studentId) => {
        setLinkedChildren(prev => prev.filter(c => c.id !== studentId));
    };

    const handleSubmit = async () => {
        if (!formData.full_name?.trim()) return setError('Full name is required');
        if (!formData.email?.trim()) return setError('Email is required');

        const payload = { ...formData };
        if (!isEdit) payload.auth_user_id = crypto.randomUUID();

        // 1. Sync Links if Edit
        if (isEdit && initialData.id) {
            const currentIds = new Set(linkedChildren.map(c => c.id));
            const toAdd = linkedChildren.filter(c => !originalChildrenIds.has(c.id));
            const toRemoveIds = [...originalChildrenIds].filter(id => !currentIds.has(id));

            try {
                const promises = [];
                toAdd.forEach(student => {
                    promises.push(parentRepository.linkStudent(initialData.id, student.id));
                });
                toRemoveIds.forEach(studentId => {
                    promises.push(parentRepository.unlinkStudent(initialData.id, studentId));
                });
                await Promise.all(promises);
            } catch (err) {
                console.error("Error syncing children", err);
            }
        }

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(16, 31, 34, 0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500 ring-4 ring-cyan-500/10">
                            {isEdit ? (
                                <span className="text-xl font-bold">{initialData?.full_name?.charAt(0).toUpperCase()}</span>
                            ) : (
                                <span className="material-symbols-outlined text-2xl">person_add</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight">
                                {isEdit ? 'Edit Parent Profile' : 'Add Parent Profile'}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {isEdit ? `Manage ${initialData?.full_name}'s information and student links` : 'Create a new parent account'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-slate-400">close</span>
                    </button>
                </div>

                {/* Body Grid */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">

                    {/* Left Col: General Info */}
                    <div className="md:col-span-4 p-8 border-r border-slate-100 space-y-6 overflow-y-auto">
                        <h4 className="text-xs font-black uppercase tracking-widest text-cyan-500 mb-4">General Information</h4>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold mb-4">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-cyan-500 focus:border-cyan-500 px-4 py-2.5 outline-none border transition-all"
                                    placeholder="e.g. Sarah Jenkins"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-cyan-500 focus:border-cyan-500 px-4 py-2.5 outline-none border transition-all"
                                    placeholder="e.g. s.jenkins@email.com"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-cyan-500 focus:border-cyan-500 px-4 py-2.5 outline-none border transition-all"
                                    placeholder="+84..."
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-cyan-500 focus:border-cyan-500 px-4 py-2.5 outline-none border transition-all"
                                    placeholder="Address..."
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Account Status</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            value="true"
                                            checked={formData.is_active === true}
                                            onChange={handleChange}
                                            className="text-cyan-500 focus:ring-cyan-500 h-4 w-4 border-slate-300"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            value="false"
                                            checked={formData.is_active === false}
                                            onChange={handleChange}
                                            className="text-cyan-500 focus:ring-cyan-500 h-4 w-4 border-slate-300"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Inactive</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Students */}
                    <div className="md:col-span-8 p-8 bg-slate-50/50 flex flex-col h-full overflow-hidden">

                        {/* Selected Chips */}
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-cyan-500">Linked Students</h4>
                            <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-600 px-2 py-0.5 rounded">
                                {linkedChildren.length} Students Selected
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6 min-h-[32px]">
                            {linkedChildren.length > 0 ? (
                                linkedChildren.map(child => (
                                    <div key={child.id} className="flex items-center gap-1.5 bg-white border border-cyan-500/30 rounded-full pl-2.5 pr-1.5 py-1 text-xs font-medium text-slate-700 shadow-sm animate-in zoom-in duration-150">
                                        <span>{child.display_name}</span>
                                        <button
                                            onClick={() => removeLinkedChild(child.id)}
                                            className="size-4 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm leading-none">close</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic">No students linked yet.</p>
                            )}
                        </div>

                        {/* Search & Filter */}
                        {!isEdit ? (
                            <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">lock</span>
                                <p className="text-sm font-medium">Create the parent first to link students.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-3 mb-4">
                                    <div className="relative flex-1">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                                        <input
                                            type="text"
                                            placeholder="Search student by name or PIN..."
                                            value={searchStudentTerm}
                                            onChange={(e) => setSearchStudentTerm(e.target.value)}
                                            className="w-full bg-white border-slate-200 rounded-lg text-sm pl-10 pr-4 py-2.5 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm outline-none border"
                                        />
                                    </div>
                                    <div className="relative w-48">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">filter_list</span>
                                        <select
                                            value={selectedClassId}
                                            onChange={(e) => setSelectedClassId(e.target.value)}
                                            className="w-full bg-white border-slate-200 rounded-lg text-sm pl-10 pr-4 py-2.5 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm appearance-none cursor-pointer outline-none border"
                                        >
                                            <option value="">Filter by Class</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Student List */}
                                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {(availableStudents.length === 0 && (searchStudentTerm || selectedClassId)) && !isLoadingStudents ? (
                                        <div className="text-center py-8 text-slate-400">
                                            <p>No students found.</p>
                                        </div>
                                    ) : (availableStudents.length === 0 && !searchStudentTerm && !selectedClassId) ? (
                                        <div className="text-center py-8 text-slate-400 bg-white/50 rounded-xl border border-dashed border-slate-200">
                                            <p className="text-sm">Select a class or search to find students.</p>
                                        </div>
                                    ) : (
                                        availableStudents.map(student => {
                                            const active = isLinked(student.id);
                                            return (
                                                <div
                                                    key={student.id}
                                                    onClick={() => toggleStudentLink(student)}
                                                    className={`flex items-center justify-between p-3 bg-white border rounded-xl transition-all cursor-pointer group shadow-sm ${active
                                                            ? 'border-cyan-500 ring-1 ring-cyan-500/20'
                                                            : 'border-slate-200 hover:border-cyan-500/50 hover:shadow-md'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`size-10 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${active
                                                                ? 'bg-cyan-50 text-cyan-600'
                                                                : 'bg-slate-100 text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-500'
                                                            }`}>
                                                            {student.display_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{student.display_name}</p>
                                                            <p className="text-[11px] text-slate-500">
                                                                {student.class_name || 'No Class'} • PIN: {student.pin_code}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`size-5 rounded border flex items-center justify-center transition-all ${active
                                                                ? 'bg-cyan-500 border-cyan-500'
                                                                : 'bg-white border-slate-300'
                                                            }`}>
                                                            {active && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    {isLoadingStudents && (
                                        <div className="py-4 text-center text-slate-400">
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-between items-center">
                    <button type="button" className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold text-sm transition-colors opacity-0 pointer-events-none">
                        <span className="material-symbols-outlined text-lg">delete</span>
                        <span>Delete Account</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-2.5 rounded-lg bg-cyan-500 text-white font-bold text-sm hover:brightness-105 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
