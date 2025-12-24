// Fungsi untuk mengelola tema
const themeToggleBtn = document.getElementById("themeToggle");
const stickyContact = document.getElementById("stickyContact");
const cursorDot = document.querySelector(".cursor-dot");

// Dapatkan elemen gambar profil untuk Parallax
const profileImage = document.getElementById("profileImage");

// Bootstrap Icons
const themeIconDark = '<i class="bi bi-moon-stars-fill"></i>';
const themeIconLight = '<i class="bi bi-sun-fill"></i>';

// Flag untuk menonaktifkan parallax jika scrollytelling aktif
let isScrollytellingActive = false;

// 1. Fungsi untuk mengatur tema
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML =
      theme === "light" ? themeIconDark : themeIconLight;
  }
}

// 2. Terapkan tema saat halaman dimuat (Logika Initial Load)
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

let initialTheme = "dark";

if (savedTheme) {
  initialTheme = savedTheme;
} else if (!systemPrefersDark) {
  initialTheme = "light";
}

document.documentElement.setAttribute("data-theme", initialTheme);

// --- 8. LOGIKA FILTER SKILLS DAN CERTIFICATIONS ---
function setupFilters(filterContainerId, itemClass) {
  const container = document.getElementById(filterContainerId);
  if (!container) return;

  const buttons = container.querySelectorAll("button");
  const items = document.querySelectorAll(`.${itemClass}`);

  const filterItems = (filter) => {
    items.forEach((item) => {
      const category = item.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        item.style.position = "relative";
        setTimeout(() => {
          item.classList.remove("hidden-item");
        }, 20);
      } else {
        item.classList.add("hidden-item");
      }
    });
    AOS.refresh();
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      filterItems(filter);
    });
  });
}

// --- 9. LOGIKA TABS (Experience & Education) ---
function setupTabs() {
  const tabContainer = document.querySelector("#experience-section");
  if (!tabContainer) return;

  const tabButtons = tabContainer.querySelectorAll(".tab-buttons button");
  const tabPanels = tabContainer.querySelectorAll(".tab-content-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabTargetId = button.getAttribute("data-tab"); // cth: "experience"
      const targetPanel = document.getElementById(`tab-${tabTargetId}`); // cth: #tab-experience

      // 1. Ganti tombol aktif
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // 2. Ganti panel aktif
      tabPanels.forEach((panel) => panel.classList.remove("active"));
      if (targetPanel) {
        targetPanel.classList.add("active");
      }

      // 3. Refresh AOS agar animasi di panel baru ter-trigger
      AOS.refresh();
    });
  });
}

// --- 11. LOGIKA CUSTOM CURSOR (VERSI MORPHING - DIPERBAIKI) ---
function setupCustomCursor() {
  // Cek jika di perangkat mobile atau cursorDot tidak ada
  if (window.matchMedia("(max-width: 768px)").matches || !cursorDot) return;

  // Simpan posisi mouse
  let mouseX = 0;
  let mouseY = 0;

  // Simpan status kursor
  let isMorphed = false;

  /*
    PERBAIKAN SELEKTOR:
    Hanya elemen-elemen ini yang akan memicu morphing.
  */
  const interactiveElements = document.querySelectorAll(
    "#themeToggle, #scrollToggle, a.btn-primary, .contact-icon"
  );

  // 1. Event listener untuk mousemove (menggerakkan kursor)
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMorphed) {
      // Gerakan instan (karena 'transform' sudah dihapus dari transisi .cursor-dot)
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      cursorDot.style.opacity = "1";
    }
  });

  // 2. Loop setiap elemen interaktif
  interactiveElements.forEach((el) => {
    // Saat mouse MASUK ke elemen
    el.addEventListener("mouseenter", () => {
      isMorphed = true; // Set status: sedang berubah bentuk

      /*
        PERBAIKAN DELAY:
        Tambahkan kelas 'is-hovering' untuk mengaktifkan
        transisi 'transform' secara mulus.
      */
      cursorDot.classList.add("is-hovering");

      // Ambil ukuran dan posisi elemen target
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const borderRadius = style.borderRadius;

      // Terapkan style elemen target ke kursor dot
      cursorDot.style.width = `${rect.width}px`;
      cursorDot.style.height = `${rect.height}px`;
      cursorDot.style.borderRadius = borderRadius;
      cursorDot.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
      cursorDot.style.opacity = "0.4";
      cursorDot.style.backgroundColor = "var(--primary-color)";
    });

    // Saat mouse KELUAR dari elemen
    el.addEventListener("mouseleave", () => {
      isMorphed = false; // Set status: kembali normal

      /*
        PERBAIKAN DELAY:
        Hapus kelas 'is-hovering' agar transisi 'transform' mati
        dan kursor dot bisa bergerak instan lagi.
      */
      cursorDot.classList.remove("is-hovering");

      // Kembalikan style kursor ke bentuk dot
      cursorDot.style.width = "8px";
      cursorDot.style.height = "8px";
      cursorDot.style.borderRadius = "50%";
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      cursorDot.style.opacity = "1";
      cursorDot.style.backgroundColor = "var(--primary-color)";
    });
  });

  // 3. Event listener untuk menyembunyikan kursor (di modal/preloader)
  document.addEventListener("mouseover", (e) => {
    if (
      e.target.closest("#pdfModal.visible") ||
      e.target.closest("#preloader:not(.fade-out)")
    ) {
      cursorDot.classList.add("hidden");
    } else {
      cursorDot.classList.remove("hidden");
    }
  });
}

// --- 12. LOGIKA FOOTER (BACK TO TOP) ---
function setupFooterScroll() {
  const backToTopButton = document.getElementById("back-to-top");
  if (!backToTopButton) return;

  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    const targetElement = document.getElementById("welcome-section");

    if (targetElement) {
      window.scrollTo({
        top: 0, // Selalu ke paling atas
        behavior: "smooth",
      });
    }
  });
}

// --- 13. LOGIKA TERMINAL INTERAKTIF ---
function setupTerminal() {
  const terminalBody = document.getElementById("terminal-body");
  const terminalOutput = document.getElementById("terminal-output");
  const terminalInput = document.getElementById("terminal-input");

  // ▼▼▼ CEK MOBILE DI SINI ▼▼▼
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (!terminalInput) return; // Hentikan jika elemen tidak ada

  // 1. Fokus ke input saat terminal diklik
  terminalBody.addEventListener("click", () => {
    terminalInput.focus();
  });

  // 2. Selalu fokus ke input saat halaman dimuat
  terminalInput.focus();

  // 3. Menangani input perintah
  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = terminalInput.value.trim();

      if (command === "") return; // Jangan lakukan apa-apa jika kosong

      // Tampilkan perintah yang diketik
      const prompt = `<span class="prompt">arvin@portfolio:~$</span>`;
      const commandDisplay = `<div class="terminal-command">${prompt} ${command}</div>`;
      terminalOutput.innerHTML += commandDisplay;

      // Proses perintah
      processCommand(command);

      // Bersihkan input
      terminalInput.value = "";

      // Selalu scroll ke bawah
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  // 4. Fungsi untuk memproses perintah
  function processCommand(command) {
    let response = "";
    const cmd = command.toLowerCase();

    switch (cmd) {
      case "help":
        // ▼▼▼ PERINTAH 'HELP' DIPERBARUI ▼▼▼
        let helpCommands = `
Available commands:
  <span style="color: var(--primary-color)">about</span>     - See my brief bio.
  <span style="color: var(--primary-color)">skills</span>    - List my key technologies.
  <span style="color: var(--primary-color)">contact</span>   - Show contact links.`;

        // Hanya tampilkan 'secret' di desktop
        if (!isMobile) {
          helpCommands += `
  <span style="color: var(--primary-color)">secret</span>    - ???`;
        }

        helpCommands += `
  <span style="color: var(--primary-color)">clear</span>     - Clear the terminal screen.
        `;
        response = helpCommands;
        break;

      case "about":
        response = `
Saya Arvin Ramdhan Fakhrudin, seorang mahasiswa Teknik Informatika
di Ma'soem University dengan keahlian hybrid: menggabungkan
pemahaman sistem mendalam dari IT Support dengan keterampilan
teknis dalam membangun antarmuka web modern.
        `;
        break;

      case "skills":
        response = `
Fetching skills...

- IT Operations: Troubleshooting, Hardware Support, Network Basics, Windows & Linux
- Front-End:     JavaScript, HTML, CSS, Web Development
- Fundamentals:  C, Object-Oriented Programming (OOP), Git & GitHub
        `;
        break;

      // Perintah 'projects' sudah dihapus

      case "contact":
        response = `
Connect with me:
  - LinkedIn: <a href="https://www.linkedin.com/in/arvin-ramdhan-fakhrudin" target="_blank">linkedin.com/in/arvin-ramdhan-fakhrudin</a>
  - GitHub:   <a href="https://github.com/ARVIN1006" target="_blank">github.com/ARVIN1006</a>
  - Email:    <a href="mailto:arvinramdhan1006@gmail.com">arvinramdhan1006@gmail.com</a>
  - WhatsApp: <a href="https://wa.me/6282127666523" target="_blank">+62 821-2766-6523</a>
        `;
        break;

      // ▼▼▼ PERINTAH 'SECRET' DIPERBARUI ▼▼▼
      case "secret":
        if (!isMobile) {
          // Hanya berfungsi di desktop
          response = `
Hmm, looking for secrets? 
I'm a classic gamer. Try this cheat code on the main page:
↑ ↑ ↓ ↓ ← → ← → B A
          `;
          break; // Penting: break di dalam if
        }
      // Jika mobile, biarkan jatuh ke 'default'

      case "clear":
        terminalOutput.innerHTML = "";
        return; // Hentikan agar tidak menambahkan div kosong

      default:
        response = `bash: command not found: ${command}
Type 'help' for a list of commands.`;
        break;
    }

    // Tambahkan respons ke output dengan error handling
    try {
      const responseElement = `<div class="terminal-response">${response}</div>`;
      terminalOutput.innerHTML += responseElement;
    } catch (error) {
      console.error("Error displaying terminal response:", error);
      terminalOutput.innerHTML += `<div class="terminal-response" style="color: #ff5f56;">Error: Failed to display response.</div>`;
    }
  }
}

// --- 14. LOGIKA KODE KONAMI (DESKTOP) ---
function setupKonamiCode() {
  // Array sudah dalam lowercase
  const konamiCode = [
    "arrowup",
    "arrowup",
    "arrowdown",
    "arrowdown",
    "arrowleft",
    "arrowright",
    "arrowleft",
    "arrowright",
    "b",
    "a",
  ];
  let konamiIndex = 0;

  document.addEventListener("keydown", (e) => {
    // Abaikan jika sedang mengetik di terminal
    if (document.activeElement.id === "terminal-input") return;

    const requiredKey = konamiCode[konamiIndex];
    const keyPressed = e.key.toLowerCase();

    // Cek jika tombol yang ditekan cocok dengan urutan
    if (keyPressed === requiredKey) {
      konamiIndex++; // Maju ke tombol berikutnya

      // Jika semua urutan benar
      if (konamiIndex === konamiCode.length) {
        triggerMatrixEffect(); // Jalankan efek!
        konamiIndex = 0; // Reset
      }
    } else {
      konamiIndex = 0; // Urutan salah, reset
      // Cek jika tombol yg salah adalah tombol pertama (untuk memulai ulang)
      if (keyPressed === konamiCode[0]) {
        konamiIndex = 1;
      }
    }
  });
}

// --- 15. FUNGSI EFEK MATRIX ---
function triggerMatrixEffect() {
  const canvas = document.getElementById("matrix-canvas");
  if (!canvas) return;

  // Mencegah trigger berulang jika efek sedang berjalan
  if (canvas.style.display === "block") return;

  const ctx = canvas.getContext("2d");

  // Set kanvas menjadi fullscreen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Tampilkan kanvas dengan fade-in
  canvas.style.display = "block";
  setTimeout(() => {
    canvas.style.opacity = "1";
  }, 10); // delay 10ms agar transisi berjalan

  // Karakter untuk hujan digital
  const katakana =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
  const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const alphabet = katakana + latin + nums;

  const fontSize = 16;
  const columns = canvas.width / fontSize;

  // Array untuk melacak posisi 'drop' di setiap kolom
  const drops = [];
  for (let x = 0; x < columns; x++) {
    drops[x] = 1;
  }

  let matrixInterval;

  function drawMatrix() {
    // Latar belakang hitam semi-transparan untuk efek 'fade'
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0"; // Warna hijau Matrix
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      // Reset 'drop' ke atas jika sudah melewati layar
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++; // Gerakkan 'drop' ke bawah
    }
  }

  // Mulai animasi
  matrixInterval = setInterval(drawMatrix, 33); // ~30 FPS

  // Hentikan efek setelah 5 detik
  setTimeout(() => {
    clearInterval(matrixInterval); // Hentikan animasi
    canvas.style.opacity = "0"; // Mulai fade-out

    // Tampilkan pesan
    alert(
      "System access granted... Just kidding. Thanks for checking out my code. - Arvin"
    );

    // Sembunyikan kanvas setelah transisi fade-out selesai (0.5s)
    setTimeout(() => {
      canvas.style.display = "none";
    }, 500);
  }, 5000); // Durasi efek: 5 detik
}

// --- 16. LOGIKA SCROLLYTELLING ---
function setupScrollytelling() {
  const triggers = document.querySelectorAll(
    ".scrolly-text [data-image-trigger]"
  );
  const items = document.querySelectorAll(".scrolly-item");

  // Matikan fitur ini di mobile
  if (window.matchMedia("(max-width: 768px)").matches) {
    isScrollytellingActive = false;
    return;
  }

  if (triggers.length === 0 || items.length === 0) return;

  // Set flag ini untuk menonaktifkan parallax lama
  isScrollytellingActive = true;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const imageName = entry.target.getAttribute("data-image-trigger");

          // Deactivate all items
          items.forEach((item) => item.classList.remove("active"));

          // Activate the target item
          const targetItem = document.querySelector(
            `.scrolly-item[data-image="${imageName}"]`
          );
          if (targetItem) {
            targetItem.classList.add("active");
          }
        }
      });
    },
    {
      threshold: 0.5, // 50% dari paragraf harus terlihat
      rootMargin: "-40% 0px -40% 0px", // Hanya trigger di area tengah layar
    }
  );

  triggers.forEach((trigger) => observer.observe(trigger));
}

// --- 17. FUNGSI KODE KONAMI MOBILE (DIHAPUS) ---
// Fungsi setupKonamiCodeMobile() sudah dihapus

// === EVENT LISTENER UTAMA ===
document.addEventListener("DOMContentLoaded", () => {
  // --- INISIALISASI AOS ---
  AOS.init({
    once: true,
    disable: "phone",
  });

  // Panggil setup filters setelah DOM siap
  setupFilters("skillFilters", "skill-pill");
  // setupFilters("certFilters", "cert-card") dipindahkan ke loadPortfolioData() setelah data dimuat

  // Panggil setup TABS
  setupTabs();

  // Setup Custom Cursor (Versi Morphing)
  setupCustomCursor();

  // Panggil fungsi Footer baru
  setupFooterScroll();

  // Panggil fungsi Terminal baru
  setupTerminal();

  // Panggil fungsi Kode Konami
  setupKonamiCode(); // Hanya untuk desktop
  // Panggilan ke setupKonamiCodeMobile() sudah dihapus

  // Panggil fungsi Scrollytelling
  setupScrollytelling();

  // --- DEFINISI ELEMEN GLOBAL ---
  const preloader = document.getElementById("preloader");
  const scrollToggleButton = document.getElementById("scrollToggle");
  const body = document.body;

  const iconScrollDown = '<i class="bi bi-chevron-bar-down"></i>';
  const iconScrollUp = '<i class="bi bi-chevron-bar-up"></i>';

  // --- LOGIKA THEME TOGGLE (lanjutan) ---
  setTheme(document.documentElement.getAttribute("data-theme"));

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      let currentTheme = document.documentElement.getAttribute("data-theme");
      let newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }

  // === LOGIKA MODAL PDF ===
  const modal = document.getElementById("pdfModal");
  const closeModalBtn = modal.querySelector(".close-modal");
  const pdfFrame = document.getElementById("pdfFrame");
  const pdfLinks = document.querySelectorAll(".open-pdf-modal");

  const pdfLoader = document.getElementById("pdfLoader");

  function openModal(pdfUrl) {
    try {
      // Reset state
      pdfFrame.style.display = "none";
      pdfFrame.classList.remove("loaded");
      pdfLoader.classList.remove("hidden");

      modal.classList.add("visible");
      body.classList.add("modal-open");
      if (cursorDot) cursorDot.classList.add("hidden");

      // Set source dan handle loading
      pdfFrame.src = pdfUrl;

      // Show loader saat PDF sedang dimuat
      pdfLoader.style.display = "flex";

      // Handle PDF load success
      pdfFrame.onload = function () {
        pdfLoader.classList.add("hidden");
        pdfFrame.style.display = "block";
        setTimeout(() => {
          pdfFrame.classList.add("loaded");
        }, 50);
      };

      // Error handling untuk PDF loading
      pdfFrame.onerror = function () {
        console.error("Failed to load PDF:", pdfUrl);
        pdfLoader.classList.add("hidden");
        alert(
          "Maaf, dokumen PDF tidak dapat dimuat. Silakan coba lagi atau hubungi saya langsung."
        );
        closeModal();
      };
    } catch (error) {
      console.error("Error opening modal:", error);
      pdfLoader.classList.add("hidden");
      alert("Terjadi kesalahan saat membuka dokumen. Silakan coba lagi.");
    }
  }

  function closeModal() {
    modal.classList.remove("visible");
    body.classList.remove("modal-open");
    pdfFrame.src = "";
    pdfFrame.style.display = "none";
    pdfFrame.classList.remove("loaded");
    pdfLoader.classList.remove("hidden");
    if (cursorDot) cursorDot.classList.remove("hidden");
  }

  pdfLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pdfUrl = link.getAttribute("href");
      if (pdfUrl && pdfUrl.trim() !== "") {
        openModal(pdfUrl);
      } else {
        console.error("PDF URL is missing or empty");
        alert(
          "Link PDF tidak valid. Silakan hubungi saya untuk mendapatkan dokumen."
        );
      }
    });
  });
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // === LOGIKA WAYPOINTS & INITIAL LOAD ===
  let waypoints = [];
  const connectSection = document.getElementById("connect-section");
  const aboutSection = document.getElementById("about-section");

  function calculateWaypoints() {
    const scrollSections = document.querySelectorAll(
      "#welcome-section, .content-section, footer"
    );

    waypoints = [];
    scrollSections.forEach((sec) => {
      waypoints.push(sec.offsetTop);
    });
  }

  // --- 18. FUNGSI LOAD DATA DARI JSON (CMS SUPPORT) ---
  async function loadPortfolioData() {
    try {
      const response = await fetch("data/content.json");
      if (!response.ok) throw new Error("Gagal mengambil data portfolio");
      const data = await response.json();

      // Render Experience
      const experienceContainer = document.getElementById("tab-experience");
      if (experienceContainer && data.experience) {
        experienceContainer.innerHTML = data.experience
          .map(
            (exp, index) => `
            <div
              class="education-entry"
              data-aos="fade-right"
              data-aos-duration="800"
              data-aos-delay="${200 + index * 100}"
            >
              <h3>${exp.institution}</h3>
              <span class="degree">${exp.role}</span>
              ${exp.description ? `<p>${exp.description}</p>` : ""}
            </div>
          `
          )
          .join("");
      }

      // Render Education
      const educationContainer = document.getElementById("tab-education");
      if (educationContainer && data.education) {
        educationContainer.innerHTML = data.education
          .map(
            (edu, index) => `
            <div
              class="education-entry"
              data-aos="fade-right"
              data-aos-duration="800"
              data-aos-delay="${200 + index * 100}"
            >
              <h3>${edu.institution}</h3>
              <span class="degree">${edu.role}</span>
            </div>
          `
          )
          .join("");
      }

      // Render Projects
      const projectContainer = document.getElementById("projectGrid");
      if (projectContainer && data.projects) {
        projectContainer.innerHTML = data.projects
          .map(
            (project) => `
            <div
              class="bento-card span-2"
              data-aos="fade-up"
              data-aos-duration="800"
            >
              <h3><i class="bi ${project.icon}"></i> ${project.title}</h3>
              <p>${project.description}</p>
              <div
                style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;"
              >
                ${
                  project.demoLink
                    ? `<a
                  href="${project.demoLink}"
                  target="_blank"
                  class="btn-primary"
                  style="margin-top: 0; padding: 10px 20px; display: flex; align-items: center; gap: 8px;"
                >
                  <i class="bi bi-rocket-takeoff-fill"></i> Live Demo
                </a>`
                    : ""
                }
                ${
                  project.repoLink
                    ? `<a
                  href="${project.repoLink}"
                  target="_blank"
                  class="btn-primary"
                  style="
                    margin-top: 0; 
                    padding: 10px 20px; 
                    display: flex; 
                    align-items: center; 
                    gap: 8px;
                    background-color: transparent; 
                    border: 2px solid var(--primary-color); 
                    color: var(--primary-color);
                  "
                  onmouseover="this.style.backgroundColor='var(--primary-color)'; this.style.color='var(--card-background)';"
                  onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--primary-color)';"
                >
                  <i class="bi bi-github"></i> Repository
                </a>`
                    : ""
                }
              </div>
            </div>
          `
          )
          .join("");
      }

      // Render Certificates
      const certContainer = document.getElementById("certGrid");
      if (certContainer && data.certifications) {
        certContainer.innerHTML = data.certifications
          .map(
            (cert, index) => `
            <div
              class="cert-card"
              data-category="${cert.type}"
              data-aos="zoom-in"
              data-aos-duration="600"
              data-aos-delay="${600 + index * 100}"
            >
              <h3>${cert.title}</h3>
              <p>${cert.issuer}</p>
              <a
                href="${cert.link}"
                ${cert.isPdf ? "" : 'target="_blank"'}
                class="cert-link ${cert.isPdf ? "open-pdf-modal" : ""}"
              >
                ${cert.isPdf ? "Lihat Sertifikat" : "Lihat Kredensial"} &rarr;
              </a>
            </div>
          `
          )
          .join("");

        // Re-attach filters listener because new elements were added
        setupFilters("certFilters", "cert-card");

        // Re-attach PDF modal listeners
        const newPdfLinks = document.querySelectorAll(".open-pdf-modal");
        newPdfLinks.forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const pdfUrl = link.getAttribute("href");
            if (pdfUrl && pdfUrl.trim() !== "") {
              openModal(pdfUrl);
            } else {
              console.error("PDF URL is missing or empty");
              alert("Link PDF tidak valid.");
            }
          });
        });
      }

      // Refresh AOS
      setTimeout(() => AOS.refresh(), 500);
    } catch (error) {
      console.error("Error loading portfolio data:", error);
    }
  }

  // --- INITIAL LOAD & RESIZE ---
  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    setTimeout(() => preloader.classList.add("fade-out"), 1200);
    calculateWaypoints();

    // Load data dynamically
    loadPortfolioData();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateWaypoints, 300);
    });
  });

  // === Logika Klik Tombol Scroll ===
  scrollToggleButton.addEventListener("click", () => {
    const isScrollUpButton =
      scrollToggleButton.innerHTML.includes("bi-chevron-bar-up");

    if (isScrollUpButton) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      const currentY = Math.round(window.scrollY);
      let currentSectionIndex = 0;

      for (let i = waypoints.length - 1; i >= 0; i--) {
        if (currentY >= waypoints[i] - 50) {
          currentSectionIndex = i;
          break;
        }
      }

      let targetIndex = currentSectionIndex + 1;

      if (targetIndex < waypoints.length) {
        const targetY = waypoints[targetIndex];
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }
    }
  });

  // === LOGIKA STICKY CONTACT VISIBILITY ===
  function updateStickyContactVisibility() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    const startPoint = aboutSection
      ? aboutSection.offsetTop - viewportHeight / 3
      : 1000;
    const endPoint = connectSection
      ? connectSection.offsetTop - viewportHeight / 2
      : document.body.scrollHeight;

    if (scrollY > startPoint && scrollY < endPoint) {
      stickyContact.classList.add("visible");
    } else {
      stickyContact.classList.remove("visible");
    }
  }

  // === Logika Event Listener Scroll (Termasuk tombol scroll & Parallax) ===
  let isScrolling;
  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;

    // LOGIKA PARALLAX LAMA (DIMODIFIKASI)
    // Hanya jalankan parallax jika scrollytelling TIDAK aktif
    if (
      profileImage &&
      !window.matchMedia("(max-width: 768px)").matches &&
      !isScrollytellingActive
    ) {
      const depth = 0.05;
      const offset = currentY * depth;
      profileImage.style.transform = `translateY(${offset}px)`;
    }

    // Throttle scroll logic (Logika Scroll Toggle dan Sticky Contact)
    if (isScrolling) return;

    isScrolling = true;
    setTimeout(() => {
      const pageHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;

      const hideThreshold = pageHeight - viewportHeight * 1.5;

      const isAtBottom = currentY + viewportHeight >= pageHeight - 50;
      const isNearEnd = currentY > hideThreshold;

      // Update Ikon Scroll Down/Up
      if (isAtBottom) {
        scrollToggleButton.innerHTML = iconScrollUp;
        scrollToggleButton.setAttribute("aria-label", "Gulir ke Atas");
      } else {
        scrollToggleButton.innerHTML = iconScrollDown;
        scrollToggleButton.setAttribute(
          "aria-label",
          "Gulir ke Konten Berikutnya"
        );
      }

      // Sembunyikan scrollToggle jika dekat bagian akhir/footer
      scrollToggleButton.style.opacity = isNearEnd ? "0" : "1";
      scrollToggleButton.style.pointerEvents = isNearEnd ? "none" : "auto";

      // Update visibility Sticky Contact
      updateStickyContactVisibility();

      isScrolling = false;
    }, 100);
  });

  // Initial call untuk contact button
  updateStickyContactVisibility();

  // === LOGIKA BREADCRUMB NAVIGATION ===
  const breadcrumbNav = document.querySelector(".breadcrumb-nav");
  const currentSectionElement = document.getElementById("currentSection");

  const sectionMap = {
    "about-section": "About",
    "why-me-section": "Value Proposition",
    "experience-section": "Experience",
    "certs-section": "Certifications",
    "connect-section": "Contact",
  };

  function updateBreadcrumb() {
    if (!breadcrumbNav || !currentSectionElement) return;

    const scrollY = window.scrollY + 200; // Offset untuk menentukan section aktif
    const sections = Object.keys(sectionMap);

    let activeSection = "about-section";

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && scrollY >= section.offsetTop) {
        activeSection = sections[i];
        break;
      }
    }

    // Update breadcrumb text
    currentSectionElement.textContent = sectionMap[activeSection] || "About";

    // Show breadcrumb setelah scroll dari welcome section
    if (scrollY > window.innerHeight * 0.5) {
      breadcrumbNav.classList.add("visible");
    } else {
      breadcrumbNav.classList.remove("visible");
    }
  }

  // Update breadcrumb saat scroll
  window.addEventListener("scroll", () => {
    updateBreadcrumb();
  });

  // Initial update
  updateBreadcrumb();
});
