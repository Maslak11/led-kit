// ─── MODELS ──────────────────────────────────────────────────
// Dane techniczne kabinetów LED. Każdy model: wmm/hmm (mm), pw/ph (px), maxW (W), kg, pitch (mm)

const MODELS = {
  dazzle: {
    name: 'ESDLumen Dazzle Plus P2.84',
    wmm: 500, hmm: 500,   // gabaryty fizyczne kabinetu [mm]
    pw: 176, ph: 176,     // rozdzielczość kabinetu [px]
    maxW: 100,            // maks. pobór mocy [W]
    kg: 8.5,              // waga [kg]
    pitch: 2.84           // pixel pitch [mm]
  }
};

// Stan aplikacji
let MODEL = MODELS.dazzle;
let VIEW = 'front';           // 'front' | 'back'
let FLOW = 'H';               // 'H' = poziomy (wierszami) | 'V' = pionowy (kolumnami)
let currentTab = 'A';         // 'A' | 'B' | 'C'

// Paleta kolorów dla portów/obwodów
const PC = [
  '#33b5d8', '#22c55e', '#f59e0b', '#f97316',
  '#a855f7', '#ec4899', '#14b8a6', '#3b82f6',
  '#ef4444', '#84cc16'
];
