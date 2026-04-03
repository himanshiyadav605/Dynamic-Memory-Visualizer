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
