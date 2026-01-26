import React, { useState } from 'react';
import { useVideoUpload } from '../../../shared/hooks/useVideoUpload';
import { Icon } from '../../../ui/AnimatedIcon';
import EnhancedModal from '../../../shared/ui/EnhancedModal';
import MediaLibraryModal from './MediaLibraryModal';

export default function LessonMetadataSidebar({ lesson, vocabulary, categories, onUpdate }) {
    const [isVocabSearchOpen, setIsVocabSearchOpen] = useState(false);
    const [vocabSearchQuery, setVocabSearchQuery] = useState('');
    const [isAllVocabModalOpen, setIsAllVocabModalOpen] = useState(false);
    const { uploadVideo, isUploading, uploadError } = useVideoUpload();
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    // Fallback if lesson.target_vocabulary is undefined
    const lessonVocabs = lesson.target_vocabulary || [];
    const VISIBLE_LIMIT = 5;
    const visibleVocabs = lessonVocabs.slice(0, VISIBLE_LIMIT);
    const hiddenCount = lessonVocabs.length - VISIBLE_LIMIT;

    const handleChangeTitle = (e) => {
        onUpdate({ ...lesson, title: e.target.value });
    };

    const handleChangeLevel = (e) => {
        onUpdate({ ...lesson, difficultyLevel: e.target.value });
    };

    const handleRemoveVocab = (vocabId) => {
        const newVocabs = lessonVocabs.filter(v => v.id !== vocabId);
        onUpdate({ ...lesson, target_vocabulary: newVocabs });
    };

    const handleAddVocabClick = () => {
        setIsVocabSearchOpen(!isVocabSearchOpen);
        setVocabSearchQuery(''); // Reset search on open
    };

    // Group vocabulary by category
    const groupedVocabulary = vocabulary
        .filter(v => !lessonVocabs.find(lv => lv.id === v.id)) // Filter out added ones
        .filter(v => v.word.toLowerCase().includes(vocabSearchQuery.toLowerCase())) // Search filter
        .reduce((acc, vocab) => {
            const catId = vocab.category_id;
            const catName = categories?.find(c => c.id === catId)?.name || 'Uncategorized';
            if (!acc[catName]) acc[catName] = [];
            acc[catName].push(vocab);
            return acc;
        }, {});

    const renderVocabChip = (v, compact = false) => (
        <div key={v.id} className={`group flex items-center justify-between gap-2.5 rounded-full bg-[#1e3a3a] pl-3 pr-1 border border-[#316868] hover:border-[#0df2f2]/60 transition-all select-none shadow-sm ${compact ? 'h-7' : 'h-8'}`}>
            <span className={`text-white font-bold font-display pt-0.5 ${compact ? 'text-xs' : 'text-sm'}`}>{v.word}</span>
            <button
                onClick={(e) => { e.stopPropagation(); handleRemoveVocab(v.id); }}
                className={`flex items-center justify-center rounded-full hover:bg-[#0df2f2] group-hover:bg-[#224949] hover:text-[#102323] text-[#90cbcb] transition-all ${compact ? 'w-5 h-5' : 'w-6 h-6'}`}
            >
                <Icon.X className={compact ? "text-[14px]" : "text-[16px]"} />
            </button>
        </div>
    );

    return (
        <aside className="w-80 border-r border-[#224949] flex flex-col bg-[#102323] overflow-y-auto custom-scrollbar h-full shrink-0">
            <div className="p-6 space-y-8">
                <div className="space-y-1">
                    <h1 className="text-white text-lg font-bold font-display">Lesson: {lesson.title}</h1>
                    <p className="text-[#90cbcb] text-sm font-normal font-display">Manage settings and assets</p>
                </div>

                {/* Lesson Title */}
                <div className="space-y-4">
                    <label className="flex flex-col gap-2">
                        <p className="text-white text-sm font-semibold font-display">Lesson Title</p>
                        <input
                            className="w-full rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#0df2f2] border border-[#316868] bg-[#183434] h-10 placeholder-[#90cbcb] px-3 text-xs font-display transition-all"
                            value={lesson.title || ''}
                            onChange={handleChangeTitle}
                            placeholder="Enter lesson title..."
                        />
                    </label>

                    {/* Video URL & Upload */}
                    <div className="space-y-2">
                        <p className="text-white text-sm font-semibold font-display">Video Source</p>

                        {/* URL Input */}
                        <div className="relative">
                            <input
                                className="w-full rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#0df2f2] border border-[#316868] bg-[#183434] h-10 placeholder-[#90cbcb] pl-9 pr-3 text-xs font-display transition-all truncate"
                                value={lesson.videoUrl || ''}
                                onChange={(e) => onUpdate({ ...lesson, videoUrl: e.target.value })}
                                placeholder="https://youtube.com/..."
                            />
                            <Icon.Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90cbcb]" />
                        </div>

                        {/* Upload Button */}
                        <div className="flex justify-end">
                            <label className="cursor-pointer flex items-center gap-2 text-xs text-[#0df2f2] font-bold hover:text-white transition-colors bg-[#183434] hover:bg-[#224949] px-3 py-1.5 rounded-md border border-[#316868] hover:border-[#0df2f2] shadow-sm">
                                <Icon.Upload className="w-3.5 h-3.5" />
                                <span>{isUploading ? 'Uploading...' : 'Upload Video File'}</span>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    disabled={isUploading}
                                    onChange={async (e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const result = await uploadVideo(file);
                                            if (result) {
                                                onUpdate({ ...lesson, videoUrl: result });
                                            } else {
                                                // Fallback: If upload fails (RLS/Permissions), use ObjectURL
                                                // This satisfies "try to see if it runs" requirement
                                                console.warn("Upload failed (server restriction). Using local preview.");
                                                const objectUrl = URL.createObjectURL(file);
                                                onUpdate({ ...lesson, videoUrl: objectUrl });
                                            }
                                        }
                                    }}
                                />
                            </label>

                            {/* Media Library Button */}
                            <button
                                onClick={() => setIsLibraryOpen(true)}
                                className="bg-[#183434] hover:bg-[#224949] text-[#0df2f2] p-3 rounded-lg border border-[#316868] transition-colors flex items-center justify-center"
                                title="Media Library"
                            >
                                <Icon.Video className="w-5 h-5" />
                            </button>
                        </div>
                        {uploadError && !lesson.videoUrl?.startsWith('blob:') && (
                            <p className="text-red-400 text-xs italic text-right">{uploadError}</p>
                        )}
                        {lesson.videoUrl?.startsWith('blob:') && (
                            <p className="text-[#0df2f2] text-xs italic text-right">Local Preview Mode (Not saved to server)</p>
                        )}
                    </div>

                    {/* Media Library Modal */}
                    <MediaLibraryModal
                        isOpen={isLibraryOpen}
                        onClose={() => setIsLibraryOpen(false)}
                        onSelect={(url) => {
                            onUpdate({ ...lesson, videoUrl: url });
                            setIsLibraryOpen(false);
                        }}
                    />

                    {/* Difficulty Level */}
                    <label className="flex flex-col gap-2">
                        <p className="text-white text-sm font-semibold font-display">Difficulty Level</p>
                        <select
                            className="w-full rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#0df2f2] border border-[#316868] bg-[#183434] h-10 px-3 text-xs font-display appearance-none cursor-pointer transition-all"
                            value={lesson.difficultyLevel || 'Intermediate'}
                            onChange={handleChangeLevel}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Professional">Professional</option>
                        </select>
                    </label>
                </div>

                {/* Target Vocabulary */}
                <div className="space-y-3 relative">
                    <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-semibold font-display">Target Vocabulary <span className="text-[#90cbcb] font-normal text-xs ml-1">({lessonVocabs.length})</span></p>
                        <button
                            onClick={handleAddVocabClick}
                            className="text-[#0df2f2] text-xs font-bold hover:underline transition-all font-display"
                        >
                            {isVocabSearchOpen ? 'Close' : '+ Add'}
                        </button>
                    </div>

                    {/* Vocabulary Search/Picker */}
                    {isVocabSearchOpen && (
                        <div className="absolute top-8 left-0 w-full z-30 bg-[#183434] border border-[#316868] rounded-lg shadow-xl max-h-80 overflow-y-auto custom-scrollbar p-2 animate-fadeIn">
                            <input
                                className="w-full bg-[#102323] border border-[#224949] rounded px-2 py-1.5 text-xs text-white mb-2 focus:outline-none focus:border-[#0df2f2]"
                                placeholder="Search..."
                                autoFocus
                                value={vocabSearchQuery}
                                onChange={(e) => setVocabSearchQuery(e.target.value)}
                            />
                            <div className="space-y-3">
                                {Object.keys(groupedVocabulary).length === 0 && (
                                    <div className="text-[#90cbcb] text-xs p-2 text-center">No vocabulary found.</div>
                                )}
                                {Object.entries(groupedVocabulary).map(([categoryName, vocabs]) => (
                                    <div key={categoryName}>
                                        <h4 className="text-[#0df2f2] text-[10px] font-bold uppercase tracking-wider mb-1 px-1 border-b border-[#224949] pb-0.5">{categoryName}</h4>
                                        <div className="space-y-0.5">
                                            {vocabs.map(v => (
                                                <div
                                                    key={v.id}
                                                    onClick={() => {
                                                        onUpdate({ ...lesson, target_vocabulary: [...lessonVocabs, v] });
                                                    }}
                                                    className="flex items-center gap-2 p-1.5 hover:bg-[#224949] rounded cursor-pointer group"
                                                >
                                                    <div className="text-white text-xs font-medium group-hover:text-[#0df2f2] transition-colors">{v.word}</div>
                                                    <div className="text-[#90cbcb] text-[10px] truncate opacity-70 group-hover:opacity-100">{v.meaning}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                        {lessonVocabs.length === 0 && (
                            <p className="text-[#90cbcb] text-xs italic">No vocabulary added.</p>
                        )}
                        {visibleVocabs.map(v => renderVocabChip(v, true))}

                        {hiddenCount > 0 && (
                            <button
                                onClick={() => setIsAllVocabModalOpen(true)}
                                className="h-7 px-3 rounded-full bg-[#183434] border border-[#316868] text-xs text-[#0df2f2] font-bold hover:bg-[#224949] transition-colors"
                            >
                                +{hiddenCount} more
                            </button>
                        )}
                    </div>
                </div>

                {/* Lesson Description */}
                <div className="space-y-4 pt-4 border-t border-[#224949]">
                    <div className="flex items-center gap-2 text-white">
                        <Icon.Info className="w-5 h-5 text-[#0df2f2]" />
                        <p className="text-sm font-semibold font-display">General Info</p>
                    </div>
                    <label className="block">
                        <textarea
                            className="w-full rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#0df2f2] border border-[#316868] bg-[#183434] h-32 placeholder-[#90cbcb] px-3 py-2 text-xs font-display transition-all resize-none custom-scrollbar"
                            value={lesson.description || ''}
                            onChange={(e) => onUpdate({ ...lesson, description: e.target.value })}
                            placeholder="Enter lesson description..."
                        />
                    </label>
                </div>
            </div>

            {/* All Vocabulary Modal */}
            <EnhancedModal
                isOpen={isAllVocabModalOpen}
                onClose={() => setIsAllVocabModalOpen(false)}
                title={`All Target Vocabulary (${lessonVocabs.length})`}
                maxWidth="md"
                showControls={false}
                footer={
                    <div className="flex justify-end pt-4">
                        <button onClick={() => setIsAllVocabModalOpen(false)} className="px-4 py-2 bg-[#183434] text-white rounded-lg hover:bg-[#224949] transition-colors font-bold text-sm">Close</button>
                    </div>
                }
            >
                <div className="flex flex-wrap gap-2 p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {lessonVocabs.map(v => renderVocabChip(v, false))}
                </div>
            </EnhancedModal>
        </aside>
    );
}
