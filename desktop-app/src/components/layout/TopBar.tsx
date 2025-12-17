import { Terminal, Flame, Zap, Bug } from 'lucide-react';
import { useState } from 'react';
import { useDevMode } from '../../context/DevModeContext';

export function TopBar() {
    const [streak] = useState(12);
    const [gems] = useState(1240);
    const { isDevMode, toggleDevMode } = useDevMode();

    return (
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur z-20 border-b border-gray-800 p-4 flex justify-between md:justify-end gap-6 items-center w-full h-16">
            <div className="flex items-center gap-2">
                {/* Dev Mode Toggle */}
                <button
                    onClick={toggleDevMode}
                    className={`p-2 rounded-lg transition-colors ${isDevMode ? 'bg-purple-500/20 text-purple-400' : 'text-gray-600 hover:text-gray-400'}`}
                    title="Toggle Developer Mode"
                >
                    <Bug size={20} />
                </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
                <Terminal size={24} className="text-purple-500" />
            </div>

            <div className="flex gap-6">
                <div className="flex items-center gap-2 text-orange-400 font-bold">
                    <Flame size={20} fill="currentColor" />
                    <span>{streak}</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Zap size={20} fill="currentColor" />
                    <span>{gems}</span>
                </div>
            </div>
        </div>
    );
}
