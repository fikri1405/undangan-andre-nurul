// Final Version SCROLL MODE: Buka Undangan, Musik, Countdown, dan Partikel
// (Logika Salin Rekening sudah dihapus)

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. Ambil Nama Tamu dari URL ===
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const namaTamu = urlParams.get('to'); 
        if (namaTamu) {
            const namaTamuElement = document.getElementById('nama-tamu-placeholder');
            if (namaTamuElement) {
                // Ganti teks placeholder dengan nama tamu dari URL
                namaTamuElement.textContent = namaTamu.replace(/_/g, ' '); // Ganti underscore jadi spasi jika ada
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
                }, 500); // Waktu harus sama dengan durasi transisi
            }
            
            // Tampilkan Konten Utama (Langsung Scroll Mode)
            if (mainContent) {
                mainContent.style.display = 'block';
                // Opsional: Animasi fade-in untuk konten utama
                mainContent.style.animation = 'fadeInMain 1s ease-in-out';
            }

            // Putar Musik
            if (music) {
                music.play().catch(error => {
                    console.error("Gagal memutar musik otomatis:", error);
                    // Browser modern sering memblokir autoplay tanpa interaksi
                });
            }
            
            // Mulai partikel
            setTimeout(initParticles, 500); 
        });
    }

    // Tambahkan keyframe untuk fade-in konten utama (opsional, tapi bagus)
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `@keyframes fadeInMain { from { opacity: 0; } to { opacity: 1; } }`;
    document.head.appendChild(styleSheet);


    // === 4. Countdown Timer ===
    // Pastikan tanggal target sudah benar
    const countdownTarget = new Date("November 30, 2025 09:00:00").getTime();
    let timerInterval = null; 

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownTarget - now;
        const formatTime = (time) => String(time).padStart(2, '0'); // Format '09'

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (distance < 0) {
            // Jika waktu sudah lewat
            clearInterval(timerInterval);
            const countdownDisplay = document.getElementById("countdown-display");
            if(countdownDisplay) {
                countdownDisplay.innerHTML = "<h3 class='acara-type' style='color:#C9A045;'>Acara Sedang Berlangsung!</h3>";
            }
            return;
        }

        // Kalkulasi waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update ke HTML
        if (daysEl) daysEl.textContent = formatTime(days);
        if (hoursEl) hoursEl.textContent = formatTime(hours);
        if (minutesEl) minutesEl.textContent = formatTime(minutes);
        if (secondsEl) secondsEl.textContent = formatTime(seconds);
    }
    
    // Hanya jalankan jika elemen countdown ada
    if(document.getElementById("countdown-display")) {
        timerInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Panggil sekali saat load agar tidak delay 1 detik
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

    // Fungsi untuk membuat satu partikel
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height, // Mulai dari atas
            size: Math.random() * 2 + 1, // Ukuran 1-3px
            speed: Math.random() * 1 + 0.5, // Kecepatan jatuh
            opacity: Math.random() * 0.5 + 0.3 // Transparansi
        };
    }

    // Fungsi untuk menggambar partikel
    function drawParticles() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(201, 160, 69, 0.7)'; // Warna Emas
        
        particles.forEach(p => {
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0; // Reset alpha
    }

    // Fungsi untuk update posisi partikel
    function updateParticles() {
        particles.forEach((p, index) => {
            p.y += p.speed;
            // Jika partikel keluar layar, reset ke atas
            if (p.y > canvas.height) {
                particles[index] = createParticle();
                particles[index].y = -10; // Muncul sedikit di atas
            }
        });
    }

    // Loop Animasi
    function animateParticles() {
        drawParticles();
        updateParticles();
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    // Inisialisasi
    function initParticles() {
        if (!canvas || animationFrameId) return; // Jangan jalankan jika sudah berjalan
        resizeCanvas();
        particles = [];
        // Jumlah partikel
        for (let i = 0; i < 100; i++) {
            particles.push(createParticle());
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animateParticles();
    }
    
    // Sesuaikan canvas jika window di-resize
    window.addEventListener('resize', resizeCanvas);
    
}); // Penutup 'DOMContentLoaded'
