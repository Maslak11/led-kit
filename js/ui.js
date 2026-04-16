// ─── UI HELPERS ──────────────────────────────────────────────

function getCols() { return Math.max(1, parseInt(document.getElementById('v-cols').value) || 1); }
function getRows() { return Math.max(1, parseInt(document.getElementById('v-rows').value) || 1); }

function adj(dim, delta) {
  const id = dim === 'cols' ? 'v-cols' : 'v-rows';
  const el = document.getElementById(id);
  const v = Math.max(1, (parseInt(el.value) || 1) + delta);
  el.value = v;
  if (currentTab === 'A') {
    document.getElementById(dim === 'cols' ? 'A-cols' : 'A-rows').value = v;
  }
  calc();
}

function selectModel(id, el) {
  MODEL = MODELS[id];
  document.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  calc();
}

function switchITab(t, btn) {
  currentTab = t;
  document.querySelectorAll('.itab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.itab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('it-' + t).classList.add('active');
  calc();
}

function setView(v, btn) {
  VIEW = v;
  document.querySelectorAll('.vtab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('opt-person-wrap').style.display = v === 'front' ? '' : 'none';
  document.getElementById('opt-power-wrap').style.display  = v === 'back'  ? '' : 'none';
  document.getElementById('opt-data-wrap').style.display   = v === 'back'  ? '' : 'none';
  document.getElementById('opt-flow-wrap').style.display   = v === 'back'  ? 'flex' : 'none';
  redraw();
}

function selectCircuit(val, btn) {
  document.getElementById('p-circ-sel').value = val;
  document.querySelectorAll('#pc-16, #pc-32').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  calc();
}

function setFlow(dir, btn) {
  FLOW = dir;
  document.querySelectorAll('#opt-flow-wrap .vtab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  redraw();
}

function fromInput(srcId, dstId) {
  document.getElementById(dstId).value = document.getElementById(srcId).value;
}

function syncBoth(slider, inputId, ctrlId) {
  document.getElementById(inputId).value = slider.value;
  document.getElementById(ctrlId).value  = slider.value;
}
