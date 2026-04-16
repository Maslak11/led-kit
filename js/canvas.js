// ─── MAIN CANVAS ─────────────────────────────────────────────

function redraw() {
  const cols = getCols(), rows = getRows();
  const canvas = document.getElementById('mainCanvas');
  const container = canvas.parentElement;
  const cW = container.clientWidth || 800;

  // Margins for arrows + person
  const ML = 52, MR = 42, MT = 30, MB = 72;
  const PERSON_W = 34;
  const availW = cW - ML - MR - PERSON_W;
  const availH = Math.min(440, window.innerHeight * 0.48);
  const GAP = 2;

  const cellW = Math.floor((availW - GAP * (cols - 1)) / cols);
  const cellH = Math.floor((availH - GAP * (rows - 1)) / rows);
  const cell  = Math.max(8, Math.min(cellW, cellH, 80));

  const wallW = cols * cell + GAP * (cols - 1);
  const wallH = rows * cell + GAP * (rows - 1);
  const canvasW = wallW + ML + MR + PERSON_W;
  const canvasH = wallH + MT + MB;

  canvas.width  = canvasW;
  canvas.height = canvasH;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = '#13151a';
  ctx.fillRect(0, 0, canvasW, canvasH);

  const ox = ML + PERSON_W;
  const oy = MT;

  if (VIEW === 'front') drawFront(ctx, cols, rows, cell, GAP, ox, oy, wallW, wallH);
  else                  drawBack(ctx, cols, rows, cell, GAP, ox, oy, wallW, wallH);

  drawDimArrows(ctx, cols, rows, ox, oy, wallW, wallH, canvasW, canvasH);
  drawARFrame(ctx, ox, oy, wallW, wallH);

  if (VIEW === 'front' && document.getElementById('opt-person').checked)
    drawPerson(ctx, ox + PERSON_W / 2 - 20, oy + wallH, wallH);
}

// ─── FRONT VIEW ──────────────────────────────────────────────
function drawFront(ctx, cols, rows, cell, GAP, ox, oy, wallW, wallH) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * (cell + GAP);
      const y = oy + r * (cell + GAP);

      // Cabinet bg gradient
      const grd = ctx.createLinearGradient(x, y, x + cell, y + cell);
      grd.addColorStop(0, '#1a1d24');
      grd.addColorStop(1, '#141620');
      ctx.fillStyle = grd;
      ctx.fillRect(x, y, cell, cell);

      // LED dot matrix
      const dots    = Math.max(2, Math.min(8, Math.floor(cell / 9)));
      const spacing = cell / dots;
      for (let dr = 0; dr < dots; dr++) {
        for (let dc = 0; dc < dots; dc++) {
          const px = x + (dc + 0.5) * spacing;
          const py = y + (dr + 0.5) * spacing;
          const r2 = Math.max(0.5, spacing * 0.18);
          const brightness = 0.6 + Math.random() * 0.4;
          ctx.beginPath();
          ctx.arc(px, py, r2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(51,${Math.floor(140 + brightness * 41)},${Math.floor(160 + brightness * 56)},${0.55 + brightness * 0.25})`;
          ctx.fill();
        }
      }

      // Sub-module lines (2×2 per cabinet)
      if (cell >= 24) {
        ctx.strokeStyle = 'rgba(30,35,46,0.8)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x + cell / 2, y); ctx.lineTo(x + cell / 2, y + cell);
        ctx.moveTo(x, y + cell / 2); ctx.lineTo(x + cell, y + cell / 2);
        ctx.stroke();
      }

      // Cabinet border
      ctx.strokeStyle = 'rgba(45,51,64,0.9)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);

      // Cabinet number
      if (cell >= 18) {
        const num = r * cols + c + 1;
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.font = `bold ${Math.max(7, Math.floor(cell * 0.22))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num, x + cell / 2, y + cell / 2);
      }
    }
  }
}

// ─── BACK VIEW ───────────────────────────────────────────────
function drawBack(ctx, cols, rows, cell, GAP, ox, oy, wallW, wallH) {
  // Cabinet backgrounds
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * (cell + GAP);
      const y = oy + r * (cell + GAP);
      ctx.fillStyle = '#1c1f28';
      ctx.fillRect(x, y, cell, cell);
      // Corner screws
      if (cell >= 16) {
        const screw = Math.max(1.5, cell * 0.065);
        [[screw, screw], [cell - screw, screw], [screw, cell - screw], [cell - screw, cell - screw]].forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.arc(x + sx, y + sy, screw, 0, Math.PI * 2);
          ctx.fillStyle = '#2a2e3a';
          ctx.fill();
        });
      }
      ctx.strokeStyle = '#252932'; ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
    }
  }

  function snakePos(r, c) {
    return { x: ox + c * (cell + GAP) + cell / 2, y: oy + r * (cell + GAP) + cell / 2 };
  }

  function snakeOrder(cols, rows) {
    const order = [];
    if (FLOW === 'H') {
      for (let r = 0; r < rows; r++) {
        if (r % 2 === 0) for (let c = 0; c < cols; c++) order.push({ r, c });
        else             for (let c = cols - 1; c >= 0; c--) order.push({ r, c });
      }
    } else {
      for (let c = 0; c < cols; c++) {
        if (c % 2 === 0) for (let r = 0; r < rows; r++) order.push({ r, c });
        else             for (let r = rows - 1; r >= 0; r--) order.push({ r, c });
      }
    }
    return order;
  }

  const total = cols * rows;
  const snake = snakeOrder(cols, rows);

  // POWER routing (solid)
  if (document.getElementById('opt-power').checked) {
    const circA    = parseInt(document.getElementById('p-circ-sel')?.value || '16');
    const perChain = Math.floor(circA * 230 / MODEL.maxW);
    const chainN   = Math.ceil(total / perChain);
    for (let p = 0; p < chainN; p++) {
      const start = p * perChain;
      const end   = Math.min(start + perChain, total);
      const color = PC[p % PC.length];
      const pts   = snake.slice(start, end);
      if (pts.length < 1) continue;

      ctx.strokeStyle = color;
      ctx.lineWidth   = Math.max(2, cell * 0.09);
      ctx.lineJoin    = 'round';
      ctx.lineCap     = 'round';
      ctx.setLineDash([]);
      ctx.beginPath();
      pts.forEach((pos, i) => {
        const { x, y } = snakePos(pos.r, pos.c);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Circuit label on first cabinet
      const { x, y } = snakePos(pts[0].r, pts[0].c);
      const r2 = Math.max(7, cell * 0.25);
      ctx.beginPath(); ctx.arc(x, y, r2, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = `bold ${Math.max(6, r2 * 0.85)}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(p + 1, x, y);
    }
  }

  // DATA routing (dashed)
  if (document.getElementById('opt-data').checked) {
    const portsNeeded = Math.min(10, Math.ceil(total / 20) || 1);
    const perPort     = Math.ceil(total / portsNeeded);
    for (let p = 0; p < portsNeeded; p++) {
      const start = p * perPort;
      const end   = Math.min(start + perPort, total);
      const color = PC[p % PC.length];
      const pts   = snake.slice(start, end);
      if (pts.length < 1) continue;

      ctx.strokeStyle = color;
      ctx.lineWidth   = Math.max(1, cell * 0.055);
      ctx.setLineDash([cell * 0.2, cell * 0.1]);
      ctx.lineJoin    = 'round';
      ctx.lineCap     = 'round';
      ctx.beginPath();
      pts.forEach((pos, i) => {
        const { x, y } = snakePos(pos.r, pos.c);
        i === 0 ? ctx.moveTo(x + 2, y + 2) : ctx.lineTo(x + 2, y + 2);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Cabinet numbers
  if (cell >= 16) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = ox + c * (cell + GAP);
      const y = oy + r * (cell + GAP);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.font = `${Math.max(7, Math.floor(cell * 0.2))}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(r * cols + c + 1, x + cell / 2, y + cell / 2);
    }
  }
}

// ─── DIMENSION ARROWS ────────────────────────────────────────
function drawDimArrows(ctx, cols, rows, ox, oy, wallW, wallH, cW, cH) {
  const m  = MODEL;
  const pW = (cols * m.wmm / 1000).toFixed(2);
  const pH = (rows * m.hmm / 1000).toFixed(2);
  ctx.strokeStyle = '#33b5d8'; ctx.fillStyle = '#33b5d8';
  ctx.lineWidth = 1.5; ctx.font = 'bold 12px sans-serif';
  ctx.setLineDash([]);

  // Horizontal arrow (top)
  const ay = oy - 14;
  arrow(ctx, ox, ay, ox + wallW, ay);
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText(`${pW}m`, ox + wallW / 2, ay - 2);

  // Vertical arrow (right)
  const ax = ox + wallW + 12;
  arrow(ctx, ax, oy, ax, oy + wallH, true);
  ctx.save();
  ctx.translate(ax + 18, oy + wallH / 2);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${pH}m`, 0, 0);
  ctx.restore();
}

function arrow(ctx, x1, y1, x2, y2, vert = false) {
  const hs = 5;
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  if (!vert) {
    ctx.beginPath(); ctx.moveTo(x1, y1 - hs); ctx.lineTo(x1, y1 + hs); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2 - hs); ctx.lineTo(x2, y2 + hs); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(x1 - hs, y1); ctx.lineTo(x1 + hs, y1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2 - hs, y2); ctx.lineTo(x2 + hs, y2); ctx.stroke();
  }
}

// ─── ASPECT RATIO FRAME ──────────────────────────────────────
function drawARFrame(ctx, ox, oy, wallW, wallH) {
  const sel = document.getElementById('ar-sel').value;
  if (!sel) return;
  const parts = sel.split(':');
  const rW = parseFloat(parts[0]), rH = parseFloat(parts[1]);
  const targetR = rW / rH, wallR = wallW / wallH;
  let fW, fH;
  if (targetR > wallR) { fW = wallW; fH = wallW / targetR; }
  else                 { fH = wallH; fW = wallH * targetR; }
  const fx = ox + (wallW - fW) / 2;
  const fy = oy + (wallH - fH) / 2;

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(ox, oy, wallW, fy - oy);
  ctx.fillRect(ox, fy + fH, wallW, oy + wallH - fy - fH);
  ctx.fillRect(ox, fy, fx - ox, fH);
  ctx.fillRect(fx + fW, fy, ox + wallW - fx - fW, fH);

  ctx.strokeStyle = 'rgba(255,60,60,0.9)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  ctx.strokeRect(fx, fy, fW, fH);
  ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(255,60,60,0.9)';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText(sel, fx + fW / 2, fy - 3);
}

// ─── PERSON SILHOUETTE ───────────────────────────────────────
function drawPerson(ctx, cx, groundY, wallH) {
  const rows       = getRows();
  const m          = MODEL;
  const wallRealH  = rows * m.hmm / 1000;
  const pxPerMeter = wallH / wallRealH;
  const pH         = 1.75 * pxPerMeter;
  if (pH < 10) return;

  const headR = pH * 0.1, bodyH = pH * 0.4, legH = pH * 0.38, armL = pH * 0.22;
  const bw = Math.max(2, pH * 0.06);
  ctx.strokeStyle = 'rgba(180,185,200,0.55)';
  ctx.fillStyle   = 'rgba(180,185,200,0.55)';
  ctx.lineWidth   = bw; ctx.lineCap = 'round';

  ctx.beginPath(); ctx.arc(cx, groundY - legH - bodyH - headR, headR, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx, groundY - legH - bodyH); ctx.lineTo(cx, groundY - legH); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - armL * 0.6, groundY - legH - bodyH * 0.3);
  ctx.lineTo(cx, groundY - legH - bodyH * 0.55);
  ctx.lineTo(cx + armL * 0.6, groundY - legH - bodyH * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, groundY - legH); ctx.lineTo(cx - pH * 0.07, groundY);
  ctx.moveTo(cx, groundY - legH); ctx.lineTo(cx + pH * 0.07, groundY);
  ctx.stroke();

  ctx.fillStyle = 'rgba(180,185,200,0.5)';
  ctx.font = `${Math.max(8, Math.floor(pxPerMeter * 0.14))}px sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('1.75m', cx, groundY + 3);
}
