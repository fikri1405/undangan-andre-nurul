// Final Version: Menggabungkan Buka Undangan, Musik, Salin Rekening, Countdown Timer, dan Navigasi Halaman

document.addEventListener('DOMContentLoaded', () => {
    
    // === [EDIT BARU] Ambil Nama Tamu dari URL ===
    try {
        // 1. Buat objek URLSearchParams dari URL saat ini
        const urlParams = new URLSearchParams(window.location.search);
        
        // 2. Ambil parameter 'to' (contoh: ...index.html?to=Budi)
        // 'to' adalah key-nya, 'Budi' adalah value-nya
        const namaTamu = urlParams.get('to'); 
        
        // 3. Cek jika parameter 'to' ada isinya
        if (namaTamu) {
            // 4. Temukan elemen H1 berdasarkan ID yang tadi kita tambahkan
            const namaTamuElement = document.getElementById('nama-tamu-placeholder');
            
            // 5. Jika elemennya ketemu, ganti teksnya
            if (namaTamuElement) {
                // Menggunakan .textContent itu lebih aman daripada .innerHTML
                // Ini akan otomatis mengganti '[Nama Tamu Undangan]'
                namaTamuElement.textContent = namaTamu; 
            }
        }
    } catch (error) {
        // Jaga-jaga jika ada error, tapi seharusnya aman
        console.warn("Gagal memproses nama tamu dari URL:", error);
    }
    // === [AKHIR EDIT BARU] ===


    // === Seleksi Elemen Utama ===
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const music = document.getElementById('bg-music');
    const openBtn = document.getElementById('open-invitation-btn');
    const copyBtn = document.querySelector('.btn-copy-rek');

    // === SELEKSI ELEMEN NAVIGASI HALAMAN ===
    const navContainer = document.getElementById('page-navigation');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageIndicator = document.getElementById('page-indicator');
    const pages = document.querySelectorAll('.page'); // Mengambil semua halaman
    let currentPageIndex = 0; // Melacak halaman aktif
    
    // === 1. Fungsionalitas Buka Undangan & Putar Musik ===
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            if (splashScreen) {
                // Efek fade out untuk splash screen
                splashScreen.style.transition = 'opacity 0.5s ease-out';
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 500); // Sembunyikan setelah transisi selesai
            }
            
            if (mainContent) {
                mainContent.style.display = 'block'; // Tampilkan container utama
            }
            
            // Tampilkan halaman pertama
            showPage(0); 
            
            // Tampilkan navigasi
            if (navContainer) {
                navContainer.style.display = 'flex';
            }

            if (music) {
                music.play().catch(error => {
                    console.error("Gagal memutar musik:", error);
                    // Jika gagal, bisa tampilkan tombol play/pause terpisah
                });
            }
            
            // Mulai animasi partikel HANYA setelah undangan dibuka
            // Panggil fungsi initParticles() yang ada di bawah
            setTimeout(initParticles, 500); 
        });
    }

    // === FUNGSI NAVIGASI HALAMAN ===
    function showPage(index) {
        // Sembunyikan semua halaman
        pages.forEach((page) => {
            page.classList.remove('active-page');
        });
        
        // Tampilkan halaman yang dipilih
        if (pages[index]) {
            pages[index].classList.add('active-page');
            currentPageIndex = index;
        }
        
        // Update indikator halaman
        if (pageIndicator) {
            pageIndicator.textContent = `${index + 1} / ${pages.length}`;
        }
        
        // Atur status tombol Prev/Next
        if (prevBtn) {
            prevBtn.disabled = (index === 0);
        }
        if (nextBtn) {
            nextBtn.disabled = (index === pages.length - 1);
        }
        
        // Scroll ke atas halaman setiap ganti halaman
        window.scrollTo(0, 0);
    }
    
    // Event listener untuk tombol Next
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPageIndex < pages.length - 1) {
                showPage(currentPageIndex + 1);
            }
        });
    }

    // Event listener untuk tombol Prev
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPageIndex > 0) {
                showPage(currentPageIndex - 1);
            }
        });
    }


    // === 2. Fungsionalitas Salin Nomor Rekening ===
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const rekElement = document.querySelector('.bank-rek-number');
            // Ambil teks, bersihkan dari <br> dan spasi extra
            const rekText = rekElement.innerText.split('\n')[0].replace(/\s/g, '').trim();

            if (navigator.clipboard) {
                // Gunakan Clipboard API modern
                navigator.clipboard.writeText(rekText).then(() => {
                    // Beri feedback ke user
                    copyBtn.textContent = 'Nomor Tersalin! ✅';
                    setTimeout(() => {
                        copyBtn.textContent = 'Salin Nomor Rekening';
                    }, 3000); // Kembalikan teks setelah 3 detik
                }).catch(err => {
                    console.error('Gagal menyalin teks: ', err);
                });
            } else {
                // Fallback untuk browser lama
                alert("Browser tidak mendukung salin otomatis. Silakan salin manual: " + rekText);
            }
        });
    }

    // === 3. Fungsionalitas Countdown Timer ===
    const countdownTarget = new Date("November 30, 2025 09:00:00").getTime();
    let timerInterval = null; // Definisikan interval di scope luar

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownTarget - now;

        // Fungsi format '09' bukan '9'
        const formatTime = (time) => String(time).padStart(2, '0');

        // Ambil elemen
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

        // Hitung waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update elemen
        if (daysEl) daysEl.textContent = formatTime(days);
        if (hoursEl) hoursEl.textContent = formatTime(hours);
        if (minutesEl) minutesEl.textContent = formatTime(minutes);
        if (secondsEl) secondsEl.textContent = formatTime(seconds);
    }
    
    // Hanya jalankan countdown jika elemennya ada
    if(document.getElementById("countdown-display")) {
        timerInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Panggil sekali saat load
    }
    
    // ==============================================
    // === 4. FUNGSI ANIMASI PARTIKEL (BARU) ===
    // ==============================================
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
            y: Math.random() * canvas.height - canvas.height, // Mulai dari atas layar
            size: Math.random() * 2 + 1, // Ukuran 1px - 3px
            speed: Math.random() * 1 + 0.5, // Kecepatan jatuh
            opacity: Math.random() * 0.5 + 0.3 // Opacity acak
        };
    }

    // Fungsi untuk menggambar partikel
    function drawParticles() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(201, 160, 69, 0.7)'; // Warna Emas (#C9A045)
        
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
        animationFrameId = requestAnimationFrame(animateParticles); // Loop terus menerus
    }

    // Inisialisasi
    function initParticles() {
        if (!canvas || animationFrameId) return; // Jangan jalankan jika sudah berjalan
        
        resizeCanvas();
        particles = []; // Kosongkan array
        
        // Buat 100 partikel
        for (let i = 0; i < 100; i++) {
            particles.push(createParticle());
        }
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Hentikan loop lama jika ada
        }
        animateParticles();
    }
    
    // Sesuaikan canvas jika window di-resize
    window.addEventListener('resize', resizeCanvas);
    
    // Catatan: initParticles() sekarang dipanggil dari dalam event listener 'openBtn'

}); // Penutup dari addEventListener 'DOMContentLoaded'
