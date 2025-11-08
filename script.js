// Final Version SCROLL MODE: Hanya Buka Undangan, Musik, Countdown, dan Partikel

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. Ambil Nama Tamu dari URL ===
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const namaTamu = urlParams.get('to'); 
        if (namaTamu) {
            const namaTamuElement = document.getElementById('nama-tamu-placeholder');
            if (namaTamuElement) {
                namaTamuElement.textContent = namaTamu; 
            }
        }
    } catch (error) {
        console.warn("Gagal memproses nama tamu dari URL:", error);
    }

    // === 2. Seleksi Elemen Utama ===
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const music = document.getElementById('bg-music');
    const openBtn = document.getElementById('open-invitation-btn');

    // === 3. Fungsionalitas Buka Undangan ===
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // Sembunyikan Splash Screen
            if (splashScreen) {
                splashScreen.style.transition = 'opacity 0.5s ease-out';
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 500);
            }
            
            // Tampilkan Konten Utama (Langsung Scroll Mode)
            if (mainContent) {
                mainContent.style.display = 'block';
                // Opsional: Scroll halus sedikit ke bawah agar user tahu bisa di-scroll
                setTimeout(() => {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }, 100);
            }

            // Putar Musik
            if (music) {
                music.play().catch(error => {
                    console.error("Gagal memutar musik otomatis:", error);
                });
            }
            
            // Mulai partikel
            setTimeout(initParticles, 500); 
        });
    }

    // === 4. Countdown Timer ===
    const countdownTarget = new Date("November 30, 2025 09:00:00").getTime();
    let timerInterval = null; 

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownTarget - now;
        const formatTime = (time) => String(time).padStart(2, '0');

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (distance < 0) {
            clearInterval(timerInterval);
            const countdownDisplay = document.getElementById("countdown-display");
            if(countdownDisplay) {
                countdownDisplay.innerHTML = "<h3 class='acara-type' style='color:#C9A045;'>Acara Sedang Berlangsung!</h3>";
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (daysEl) daysEl.textContent = formatTime(days);
        if (hoursEl) hoursEl.textContent = formatTime(hours);
        if (minutesEl) minutesEl.textContent = formatTime(minutes);
        if (secondsEl) secondsEl.textContent = formatTime(seconds);
    }
    
    if(document.getElementById("countdown-display")) {
        timerInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }
    
    // === 5. ANIMASI PARTIKEL ===
    const canvas = document.getElementById('particle-canvas');
    let particles = [];
    let animationFrameId = null;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.3
        };
    }

    function drawParticles() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(201, 160, 69, 0.7)'; 
        
        particles.forEach(p => {
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0; 
    }

    function updateParticles() {
        particles.forEach((p, index) => {
            p.y += p.speed;
            if (p.y > canvas.height) {
                particles[index] = createParticle();
                particles[index].y = -10;
            }
        });
    }

    function animateParticles() {
        drawParticles();
        updateParticles();
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    function initParticles() {
        if (!canvas || animationFrameId) return;
        resizeCanvas();
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(createParticle());
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animateParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);
});
