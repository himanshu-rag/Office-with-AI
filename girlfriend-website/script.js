/* =========================================
   CUSTOMIZATION VARIABLES
   ========================================= */
const girlfriendName = "Snehal";
const yourName = "Himanshu Sharma";
const relationshipStartDate = "2026-04-24T00:31:00"; // 24 of april 2026 at 12:31 am
const backgroundMusic = "assets/music/background.mp3";

// Update DOM elements with variables
document.getElementById('signature-name').textContent = yourName;
document.getElementById('her-name-reveal').textContent = girlfriendName;

/* =========================================
   MOUSE TRAIL (Cursor)
   ========================================= */
const canvas = document.getElementById("mouse-trail");
const ctx = canvas.getContext("2d");
let width, height;
let cursor = { x: 0, y: 0 };
let particlesArray = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    cursor.x = e.x;
    cursor.y = e.y;
    addParticle(e.x, e.y);
});

function addParticle(x, y) {
    particlesArray.push({
        x: x,
        y: y,
        size: Math.random() * 5 + 2,
        life: 1,
        color: `rgba(120, 196, 255, ${Math.random()})`
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particlesArray.length; i++) {
        let p = particlesArray[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.life -= 0.02;
        p.size -= 0.1;
        p.y -= 1; // float up slightly
        if (p.life <= 0 || p.size <= 0) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    
    // Draw Custom Cursor
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(77, 168, 255, 1)";
    ctx.fill();
    ctx.shadowBlur = 0; // reset
    
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* =========================================
   AUDIO & SURPRISE START
   ========================================= */
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const iconPlay = document.getElementById('music-icon-play');
const iconPause = document.getElementById('music-icon-pause');

bgMusic.src = backgroundMusic;
bgMusic.volume = 0.4;

let isPlaying = false;
function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        iconPause.classList.add('hidden');
        iconPlay.classList.remove('hidden');
    } else {
        bgMusic.play();
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
    }
    isPlaying = !isPlaying;
}

musicBtn.addEventListener('click', toggleMusic);

// Chapter 1 typed
new Typed('#typed-surprise-1', {
    strings: ['Someone has been waiting to tell you something...'],
    typeSpeed: 50,
    showCursor: false,
    onComplete: (self) => {
        setTimeout(() => {
            new Typed('#typed-surprise-2', {
                strings: ['Just for you.'],
                typeSpeed: 50,
                showCursor: false,
                onComplete: () => {
                    setTimeout(() => {
                        document.getElementById('btn-begin').classList.remove('hidden');
                    }, 500);
                }
            });
        }, 1500);
    }
});

document.getElementById('btn-begin').addEventListener('click', () => {
    toggleMusic();
    gsap.to('#chap-surprise', {
        opacity: 0,
        duration: 2,
        onComplete: () => {
            document.getElementById('chap-surprise').classList.add('hidden');
            document.getElementById('chap-hero').classList.remove('hidden');
            initScrollEffects();
        }
    });
});


/* =========================================
   SCROLL EFFECTS (Lenis & GSAP & AOS)
   ========================================= */
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

function initScrollEffects() {
    AOS.init({ duration: 1000, once: true });
    
    // Parallax on Background
    gsap.to('.aurora', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });
}


/* =========================================
   CHAPTER 3: OUR STORY
   ========================================= */
const memories = [
    { date: "Day 1", title: "When We Met", desc: "The start of something beautiful.", img: "assets/images/photo2.jpg" },
    { date: "First Date", title: "Butterflies", desc: "I couldn't stop smiling.", img: "assets/images/photo3.jpg" },
    { date: "Our Adventure", title: "Lost Together", desc: "Every moment with you is an adventure.", img: "assets/images/photo4.jpg" },
    { date: "Cozy Days", title: "Just Us", desc: "My favorite place is right beside you.", img: "assets/images/photo5.jpg" }
];

const timelineContainer = document.querySelector('.timeline');
memories.forEach((mem, index) => {
    timelineContainer.innerHTML += `
        <div class="timeline-item" data-aos="${index % 2 === 0 ? 'fade-right' : 'fade-left'}">
            <div class="timeline-content glass-card">
                <img src="${mem.img}" alt="${mem.title}">
                <p class="timeline-date">${mem.date}</p>
                <h3 class="timeline-title">${mem.title}</h3>
                <p class="text-light">${mem.desc}</p>
            </div>
        </div>
    `;
});


/* =========================================
   CHAPTER 4: GALLERY (LightGallery)
   ========================================= */
const galleryContainer = document.getElementById('lightgallery');
// Add photos 6 to 14
for (let i = 6; i <= 14; i++) {
    galleryContainer.innerHTML += `
        <a href="assets/images/photo${i}.jpg" class="gallery-item" data-aos="fade-up">
            <img src="assets/images/photo${i}.jpg" alt="Memory ${i}">
            <div class="gallery-overlay"></div>
        </a>
    `;
}
lightGallery(galleryContainer, {
    speed: 500,
    download: false
});


/* =========================================
   CHAPTER 5: REASONS I LOVE YOU
   ========================================= */
const reasons = [
    { icon: "💙", text: "Your smile" },
    { icon: "🌙", text: "Your kindness" },
    { icon: "✨", text: "Your laugh" },
    { icon: "🌊", text: "Your support" },
    { icon: "🦋", text: "Your heart" },
    { icon: "💎", text: "Everything about you" }
];
const reasonsGrid = document.querySelector('.reasons-grid');
reasons.forEach((r, i) => {
    reasonsGrid.innerHTML += `
        <div class="reason-card glass-card" data-aos="zoom-in" data-aos-delay="${i * 100}">
            <span class="reason-icon">${r.icon}</span>
            <p class="reason-text">${r.text}</p>
        </div>
    `;
});


/* =========================================
   CHAPTER 6: LOVE LETTER
   ========================================= */
let envelopeOpened = false;
window.openEnvelope = function() {
    if(envelopeOpened) return;
    envelopeOpened = true;
    document.getElementById('envelope').classList.add('open');
    document.getElementById('envelope-instruction').classList.add('hidden');
    
    setTimeout(() => {
        new Typed('#typed-letter', {
            strings: [
                `My dearest ${girlfriendName},<br><br>
                Every day with you feels like a dream I never want to wake up from.<br>
                You bring so much light into my world. Thank you for being exactly who you are.<br><br>
                I love you more than words can say.<br><br>
                Yours, ${yourName}`
            ],
            typeSpeed: 40,
            showCursor: false
        });
    }, 1200);
}


/* =========================================
   CHAPTER 7: TIMER
   ========================================= */
function updateTimer() {
    const start = new Date(relationshipStartDate).getTime();
    const now = new Date().getTime();
    
    if (isNaN(start)) return;
    
    let diff = now - start;
    if (diff < 0) diff = 0; // future date check
    
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30.436875;
    const year = day * 365.25;
    
    const y = Math.floor(diff / year);
    const m = Math.floor((diff % year) / month);
    const d = Math.floor((diff % month) / day);
    const h = Math.floor((diff % day) / hour);
    const min = Math.floor((diff % hour) / minute);
    const s = Math.floor((diff % minute) / second);
    
    document.getElementById('t-years').innerText = y;
    document.getElementById('t-months').innerText = m;
    document.getElementById('t-days').innerText = d;
    document.getElementById('t-hours').innerText = h;
    document.getElementById('t-mins').innerText = min;
    document.getElementById('t-secs').innerText = s;
}
setInterval(updateTimer, 1000);
updateTimer();


/* =========================================
   CHAPTER 8: HIDDEN MESSAGES
   ========================================= */
const hiddenMessages = [
    "You are my favorite notification.",
    "I still get butterflies.",
    "My safe place is in your arms.",
    "You make my heart smile.",
    "Forever isn't long enough.",
    "I love the way you look at me.",
    "You are my greatest adventure.",
    "Lucky to have you.",
    "I love you more today than yesterday.",
    "You are my sunshine.",
    "My heart is full because of you.",
    "I'd choose you in every lifetime."
];
const hiddenContainer = document.getElementById('hidden-messages-container');
hiddenMessages.forEach((msg, i) => {
    let star = document.createElement('div');
    star.className = 'hidden-star';
    star.style.top = `${Math.random() * 80 + 10}%`;
    star.style.left = `${Math.random() * 80 + 10}%`;
    star.onclick = () => openModal(msg);
    hiddenContainer.appendChild(star);
});

function openModal(text) {
    document.getElementById('modal-text').innerText = text;
    document.getElementById('note-modal').classList.remove('hidden');
}
window.closeModal = function() {
    document.getElementById('note-modal').classList.add('hidden');
}


/* =========================================
   CHAPTER 9: WISH UPON A STAR
   ========================================= */
let heartDrawn = false;
ScrollTrigger.create({
    trigger: "#chap-star",
    start: "top center",
    onEnter: () => {
        if(heartDrawn) return;
        heartDrawn = true;
        
        new Typed('#typed-wish', {
            strings: [
                "If someone asked me...^1000",
                "What happiness looks like...^1000",
                "I would simply show them you.^1000<br><br>I love you."
            ],
            typeSpeed: 60,
            showCursor: false,
            onComplete: () => {
                document.getElementById('heart-svg').classList.remove('hidden');
                gsap.to('.draw-path', {
                    strokeDashoffset: 0,
                    duration: 3,
                    ease: "power2.inOut",
                    onComplete: () => {
                        let nameReveal = document.getElementById('her-name-reveal');
                        nameReveal.classList.remove('hidden');
                        gsap.to(nameReveal, { opacity: 1, duration: 2, delay: 0.5 });
                    }
                });
            }
        });
    }
});


/* =========================================
   CHAPTER 10: FINALE
   ========================================= */
ScrollTrigger.create({
    trigger: "#chap-finale",
    start: "top center",
    onEnter: () => {
        let duration = 3 * 1000;
        let end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#1E5EFF', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#1E5EFF', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
});

document.getElementById('btn-replay').addEventListener('click', () => {
    lenis.scrollTo('#chap-hero');
});
