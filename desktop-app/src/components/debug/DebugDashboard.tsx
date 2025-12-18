import { useState, useMemo } from 'react';
import { X, RotateCcw, Award, Zap, Trophy, Map, ChevronRight, Layers } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { userProfile } from '../../lib/gamification';
import { useNavigate } from 'react-router-dom';
import { LESSONS_DATA } from '../../lib/lessons';

export function DebugDashboard({ onClose }: { onClose: () => void }) {
    const profile = useUserProfile();
    const navigate = useNavigate();
    const [xpInput, setXpInput] = useState('100');
    const [gemsInput, setGemsInput] = useState('500');

    const handleAddXp = () => {
        userProfile.addXp(parseInt(xpInput) || 0);
    };

    const handleAddGems = () => {
        userProfile.addGems(parseInt(gemsInput) || 0);
    };

    const handleToggleAchievement = (id: string) => {
        if (userProfile.achievements.includes(id)) {
            userProfile.achievements = userProfile.achievements.filter((a) => a !== id);
        } else {
            userProfile.achievements.push(id);
        }
        userProfile.save();
    };

    const handleHardReset = () => {
        if (confirm('¿Estás seguro? Esto borrará TODO el progreso localmente.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const allAchievements = [
        { id: 'first_step', name: 'Primer Paso' },
        { id: 'scholar', name: 'Estudioso' },
        { id: 'master', name: 'Maestro' },
        { id: 'on_fire', name: 'En Llamas' },
        { id: 'unstoppable', name: 'Imparable' },
        { id: 'first_steps', name: 'Primeros Pasos (Completo)' },
        { id: 'algo_1', name: 'Algoritmo I' },
    ];

    // Agrupar lecciones por Categoría y luego por Módulo
    const categorizedModules = useMemo(() => {
        const grouped: Record<string, Record<string, typeof LESSONS_DATA[string][]>> = {};

        Object.values(LESSONS_DATA).forEach((lesson) => {
            const parts = lesson.id.split('-');
            const category = parts[0]; // Ej: 'Python', 'Mecánica'
            const groupKey = parts.length > 2 ? parts.slice(0, -1).join(' ') : parts.join(' ');

            if (!grouped[category]) grouped[category] = {};
            if (!grouped[category][groupKey]) grouped[category][groupKey] = [];
            grouped[category][groupKey].push(lesson);
        });

        return Object.entries(grouped).map(([category, modules]) => ({
            category,
            levels: Object.entries(modules).map(([name, lessons]) => ({
                name,
                startId: lessons[0].id,
                count: lessons.length,
            })),
        }));
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-purple-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                    <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-3">
                        <BugDashboardIcon /> Debug Dashboard
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 grid gap-8">
                    {/* Stats Manipulation */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                            Manipulación de Estado
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-2 mb-2 text-purple-300">
                                    <Trophy size={18} /> <span className="font-bold">Experiencia (XP)</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={xpInput}
                                        onChange={(e) => setXpInput(e.target.value)}
                                        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white w-24 focus:outline-none focus:border-purple-500"
                                    />
                                    <button
                                        onClick={handleAddXp}
                                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Añadir XP
                                    </button>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    Nivel Actual: <span className="text-white">{profile.level}</span>
                                </div>
                            </div>

                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-2 mb-2 text-cyan-300">
                                    <Zap size={18} /> <span className="font-bold">Gemas</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={gemsInput}
                                        onChange={(e) => setGemsInput(e.target.value)}
                                        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white w-24 focus:outline-none focus:border-cyan-500"
                                    />
                                    <button
                                        onClick={handleAddGems}
                                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Añadir Gemas
                                    </button>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    Total: <span className="text-white">{profile.gems}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Categorized Module Teleport */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Map size={16} /> Teletransporte (Categorías)
                        </h3>
                        <div className="space-y-8">
                            {categorizedModules.map((cat) => (
                                <div key={cat.category} className="space-y-3">
                                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-widest border-l-4 border-purple-500 pl-3">
                                        <Layers size={14} /> {cat.category}
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {cat.levels.map((mod) => (
                                            <button
                                                key={mod.name}
                                                onClick={() => {
                                                    navigate(`/lessons/${mod.startId}`);
                                                    onClose();
                                                }}
                                                className="flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-purple-500/50 rounded-xl transition-all group text-left"
                                            >
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-purple-300 transition-colors capitalize">
                                                        {mod.name.replace(cat.category, '').trim()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {mod.count} pasos/lecciones
                                                    </div>
                                                </div>
                                                <ChevronRight size={20} className="text-gray-600 group-hover:text-purple-400" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Achievements Toggle */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Award size={16} /> Logros (Toggle)
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {allAchievements.map((ach) => {
                                const isUnlocked = profile.achievements.includes(ach.id);
                                return (
                                    <button
                                        key={ach.id}
                                        onClick={() => handleToggleAchievement(ach.id)}
                                        className={`p-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center gap-2 ${isUnlocked
                                                ? 'bg-green-900/30 border-green-500/50 text-green-300'
                                                : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-750'
                                            }`}
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-gray-600'}`}
                                        ></div>
                                        {ach.name}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-red-900/10 border border-red-500/30 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4">
                            Zona de Peligro
                        </h3>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-red-200">
                                <p>Borrar todo el progreso y reiniciar app.</p>
                            </div>
                            <button
                                onClick={handleHardReset}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                            >
                                <RotateCcw size={18} /> HARD RESET
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function BugDashboardIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bug"
        >
            <path d="m8 2 1.88 1.88" />
            <path d="M14.12 3.88 16 2" />
            <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
            <path d="M12 20c-3.3 0-6-2.6-6-6v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1c0 3.4-2.7 6-6 6" />
            <path d="M12 20v-9" />
            <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
            <path d="M6 13H2" />
            <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
            <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
            <path d="M22 13h-4" />
            <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
        </svg>
    );
}
