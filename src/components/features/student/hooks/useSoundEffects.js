import { useCallback } from 'react';

// Simple base64 sounds to avoid external dependency issues or 404s
// Short "Pop" sound for hover
const HOVER_POP_SFX = 'data:audio/wav;base64,UklGRl9vT1ZAVXdtAA...'; // Placeholder, using real concise logic below

// Since we can't easily embed large base64, we'll try to use a very short, synthesized beep or a reliable public URL if possible. 
// For this demo, let's use a standard trick: creating an oscillator if possible, or just a dummy URL that we assume exists? 
// Actually, let's use the Web Audio API to generate sounds purely in code! Zero assets needed.

export const useSoundEffects = () => {

    // Helper to generate a short "pop" or "bloop"
    const playTone = useCallback((freq = 400, type = 'sine', duration = 0.1) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            // Slide frequency for "bloop" effect
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error("Audio error", e);
        }
    }, []);

    const playHover = useCallback(() => {
        // High pitched short "bloop"
        playTone(600, 'sine', 0.1);
    }, [playTone]);

    const playClick = useCallback(() => {
        // Lower pitched "thud" or "click"
        playTone(300, 'triangle', 0.15);
    }, [playTone]);

    const playSuccess = useCallback(() => {
        // Little fanfare arp ?
        setTimeout(() => playTone(500, 'sine', 0.1), 0);
        setTimeout(() => playTone(600, 'sine', 0.1), 100);
        setTimeout(() => playTone(800, 'sine', 0.2), 200);
    }, [playTone]);

    return { playHover, playClick, playSuccess };
};
