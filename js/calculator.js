// ─── CALCULATOR ──────────────────────────────────────────────

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function fmtPx(n) {
  return n >= 1_000_000 ? (n / 1_000_000).toFixed(2) + 'M'
       : n >= 1_000     ? Math.round(n / 1_000) + 'K'
       : n;
}

function derivedColsRows() {
  const m = MODEL;
  if (currentTab === 'A') {
    return {
      cols: Math.max(1, parseInt(document.getElementById('A-cols').value) || 1),
      rows: Math.max(1, parseInt(document.getElementById('A-rows').value) || 1)
    };
  }
  if (currentTab === 'B') {
    return {
      cols: Math.max(1, Math.round(parseFloat(document.getElementById('B-w').value) / (m.wmm / 1000))),
      rows: Math.max(1, Math.round(parseFloat(document.getElementById('B-h').value) / (m.hmm / 1000)))
    };
  }
  if (currentTab === 'C') {
    return {
      cols: Math.max(1, Math.ceil(parseInt(document.getElementById('C-w').value) / m.pw)),
      rows: Math.max(1, Math.ceil(parseInt(document.getElementById('C-h').value) / m.ph))
    };
  }
  return { cols: 1, rows: 1 };
}

function calc() {
  const { cols, rows } = derivedColsRows();
  const m = MODEL;

  // Sync control bar
  document.getElementById('v-cols').value = cols;
  document.getElementById('v-rows').value = rows;

  const total = cols * rows;
  const pW    = (cols * m.wmm / 1000).toFixed(2);
  const pH    = (rows * m.hmm / 1000).toFixed(2);
  const rW    = cols * m.pw;
  const rH    = rows * m.ph;
  const g     = gcd(rW, rH);
  const px    = rW * rH;
  const wt    = (total * m.kg).toFixed(1);
  const pw    = total * m.maxW;
  const kw    = (pw / 1000).toFixed(2);
  const amp   = (pw / 230).toFixed(1);

  // Tab hints
  if (currentTab === 'A') {
    document.getElementById('A-hint').textContent = `${cols}×${rows} → ${pW}m × ${pH}m`;
    const sliders = document.querySelectorAll('#it-A input[type=range]');
    if (sliders[0]) sliders[0].value = cols;
    if (sliders[1]) sliders[1].value = rows;
  }
  if (currentTab === 'B') document.getElementById('B-hint').textContent = `→ ${cols}×${rows} kabinetów = ${pW}m × ${pH}m`;
  if (currentTab === 'C') document.getElementById('C-hint').textContent = `→ ${cols}×${rows} kabinetów = ${rW}×${rH}px`;

  // Summary bar
  const _circA    = parseInt(document.getElementById('p-circ-sel')?.value || 16);
  const _perChain = Math.floor(_circA * 230 / MODEL.maxW);
  const _chains   = Math.ceil(total / _perChain);
  document.getElementById('summary-bar').innerHTML =
    `<span>${total}</span> kab. · <span>${rW}×${rH}px</span> · <span>${wt}kg</span> · <span>${_chains}× Powercon ${_circA}A</span> · <span>${kw}kW</span>`;

  // Stat cards
  document.getElementById('s-total').textContent = total;
  document.getElementById('s-dim').textContent   = `${pW}×${pH}`;
  document.getElementById('s-res').textContent   = `${rW}×${rH}`;
  document.getElementById('s-ar').textContent    = `${rW/g}:${rH/g}`;
  document.getElementById('s-px').textContent    = fmtPx(px);
  document.getElementById('s-wt').textContent    = wt;
  document.getElementById('s-pw').textContent    = pw;

  // ── Zasilanie: Powercon True1 daisy chain przez kabinety ──
  // Każdy kabinet Dazzle Plus ma wbudowany zasilacz.
  // Kabel Powercon 230V z gniazda → kabinet 1 → kabinet 2 → … → kabinet N
  // 16A × 230V = 3680W → 36 kab. | 32A × 230V = 7360W → 73 kab.
  const circSel     = document.getElementById('p-circ-sel')?.value || '16';
  const CIRC_A      = parseInt(circSel);
  const CIRC_W      = CIRC_A * 230;
  const cabsPerChain = Math.floor(CIRC_W / m.maxW);
  const chainsNeeded = Math.ceil(total / cabsPerChain);

  let rec;
  if (chainsNeeded === 1) {
    rec = `✅ Wystarczy <strong>1 kabel Powercon ${CIRC_A}A</strong> z rozdzielni. Łańcuch: ${total} kab. × ${m.maxW}W = <strong>${pw}W</strong> (limit ${CIRC_W}W).`;
  } else {
    rec = `⚡ Potrzebujesz <strong>${chainsNeeded} kabli Powercon ${CIRC_A}A</strong> z rozdzielni. Każdy obwód zasila maks. <strong>${cabsPerChain} kabinetów</strong> w łańcuchu daisy chain.`;
  }

  document.getElementById('p-kw').textContent       = kw + ' kW';
  document.getElementById('p-amp').textContent      = amp + ' A';
  document.getElementById('p-chains').textContent   = chainsNeeded;
  document.getElementById('p-perchain').textContent = cabsPerChain + ' kab.';
  document.getElementById('power-rec').innerHTML    = rec;

  drawPowerSVG(cols, rows, total, cabsPerChain, chainsNeeded, CIRC_A);
  drawVX1000(cols, rows, total);
  redraw();
}
