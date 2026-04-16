// ─── POWER SVG ────────────────────────────────────────────────

function drawPowerSVG(cols, rows, total, cabsPerChain, chainsNeeded, circA) {
  const svg    = document.getElementById('pwr-svg');
  const legend = document.getElementById('pwr-legend');
  legend.innerHTML = '';

  const cabW = 30, cabH = 22, cabGap = 4, outletW = 46, outletH = 34;
  const rowH = 50;
  const svgH = Math.max(60, chainsNeeded * rowH + 12);
  const svgW = 580;
  svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);
  svg.setAttribute('height', svgH);

  let html = '';

  for (let ch = 0; ch < chainsNeeded; ch++) {
    const start = ch * cabsPerChain;
    const end   = Math.min(start + cabsPerChain, total);
    const count = end - start;
    const color = PC[ch % PC.length];
    const y     = 8 + ch * rowH;
    const cy    = y + (rowH - outletH) / 2;

    // Outlet symbol (gniazdo Powercon)
    html += `<rect x="4" y="${cy}" width="${outletW}" height="${outletH}" rx="17" fill="${color}22" stroke="${color}" stroke-width="1.5"/>`;
    html += `<circle cx="${4 + outletW / 2}" cy="${cy + outletH / 2}" r="8" fill="none" stroke="${color}" stroke-width="1.5"/>`;
    html += `<circle cx="${4 + outletW / 2}" cy="${cy + outletH / 2}" r="2.5" fill="${color}"/>`;
    html += `<text x="${4 + outletW / 2}" y="${cy + outletH + 10}" text-anchor="middle" fill="${color}99" font-size="8">${circA}A</text>`;

    // Cable to first cabinet
    const lineX1 = 4 + outletW;
    const lineY  = cy + outletH / 2;
    html += `<line x1="${lineX1}" y1="${lineY}" x2="${lineX1 + 10}" y2="${lineY}" stroke="${color}" stroke-width="2"/>`;
    html += `<text x="${lineX1 + 5}" y="${lineY - 4}" text-anchor="middle" fill="${color}99" font-size="7">Powercon</text>`;

    // Cabinets daisy chain
    for (let c = 0; c < count; c++) {
      const cabNum = start + c + 1;
      const cx2    = lineX1 + 10 + c * (cabW + cabGap + 10);
      const caby   = cy + (outletH - cabH) / 2;

      // Powercon IN dot
      html += `<circle cx="${cx2}" cy="${caby + cabH / 2}" r="3" fill="${color}" stroke="${color}" stroke-width="1"/>`;
      // Cabinet box
      html += `<rect x="${cx2 + 3}" y="${caby}" width="${cabW}" height="${cabH}" rx="3" fill="${color}18" stroke="${color}" stroke-width="1.5"/>`;
      html += `<text x="${cx2 + 3 + cabW / 2}" y="${caby + cabH / 2 + 4}" text-anchor="middle" fill="${color}" font-size="9" font-weight="700">K${cabNum}</text>`;

      if (c < count - 1) {
        // Powercon OUT dot + cable to next cabinet
        const outX = cx2 + 3 + cabW;
        html += `<circle cx="${outX}" cy="${caby + cabH / 2}" r="3" fill="${color}" stroke="${color}" stroke-width="1"/>`;
        html += `<line x1="${outX}" y1="${caby + cabH / 2}" x2="${outX + cabGap + 10}" y2="${caby + cabH / 2}" stroke="${color}" stroke-width="2"/>`;
      }
    }

    // Legend row
    const li = document.createElement('div');
    li.className = 'leg-i';
    li.innerHTML = `<div class="leg-d" style="background:${color}"></div> Obwód ${ch + 1} (${circA}A): K${start + 1}–K${end} &nbsp;·&nbsp; ${count * MODEL.maxW}W`;
    legend.appendChild(li);
  }

  svg.innerHTML = html;
}

// ─── VX1000 SVG + TABLE ──────────────────────────────────────

function drawVX1000(cols, rows, total) {
  const pxPerCab = MODEL.pw * MODEL.ph;
  const portsN   = Math.min(10, Math.ceil(total / 20) || 1);
  const ports    = [];
  let idx = 0;
  const base  = Math.floor(total / portsN);
  const extra = total % portsN;
  for (let p = 0; p < portsN; p++) {
    const cnt = base + (p < extra ? 1 : 0);
    ports.push({ p: p + 1, cabs: Array.from({ length: cnt }, (_, i) => idx + i + 1), color: PC[p % PC.length] });
    idx += cnt;
  }

  // Table
  const tbody = document.getElementById('vx-tbody');
  tbody.innerHTML = '';
  ports.forEach(p => {
    const c1 = p.cabs[0], cN = p.cabs[p.cabs.length - 1];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="port-pill" style="background:${p.color}22;color:${p.color}">Port ${p.p}</span></td>
      <td>${p.cabs.length}</td>
      <td style="color:${p.color};font-weight:600">K${c1}${p.cabs.length > 1 ? '–K' + cN : ''}</td>
      <td>${fmtPx(p.cabs.length * pxPerCab)} px</td>`;
    tbody.appendChild(tr);
  });

  // SVG
  const svg  = document.getElementById('vx-svg');
  const vxW  = 82;
  const vxH  = Math.max(160, portsN * 24 + 20);
  const svgH = vxH + 20;
  const svgW = 520;
  svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);
  svg.setAttribute('height', svgH);

  let html = '';
  html += `<rect x="8" y="8" width="${vxW}" height="${vxH}" rx="8" fill="#1e2028" stroke="#33b5d8" stroke-width="2"/>`;
  html += `<text x="${8 + vxW / 2}" y="26" text-anchor="middle" fill="#33b5d8" font-size="11" font-weight="700">VX1000</text>`;
  html += `<text x="${8 + vxW / 2}" y="39" text-anchor="middle" fill="#7a8394" font-size="9">Novastar</text>`;

  for (let i = 0; i < 10; i++) {
    const py   = 55 + i * 22;
    const used = i < portsN;
    const col  = used ? PC[i] : '#2d3340';
    html += `<circle cx="${8 + vxW}" cy="${py}" r="5" fill="${col}"/>`;
    html += `<text x="${8 + vxW - 10}" y="${py + 4}" text-anchor="end" fill="${col}88" font-size="8">${i + 1}</text>`;
  }

  ports.forEach((p, i) => {
    const py     = 55 + i * 22;
    const cx     = 8 + vxW;
    const chainX = 128;
    const cw = 28, ch = 18, cg = 4;
    html += `<line x1="${cx + 5}" y1="${py}" x2="${chainX}" y2="${py}" stroke="${p.color}" stroke-width="1.5"/>`;
    p.cabs.forEach((num, c) => {
      const x = chainX + c * (cw + cg);
      const y = py - ch / 2;
      html += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="3" fill="${p.color}1a" stroke="${p.color}" stroke-width="1.2"/>`;
      html += `<text x="${x + cw / 2}" y="${y + ch / 2 + 4}" text-anchor="middle" fill="${p.color}" font-size="8" font-weight="600">K${num}</text>`;
      if (c < p.cabs.length - 1)
        html += `<line x1="${x + cw}" y1="${y + ch / 2}" x2="${x + cw + cg}" y2="${y + ch / 2}" stroke="${p.color}66" stroke-width="1" stroke-dasharray="2,2"/>`;
    });
  });

  svg.innerHTML = html;
}
