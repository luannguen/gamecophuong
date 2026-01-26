import React from 'react';
import { Icon } from '../../../ui/AnimatedIcon';

export default function CheckpointTable({ checkpoints, vocabulary, onEdit, onDelete, onJumpTo }) {

    const formatTime = (seconds) => {
        if (!seconds && seconds !== 0) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'vocab': return 'text-[#0df2f2]'; // Primary
            case 'question': return 'text-purple-400';
            case 'note': return 'text-amber-400';
            default: return 'text-slate-400';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'vocab': return <Icon.Translate className="w-[18px]" />;
            case 'question': return <Icon.HelpCircle className="w-[18px]" />; // Using HelpCircle as fallback for Quiz
            case 'note': return <Icon.FileText className="w-[18px]" />;
            default: return <Icon.Circle className="w-[18px]" />;
        }
    };

    const getPreviewText = (cp) => {
        if (cp.type === 'vocab') {
            const vocab = vocabulary?.find(v => v.id === cp.vocabId);
            return (
                <span className="text-white">
                    Target Word: <span className="text-[#0df2f2] font-medium">
                        {vocab?.word || cp.vocabWord || (cp.vocabId ? `ID: ${cp.vocabId.substring(0, 8)}...` : 'No word selected')}
                    </span>
                    {vocab?.meaning && <span className="text-slate-400 text-xs ml-2">- {vocab.meaning}</span>}
                </span>
            );
        }
        if (cp.type === 'question') {
            return (
                <span className="text-white">
                    Question: <span className="italic">"{cp.content?.question || 'No question text'}"</span>
                </span>
            );
        }
        return <span className="text-slate-400">No preview available</span>;
    };

    return (
        <div className="h-64 overflow-y-auto custom-scrollbar px-6 py-2 bg-[#102323] border-t border-[#224949]">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#102323] z-10 border-b border-[#224949]">
                    <tr>
                        <th className="py-3 font-semibold text-[#90cbcb] w-24">Time</th>
                        <th className="py-3 font-semibold text-[#90cbcb] w-32">Type</th>
                        <th className="py-3 font-semibold text-[#90cbcb]">Content Preview</th>
                        <th className="py-3 font-semibold text-[#90cbcb] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#224949]">
                    {checkpoints.length === 0 && (
                        <tr>
                            <td colSpan="4" className="py-8 text-center text-[#90cbcb] italic">
                                No checkpoints added yet. Play the video and add some!
                            </td>
                        </tr>
                    )}
                    {checkpoints.map((cp) => (
                        <tr key={cp.id} className="hover:bg-[#0df2f2]/5 group transition-colors">
                            <td className="py-4 font-mono text-[#0df2f2]">
                                <button onClick={() => onJumpTo(cp.timeSec)} className="hover:underline">
                                    {formatTime(cp.timeSec)}
                                </button>
                            </td>
                            <td className="py-4">
                                <div className={`flex items-center gap-2 ${getTypeColor(cp.type)}`}>
                                    {getTypeIcon(cp.type)}
                                    <span className="text-xs font-bold uppercase">{cp.type}</span>
                                </div>
                            </td>
                            <td className="py-4">{getPreviewText(cp)}</td>
                            <td className="py-4 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(cp)}
                                        className="text-[#90cbcb] hover:text-white transition-colors"
                                        title="Edit"
                                    >
                                        <Icon.Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(cp.id)}
                                        className="text-[#90cbcb] hover:text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Icon.Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
