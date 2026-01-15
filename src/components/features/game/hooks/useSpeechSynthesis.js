import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook để phát âm từ vựng tiếng Anh sử dụng Web Speech API
 * @param {Object} options - Tùy chọn
 * @param {string} options.lang - Ngôn ngữ (default: 'en-US')
 * @param {number} options.rate - Tốc độ nói (0.1 - 10, default: 0.9)
 * @param {number} options.pitch - Cao độ (0 - 2, default: 1.1)
 */
export function useSpeechSynthesis(options = {}) {
    const {
        lang = 'en-US',
        rate = 0.9,
        pitch = 1.1
    } = options;

    const [voices, setVoices] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [currentWord, setCurrentWord] = useState('');
    const synthRef = useRef(null);

    // Initialize speech synthesis
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            synthRef.current = window.speechSynthesis;
            setIsSupported(true);

            // Load voices
            const loadVoices = () => {
                const availableVoices = synthRef.current.getVoices();
                // Prefer English voices (US or UK)
                const englishVoices = availableVoices.filter(v =>
                    v.lang.startsWith('en')
                );
                setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
            };

            loadVoices();
            synthRef.current.onvoiceschanged = loadVoices;

            return () => {
                if (synthRef.current) {
                    synthRef.current.cancel();
                }
            };
        }
    }, []);

    /**
     * Phát âm một từ hoặc câu
     * @param {string} text - Văn bản cần phát âm
     * @param {Object} overrides - Ghi đè tùy chọn
     */
    const speak = useCallback((text, overrides = {}) => {
        if (!synthRef.current || !text) return;

        // Cancel any ongoing speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set language
        utterance.lang = overrides.lang || lang;

        // Set rate (slower for learning)
        utterance.rate = overrides.rate ?? rate;

        // Set pitch (slightly higher for child-friendly)
        utterance.pitch = overrides.pitch ?? pitch;

        // Select best voice
        if (voices.length > 0) {
            // Prefer female voices for friendlier sound
            const femaleVoice = voices.find(v =>
                v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('samantha') ||
                v.name.toLowerCase().includes('karen') ||
                v.name.toLowerCase().includes('victoria')
            );
            utterance.voice = femaleVoice || voices[0];
        }

        // Event handlers
        utterance.onstart = () => {
            setIsSpeaking(true);
            setCurrentWord(text);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setCurrentWord('');
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            setIsSpeaking(false);
            setCurrentWord('');
        };

        synthRef.current.speak(utterance);
    }, [lang, rate, pitch, voices]);

    /**
     * Phát âm từ với tốc độ chậm hơn (cho học sinh)
     */
    const speakSlow = useCallback((text) => {
        speak(text, { rate: 0.6 });
    }, [speak]);

    /**
     * Phát âm từ và dịch nghĩa
     * @param {string} english - Từ tiếng Anh
     * @param {string} vietnamese - Nghĩa tiếng Việt (optional)
     */
    const speakWithTranslation = useCallback((english, vietnamese) => {
        if (!synthRef.current) return;

        // First speak English
        speak(english);

        // Then speak Vietnamese if provided (after a delay)
        if (vietnamese) {
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(vietnamese);
                utterance.lang = 'vi-VN';
                utterance.rate = 0.9;

                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => setIsSpeaking(false);

                synthRef.current?.speak(utterance);
            }, 1200);
        }
    }, [speak]);

    /**
     * Dừng phát âm
     */
    const stop = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
            setCurrentWord('');
        }
    }, []);

    /**
     * Tạm dừng phát âm
     */
    const pause = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.pause();
        }
    }, []);

    /**
     * Tiếp tục phát âm
     */
    const resume = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.resume();
        }
    }, []);

    return {
        speak,
        speakSlow,
        speakWithTranslation,
        stop,
        pause,
        resume,
        isSpeaking,
        isSupported,
        currentWord,
        voices
    };
}

export default useSpeechSynthesis;
