import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const BackgroundMusic = () => {
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLVideoElement>(null);

    // Initial play attempt
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2; // Low volume by default
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Auto-play was prevented. Interaction required to start music.", error);
                });
            }
        }
    }, []);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            // If it was paused due to autoplay policy, try playing again on user interaction
            if (audioRef.current.paused && !isMuted) {
                audioRef.current.play();
            }
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <video
                ref={audioRef}
                src="/sounds/background_music.mp4"
                loop
                autoPlay
                className="hidden" // Hidden video element, audio only
            />
            <button
                onClick={toggleMute}
                className="p-3 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700 text-cyan-400 hover:bg-gray-800 hover:scale-110 transition-all shadow-lg group relative"
                aria-label={isMuted ? "Unmute background music" : "Mute background music"}
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}

                {/* Tooltip */}
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-xs text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700">
                    {isMuted ? "Activar música" : "Silenciar"}
                </span>
            </button>
        </div>
    );
};
