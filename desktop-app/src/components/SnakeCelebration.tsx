import { useEffect, useRef, useState } from 'react';

// --- PALETA DE COLORES (Estilo Duolingo Dark Mode + Python) ---
const BG_DARK = '#0D141F'; // Color::new(0.05, 0.08, 0.12, 1.0)
const RAY_COLOR = 'rgba(255, 255, 255, 0.03)';
const BTN_GREEN = '#58CC02'; // Color::new(0.35, 0.8, 0.01, 1.0) approx
const BTN_HOVER = '#66D908';

const SNAKE_GREEN = '#33B34D'; // Color::new(0.2, 0.7, 0.3, 1.0) approx
const PYTHON_BLUE = '#3373B3'; // Color::new(0.2, 0.45, 0.7, 1.0) approx
const PYTHON_YELLOW = '#FFD940'; // Color::new(1.0, 0.85, 0.25, 1.0) approx
const TEXT_WHITE = '#FFFFFF';
const BLACK = '#000000';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  color: string;
  rotation: number;
  rotSpeed: number;
  depth: number; // For parallax/size
}

interface SnakeCelebrationProps {
  show: boolean;
  stats: {
    totalTime: number;
    mistakes: number;
    completed: number;
  };
  onRestart: () => void;
  onContinue: () => void;
}

export default function SnakeCelebration({
  show,
  stats: _stats,
  onRestart: _onRestart,
  onContinue,
}: SnakeCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  // UI Interaction State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoverBtn, setIsHoverBtn] = useState(false);
  const [isClickBtn, setIsClickBtn] = useState(false);

  // Initial setup of particles
  const particlesRef = useRef<Particle[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!show && initializedRef.current) {
      initializedRef.current = false;
    }

    if (!show) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles if not done
    if (!initializedRef.current) {
      const symbols = ['{ }', '( )', 'def', '#', 'py', 'return', 'print', '[]', ';', 'if'];
      const newParticles: Particle[] = [];
      for (let i = 0; i < 80; i++) {
        const isBlue = Math.random() > 0.5;
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * -window.innerHeight, // Start above
          vx: (Math.random() - 0.5) * 100,
          vy: Math.random() * 200 + 100,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          color: isBlue ? PYTHON_BLUE : PYTHON_YELLOW,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 4,
          depth: Math.random(), // 0 to 1
        });
      }
      particlesRef.current = newParticles;
      initializedRef.current = true;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let timeAccum = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      timeAccum += dt;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear Background
      ctx.fillStyle = BG_DARK;
      ctx.fillRect(0, 0, width, height);

      // --- 1. FONDO "SUNBURST" ---
      ctx.save();
      ctx.translate(centerX, centerY);
      // Rotate the whole sunburst
      const rayAngleOffset = timeAccum * 0.15;
      ctx.rotate(rayAngleOffset);

      const numRays = 16;
      const rayLen = Math.max(width, height) * 1.5;
      const rayWidthRad = 0.15; // Approx width in radians

      ctx.fillStyle = RAY_COLOR;
      for (let i = 0; i < numRays; i++) {
        const angle = (i * Math.PI * 2) / numRays;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Simple triangle fan
        ctx.lineTo(Math.cos(angle - rayWidthRad) * rayLen, Math.sin(angle - rayWidthRad) * rayLen);
        ctx.lineTo(Math.cos(angle + rayWidthRad) * rayLen, Math.sin(angle + rayWidthRad) * rayLen);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // --- 2. PARTÍCULAS DE CÓDIGO ---
      ctx.save();
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      particlesRef.current.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.rotSpeed * dt;

        // Reset if out of bounds
        if (p.y > height + 50) {
          p.y = -50;
          p.x = Math.random() * width;
          p.vy = Math.random() * 200 + 100;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const scale = 0.5 + p.depth * 0.5; // Depth effect
        ctx.scale(scale, scale);
        ctx.globalAlpha = 0.6 + p.depth * 0.4;
        ctx.fillStyle = p.color;
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      });
      ctx.restore();

      // --- 3. PERSONAJE: LA PITÓN GRADUADA ---
      const bounce = Math.sin(timeAccum * 5);
      const stretchY = 1.0 + bounce * 0.03;
      const stretchX = 1.0 - bounce * 0.03;
      const snakeBaseY = centerY + 40;

      // Helper for ellipses
      const drawEllipse = (cx: number, cy: number, rx: number, ry: number, color: string) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      };

      // Cuerpo
      drawEllipse(centerX, snakeBaseY + 40, 90 * stretchX, 40 * stretchY, SNAKE_GREEN);
      drawEllipse(centerX, snakeBaseY + 25, 75 * stretchX, 35 * stretchY, '#40BF59'); // Spiral interior (lighter)

      // Cabeza
      const headY = snakeBaseY - 30 + bounce * -5;
      ctx.beginPath();
      ctx.arc(centerX, headY, 55, 0, Math.PI * 2);
      ctx.fillStyle = SNAKE_GREEN;
      ctx.fill();

      // Gorro (Birrete)
      const capY = headY - 45;
      const capW = 60;


      // Base Rectangle (Connection to head)
      ctx.fillStyle = BLACK;
      ctx.beginPath();
      // Approximating macroquad draw_poly for rectangle
      // Rotated rectangle appearing as part of cap base? Rust code used a rotated rect.
      // Let's draw a simple trapezoid or rect for the cap base sitting on head
      ctx.moveTo(centerX - 20, capY + 15);
      ctx.lineTo(centerX + 20, capY + 15);
      ctx.lineTo(centerX + 25, capY + 5);
      ctx.lineTo(centerX - 25, capY + 5);
      ctx.fill();

      // Top Diamond
      ctx.beginPath();
      ctx.moveTo(centerX, capY - 10 - 20); // Top
      ctx.lineTo(centerX + capW, capY - 10); // Right
      ctx.lineTo(centerX, capY - 10 + 20); // Bottom
      ctx.lineTo(centerX - capW, capY - 10); // Left
      ctx.closePath();
      ctx.fill();

      // Tassel (Borla)
      const tasselX = centerX + capW - 10;
      const tasselY = capY - 10;
      const tasselSwing = Math.sin(timeAccum * 3) * 10;

      ctx.strokeStyle = PYTHON_YELLOW;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, capY - 10); // Center of cap
      ctx.lineTo(tasselX, tasselY); // Edge
      ctx.stroke();

      // Hanging part
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tasselX, tasselY);
      ctx.quadraticCurveTo(
        tasselX + tasselSwing * 0.5,
        tasselY + 15, // Control point
        tasselX + tasselSwing,
        tasselY + 30 // End point
      );
      ctx.stroke();

      // Ball at end
      ctx.fillStyle = PYTHON_YELLOW;
      ctx.beginPath();
      ctx.arc(tasselX + tasselSwing, tasselY + 30, 5, 0, Math.PI * 2);
      ctx.fill();

      // Cara
      // Mouse tracking for eyes
      const mouseDeltaX = (mousePos.x - centerX) * 0.05;
      const mouseDeltaY = (mousePos.y - headY) * 0.05;

      // Eyes White
      ctx.fillStyle = TEXT_WHITE;
      ctx.beginPath();
      ctx.arc(centerX - 18, headY - 5, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 18, headY - 5, 16, 0, Math.PI * 2);
      ctx.fill();

      // Pupils
      const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
      const pupXClamped = clamp(mouseDeltaX, -8, 8);
      const pupYClamped = clamp(mouseDeltaY, -8, 8);

      ctx.fillStyle = BLACK;
      ctx.beginPath();
      ctx.arc(centerX - 18 + pupXClamped, headY - 5 + pupYClamped, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 18 + pupXClamped, headY - 5 + pupYClamped, 7, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = BLACK;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(centerX - 15, headY + 15);
      ctx.quadraticCurveTo(centerX, headY + 23, centerX + 15, headY + 15);
      ctx.stroke();

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [show, mousePos]); // Depend on mousePos not truly needed if using Ref, but okay for React

  // Mouse tracking
  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  if (!show) return null;

  // --- HTML UI OVERLAY ---
  // Button Logic
  // We handle button state via React state, but position it absolute to match visual location requests if needed.
  // However, the Rust code drew the button on Canvas. For accessibility and ease, HTML button is better.
  // We will style it to look exactly like the Rust version.

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden font-sans select-none">
      {/* CANVAS LAYER */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* UI LAYER */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Título "NIVEL DOMINADO" (Arriba) */}
        <div className="mb-[300px] flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
          <h1
            className="text-6xl md:text-7xl font-black text-white italic tracking-tighter"
            style={{
              textShadow: '0px 4px 0px rgba(0,0,0,0.5)',
              fontFamily: '"Feather Bold", sans-serif', // Or fallback
            }}
          >
            ¡NIVEL DOMINADO!
          </h1>
          <div className="mt-4 bg-[#FFC900] text-[#8A6D05] px-6 py-2 rounded-xl font-bold text-xl shadow-lg transform -rotate-2">
            Has ganado +50 XP
          </div>
        </div>

        {/* AREA DE ESTADISTICAS (Opcional, no estaba explicitamente en el Rust pero si en el prompt anterior de mejora) */}
        {/* El Rust code NO tiene caja de estadísticas, solo texto. Pero mantendré una versión minimalista si es necesario, 
                    o simplemente sigo el Rust code que dice "Has ganado +50 XP" como subtitulo */}

        {/* BOTÓN CONTINUAR (Abajo) */}
        <div className="absolute bottom-20 w-full flex justify-center pointer-events-auto">
          <button
            onMouseEnter={() => setIsHoverBtn(true)}
            onMouseLeave={() => {
              setIsHoverBtn(false);
              setIsClickBtn(false);
            }}
            onMouseDown={() => setIsClickBtn(true)}
            onMouseUp={() => setIsClickBtn(false)}
            onClick={onContinue}
            className="relative group transition-transform"
            style={{
              width: '260px',
              height: '60px',
              transform: isClickBtn
                ? 'translateY(6px)'
                : isHoverBtn
                  ? 'translateY(2px)'
                  : 'translateY(0)',
            }}
          >
            {/* Shadow Layer */}
            <div
              className="absolute inset-x-0 bottom-[-10px] rounded-2xl bg-[#408008]"
              style={{
                height: '100%',
                top: isClickBtn ? '4px' : isHoverBtn ? '8px' : '10px',
                borderRadius: '16px',
              }}
            />

            {/* Face Layer */}
            <div
              className="absolute inset-x-0 top-0 rounded-2xl flex items-center justify-center border-b-4 border-[rgba(0,0,0,0.1)]"
              style={{
                height: '100%',
                backgroundColor: isHoverBtn ? BTN_HOVER : BTN_GREEN,
                borderRadius: '16px',
                transition: 'background-color 0.1s',
              }}
            >
              <span className="text-white font-bold text-xl tracking-wide font-sans">
                CONTINUAR
              </span>

              {/* Brillo Superior */}
              <div className="absolute top-1 left-2 right-2 h-[2px] bg-white opacity-30 rounded-full"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
