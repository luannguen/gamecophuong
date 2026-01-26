import React, { useState, useEffect } from 'react';
import { Icon } from '../../../ui/AnimatedIcon';

export default function CheckpointEditorModal({ isOpen, onClose, onSave, initialData, vocabulary = [] }) {
    const [formData, setFormData] = useState({
        timeSec: 0,
        type: 'vocab',
        vocabId: '',
        content: {
            question: '',
            options: ['', '', '', ''],
            answer: '',
            note: ''
        }
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                id: initialData.id, // Preserve ID
                timeSec: initialData.timeSec || 0,
                type: initialData.type || 'vocab',
                vocabId: initialData.vocabId || '',
                content: {
                    question: initialData.content?.question || '',
                    options: initialData.content?.options || ['', '', '', ''],
                    answer: initialData.content?.answer || '',
                    note: initialData.content?.note || ''
                }
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleContentChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            content: { ...prev.content, [field]: value }
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.content.options];
        newOptions[index] = value;
        handleContentChange('options', newOptions);
    };

    const handleSubmit = () => {
        // Validation
        if (formData.type === 'vocab' && !formData.vocabId) {
            alert("Please select a vocabulary word.");
            return;
        }
        if (formData.type === 'question' && !formData.content.question) {
            alert("Please enter a question.");
            return;
        }

        onSave(formData);
        onClose();
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#102323] w-full max-w-2xl rounded-2xl border border-[#224949] shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#224949]">
                    <div>
                        <h2 className="text-xl font-bold text-white font-display">
                            {initialData?.id ? 'Edit Checkpoint' : 'Add Checkpoint'}
                        </h2>
                        <p className="text-[#90cbcb] text-sm">
                            at {formatTime(formData.timeSec)} ({formData.timeSec}s)
                        </p>
                    </div>
                    <button onClick={onClose} className="text-[#90cbcb] hover:text-white transition-colors">
                        <Icon.X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                    {/* Time Adjustment */}
                    <div>
                        <label className="block text-[#90cbcb] text-xs font-bold uppercase mb-2">Timestamp (Seconds)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={formData.timeSec}
                                onChange={(e) => handleChange('timeSec', Number(e.target.value))}
                                className="bg-[#0a1515] border border-[#316868] text-white rounded px-4 py-2 w-32 focus:outline-none focus:border-[#0df2f2]"
                            />
                            <span className="text-[#90cbcb] text-sm italic">Adjust precision if needed</span>
                        </div>
                    </div>

                    {/* Type Selection */}
                    <div>
                        <label className="block text-[#90cbcb] text-xs font-bold uppercase mb-2">Checkpoint Type</label>
                        <div className="flex gap-4">
                            {['vocab', 'question', 'note'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => handleChange('type', t)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-bold capitalize transition-all ${formData.type === t
                                            ? 'bg-[#0df2f2]/20 border-[#0df2f2] text-[#0df2f2]'
                                            : 'border-[#316868] text-[#90cbcb] hover:border-[#90cbcb]'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Content */}
                    <div className="bg-[#0a1515] p-4 rounded-xl border border-[#224949]">

                        {formData.type === 'vocab' && (
                            <div className="space-y-4">
                                <label className="block text-white text-sm font-bold">Select Vocabulary</label>
                                <select
                                    value={formData.vocabId}
                                    onChange={(e) => handleChange('vocabId', e.target.value)}
                                    className="w-full bg-[#102323] border border-[#316868] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#0df2f2]"
                                >
                                    <option value="">-- Choose a word --</option>
                                    {vocabulary.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.word} ({v.meaning})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[#90cbcb] text-xs">
                                    Shows detailed flashcard for this word at this timestamp.
                                </p>
                            </div>
                        )}

                        {formData.type === 'question' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white text-sm font-bold mb-2">Question Text</label>
                                    <input
                                        value={formData.content.question}
                                        onChange={(e) => handleContentChange('question', e.target.value)}
                                        className="w-full bg-[#102323] border border-[#316868] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#0df2f2]"
                                        placeholder="e.g. What implies 'Create'?"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {formData.content.options.map((opt, idx) => (
                                        <div key={idx}>
                                            <label className="block text-[#90cbcb] text-xs mb-1">Option {String.fromCharCode(65 + idx)}</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                    className="w-full bg-[#102323] border border-[#316868] text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0df2f2]"
                                                    placeholder={`Option ${idx + 1}`}
                                                />
                                                <input
                                                    type="radio"
                                                    name="correctAnswer"
                                                    checked={formData.content.answer === opt && opt !== ''}
                                                    onChange={() => handleContentChange('answer', opt)}
                                                    className="accent-[#0df2f2] w-4 h-4 cursor-pointer"
                                                    disabled={!opt}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[#90cbcb] text-xs">Select the radio button next to the correct answer.</p>
                            </div>
                        )}

                        {formData.type === 'note' && (
                            <div className="space-y-4">
                                <label className="block text-white text-sm font-bold">Concept / Note</label>
                                <textarea
                                    value={formData.content.note}
                                    onChange={(e) => handleContentChange('note', e.target.value)}
                                    className="w-full bg-[#102323] border border-[#316868] text-white rounded-lg px-4 py-3 h-24 focus:outline-none focus:border-[#0df2f2]"
                                    placeholder="Explain a grammar point or cultural context..."
                                />
                            </div>
                        )}

                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#224949] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-[#90cbcb] font-bold hover:bg-[#224949] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 rounded-lg bg-[#0df2f2] text-[#102323] font-bold hover:scale-105 transition-transform shadow-[0_4px_15px_rgba(13,242,242,0.3)]"
                    >
                        Save Checkpoint
                    </button>
                </div>

            </div>
        </div>
    );
}
