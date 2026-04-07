// STATE
let selectedAlgo = 'FIFO';
let allResults = [];
let allPages = [];
let nFrames = 3;
let currentStep = 0;
let playInterval = null;

// ALGO TOGGLE
document.querySelectorAll('.algo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedAlgo = btn.dataset.algo;
  });
});

// RESET
function resetAll() {
  stopPlay();
  allResults = [];
  allPages = [];
  currentStep = 0;

  document.getElementById('viz-output').innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">⬡</div>
      <p>Configure your parameters and click RUN</p>
    </div>`;

  ['val-hits', 'val-faults', 'val-rate']
    .forEach(id => document.getElementById(id).textContent = '—');

  document.getElementById('error-msg').style.display = 'none';
}

document.getElementById('reset-btn').addEventListener('click', resetAll);// STATE
let selectedAlgo = 'FIFO';
let allResults = [];
let allPages = [];
let nFrames = 3;
let currentStep = 0;
let playInterval = null;

// ALGO TOGGLE
document.querySelectorAll('.algo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedAlgo = btn.dataset.algo;
  });
});

// RESET
function resetAll() {
  stopPlay();
  allResults = [];
  allPages = [];
  currentStep = 0;

  document.getElementById('viz-output').innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">⬡</div>
      <p>Configure your parameters and click RUN</p>
    </div>`;

  ['val-hits', 'val-faults', 'val-rate']
    .forEach(id => document.getElementById(id).textContent = '—');

  document.getElementById('error-msg').style.display = 'none';
}

document.getElementById('reset-btn').addEventListener('click', resetAll);

// VALIDATE INPUTS
function getInputs() {
  const errEl = document.getElementById('error-msg');
  errEl.style.display = 'none';

  const n = parseInt(document.getElementById('frames-input').value);
  if (!n || n < 1 || n > 10) {
    errEl.textContent = 'ERROR: Frames must be 1–10';
    errEl.style.display = 'block';
    return null;
  }

  const raw = document.getElementById('pages-input').value;
  const pages = raw.split(',')
    .map(s => parseInt(s.trim()))
    .filter(x => !isNaN(x));

  if (pages.length < 1) {
    errEl.textContent = 'ERROR: Invalid page string';
    errEl.style.display = 'block';
    return null;
  }

  return { n, pages };
}

// RUN BUTTON
document.getElementById('run-btn').addEventListener('click', () => {
  const inp = getInputs();
  if (!inp) return;

  stopPlay();

  nFrames = inp.n;
  allPages = inp.pages;

  allResults = selectedAlgo === 'FIFO'
    ? runFIFO(allPages, nFrames)
    : runLRU(allPages, nFrames);

  currentStep = 0;

  document.getElementById('viz-output').innerHTML =
    buildTableSkeleton(allPages, nFrames);

  bindStepButtons();
  updateStepBtns(0);
});