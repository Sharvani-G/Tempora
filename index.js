/* ══════════════════════════════════════
   TEMPORA — index.js
   ══════════════════════════════════════ */

// ── Element refs ──────────────────────
// Current HTML uses <div class="digit hr1"><span>…</span></div>
let h1 = document.querySelector('.hr1 span');
let h2 = document.querySelector('.hr2 span');
let m1 = document.querySelector('.m1 span');
let m2 = document.querySelector('.m2 span');

let start  = document.querySelector('.start');
let reset  = document.querySelector('.reset');
let pause  = document.querySelector('.pause');

// ── State ─────────────────────────────
let totalsecs  = 0;
let intervalId = null;

// ── Initial display ───────────────────
h1.innerHTML = '0';
h2.innerHTML = '0';
m1.innerHTML = '2';
m2.innerHTML = '5';

// ── Music Button ──────────────────────
function handleMusicClick() {
    document.getElementById('musicBtn').classList.add('active');
    setTimeout(() => musicDialog.showModal(), 180);
}

musicDialog.addEventListener('close', () => {
    document.getElementById('musicBtn').classList.remove('active');
});

// ── Flip helper ───────────────────────
function flipDigit(el, val) {
    const s = val.toString();
    if (el.innerHTML !== s) {
        el.parentElement.classList.remove('flip-anim');
        void el.parentElement.offsetWidth; // reflow to restart animation
        el.innerHTML = s;
        el.parentElement.classList.add('flip-anim');
    }
}

// ── Timer function (your original logic) ──
function timercont() {
    if (totalsecs <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        alert('Session completed!');
        return;
    }

    totalsecs = totalsecs - 1;

    let hours   = Math.floor(totalsecs / 3600);
    let minutes = Math.floor((totalsecs % 3600) / 60);

    flipDigit(h1, parseInt(hours / 10));
    flipDigit(h2, hours % 10);
    flipDigit(m1, parseInt(minutes / 10));
    flipDigit(m2, minutes % 10);
}

// ── Set Time Dialog ───────────────────
function confirmTime() {
    timeDialog.close();

    const hoursInput   = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');

    // hours.value is string — parse to int
    let hours   = parseInt(hoursInput.value)   || 0;
    let minutes = parseInt(minutesInput.value) || 0;

    // normalize overflow minutes into hours
    hours   += Math.floor(minutes / 60);
    minutes  = minutes % 60;

    totalsecs = (hours * 3600) + (minutes * 60);

    // update display immediately after setting
    flipDigit(h1, parseInt(hours / 10));
    flipDigit(h2, hours % 10);
    flipDigit(m1, parseInt(minutes / 10));
    flipDigit(m2, minutes % 10);
}

// ── Start ─────────────────────────────
start.addEventListener('click', () => {
    if (intervalId) return;       // already running
    if (totalsecs <= 0) return;   // nothing set
    intervalId = setInterval(timercont, 1000);
});

// ── Pause ─────────────────────────────
pause.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
});

// ── Reset ─────────────────────────────
reset.addEventListener('click', () => {
    
const audio = new Audio('/sound/end.wav'); 
  // MP3, WAV, and OGG formats are widely supported

  // Play the sound
  audio.play()
  audio.play()
    .catch(error => {
      // Handle potential errors, e.g., if the user hasn't interacted with the page yet
      console.error("Audio playback failed:", error);
    });

    clearInterval(intervalId);
    intervalId = null;
    totalsecs  = 0;

    h1.innerHTML = '0';
    h2.innerHTML = '0';
    m1.innerHTML = '0';
    m2.innerHTML = '0';
});

