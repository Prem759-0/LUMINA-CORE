// ==========================================
// 7. AWWWARDS POLISH: CUSTOM CURSOR & AUDIO
// ==========================================

const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let ccX = window.innerWidth / 2;
let ccY = window.innerHeight / 2;
let fX = window.innerWidth / 2;
let fY = window.innerHeight / 2;

// Track real mouse position
window.addEventListener('mousemove', (e) => {
    ccX = e.clientX;
    ccY = e.clientY;
    // The inner dot moves instantly
    cursor.style.transform = `translate(${ccX}px, ${ccY}px)`;
});

// Use GSAP Ticker for buttery smooth trailing animation
gsap.ticker.add(() => {
    // Lerp (Linear Interpolation) to smoothly catch up to the mouse
    fX += (ccX - fX) * 0.15;
    fY += (ccY - fY) * 0.15;
    follower.style.transform = `translate(${fX}px, ${fY}px)`;
});

// Magnetic Hover State
const interactables = document.querySelectorAll('.interactable, .audio-toggle, button');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
    });
});

// Audio Toggle Logic Prototype
const audioBtn = document.getElementById('audio-btn');
let isSoundOn = false;

audioBtn.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    if (isSoundOn) {
        audioBtn.innerHTML = "<span>SOUND [ON]</span>";
        audioBtn.style.color = "#ff00ff";
        audioBtn.style.borderColor = "#ff00ff";
        // To add real music later, upload an mp3 to GitHub and uncomment this:
        // const bgMusic = new Audio('your-audio-file.mp3');
        // bgMusic.loop = true;
        // bgMusic.play();
    } else {
        audioBtn.innerHTML = "<span>SOUND [OFF]</span>";
        audioBtn.style.color = "#a0a0a0";
        audioBtn.style.borderColor = "rgba(160, 160, 160, 0.3)";
    }
});
