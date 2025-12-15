import { useMemo, useState, useEffect } from 'react';
import { BookOpen, Lock, CheckCircle, Play, Star, Zap, Code } from 'lucide-react';
import { QUIZ_DATA } from '../lib/quiz-data';
import { useNavigate } from 'react-router-dom';

type LessonType = {
    id: string;
    title: string;
    topic: string;
    locked: boolean;
    completed: boolean;
};

interface UnitSection {
    title: string;
    description: string;
    color: string;
    lessons: LessonType[];
}

export default function Dashboard() {
    const navigate = useNavigate();

    // Get available subjects
    const subjects = useMemo(() => Object.keys(QUIZ_DATA), []);

    // State with Persistence
    const [selectedSubject, setSelectedSubject] = useState<string>(() => {
        const saved = localStorage.getItem('selectedSubject');
        return saved && subjects.includes(saved) ? saved : subjects[0];
    });

    useEffect(() => {
        localStorage.setItem('selectedSubject', selectedSubject);
    }, [selectedSubject]);


    const units = useMemo(() => {
        const processedUnits: UnitSection[] = [];
        let globalLessonIndex = 0;

        // Only process the selected subject
        const subjectData = QUIZ_DATA[selectedSubject];
        if (subjectData) {
            Object.entries(subjectData).forEach(([categoryName, topics]) => {
                const lessons: LessonType[] = [];

                Object.keys(topics).forEach((topicName) => {
                    // Add study lesson
                    lessons.push({
                        id: `${selectedSubject}-${categoryName}-${topicName}-study`, // Updated ID schema to be unique per subject
                        title: `Estudiar: ${topicName}`,
                        topic: topicName,
                        locked: globalLessonIndex > 0, // Mock locking
                        completed: false,
                    });
                    globalLessonIndex++;

                    // Add quiz lesson
                    lessons.push({
                        id: `${selectedSubject}-${categoryName}-${topicName}-quiz`,
                        title: `Práctica: ${topicName}`,
                        topic: topicName,
                        locked: globalLessonIndex > 0,
                        completed: false,
                    });
                    globalLessonIndex++;
                });

                processedUnits.push({
                    title: categoryName,
                    description: `Temas de ${selectedSubject}`,
                    color: selectedSubject === 'Python' ? "from-yellow-500 to-orange-500" : "from-blue-600 to-cyan-500", // Dynamic color per subject
                    lessons,
                });
            });
        }

        return processedUnits;
    }, [selectedSubject]);

    // Snake Path Constants
    const VERTICAL_SPACING = 120;
    const AMPLITUDE = 80; // Horizontal sway

    return (
        <div className="flex flex-col items-center pb-40 pt-2 w-full overflow-x-hidden">

            {/* Subject Selector Tabs */}
            <div className="flex gap-4 mb-8 bg-gray-900/50 p-2 rounded-full border border-white/5 backdrop-blur-sm sticky top-0 z-50 shadow-xl">
                {subjects.map((subject) => (
                    <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${selectedSubject === subject
                                ? (subject === 'Python' ? 'bg-yellow-500 text-yellow-950 shadow-lg shadow-yellow-500/20' : 'bg-cyan-500 text-cyan-950 shadow-lg shadow-cyan-500/20')
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {subject === 'Física' ? <Zap size={16} /> :
                            subject === 'Python' ? <Code size={16} /> : <BookOpen size={16} />}
                        {subject}
                    </button>
                ))}
            </div>

            {units.map((unit, unitIdx) => {
                const totalHeight = (unit.lessons.length) * VERTICAL_SPACING + 100;

                // Helper to calculate position for index
                const getPos = (i: number) => {
                    const y = i * VERTICAL_SPACING + 80; // Start with more offset
                    // Sine wave pattern: 0 -> Center, 1 -> Right, 2 -> Center, 3 -> Left
                    // We modify sine to achieve this specific "Duolingo" zigzag
                    const xOffset = Math.sin(i * Math.PI / 2) * AMPLITUDE;
                    return { x: xOffset, y };
                };

                // Generate SVG Path
                let pathD = "";
                for (let i = 0; i < unit.lessons.length; i++) {
                    const curr = getPos(i);
                    if (i === 0) {
                        pathD += `M ${curr.x} ${curr.y}`;
                    } else {
                        const prev = getPos(i - 1);
                        // Cubic Bezier control points for smooth curve
                        const cp1y = prev.y + VERTICAL_SPACING * 0.5;
                        const cp2y = curr.y - VERTICAL_SPACING * 0.5;
                        pathD += ` C ${prev.x} ${cp1y}, ${curr.x} ${cp2y}, ${curr.x} ${curr.y}`;
                    }
                }

                // Extend path a bit at the end
                if (unit.lessons.length > 0) {
                    const last = getPos(unit.lessons.length - 1);
                    pathD += ` L ${last.x} ${last.y + 60}`;
                }

                return (
                    <div key={unitIdx} className="w-full max-w-md mb-24 relative">
                        {/* Unit Header */}
                        <div className={`bg-gradient-to-r ${unit.color} p-6 rounded-3xl mb-12 shadow-xl shadow-cyan-900/20 text-white flex justify-between items-center relative z-20 mx-4 border border-white/10`}>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">{unit.title}</h2>
                                <p className="text-white/80 text-sm font-medium">{unit.description}</p>
                            </div>
                            <BookOpen size={28} className="opacity-90 drop-shadow-md" />
                        </div>

                        {/* Lessons Container */}
                        <div className="relative flex justify-center" style={{ height: totalHeight }}>

                            {/* SVG Snake Path Layer */}
                            <svg
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-full pointer-events-none -z-10"
                                overflow="visible"
                            >
                                {/* Shadow/Outer Stroke */}
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke="#1f2937"
                                    strokeWidth="24"
                                    strokeLinecap="round"
                                    className="drop-shadow-sm opacity-50"
                                />
                                {/* Inner Path (Snake Body) */}
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke="#374151"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray="20 10"
                                    className="opacity-60"
                                />
                            </svg>

                            {/* Lessons Buttons */}
                            {unit.lessons.map((lesson, idx) => {
                                const pos = getPos(idx);
                                const isActive = !lesson.locked && !lesson.completed;
                                const isCompleted = lesson.completed; // Simulate completion visually for now if needed

                                return (
                                    <div
                                        key={lesson.id}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-105"
                                        style={{ left: `calc(50% + ${pos.x}px)`, top: pos.y }}
                                    >
                                        <div className="relative group">
                                            {/* Tooltip for Active */}
                                            {isActive && (
                                                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-cyan-900 text-sm font-extrabold py-2 px-4 rounded-xl animate-bounce z-30 shadow-lg whitespace-nowrap">
                                                    EMPEZAR
                                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => !lesson.locked && navigate(`/lessons/${lesson.id}`)}
                                                disabled={lesson.locked}
                                                className={`
                                                    relative w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl font-bold border-b-8 transition-all
                                                    active:border-b-0 active:translate-y-2
                                                    ${isCompleted
                                                        ? 'bg-yellow-400 border-yellow-600 text-yellow-900'
                                                        : isActive
                                                            ? (selectedSubject === 'Python' ? 'bg-yellow-400 border-yellow-600 text-yellow-950 shadow-[0_0_30px_rgba(250,204,21,0.5)]' : 'bg-cyan-400 border-cyan-600 text-cyan-950 shadow-[0_0_30px_rgba(34,211,238,0.5)]')
                                                            : 'bg-gray-700 border-gray-600 text-gray-500'
                                                    }
                                                `}
                                            >
                                                {isCompleted ? <CheckCircle size={32} strokeWidth={3} /> :
                                                    lesson.locked ? <Lock size={28} /> :
                                                        <Star size={32} fill="currentColor" />}

                                                {/* Button Highlights */}
                                                <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-white opacity-20"></div>
                                            </button>

                                            {/* Label below button */}
                                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center w-32 pointer-events-none">
                                                <span className={`text-sm font-bold drop-shadow-md ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                                    {lesson.topic}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
