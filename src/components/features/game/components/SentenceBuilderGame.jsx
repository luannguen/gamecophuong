import { useState, useEffect } from 'react';

// Mock Sentences - In real app this comes from Topic Vocabulary/Phrases
const SENTENCES = [
    { id: 1, text: "I like apples", words: ["I", "like", "apples"], translation: "Tôi thích táo" },
    { id: 2, text: "It is a cat", words: ["It", "is", "a", "cat"], translation: "Nó là một con mèo" },
    { id: 3, text: "She runs fast", words: ["She", "runs", "fast"], translation: "Cô ấy chạy nhanh" },
    { id: 4, text: "The dog is big", words: ["The", "dog", "is", "big"], translation: "Con chó thì to" },
];

export default function SentenceBuilderGame({ onScoreUpdate, onEndGame }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [targetSentence, setTargetSentence] = useState(null);
    const [availableWords, setAvailableWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        setupRound(0);
    }, []);

    const setupRound = (index) => {
        if (index >= SENTENCES.length) {
            onEndGame();
            return;
        }
        const sentence = SENTENCES[index];
        setTargetSentence(sentence);
        // Shuffle words
        const shuffled = [...sentence.words].sort(() => Math.random() - 0.5);
        setAvailableWords(shuffled.map((w, i) => ({ id: i, text: w, used: false })));
        setSelectedWords([]);
        setCurrentQuestion(index);
    };

    const handleWordClick = (wordObj) => {
        if (wordObj.used || feedback) return;

        // Add to selected
        const newSelected = [...selectedWords, wordObj];
        setSelectedWords(newSelected);

        // Mark as used
        setAvailableWords(prev => prev.map(w => w.id === wordObj.id ? { ...w, used: true } : w));

        // Check availability
        if (newSelected.length === targetSentence.words.length) {
            checkAnswer(newSelected);
        }
    };

    const handleUndo = (wordObj) => {
        if (feedback) return;
        // Remove from selected
        setSelectedWords(prev => prev.filter(w => w.id !== wordObj.id));
        // Mark as unused
        setAvailableWords(prev => prev.map(w => w.id === wordObj.id ? { ...w, used: false } : w));
    };

    const checkAnswer = (finalSelection) => {
        const formedSentence = finalSelection.map(w => w.text).join(' ');
        if (formedSentence === targetSentence.text) {
            setFeedback({ type: 'correct', message: 'Correct! 🎉' });
            onScoreUpdate(100);
            setTimeout(() => {
                setFeedback(null);
                setupRound(currentQuestion + 1);
            }, 1000);
        } else {
            setFeedback({ type: 'wrong', message: 'Try again!' });
            setTimeout(() => {
                setFeedback(null);
                // Reset simple way: clear selection
                setSelectedWords([]);
                setAvailableWords(prev => prev.map(w => ({ ...w, used: false })));
            }, 1000);
        }
    };

    if (!targetSentence) return <div>Loading...</div>;

    return (
        <div className="sentence-game-screen animate-in fade-in duration-300 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-700 mb-8">Build the Sentence</h2>

            {/* Target Translation/Hint */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 text-center">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider block mb-2">Translate this:</span>
                <p className="text-xl font-medium text-slate-800">{targetSentence.translation}</p>
            </div>

            {/* Selection Area (Answer Slot) */}
            <div className="min-h-[80px] bg-slate-100 rounded-2xl p-4 flex flex-wrap gap-2 items-center justify-center mb-8 border-2 border-dashed border-slate-300">
                {selectedWords.length === 0 && <span className="text-slate-400">Tap words to build sentence...</span>}
                {selectedWords.map((word) => (
                    <button
                        key={word.id}
                        onClick={() => handleUndo(word)}
                        className="bg-white px-4 py-2 rounded-xl shadow-sm border-b-4 border-slate-200 font-bold text-slate-700 hover:-translate-y-1 hover:border-slate-300 transition-all animate-in zoom-in-50 duration-200"
                    >
                        {word.text}
                    </button>
                ))}
            </div>

            {/* Available Words */}
            <div className="flex flex-wrap gap-3 justify-center">
                {availableWords.map((word) => (
                    <div key={word.id} className={word.used ? 'opacity-0 pointer-events-none w-[80px]' : ''}>
                        <button
                            onClick={() => handleWordClick(word)}
                            className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl font-bold shadow-sm border-b-4 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            {word.text}
                        </button>
                    </div>
                ))}
            </div>

            {feedback && (
                <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl font-bold shadow-2xl text-white animate-in slide-in-from-bottom-5 ${feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
}
