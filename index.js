/* ══════════════════════════════════════
   TEMPORA — index.js
   ══════════════════════════════════════ */

// ── 1. ELEMENT REFERENCES ────────────────
// Selecting visual digits and control buttons
const h1 = document.querySelector('.hr1 span');
const h2 = document.querySelector('.hr2 span');
const m1 = document.querySelector('.m1 span');
const m2 = document.querySelector('.m2 span');

const startBtn = document.querySelector('.start');
const resetBtn = document.querySelector('.reset');
const pauseBtn = document.querySelector('.pause');
const musicBtn = document.getElementById('musicBtn');

// ── 2. MUSIC DATA & PLAYLISTS ────────────
// Static presets (Direct links to open-source MP3s)
const presets = [
    { title: "Lofi Study", url: "https://cdn.pixabay.com/download/audio/2026/02/26/audio_a0ca555c0d.mp3?filename=mondamusic-chill-491681.mp3" },
    { title: "Deep Focus", url: "https://cdn.pixabay.com/download/audio/2026/02/23/audio_9155a8528a.mp3?filename=quietphase-deep-ambient-489703.mp3" },
    { title: "calm Day", url: "https://cdn.pixabay.com/download/audio/2026/02/19/audio_34037f847d.mp3?filename=mondamusic-relaxing-relax-music-487314.mp3" }
];

// Dynamic playlist: Loaded from LocalStorage and converted back from a String to an Array
let userPlaylist = JSON.parse(localStorage.getItem('tempora_user_playlist')) || [];

// ── 3. APPLICATION STATE ─────────────────
let totalsecs  = 0;       
let intervalId = null;    
const currentAudio = document.getElementById('mainAudio'); 
let currentTrackElement = null; 

// ── 4. INITIALIZATION (LOCAL STORAGE) ───
// Restore timer progress if user refreshed the page
const savedTime = localStorage.getItem('savedPomoTime');
if (savedTime) {
    totalsecs = parseInt(savedTime);
    updateDisplayVisuals(Math.floor(totalsecs / 3600), Math.floor((totalsecs % 3600) / 60));
} else {
    totalsecs = 1500; // Default 25 min
    updateDisplayVisuals(0, 25);
}

// ── 5. CORE TIMER FUNCTIONS ──────────────

// Request/Send browser notifications
function sendNotification(title, message) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
    }
}

// Visual "Flip" animation logic
function flipDigit(el, val) {
    const s = val.toString();
    if (el.innerHTML !== s) {
        el.parentElement.classList.remove('flip-anim');
        void el.parentElement.offsetWidth; // Force Reflow to restart animation
        el.innerHTML = s;
        el.parentElement.classList.add('flip-anim');
    }
}

function updateDisplayVisuals(h, m) {
    flipDigit(h1, Math.floor(h / 10));
    flipDigit(h2, h % 10);
    flipDigit(m1, Math.floor(m / 10));
    flipDigit(m2, m % 10);
}

// The main loop that runs every second
function timercont() {
    if (totalsecs <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        sendNotification('Session Completed!', 'Well done! Time for a break.');
        setTimeout(() => alert('Session completed!'), 100);
        return;
    }

    totalsecs--;
    updateDisplayVisuals(Math.floor(totalsecs / 3600), Math.floor((totalsecs % 3600) / 60));
}

// ── 6. TIMER EVENT LISTENERS ─────────────

function confirmTime() {
    window.timeDialog.close();
    const hIn = parseInt(document.getElementById('hours').value) || 0;
    const mIn = parseInt(document.getElementById('minutes').value) || 25;
    
    totalsecs = (hIn * 3600) + (mIn * 60);
    localStorage.setItem('savedPomoTime', totalsecs);
    updateDisplayVisuals(hIn, mIn % 60);
}

startBtn.addEventListener('click', () => {
    // Request permission on first user interaction
    if (Notification.permission === 'default') Notification.requestPermission();
    if (intervalId || totalsecs <= 0) return;
    
    intervalId = setInterval(timercont, 1000);
    sendNotification('Timer Started', 'Stay focused!');
});

pauseBtn.addEventListener('click', () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        sendNotification('Timer Paused', 'Timer is on hold.');
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
    totalsecs = 0;
    localStorage.removeItem('savedPomoTime');
    updateDisplayVisuals(0, 0);
});

// ── 7. MUSIC MANAGER LOGIC ───────────────

function handleMusicClick() {
    musicBtn.classList.add('active');
    setTimeout(() => window.musicDialog.showModal(), 150);
}

window.musicDialog.addEventListener('close', () => musicBtn.classList.remove('active'));

function showUploadFields() {
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('addTrackForm').style.display = 'flex';
}

function hideUploadFields() {
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('addTrackForm').style.display = 'none';
}

// Add a web link to the user list
function addUserTrack() {
    const titleIn = document.getElementById('userSongTitle');
    const urlIn = document.getElementById('userSongUrl');

    if (titleIn.value && urlIn.value) {
        userPlaylist.push({ title: titleIn.value, url: urlIn.value });
        localStorage.setItem('tempora_user_playlist', JSON.stringify(userPlaylist));
        renderPlaylist();
        titleIn.value = ""; urlIn.value = "";
        hideUploadFields();
    }
}

// Rebuilds the UI based on presets and userPlaylist arrays
function renderPlaylist() {
    const container = document.getElementById('songs-container');
    if (!container) return;
    container.innerHTML = ""; 

    const allSongs = [...presets, ...userPlaylist];

    allSongs.forEach((song, index) => {
        const isPreset = index < presets.length;
        const div = document.createElement('div');
        div.className = "track";
        
        // Use a click listener for the whole row to play the song
        div.onclick = (e) => {
            if (e.target.tagName !== 'BUTTON') togglePlay(song.url, div);
        };
        
        div.innerHTML = `
            <div class="track-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="track-info">
                <div class="track-name">${song.title}</div>
                <div class="track-sub">${isPreset ? 'Preset' : 'User Track'}</div>
            </div>
            ${!isPreset ? `<button class="btn mini" style="color: #f87171; border:none; background:transparent; font-size:1.2rem;" onclick="deleteTrack(${index - presets.length})">×</button>` : ''}
        `;
        container.appendChild(div);
    });
}

// The core Play/Pause toggle logic
function togglePlay(url, element) {
    // Check if the current song is the one being clicked
    if (currentAudio.src === url || decodeURI(currentAudio.src) === url) {
        if (currentAudio.paused) {
            currentAudio.play();
            element.classList.add('playing');
        } else {
            currentAudio.pause();
            element.classList.remove('playing');
        }
    } else {
        // Switching to a new song
        if (currentTrackElement) currentTrackElement.classList.remove('playing');
        currentAudio.src = url;
        currentAudio.play().catch(e => alert("Please use a direct MP3 link"));
        currentTrackElement = element;
        element.classList.add('playing');
    }
}

function deleteTrack(userIndex) {
    userPlaylist.splice(userIndex, 1);
    localStorage.setItem('tempora_user_playlist', JSON.stringify(userPlaylist));
    renderPlaylist();
}

// Handle local file picker via Blob URLs
function handleLocalFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    userPlaylist.push({ title: file.name.replace(/\.[^/.]+$/, ""), url: blobUrl });
    renderPlaylist();
}

// Build the playlist for the first time
renderPlaylist();