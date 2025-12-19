import { useState, type ElementType } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Milk, Utensils, RotateCcw, Soup, Box, Sparkles, Drumstick } from 'lucide-react';

/* 
  Minijuego: Reparación de Algoritmo
  Objetivo: Enseñar depuración básica (identificar y eliminar errores)
  Mecánica: Swipe para eliminar el error ("Tenedor" para cereal)
*/

type BlockType = 'bowl' | 'milk' | 'cereal' | 'error' | 'fix';

interface Block {
    id: string;
    type: BlockType;
    label: string;
    icon: ElementType;
}

const INITIAL_BLOCKS: Block[] = [
    { id: '1', type: 'bowl', label: 'Sacar tazón', icon: Soup },
    { id: '2', type: 'milk', label: 'Echar leche', icon: Milk },
    { id: '3', type: 'error', label: 'Echar carne', icon: Drumstick },
    { id: '4', type: 'cereal', label: 'Echar cereal', icon: Box },
    { id: '5', type: 'error', label: 'Comer con tenedor', icon: Utensils },
];

export default function AlgorithmRepair({ onComplete }: { onComplete?: () => void }) {
    const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isShocked, setIsShocked] = useState(false);

    const handleBlockClick = (block: Block) => {
        if (gameStatus === 'won') return;

        if (block.type === 'milk') {
            // Distractor logic
            setFeedback("Raro, pero compila. No es un error fatal.");
            setTimeout(() => setFeedback(null), 2500);
        } else if (block.type === 'error') {
            setIsShocked(true);
            setTimeout(() => setIsShocked(false), 500);
        }
    };

    const handleDragEnd = (_: any, info: PanInfo, blockId: string) => {
        if (gameStatus === 'won') return;

        // Threshold for swipe (100px)
        if (Math.abs(info.offset.x) > 100) {
            removeErrorBlock(blockId);
        }
    };

    const removeErrorBlock = (id: string) => {
        // 1. Remove the error block
        setBlocks(prev => {
            const updated = prev.filter(b => b.id !== id);

            // Check if there are no more errors left
            if (!updated.some(b => b.type === 'error')) {
                // 2. Add the fix block
                setTimeout(() => {
                    const fixBlock: Block = { id: '6', type: 'fix', label: 'Comer con cuchara', icon: Utensils };
                    setBlocks(prev => [...prev.filter(b => b.type !== 'fix'), fixBlock]);
                    setGameStatus('won');
                    onComplete?.();
                }, 300); // Small delay for effect
            }

            return updated;
        });
    };

    const resetGame = () => {
        setBlocks(INITIAL_BLOCKS);
        setGameStatus('playing');
        setFeedback(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto p-4 bg-gray-900 rounded-xl border border-gray-800 relative overflow-hidden">

            {/* Header / Instructions */}
            <h2 className="text-xl font-bold text-white mb-4">Depura el Algoritmo</h2>
            <p className="text-gray-400 text-sm mb-6 text-center">
                {gameStatus === 'playing'
                    ? "El programa se ha detenido. Desliza el bloque defectuoso fuera de la pantalla."
                    : "¡Bug eliminado! El código corre fluido."}
            </p>

            {/* Game Area */}
            <div className="relative w-full flex flex-col items-center gap-6 py-4">

                {/* Flow Line (Background) - Represents the "cable" */}
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-800 -translate-x-1/2 z-0" />

                {/* Victory Flow Line (Green) */}
                {gameStatus === 'won' && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="absolute top-0 left-1/2 w-1 bg-green-500 -translate-x-1/2 z-0 shadow-[0_0_15px_rgba(34,197,94,0.8)]"
                    />
                )}

                {/* Blocks */}
                <AnimatePresence mode='popLayout'>
                    {blocks.map((block, index) => (
                        <motion.div
                            key={block.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, x: 200, rotate: 20, transition: { duration: 0.3 } }}
                            drag={block.type === 'error' ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.4}
                            onDragEnd={(e, info) => block.type === 'error' && handleDragEnd(e, info, block.id)}
                            onClick={() => handleBlockClick(block)}
                            whileTap={block.type === 'milk' ? { x: [0, -4, 4, -4, 0] } : { scale: 0.98 }}
                            className={`
                                relative z-10 w-full p-4 rounded-xl flex items-center gap-4 cursor-pointer select-none transition-colors
                                ${block.type === 'error'
                                    ? `bg-red-900/40 border-2 ${isShocked ? 'border-yellow-400 bg-red-600/60 shadow-[0_0_20px_rgba(250,204,21,0.6)]' : 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`
                                    : gameStatus === 'won' ? 'bg-green-900/20 border border-green-500/30' : 'bg-gray-800 border border-gray-700 shadow-lg'}
                                ${block.type === 'fix' ? 'border-green-500 bg-green-900/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}
                            `}
                        >
                            {/* Connector Dot */}
                            <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full z-20
                                ${index === 0 ? 'hidden' : 'block'}
                                ${gameStatus === 'won' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]' : 'bg-gray-600'}
                            `} />

                            {/* Icon Container */}
                            <div className={`p-3 rounded-xl 
                                ${block.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/50 text-gray-300'}
                                ${block.type === 'fix' ? 'bg-green-500/20 text-green-400' : ''}
                                ${isShocked && block.type === 'error' ? 'animate-pulse scale-110' : ''}
                            `}>
                                <block.icon size={28} />
                            </div>

                            <div className="flex flex-col">
                                <span className={`text-xs font-bold uppercase tracking-widest opacity-50 mb-0.5
                                    ${block.type === 'error' ? 'text-red-300' : 'text-gray-400'}
                                `}>
                                    Paso {index + 1}
                                </span>
                                <span className={`font-bold text-lg ${block.type === 'error' ? 'text-white' : 'text-gray-200'}`}>
                                    {block.label}
                                </span>
                            </div>

                            {/* Shock Sparkles */}
                            {block.type === 'error' && isShocked && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute -right-4 -top-4 text-yellow-400"
                                >
                                    <Sparkles size={32} className="animate-pulse" />
                                </motion.div>
                            )}

                            {/* Status Indicator */}
                            {gameStatus === 'won' && (
                                <div className="ml-auto text-green-400">
                                    <Sparkles size={20} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

            </div>

            {/* Feedback Toast */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-12 bg-gray-800 text-white px-6 py-2 rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] text-sm font-medium z-50 flex items-center gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        {feedback}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Victory Action */}
            {gameStatus === 'won' && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={resetGame}
                    className="mt-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold border border-gray-600 transition-all active:scale-95 group shadow-xl"
                >
                    <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    Reiniciar Desafío
                </motion.button>
            )}

        </div>
    );
}
