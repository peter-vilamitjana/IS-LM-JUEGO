import { useEffect, useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------- efectos visuales ---------- */

// 1) Lluvia de billetes (aparece cuando la inflación/tasa está alta)
// Lluvia de billetes con la imagen subida
function MoneyRain({ show = false }) {
  if (!show) return null;

  const drops = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden z-20'>
      {drops.map(i => {
        const delay = Math.random() * 1.2;
        const dur = 2 + Math.random() * 1.8;
        const startX = Math.random() * window.innerWidth * 0.9;
        const rot = Math.random() * 40 - 20;
        const scale = 0.7 + Math.random() * 0.6;

        return (
          <motion.img
            key={i}
            src='/public/money_313176.png' // guarda la imagen subida como /public/money.png
            alt='dinero'
            width={40}
            height={40}
            draggable={false}
            initial={{ y: -80, x: startX, rotate: rot, opacity: 0 }}
            animate={{ y: '110%', rotate: rot + 180, opacity: 1 }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: 'linear' }}
            className='select-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]'
            style={{ transformOrigin: '50% 50%', scale }}
          />
        );
      })}
    </div>
  );
}

// 2) Ola de protesta (aparece cuando la aprobación está baja)
function ProtestWave({ show = false }) {
  if (!show) return null;
  const crowd = '🪧🧍‍♀️🧍‍♂️🪧🧍‍♂️🧍‍♀️🪧';
  return (
    <div className='pointer-events-none absolute bottom-2 left-0 right-0 z-20'>
      <motion.div
        initial={{ x: '-110%' }}
        animate={{ x: '110%' }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className='text-xl opacity-90 whitespace-nowrap'>
        {crowd} {crowd} {crowd}
      </motion.div>
    </div>
  );
}

// 3) Banner “¡Viva la libertad, carajo!” (gatillalo cuando estés en racha o al ganar)
function FreedomBanner({ show = false }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className='pointer-events-none fixed top-4 left-1/2 -translate-x-1/2 z-[60] rounded-full border border-emerald-500/40 bg-emerald-600/20 backdrop-blur px-4 py-2 text-emerald-200 font-semibold'>
          ¡Viva la libertad, carajo! 🇦🇷
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 4) Barrido de radar (cuando activás el radar económico)
function RadarSweep({ show = false, left = 0, width = 0 }) {
  if (!show) return null;
  return (
    <div className='pointer-events-none absolute inset-y-0 z-10' style={{ left, width }}>
      <motion.div
        className='absolute inset-y-0 w-16 bg-emerald-500/8 rounded'
        initial={{ x: '-10%' }}
        animate={{ x: '110%' }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className='absolute inset-y-0 w-1.5 bg-emerald-400/25 rounded'
        initial={{ x: '-10%' }}
        animate={{ x: '110%' }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: 0.05 }}
      />
    </div>
  );
}

/* --------------------- utilidades --------------------- */
const BASE = { a: 14, b: 0.02, c: 2, d: 0.02, k: 4 };
const TARGET = { Y: [350, 450], i: [3, 7] };

const DIFFS = {
  Fácil: { da: [-0.8, 0.8], dk: [-0.6, 0.6] },
  Normal: { da: [-1.2, 1.2], dk: [-1.0, 1.0] },
  Duro: { da: [-1.8, 1.8], dk: [-1.5, 1.5] }
};

const PARAMS = {
  Fácil: { sigma: 0.2, shockP: 0.4, costG: 1.0, costMs: 1.0, budget: 18 },
  Normal: { sigma: 0.35, shockP: 0.55, costG: 1.3, costMs: 1.3, budget: 16 },
  Duro: { sigma: 0.5, shockP: 0.7, costG: 1.6, costMs: 1.6, budget: 14 }
};

const MAX_TURNS = 12;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rndIn = ([lo, hi]) => lo + Math.random() * (hi - lo);

const useLocalStorage = (key, initial) => {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(v));
  }, [key, v]);
  return [v, setV];
};

/* --------------------- dilemas (mini misiones) --------------------- */
const DILEMMAS = [
  {
    title: 'Paritarias calientes',
    text: 'Los sindicatos piden suba del salario mínimo.',
    options: [
      {
        label: 'Aumentar G (obra pública)',
        effect: s => ({ ...s, a: clamp(s.a + 0.8, 0, 20), appr: +6, msg: 'Obras activadas, mejora el empleo 👷' })
      },
      {
        label: 'Emitir para sostener',
        effect: s => ({ ...s, k: clamp(s.k + 0.7, 0, 10), appr: +3, msg: 'Más billetes en la calle 💸' })
      },
      {
        label: 'Ajuste y diálogo',
        effect: s => ({ ...s, a: clamp(s.a - 0.4, 0, 20), appr: -7, msg: 'Tensión social, baja el gasto 😬' })
      }
    ]
  },
  {
    title: 'Sequía en el campo',
    text: 'La cosecha cae y exporta menos.',
    options: [
      {
        label: 'Bajar impuestos sectoriales',
        effect: s => ({ ...s, a: clamp(s.a + 0.4, 0, 20), appr: +3, msg: 'Alivio impositivo al campo 🌾' })
      },
      {
        label: 'Crédito blando (Ms↑)',
        effect: s => ({ ...s, k: clamp(s.k + 0.5, 0, 10), appr: +2, msg: 'Créditos para capital de trabajo 🏦' })
      },
      { label: 'No intervenir', effect: s => ({ ...s, appr: -5, msg: 'Mercado se ajusta solo… la gente se queja 😕' }) }
    ]
  },
  {
    title: 'Suba del dólar',
    text: 'Mercados nerviosos, suben precios de importados.',
    options: [
      {
        label: 'Subir tasa (contraer Ms)',
        effect: s => ({
          ...s,
          k: clamp(s.k - 0.7, 0, 10),
          appr: -2,
          msg: 'Menos dinero, frena precios pero enfría la actividad 🧊'
        })
      },
      {
        label: 'Plan de precios + G',
        effect: s => ({ ...s, a: clamp(s.a + 0.6, 0, 20), appr: +1, msg: 'Contención social con gasto 🧺' })
      },
      { label: 'Dejar flotar', effect: s => ({ ...s, appr: -4, msg: 'Incertidumbre, la calle murmura 🤔' }) }
    ]
  }
];

/* --------------------- modal simple --------------------- */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/60' onClick={onClose} />
      <div className='relative w-[min(760px,92vw)] rounded-2xl border border-zinc-700 bg-zinc-900 p-6'>
        {children}
        <div className='mt-4 text-right'>
          <button
            onClick={onClose}
            className='rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-medium'>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------- app --------------------- */
export default function App() {
  const [p, setP] = useState({ ...BASE });
  const [diff, setDiff] = useState('Normal');
  const params = useMemo(() => PARAMS[diff], [diff]);

  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [eventMsg, setEvent] = useState('—');
  const [finished, setFinished] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // nuevo: modo práctica (muestra siempre la zona dulce)
  const [practice, setPractice] = useState(false);

  // nuevo: aprobación del pueblo
  const [approval, setApproval] = useState(55);

  // nuevo: radar que revela la zona 1 turno, con 2 usos
  const [radarCharges, setRadarCharges] = useState(2);
  const [radarActive, setRadarActive] = useState(false);

  // dilemas
  const [showDilemma, setShowDilemma] = useState(false);
  const [pendingDilemma, setPendingDilemma] = useState(null);
  const [dilemmaInfo, setDilemmaInfo] = useState(''); // mensaje tras elegir

  // presupuesto silencioso y costo de movimiento
  const [budgetF, setBudgetF] = useState(params.budget);
  const [budgetM, setBudgetM] = useState(params.budget);
  const [prevG, setPrevG] = useState(p.a);
  const [prevK, setPrevK] = useState(p.k);

  // récords
  const [records, setRecords] = useLocalStorage('islm-records-v2', { best: 0, history: [] });

  // mensajes del pueblo
  const CITAS = [
    '“Todo sube menos mi sueldo 😤”',
    '“Por fin hay laburo otra vez 🙌”',
    '“No se consigue harina 😩”',
    '“El banco me subió la tasa 😓”',
    '“La fábrica volvió a tomar gente 💪”',
    '“El super está más caro, otra vez…”'
  ];

  // sliders
  const setG = v => {
    const val = v[0];
    const delta = Math.abs(val - prevG);
    const cost = delta * params.costG;
    setPrevG(val);
    setBudgetF(b => Math.max(0, b - cost));
    setP(x => ({ ...x, a: val }));
  };
  const setMs = v => {
    const val = v[0];
    const delta = Math.abs(val - prevK);
    const cost = delta * params.costMs;
    setPrevK(val);
    setBudgetM(b => Math.max(0, b - cost));
    setP(x => ({ ...x, k: val }));
  };

  // equilibrio
  const eq = useMemo(() => {
    const Y = (p.a - p.c + p.k) / (p.b + p.d);
    const i = p.a - p.b * Y;
    return { Y, i };
  }, [p]);

  const inGreen = eq.Y >= TARGET.Y[0] && eq.Y <= TARGET.Y[1] && eq.i >= TARGET.i[0] && eq.i <= TARGET.i[1];

  // puntaje
  function scoreBase() {
    return inGreen ? 100 + streak * 10 : -50;
  }
  function overSpendPenalty() {
    const overF = Math.max(0, PARAMS[diff].budget - budgetF);
    const overM = Math.max(0, PARAMS[diff].budget - budgetM);
    return (overF + overM) * 2;
  }
  function scoreThisTurn() {
    return scoreBase() - overSpendPenalty();
  }
  function rankFor(total) {
    return total >= 1100 ? 'S' : total >= 900 ? 'A' : total >= 700 ? 'B' : 'C';
  }

  // encuesta de aprobación reacciona a desempeño + ruído
  function updateApproval() {
    const delta = (inGreen ? +6 : -9) + rndIn([-3, 3]);
    setApproval(a => clamp(a + delta, 0, 100));
  }

  // dilemas cada 3 turnos (3,6,9,12… antes de puntuar el siguiente)
  function maybeSpawnDilemma(nextT) {
    if (nextT % 3 === 0 && nextT <= MAX_TURNS) {
      const d = DILEMMAS[Math.floor(Math.random() * DILEMMAS.length)];
      setPendingDilemma(d);
      setShowDilemma(true);
    }
  }

  function chooseDilemmaOption(opt) {
    // aplicar efecto sobre parámetros/approval y mostrar mensaje
    setP(s => {
      const res = opt.effect(s);
      setApproval(a => clamp(a + (res.appr || 0), 0, 100));
      setDilemmaInfo(res.msg || '');
      return { a: res.a ?? s.a, b: s.b, c: s.c, d: s.d, k: res.k ?? s.k };
    });
    setShowDilemma(false);
  }

  function useRadar() {
    if (radarCharges <= 0 || radarActive) return;
    setRadarCharges(n => n - 1);
    setRadarActive(true); // se apaga al terminar el turno
    setEvent('🛰️ Radar económico activado: la “zona dulce” es visible este turno.');
  }

  function nextTurn(withShock = true) {
    if (finished) return;

    // 1) puntúo estado actual
    const add = scoreThisTurn();
    setScore(s => s + add);
    setStreak(s => (inGreen ? s + 1 : 0));
    updateApproval();

    // 2) fin de partida
    if (turn >= MAX_TURNS) {
      setFinished(true);
      const total = score + add;
      setRecords(r => {
        const best = Math.max(r.best || 0, total);
        const history = [{ date: new Date().toISOString(), score: total, diff }, ...r.history].slice(0, 7);
        return { best, history };
      });
      setEvent('—');
      setRadarActive(false);
      return;
    }

    // 3) ruido de ejecución
    const gNoise = rndIn([-params.sigma, params.sigma]);
    const msNoise = rndIn([-params.sigma, params.sigma]);
    setP(x => ({ ...x, a: clamp(x.a + gNoise, 0, 20), k: clamp(x.k + msNoise, 0, 10) }));

    // 4) shock aleatorio
    if (withShock && Math.random() < params.shockP) {
      const d = DIFFS[diff];
      const isDemand = Math.random() < 0.5;
      const cita = CITAS[Math.floor(Math.random() * CITAS.length)];
      if (isDemand) {
        const da = rndIn(d.da);
        setP(x => ({ ...x, a: clamp(x.a + da, 0, 20) }));
        setEvent(da >= 0 ? `Boom de consumo 💥 — ${cita}` : `Caída de demanda 😞 — ${cita}`);
      } else {
        const dk = rndIn(d.dk);
        setP(x => ({ ...x, k: clamp(x.k + dk, 0, 10) }));
        setEvent(dk >= 0 ? `Expansión monetaria 💸 — ${cita}` : `Contracción monetaria 🏦 — ${cita}`);
      }
    } else {
      setEvent('Ruido de ejecución (cosas que nadie controla del todo) 🤷‍♂️');
    }

    // 5) apagar radar y avanzar turno
    setRadarActive(false);
    setTurn(t => {
      const nt = t + 1;
      maybeSpawnDilemma(nt);
      return nt;
    });
  }

  function resetGame() {
    setP({ ...BASE });
    setTurn(1);
    setScore(0);
    setStreak(0);
    setEvent('—');
    setFinished(false);
    setBudgetF(PARAMS[diff].budget);
    setBudgetM(PARAMS[diff].budget);
    setPrevG(BASE.a);
    setPrevK(BASE.k);
    setApproval(55);
    setRadarCharges(2);
    setRadarActive(false);
    setPractice(false);
    setDilemmaInfo('');
  }

  useEffect(() => {
    if (turn <= 1 && !finished) {
      setBudgetF(PARAMS[diff].budget);
      setBudgetM(PARAMS[diff].budget);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diff]);

  /* --------------------- helpers UI --------------------- */
  const percent = v => clamp(v, 0, 100);
  const Ymax = 600,
    imax = 20;
  const prodPct = percent((eq.Y / Ymax) * 100);
  const empleoPct = percent((eq.Y / Ymax) * 100);
  const inflacionPct = percent(100 - eq.i * 10);
  const felicidadPct = percent(approval * 0.6 + prodPct * 0.2 + inflacionPct * 0.2);

  /* --------------------- gráfico --------------------- */
  const W = 760,
    H = 420,
    PAD = 48;
  const x = Y => PAD + (Y / Ymax) * (W - PAD * 2);
  const y = i => H - PAD - (i / imax) * (H - PAD * 2);
  const poly = fn => {
    const n = 40,
      pts = [];
    for (let t = 0; t <= n; t++) {
      const Y = (t / n) * Ymax;
      const i = fn(Y);
      pts.push(`${x(Y)},${y(i)}`);
    }
    return pts.join(' ');
  };
  const ptsIS = poly(Y => p.a - p.b * Y);
  const ptsLM = poly(Y => p.c + p.d * Y - p.k);

  const totalProjected = finished ? score : score + scoreThisTurn();
  const rank = rankFor(totalProjected);

  /* --------------------- UI --------------------- */
  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-100'>
      {/* banner épico */}
      <FreedomBanner show={(streak >= 3 && !finished) || (finished && ['A', 'S'].includes(rankFor(score)))} />

      {/* header */}
      <header className='border-b border-zinc-800 bg-zinc-900/40'>
        <div className='mx-auto max-w-6xl p-6'>
          <div className='flex flex-wrap items-center gap-3'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-emerald-400'>Ministro por un día — Juego IS-LM</h1>
              <p className='text-sm text-zinc-400'>
                Mantené la economía estable: 12 turnos, shocks, dilemas y puntaje.
              </p>
            </div>
            <div className='ml-auto flex flex-wrap items-center gap-2'>
              <span className='rounded-full bg-zinc-900/60 border border-zinc-800 px-3 py-1 text-sm'>
                Turno <b>{turn}</b> / {MAX_TURNS}
              </span>
              <span className='rounded-full bg-zinc-900/60 border border-zinc-800 px-3 py-1 text-sm'>
                Score <b>{score}</b>
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm border ${
                  inGreen
                    ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300'
                    : 'bg-zinc-900/60 border-zinc-700 text-zinc-300'
                }`}>
                Racha <b>{streak}</b>
              </span>
              <select
                className='bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1 text-sm'
                value={diff}
                onChange={e => setDiff(e.target.value)}
                disabled={turn > 1}
                title='Solo antes de empezar'>
                {Object.keys(DIFFS).map(k => (
                  <option key={k}>{k}</option>
                ))}
              </select>

              {/* modo práctica y radar */}
              <label className='flex items-center gap-2 text-sm ml-2'>
                <input
                  type='checkbox'
                  className='accent-emerald-500'
                  checked={practice}
                  onChange={e => setPractice(e.target.checked)}
                  disabled={turn > 1}
                />
                Modo práctica
              </label>
              <button
                onClick={useRadar}
                disabled={radarCharges <= 0 || radarActive || finished}
                className='rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 px-3 py-1 text-sm'>
                🛰️ Radar económico ({radarCharges})
              </button>

              <button
                onClick={() => setShowIntro(true)}
                className='rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1 text-sm border border-zinc-600'>
                Instrucciones
              </button>
              <button
                onClick={resetGame}
                className='rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-sm font-medium'>
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* contenido */}
      <div className='mx-auto max-w-6xl p-6'>
        {/* récords */}
        <div className='mb-3 flex items-center gap-4'>
          <div className='text-sm text-zinc-300'>
            Récord personal: <b className='text-emerald-400'>{records.best}</b> • Ranking proyectado:{' '}
            <b className='text-emerald-400'>{rank}</b>
          </div>
        </div>

        {/* estado país */}
        <div className='rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-center text-sm mb-4'>
          <span className='text-zinc-300 mr-1'>Estado del país:</span>
          {inGreen ? (
            <span className='text-emerald-400'>Estable y con buen ánimo 😄</span>
          ) : eq.i > TARGET.i[1] ? (
            <span className='text-amber-400'>Tasas altas / precios calientes 💸</span>
          ) : (
            <span className='text-sky-400'>Actividad floja: se siente la recesión 🥶</span>
          )}
        </div>

        {/* indicadores */}
        <div className='grid sm:grid-cols-5 gap-3 mb-6'>
          {[
            { label: 'Producción', icon: '🏭', val: prodPct },
            { label: 'Inflación (mejor baja)', icon: '📈', val: inflacionPct },
            { label: 'Empleo', icon: '🧍‍♂️', val: empleoPct },
            { label: 'Felicidad', icon: '😊', val: felicidadPct },
            { label: 'Aprobación', icon: '🗳️', val: approval }
          ].map((v, i) => (
            <div key={i} className='rounded-xl border border-zinc-700 bg-zinc-900/50 p-3'>
              <div className='flex justify-between text-sm text-zinc-300 mb-1'>
                <span>
                  {v.icon} {v.label}
                </span>
                <span>{Math.round(v.val)}%</span>
              </div>
              <div className='h-2 rounded-full bg-zinc-800 overflow-hidden'>
                <div className='h-full bg-emerald-500 transition-all' style={{ width: `${v.val}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Controles */}
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5'>
            <h2 className='font-semibold text-zinc-200'>Gasto del Estado (G)</h2>
            <p className='text-xs text-zinc-400 mb-2'>Más obras y ayudas → la economía se acelera.</p>
            <div className='flex items-center gap-4'>
              <span className='w-16 text-xs text-zinc-400'>G (a)</span>
              <Slider min={0} max={20} step={0.5} value={[p.a]} onValueChange={setG} className='flex-1' />
              <span className='w-12 text-right text-sm'>{p.a.toFixed(1)}</span>
            </div>
          </div>
          <div className='rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5'>
            <h2 className='font-semibold text-zinc-200'>Billetes en la calle (Ms)</h2>
            <p className='text-xs text-zinc-400 mb-2'>Más billetes → más compras… y pueden subir los precios.</p>
            <div className='flex items-center gap-4'>
              <span className='w-16 text-xs text-zinc-400'>Ms (k)</span>
              <Slider min={0} max={10} step={0.5} value={[p.k]} onValueChange={setMs} className='flex-1' />
              <span className='w-12 text-right text-sm'>{p.k.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Tablero */}
        <div
          className={`mt-6 rounded-2xl border p-4 relative overflow-hidden ${
            eq.i > 7 ? 'border-amber-600/50 bg-amber-900/10' : 'border-zinc-800 bg-zinc-900/40'
          }`}>
          {/* CAPAS DE ANIMACIÓN */}
          <MoneyRain show={eq.i > 7 || eventMsg.includes('Expansión monetaria')} />
          <ProtestWave show={approval < 35} />
          <RadarSweep show={radarActive} />

          <div className='flex items-center justify-between px-2 relative z-30'>
            <div className='text-sm'>
              <span className='inline-flex items-center gap-2 mr-4'>
                <span className='inline-block w-4 h-1.5 bg-sky-400 rounded' /> IS
              </span>
              <span className='inline-flex items-center gap-2'>
                <span className='inline-block w-4 h-1.5 bg-amber-300 rounded' /> LM
              </span>
            </div>
            <div className='text-sm text-zinc-300'>
              <span className='mr-5'>
                Y* = <b>{eq.Y.toFixed(0)}</b>
              </span>
              <span>
                i* = <b>{eq.i.toFixed(2)}%</b>
              </span>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className='w-full mt-3 relative z-30'>
            {/* ejes */}
            <line x1={x(0)} y1={y(0)} x2={x(Ymax)} y2={y(0)} stroke='#71717a' strokeWidth='1' />
            <line x1={x(0)} y1={y(0)} x2={x(0)} y2={y(imax)} stroke='#71717a' strokeWidth='1' />
            <text x={x(Ymax)} y={y(0) + 20} className='fill-zinc-400 text-[10px]' textAnchor='end'>
              Ingreso (Y)
            </text>
            <text x={x(0) - 8} y={y(imax)} className='fill-zinc-400 text-[10px]' textAnchor='end'>
              Tasa (i)
            </text>

            {/* zona dulce: solo si práctica o radar activo */}
            {(practice || radarActive) && (
              <rect
                x={x(TARGET.Y[0])}
                y={y(TARGET.i[1])}
                width={x(TARGET.Y[1]) - x(TARGET.Y[0])}
                height={y(TARGET.i[0]) - y(TARGET.i[1])}
                fill='#10b98122'
                stroke='#10b98166'
                strokeWidth='1'
                rx='6'
              />
            )}

            {/* curvas */}
            <polyline points={ptsIS} fill='none' stroke='#38bdf8' strokeWidth='2.5' />
            <polyline points={ptsLM} fill='none' stroke='#facc15' strokeWidth='2.5' />

            {/* equilibrio */}
            <circle
              cx={x(eq.Y)}
              cy={y(eq.i)}
              r='5'
              className={inGreen ? 'pulse-green' : 'shake'}
              fill={inGreen ? '#10b981' : '#ef4444'}
            />
            <text x={x(eq.Y) + 8} y={y(eq.i) - 6} className='fill-emerald-300 text-[10px]'>
              E*
            </text>

            {/* guías */}
            <line x1={x(eq.Y)} y1={y(0)} x2={x(eq.Y)} y2={y(eq.i)} stroke='#10b981' strokeDasharray='4 4' />
            <line x1={x(0)} y1={y(eq.i)} x2={x(eq.Y)} y2={y(eq.i)} stroke='#10b981' strokeDasharray='4 4' />
          </svg>

          {/* noticiero */}
          <div className='mt-3 bg-zinc-900/60 rounded-xl p-3 text-sm border border-zinc-700 relative z-30'>
            📰 <b>Noticias:</b> {eventMsg === '—' ? 'Esperando decisiones del ministro…' : eventMsg}
          </div>

          {/* acciones */}
          <div className='mt-3 flex items-center gap-3 relative z-30'>
            <button
              onClick={() => nextTurn(true)}
              className='rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-medium'
              disabled={finished}>
              Aprobar presupuesto (siguiente turno)
            </button>
            <button
              onClick={() => nextTurn(false)}
              className='rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-sm border border-zinc-600'
              disabled={finished}
              title='Puntuar sin shock (modo práctica)'>
              Puntuar sin shock
            </button>
            <span className='ml-auto text-sm text-zinc-300'>
              Presupuesto usado:{' '}
              <b className='text-zinc-100'>
                F {Math.max(0, PARAMS[diff].budget - budgetF).toFixed(1)} / M{' '}
                {Math.max(0, PARAMS[diff].budget - budgetM).toFixed(1)}
              </b>
            </span>
          </div>

          {finished && (
            <div className='mt-3 rounded-xl border border-zinc-700 bg-zinc-900/60 p-3 text-sm relative z-30'>
              <b>Partida terminada.</b> Score <b>{score}</b> • Ranking{' '}
              <b className='text-emerald-400'>{rankFor(score)}</b>
              <div className='mt-1 text-zinc-300'>
                {rankFor(score) === 'S' && '🌟 Milagro económico: te llama el FMI para dar charlas.'}
                {rankFor(score) === 'A' && '💼 Gestión sólida: te reelige todo el país.'}
                {rankFor(score) === 'B' && '📈 Zafaste con lo justo. Buen aprendizaje.'}
                {rankFor(score) === 'C' && '🔥 Crisis grande. Te fuiste, pero ahora sabés más que antes.'}
              </div>
            </div>
          )}
        </div>

        {/* historial */}
        <div className='mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4'>
          <h3 className='font-semibold mb-2'>Historial (últimos 7)</h3>
          {records.history.length === 0 ? (
            <p className='text-sm text-zinc-400'>Sin partidas todavía.</p>
          ) : (
            <ul className='text-sm text-zinc-300 grid sm:grid-cols-2 gap-2'>
              {records.history.map((h, i) => (
                <li key={i} className='rounded-lg border border-zinc-700/70 bg-zinc-900/50 px-3 py-2'>
                  <span className='text-zinc-400'>{new Date(h.date).toLocaleString()}</span>
                  <span className='mx-2'>•</span>
                  Dificultad <b>{h.diff}</b> — Score <b>{h.score}</b> — Rank <b>{rankFor(h.score)}</b>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className='mt-4 text-xs text-zinc-400'>
          Versión 2.0 — Zona dulce oculta (salvo práctica o radar), aprobación ciudadana, dilemas y animaciones.
        </p>
      </div>

      {/* modal intro */}
      <Modal open={showIntro} onClose={() => setShowIntro(false)}>
        <h2 className='text-xl font-semibold'>🎮 Bienvenido, Ministro</h2>
        <p className='text-sm text-zinc-400 mt-2'>
          Tenés 12 turnos para llevar al país por buen camino. La “zona dulce” no siempre es visible: usá el{' '}
          <b>🛰️ Radar</b> (2 usos) o activá <b>Modo práctica</b> antes de empezar.
        </p>
        <ul className='mt-3 list-disc pl-5 space-y-1 text-sm text-zinc-300'>
          <li>🏦 Gasto (G) acelera la economía, pero puede calentar precios.</li>
          <li>💸 Emisión (Ms) pone billetes en la calle: más compras y posible inflación.</li>
          <li>📊 Apuntá a buena producción y tasas razonables. La gente te evalúa (aprobación).</li>
          <li>
            🧩 Cada 3 turnos aparece un <b>dilema</b> con decisiones difíciles.
          </li>
          <li>🔢 Puntaje: +100 en equilibrio (+10 por racha), -50 fuera. Penaliza el sobre-uso del presupuesto.</li>
        </ul>
      </Modal>

      {/* modal dilema */}
      <Modal open={showDilemma} onClose={() => setShowDilemma(false)}>
        {pendingDilemma && (
          <>
            <h2 className='text-lg font-semibold'>{pendingDilemma.title}</h2>
            <p className='text-sm text-zinc-400 mt-1'>{pendingDilemma.text}</p>
            <div className='mt-4 grid gap-2'>
              {pendingDilemma.options.map((o, idx) => (
                <button
                  key={idx}
                  onClick={() => chooseDilemmaOption(o)}
                  className='text-left rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-sm'>
                  {o.label}
                </button>
              ))}
            </div>
            {dilemmaInfo && <div className='mt-3 text-sm text-zinc-300'>👉 {dilemmaInfo}</div>}
          </>
        )}
      </Modal>

      {/* estilos de micro-animaciones */}
      <style>{`
        @keyframes pulseGreen{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
        .pulse-green{animation:pulseGreen .8s ease-in-out;}
        .shake{animation:shake .5s ease-in-out;}
      `}</style>
    </div>
  );
}
