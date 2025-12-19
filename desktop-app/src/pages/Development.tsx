import { Gamepad2 } from 'lucide-react';
import AlgorithmRepair from '@/components/minigames/AlgorithmRepair';

export default function Development() {
    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                    <Gamepad2 className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Laboratorio de Minijuegos</h1>
                    <p className="text-gray-400">Área de pruebas para nuevos componentes y mecánicas de juego</p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Gamepad2 className="text-purple-400" size={20} />
                        Reparación de Algoritmo
                    </h2>
                    <AlgorithmRepair />
                </div>

                {/* Placeholder for future games */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[200px] border-dashed">
                    <p className="text-gray-500">
                        Más minijuegos próximamente...
                    </p>
                </div>
            </div>
        </div>
    );
}
