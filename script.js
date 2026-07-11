const app = document.querySelector("#app");
const navButtons = [...document.querySelectorAll("[data-route]")];

//API Backend Config
// Base URL backend Express.
// Backend harus dijalankan di http://localhost:3000
// Semua request API frontend dimulai dari URL ini.
const API_BASE_URL = "http://localhost:3000/api";

const state = {
  route: "beranda",
  selectedHotspot: "CPU",
  studentName: "",
  quizNameConfirmed: false,
  nameWarning: "",
  currentQuestion: 0,
  selectedAnswer: null,
  answers: [],
  lastResult: null,
  apiReady: false,
  apiMessage: "Menghubungkan ke API...",
  apiLeaderboard: [],
  lessonSearch: "",
  selectedLesson: "Proses",
  viewerRotation: 0,
  viewerZoom: 1,
  adminTab: "materi",
  adminEditingId: null,
  adminMessage: "",
  adminError: "",
  adminForm: {
    title: "",
    desc: "",
    file: "",
    modelUrl: "",
    items: "",
  },
  adminQuizEditingId: null,
  adminQuizMessage: "",
  adminQuizError: "",
  adminQuizForm: {
    question: "",
    answers: "",
    correct: "0",
  },
};

let lessons = [
  {
    title: "Input",
    desc: "Perangkat untuk memasukkan data ke komputer.",
    file: "input.glb",
    modelUrl: "/uploads/models/input.glb",
    items: ["Keyboard", "Mouse", "Scanner"],
  },
  {
    title: "Proses",
    desc: "Komponen yang mengolah instruksi dan data.",
    file: "cpu.glb",
    modelUrl: "/uploads/models/cpu.glb",
    items: ["CPU", "RAM", "Motherboard"],
  },
  {
    title: "Output",
    desc: "Perangkat untuk menampilkan hasil pengolahan.",
    file: "output.glb",
    modelUrl: "/uploads/models/output.glb",
    items: ["Monitor", "Printer", "Speaker"],
  },
  {
    title: "Storage",
    desc: "Media penyimpanan data jangka pendek dan panjang.",
    file: "storage.glb",
    modelUrl: "/uploads/models/storage.glb",
    items: ["SSD", "Hard disk", "Flash drive"],
  },
];

const componentDetails = {
  CPU: {
    title: "Detail Komponen CPU",
    subtitle: "CPU adalah pusat pemrosesan instruksi pada komputer.",
    visual: "CPU",
    bullets: [
      "Mengolah instruksi dari program.",
      "Mengatur kerja komponen lain.",
      "Menentukan kecepatan proses komputer.",
    ],
    prompt: "CPU bekerja seperti otak komputer yang membaca instruksi, memproses data, lalu mengirim hasilnya ke komponen lain.",
  },
  RAM: {
    title: "Detail Komponen RAM",
    subtitle: "RAM menyimpan data sementara saat aplikasi sedang berjalan.",
    visual: "RAM",
    bullets: [
      "Menyimpan data sementara.",
      "Membantu aplikasi berjalan lebih cepat.",
      "Data akan hilang saat komputer dimatikan.",
    ],
    prompt: "RAM digunakan saat komputer sedang aktif menjalankan program, sehingga proses belajar model 3D dapat berjalan lebih lancar.",
  },
  SSD: {
    title: "Detail Komponen SSD",
    subtitle: "SSD adalah media penyimpanan permanen yang cepat.",
    visual: "SSD",
    bullets: [
      "Menyimpan file dan sistem operasi.",
      "Akses data lebih cepat dari hard disk.",
      "Data tetap tersimpan meski komputer dimatikan.",
    ],
    prompt: "SSD membuat proses membuka aplikasi, menyimpan data, dan memuat model 3D menjadi lebih cepat.",
  },
  MOTHERBOARD: {
    title: "Detail Komponen Motherboard",
    subtitle: "Motherboard menghubungkan CPU, RAM, storage, dan perangkat lain.",
    visual: "Motherboard",
    bullets: [
      "Menjadi papan utama tempat komponen dipasang.",
      "Mengatur jalur komunikasi antar perangkat keras.",
      "Memiliki socket CPU, slot RAM, dan konektor storage.",
    ],
    prompt: "Motherboard seperti jalan utama di dalam komputer: semua komponen saling terhubung melalui papan ini.",
  },
  KEYBOARD: {
    title: "Detail Perangkat Keyboard",
    subtitle: "Keyboard digunakan untuk memasukkan huruf, angka, dan perintah.",
    visual: "Keyboard",
    bullets: [
      "Memasukkan teks ke komputer.",
      "Memakai tombol shortcut untuk perintah cepat.",
      "Termasuk perangkat input.",
    ],
    prompt: "Keyboard membantu pengguna memberi instruksi tertulis kepada komputer.",
  },
  MOUSE: {
    title: "Detail Perangkat Mouse",
    subtitle: "Mouse digunakan untuk menggerakkan pointer dan memilih objek.",
    visual: "Mouse",
    bullets: [
      "Menggerakkan kursor di layar.",
      "Memilih menu, tombol, dan ikon.",
      "Termasuk perangkat input.",
    ],
    prompt: "Mouse memudahkan pengguna berinteraksi dengan tampilan grafis komputer.",
  },
  SCANNER: {
    title: "Detail Perangkat Scanner",
    subtitle: "Scanner mengubah dokumen fisik menjadi data digital.",
    visual: "Scanner",
    bullets: [
      "Memindai gambar atau dokumen kertas.",
      "Menghasilkan file digital seperti JPG atau PDF.",
      "Termasuk perangkat input.",
    ],
    prompt: "Scanner membantu komputer menerima informasi dari dokumen fisik.",
  },
  MONITOR: {
    title: "Detail Perangkat Monitor",
    subtitle: "Monitor menampilkan hasil proses komputer dalam bentuk visual.",
    visual: "Monitor",
    bullets: [
      "Menampilkan teks, gambar, dan video.",
      "Membantu pengguna melihat hasil kerja komputer.",
      "Termasuk perangkat output.",
    ],
    prompt: "Monitor adalah layar utama untuk melihat informasi yang diproses komputer.",
  },
  PRINTER: {
    title: "Detail Perangkat Printer",
    subtitle: "Printer mencetak dokumen digital ke media kertas.",
    visual: "Printer",
    bullets: [
      "Mencetak teks dan gambar.",
      "Mengubah dokumen digital menjadi fisik.",
      "Termasuk perangkat output.",
    ],
    prompt: "Printer digunakan ketika hasil kerja komputer perlu dicetak.",
  },
  SPEAKER: {
    title: "Detail Perangkat Speaker",
    subtitle: "Speaker mengeluarkan suara dari komputer.",
    visual: "Speaker",
    bullets: [
      "Menghasilkan audio.",
      "Dipakai untuk musik, video, dan notifikasi.",
      "Termasuk perangkat output.",
    ],
    prompt: "Speaker membuat komputer dapat menyampaikan informasi dalam bentuk suara.",
  },
  "HARD DISK": {
    title: "Detail Komponen Hard Disk",
    subtitle: "Hard disk menyimpan data secara permanen.",
    visual: "Hard Disk",
    bullets: [
      "Menyimpan sistem operasi dan file.",
      "Kapasitasnya biasanya besar.",
      "Data tetap tersimpan saat komputer mati.",
    ],
    prompt: "Hard disk adalah media penyimpanan jangka panjang pada komputer.",
  },
  "FLASH DRIVE": {
    title: "Detail Perangkat Flash Drive",
    subtitle: "Flash drive adalah penyimpanan portabel yang mudah dipindahkan.",
    visual: "Flash Drive",
    bullets: [
      "Menyimpan dan memindahkan file.",
      "Berukuran kecil dan mudah dibawa.",
      "Menggunakan koneksi USB.",
    ],
    prompt: "Flash drive membantu memindahkan data dari satu komputer ke komputer lain.",
  },
};

let quizQuestions = [
  {
    question: "Komponen apa yang berfungsi sebagai pusat pemrosesan instruksi pada komputer?",
    answers: ["Monitor", "Keyboard", "CPU", "Printer"],
    correct: 2,
  },
  {
    question: "Perangkat apa yang digunakan untuk menyimpan data secara permanen?",
    answers: ["RAM", "SSD", "Monitor", "Mouse"],
    correct: 1,
  },
  {
    question: "RAM termasuk komponen yang membantu komputer dalam hal apa?",
    answers: ["Memori sementara", "Cetak dokumen", "Tampilan layar", "Input suara"],
    correct: 0,
  },
  {
    question: "Format file yang umum dipakai untuk model 3D di web adalah...",
    answers: ["DOCX", "GLB", "XLSX", "MP3"],
    correct: 1,
  },
  {
    question: "API yang mengirim data berbentuk JSON biasanya digunakan untuk...",
    answers: ["Menghubungkan aplikasi dengan server", "Menghapus monitor", "Memperbesar layar", "Mengganti kabel listrik"],
    correct: 0,
  },
];

function setRoute(route) {
  state.route = route;
  window.location.hash = route;
  render();
}

function syncRouteFromHash() {
  const routeFromHash = window.location.hash.replace("#", "");

  if (routes[routeFromHash] && state.route !== routeFromHash) {
    state.route = routeFromHash;
    render();
  }
}

function updateNav() {
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === state.route);
  });
}

function filterLessons(sourceLessons, query) {
  const keyword = String(query || "").trim().toLowerCase();

  if (!keyword) {
    return sourceLessons;
  }

  return sourceLessons.filter((lesson) => {
    const searchableText = [
      lesson.title,
      lesson.desc,
      lesson.file,
      ...(lesson.items || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(keyword);
  });
}

function parseItemsInput(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeLessonPayload(payload) {
  return {
    title: String(payload?.title || "").trim(),
    desc: String(payload?.desc || "").trim(),
    file: String(payload?.file || "").trim(),
    modelUrl: String(payload?.modelUrl || "").trim(),
    items: parseItemsInput(payload?.items),
  };
}

function normalizeQuizPayload(payload) {
  return {
    question: String(payload?.question || "").trim(),
    answers: parseItemsInput(payload?.answers),
    correct: Number(payload?.correct),
  };
}

function getLessonModelUrl(lesson) {
  const source = String(lesson?.modelUrl || lesson?.file || "").trim();

  if (!source) {
    return "";
  }

  if (/^https?:\/\//i.test(source)) {
    return source;
  }

  if (source.startsWith("/")) {
    return `${API_BASE_URL.replace("/api", "")}${source}`;
  }

  return `${API_BASE_URL.replace("/api", "")}/uploads/models/${source}`;
}

function getComponentModelUrl(component) {
  const key = String(component || "").toUpperCase();
  const fileMap = {
    CPU: "cpu-chip.glb",
    RAM: "ram.glb",
    MOTHERBOARD: "motherboard.glb",
    KEYBOARD: "keyboard.glb",
    MOUSE: "mouse.glb",
    SCANNER: "scanner.glb",
    MONITOR: "monitor.glb",
    PRINTER: "printer.glb",
    SPEAKER: "speaker.glb",
    SSD: "ssd.glb",
    "HARD DISK": "hard-disk.glb",
    "FLASH DRIVE": "flash-drive.glb",
  };

  if (fileMap[key]) {
    return getLessonModelUrl({ file: fileMap[key] });
  }

  return getLessonModelUrl({ file: "cpu.glb" });
}

function getEmptyAdminForm() {
  return {
    title: "",
    desc: "",
    file: "",
    modelUrl: "",
    items: "",
  };
}

function setAdminFormFromLesson(lesson) {
  state.adminEditingId = lesson.id ?? lesson.title;
  state.adminForm = {
    title: lesson.title || "",
    desc: lesson.desc || "",
    file: lesson.file || "",
    modelUrl: lesson.modelUrl || "",
    items: (lesson.items || []).join(", "),
  };
  state.adminMessage = `Mode edit materi ${lesson.title}.`;
  state.adminError = "";
}

function clearAdminForm() {
  state.adminEditingId = null;
  state.adminForm = getEmptyAdminForm();
  state.adminMessage = "";
  state.adminError = "";
}

function getEmptyAdminQuizForm() {
  return {
    question: "",
    answers: "",
    correct: "0",
  };
}

function setAdminQuizFormFromQuestion(question) {
  state.adminQuizEditingId = question.id ?? "";
  state.adminQuizForm = {
    question: question.question || "",
    answers: (question.answers || []).join(", "),
    correct: String(question.correct ?? 0),
  };
  state.adminQuizMessage = `Mode edit soal ${question.id ?? ""}.`;
  state.adminQuizError = "";
}

function clearAdminQuizForm() {
  state.adminQuizEditingId = null;
  state.adminQuizForm = getEmptyAdminQuizForm();
  state.adminQuizMessage = "";
  state.adminQuizError = "";
}

function getViewerTransform({ rotation, zoom }) {
  return `rotateY(${rotation}deg) scale(${zoom})`;
}

function getLessonHotspot(title) {
  const lessonTitle = String(title || "").toLowerCase();

  if (lessonTitle.includes("keyboard")) return "KEYBOARD";
  if (lessonTitle.includes("mouse")) return "MOUSE";
  if (lessonTitle.includes("scanner")) return "SCANNER";
  if (lessonTitle.includes("motherboard")) return "MOTHERBOARD";
  if (lessonTitle.includes("monitor")) return "MONITOR";
  if (lessonTitle.includes("printer")) return "PRINTER";
  if (lessonTitle.includes("speaker")) return "SPEAKER";
  if (lessonTitle.includes("hard")) return "HARD DISK";
  if (lessonTitle.includes("flash")) return "FLASH DRIVE";
  if (lessonTitle.includes("ssd")) return "SSD";
  if (lessonTitle.includes("ram")) return "RAM";
  if (lessonTitle.includes("storage")) return "SSD";
  if (lessonTitle.includes("input")) return "KEYBOARD";
  if (lessonTitle.includes("output")) return "MONITOR";
  return "CPU";
}

function getComponentHotspot(item) {
  const component = String(item || "").toUpperCase();

  if (componentDetails[component]) {
    return component;
  }

  return getLessonHotspot(item);
}

function getSelectedLesson() {
  return lessons.find((lesson) => {
    return String(lesson.id) === String(state.selectedLesson) || lesson.title === state.selectedLesson;
  }) ?? lessons[1] ?? lessons[0];
}

function computerModel() {
  return `
    <div class="computer-model" aria-label="Model komputer 3D">
      <div class="viewer-model-body"></div>
      <div class="viewer-model-screen"></div>
      <div class="viewer-model-glow"></div>
      <div class="viewer-model-stand"></div>
      <div class="viewer-model-base"></div>

      <button class="viewer-hotspot viewer-hotspot-ram" type="button" data-hotspot="RAM" aria-label="RAM"></button>
      <button class="viewer-hotspot viewer-hotspot-cpu" type="button" data-hotspot="CPU" aria-label="CPU"></button>
      <button class="viewer-hotspot viewer-hotspot-ssd" type="button" data-hotspot="SSD" aria-label="SSD"></button>
    </div>
  `;
}

function pageHeader(title, subtitle) {
  return `
    <div class="page-head">
      <h1 class="page-title">${title}</h1>
      <p class="page-subtitle">${subtitle}</p>
    </div>
  `;
}

function renderHome() {
  const heroModelUrl = getLessonModelUrl({ file: "cpu.glb" });

  return `
    <section class="home-grid">
      <div class="hero-copy">
        <p class="eyebrow">Media Pembelajaran Interaktif 3D</p>
        <h1 class="hero-title">Belajar Informatika lewat model perangkat keras 3D.</h1>
        <p class="hero-text">
          Siswa SMPN 2 Tasikmalaya dapat mengenali komponen komputer, membaca materi singkat,
          melihat simulasi 3D, lalu mengerjakan kuis dengan leaderboard permanen.
        </p>

        <div class="hero-actions">
          <button class="btn primary" type="button" data-route-target="materi">Mulai Belajar</button>
          <button class="btn" type="button" data-route-target="viewer">Lihat Model 3D</button>
        </div>
      </div>

      <div class="hero-preview card">
        <div class="viewer-bar">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <model-viewer
          class="hero-model-viewer"
          src="${escapeHtml(heroModelUrl)}"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          exposure="0.9"
        >
          <div class="model-loading-card" slot="poster">
            <strong>Model 3D perangkat komputer</strong>
            <span>Motherboard, CPU, RAM, dan slot komponen.</span>
          </div>
        </model-viewer>

        <p class="preview-caption">
          Model 3D motherboard, CPU, RAM, dan komponen komputer dapat diputar langsung.
        </p>
      </div>
    </section>

    <section class="feature-row" aria-label="Fitur pembelajaran">
      <article class="feature-card card">
        <span class="feature-dot"></span>
        <h2>REST API</h2>
        <p>Data materi</p>
      </article>

      <article class="feature-card card">
        <span class="feature-dot"></span>
        <h2>JSON</h2>
        <p>Format data</p>
      </article>

      <article class="feature-card card">
        <span class="feature-dot"></span>
        <h2>WebGL</h2>
        <p>Model 3D</p>
      </article>

      <article class="feature-card card">
        <span class="feature-dot"></span>
        <h2>MySQL</h2>
        <p>Database</p>
      </article>
    </section>
  `;
}

function renderLessons() {
  const visibleLessons = filterLessons(lessons, state.lessonSearch);

  return `
    ${pageHeader(
    "Daftar Materi",
    "Pilih kategori perangkat keras, baca ringkasan, lalu lanjutkan ke viewer 3D."
  )}

    <label class="search-field">
      <span>Cari materi, komponen, atau model 3D</span>
      <input type="search" value="${escapeHtml(state.lessonSearch)}" data-search-lessons />
    </label>

    <section class="category-grid">
      ${visibleLessons.length > 0 ? visibleLessons
      .map(
        (lesson) => `
            <article class="category-card card">
              <model-viewer
                class="category-model-viewer"
                src="${escapeHtml(getLessonModelUrl(lesson))}"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="0.9"
              >
                <div class="model-loading-card compact" slot="poster">
                  <strong>${escapeHtml(lesson.title)}</strong>
                </div>
              </model-viewer>
              <span class="category-icon">${lesson.title.charAt(0)}</span>
              <h2>${lesson.title}</h2>
              <p>${lesson.desc}</p>
              <div class="category-components">
                <button class="component-chip is-overall" type="button" data-open-lesson="${escapeHtml(lesson.title)}">
                  Keseluruhan
                </button>
                ${(lesson.items || []).map((item) => `
                  <button class="component-chip" type="button" data-open-component="${escapeHtml(getComponentHotspot(item))}" data-component-lesson="${escapeHtml(lesson.title)}">
                    ${escapeHtml(item)}
                  </button>
                `).join("")}
              </div>
              <button class="btn compact" type="button" data-open-lesson="${lesson.title}">
                Buka ${lesson.title}
              </button>
            </article>
          `
      )
      .join("") : `
        <article class="category-empty card">
          <h2>Materi tidak ditemukan</h2>
          <p>Coba cari dengan kata CPU, RAM, SSD, input, output, atau storage.</p>
        </article>
      `}
    </section>

    <section class="lesson-layout">
      <div class="card lesson-list">
        <h2>Materi unggulan</h2>

        ${visibleLessons
      .slice(0, 3)
      .map(
        (lesson) => `
              <div class="lesson-row">
                <span></span>
                <div>
                  <strong>${lesson.title}</strong>
                  <p>${lesson.items.join(", ")}</p>
                </div>
                <em>${lesson.file}</em>
              </div>
            `
      )
      .join("")}
      </div>

      <div class="card learning-path">
        <h2>Alur belajar</h2>
        <p>1. Pilih kategori</p>
        <p>2. Baca ringkasan</p>
        <p>3. Buka model 3D</p>
        <p>4. Klik hotspot</p>
        <p>5. Kerjakan kuis</p>
      </div>
    </section>
  `;
}

function renderViewer() {
  const hotspotDetails = {
    CPU: "CPU berfungsi sebagai pusat pemrosesan instruksi pada komputer.",
    RAM: "RAM menyimpan data sementara saat aplikasi sedang berjalan.",
    SSD: "SSD menyimpan data secara permanen dengan akses yang cepat.",
  };
  const selectedLesson = getSelectedLesson();
  const modelUrl = getLessonModelUrl(selectedLesson);
  const lessonItems = selectedLesson?.items || [];

  return `
    ${pageHeader(
    "Viewer 3D Interaktif",
    `Materi aktif: ${selectedLesson?.title ?? "Proses"}. Klik hotspot pada model untuk melihat fungsi komponen.`
  )}

    <section class="viewer-layout">
      <div class="canvas-3d card">
        ${modelUrl ? `
          <model-viewer
            class="model-viewer"
            src="${escapeHtml(modelUrl)}"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            exposure="0.9"
            ar
          >
            <div class="viewer-fallback" slot="poster">
              <strong>Memuat model 3D...</strong>
              <span>${escapeHtml(selectedLesson?.file || "model.glb")}</span>
            </div>
            <div class="model-loading-card" slot="poster">
              <strong>${escapeHtml(selectedLesson?.title || "Model 3D")}</strong>
              <span>${escapeHtml(selectedLesson?.file || "model.glb")}</span>
            </div>
          </model-viewer>
        ` : `
          <div class="viewer-fallback">
            <strong>Model 3D belum tersedia</strong>
            <span>Upload file .glb atau .gltf dari halaman Admin.</span>
          </div>
        `}
      </div>

      <aside class="control-panel card">
        <h2>Model Aktif</h2>

        <div class="viewer-meta">
          <strong>${escapeHtml(selectedLesson?.title || "Materi")}</strong>
          <span>${escapeHtml(selectedLesson?.file || "Belum ada file")}</span>
        </div>

        <p>
          <strong>${state.selectedHotspot}</strong>: ${hotspotDetails[state.selectedHotspot]}
        </p>
        <p class="viewer-state">Gunakan mouse, touchpad, atau layar sentuh untuk memutar dan zoom model.</p>

        <div class="component-tags">
          ${lessonItems.map((item) => `
            <button class="tag-button" type="button" data-hotspot="${escapeHtml(getComponentHotspot(item))}">
              ${escapeHtml(item)}
            </button>
          `).join("")}
        </div>

        <button class="btn" type="button" data-route-target="materi">
          Kembali ke Materi
        </button>

        <button class="btn success" type="button" data-route-target="kuis">
          Mulai Kuis
        </button>
      </aside>
    </section>
  `;
}

function renderHotspotDetail() {
  const detail = componentDetails[state.selectedHotspot] ?? componentDetails.CPU;
  const componentModelUrl = getComponentModelUrl(detail.visual);

  return `
    ${pageHeader(detail.title, detail.subtitle)}

    <section class="detail-layout">
      <div class="detail-visual card">
        <model-viewer
          class="detail-model-viewer"
          src="${escapeHtml(componentModelUrl)}"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          exposure="0.9"
        >
          <div class="model-loading-card" slot="poster">
            <strong>${escapeHtml(detail.visual)}</strong>
            <span>Model 3D komponen komputer.</span>
          </div>
        </model-viewer>

        <p>Visual 3D khusus komponen ${detail.visual}. Gunakan tombol Keseluruhan di halaman materi untuk melihat semua komponen.</p>
      </div>

      <div class="detail-content card">
        <h2>Apa fungsi ${detail.visual}?</h2>

        <div class="detail-bullets">
          ${detail.bullets
      .map(
        (item) => `
                <div class="detail-bullet">
                  <span></span>
                  <p>${item}</p>
                </div>
              `
      )
      .join("")}
        </div>

        <div class="prompt-box">
          ${detail.prompt}
        </div>

        <div class="detail-actions">
          <button class="btn" type="button" data-route-target="materi">
            Kembali ke Materi
          </button>

          <button class="btn" type="button" data-route-target="viewer">
            Kembali ke Viewer
          </button>

          <button class="btn primary" type="button" data-route-target="kuis">
            Kerjakan Kuis
          </button>
        </div>
      </div>
    </section>
  `;
}

// API Helper
// Function utama untuk melakukan request ke REST API backend.
// Endpoint yang dipanggil akan digabung dengan API_BASE_URL.
// Contoh: fetchJson("/materi") -> http://localhost:3000/api/materi
async function fetchJson(endpoint, options) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error ${response.status}`);
  }

  return response.json();
}

async function loadLessonsFromApi() {
  const materiData = await fetchJson("/materi");

  if (Array.isArray(materiData) && materiData.length > 0) {
    lessons = materiData;
  }

  return lessons;
}

async function createLesson(payload) {
  return fetchJson("/materi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function updateLesson(id, payload) {
  return fetchJson(`/materi/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function deleteLesson(id) {
  return fetchJson(`/materi/${id}`, {
    method: "DELETE",
  });
}

async function uploadModel(file) {
  const formData = new FormData();
  formData.append("model", file);

  const response = await fetch(`${API_BASE_URL}/uploads/models`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Upload gagal ${response.status}`);
  }

  return response.json();
}

async function loadQuizFromApi() {
  const quizData = await fetchJson("/quiz");

  if (Array.isArray(quizData) && quizData.length > 0) {
    quizQuestions = quizData;
  }

  return quizQuestions;
}

async function createQuizQuestion(payload) {
  return fetchJson("/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function updateQuizQuestion(id, payload) {
  return fetchJson(`/quiz/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function deleteQuizQuestion(id) {
  return fetchJson(`/quiz/${id}`, {
    method: "DELETE",
  });
}

// API Get Materi & Quiz
// Mengambil data materi dan soal kuis dari backend.
// Endpoint:
// GET /api/materi
// GET /api/quiz
// Jika backend tidak aktif, frontend memakai data fallback lokal.
async function loadInitialData() {
  try {
    const [materiData, quizData] = await Promise.all([
      loadLessonsFromApi(),
      loadQuizFromApi(),
    ]);

    state.apiReady = true;
    state.apiMessage = "Data berhasil dimuat dari API backend.";
  } catch (error) {
    state.apiReady = false;
    state.apiMessage = "API backend tidak aktif. Data fallback lokal digunakan.";
  }

  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function calculateScore(answers) {
  const correctAnswers = answers.filter((answer, index) => {
    return quizQuestions[index]?.correct === answer;
  });

  if (quizQuestions.length === 0) {
    return 0;
  }

  return Math.round((correctAnswers.length / quizQuestions.length) * 100);
}

function isStudentNameReady() {
  return state.studentName.trim().length > 0;
}

function canAnswerQuiz() {
  return isStudentNameReady() && state.quizNameConfirmed;
}

function isSelectedAnswerCorrect() {
  const question = quizQuestions[state.currentQuestion];

  return state.selectedAnswer !== null && question?.correct === state.selectedAnswer;
}

function normalizeName(value) {
  const cleanName = String(value || "").trim().replace(/\s+/g, " ");

  if (!cleanName) {
    return "Siswa Tanpa Nama";
  }

  return cleanName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem("informatika3d.leaderboard") || "[]")
      .filter((entry) => entry && entry.name && Number.isFinite(entry.score))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  } catch {
    return [];
  }
}

// API Get leaderboard
// Mengambil data leaderboard dari backend.
// Endpoint:
// GET /api/leaderboard
async function getLeaderboardFromApi() {
  return fetchJson("/leaderboard");
}

// API Post Leaderboard
// Mengirim skor siswa ke backend agar tersimpan di leaderboard.
async function saveScoreToApi(result) {
  return fetchJson("/leaderboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: result.name,
      score: result.score,
      total: result.total,
    }),
  });
}

// API Delete Leaderboard
// Menghapus semua data leaderboard melalui backend.
async function resetLeaderboardApi() {
  return fetchJson("/leaderboard", {
    method: "DELETE",
  });
}

function savePermanentScore(result) {
  const leaderboard = getLeaderboard();
  const studentName = normalizeName(result.name);

  const existingIndex = leaderboard.findIndex(
    (entry) => entry.name.toLowerCase() === studentName.toLowerCase()
  );

  const newEntry = {
    name: studentName,
    score: result.score,
    total: result.total,
    savedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    if (newEntry.score >= leaderboard[existingIndex].score) {
      leaderboard[existingIndex] = newEntry;
    }
  } else {
    leaderboard.push(newEntry);
  }

  localStorage.setItem(
    "informatika3d.leaderboard",
    JSON.stringify(leaderboard.sort((a, b) => b.score - a.score).slice(0, 10))
  );
}

async function finishQuiz() {
  if (!state.studentName.trim()) {
    state.nameWarning = "Nama harus diisi sebelum skor disimpan.";
    setRoute("kuis");
    return;
  }

  const score = calculateScore(state.answers);
  const name = normalizeName(state.studentName);

  state.lastResult = {
    name,
    score,
    total: 100,
    answers: [...state.answers],
  };

  savePermanentScore(state.lastResult);

  try {
    // API POST: kirim hasil kuis ke backend leaderboard.
    await saveScoreToApi(state.lastResult);
    state.apiMessage = "Skor berhasil dikirim ke API backend.";
  } catch {
    state.apiMessage = "Skor tersimpan lokal. API backend tidak aktif.";
  }

  setRoute("hasil");
}

function renderQuiz() {
  const question = quizQuestions[state.currentQuestion];
  const progressWidth = ((state.currentQuestion + 1) / quizQuestions.length) * 100;
  const hasName = isStudentNameReady();
  const canAnswer = canAnswerQuiz();
  const selectedCorrect = isSelectedAnswerCorrect();
  const hasSelectedAnswer = state.selectedAnswer !== null;
  const scorePanelClass = hasSelectedAnswer ? (selectedCorrect ? "is-correct" : "is-wrong") : "";

  return `
    ${pageHeader(
    "Kuis Perangkat Keras",
    "Isi nama dulu, lalu pilih jawaban. Skor akan dihitung otomatis."
  )}

    <section class="quiz-name card">
      <label for="studentName">Nama siswa</label>
      <input
       id="studentName"
       type="text"
       value="${escapeHtml(state.studentName)}"
       placeholder="Masukkan nama kamu"
      autocomplete="name"
     />
      <button class="btn compact quiz-name-confirm ${state.quizNameConfirmed ? "is-confirmed" : ""}" type="button" data-confirm-quiz-name>
        ${state.quizNameConfirmed ? "OK" : "Mulai"}
      </button>
    <small class="name-warning">
    ${escapeHtml(state.nameWarning || (!hasName ? "Nama wajib diisi, lalu klik Mulai." : !state.quizNameConfirmed ? "Klik Mulai agar pilihan jawaban aktif." : `Siap mengerjakan sebagai ${normalizeName(state.studentName)}.`))}
    </small>
    </section>

    <section class="quiz-layout">
      <div class="question-card card">
        <p class="progress-label">Soal ${state.currentQuestion + 1} dari ${quizQuestions.length}</p>

        <div class="progress-track">
          <span style="width: ${progressWidth}%"></span>
        </div>

        <h2>${question.question}</h2>

        <div class="answer-list">
          ${question.answers
      .map(
        (answer, index) => `
                <button
                  class="answer-button ${state.selectedAnswer === index ? "is-selected" : ""} ${!canAnswer ? "is-disabled" : ""}"
                  type="button"
                  data-answer="${index}"
                  ${!canAnswer ? "disabled" : ""}
                >
                  ${String.fromCharCode(65 + index)}. ${answer}
                </button>
              `
      )
      .join("")}
        </div>

        <button class="btn success next-button" type="button" data-next-question>
          ${state.currentQuestion === quizQuestions.length - 1 ? "Selesai" : "Lanjutkan"}
        </button>
      </div>

      <aside class="score-side card ${scorePanelClass}">
        <h2>Status kuis</h2>
        <strong class="score-number">${calculateScore(state.answers)}</strong>
        <span>poin sementara</span>

        <p><b>Nama:</b> ${escapeHtml(state.studentName || "belum diisi")}</p>
        <p>${!hasName ? "Isi nama terlebih dahulu." : !state.quizNameConfirmed ? "Klik Mulai untuk membuka pilihan jawaban." : state.selectedAnswer === null ? "Pilih salah satu jawaban." : selectedCorrect ? "Jawaban benar. + poin masuk ke skor." : "Jawaban belum tepat."}</p>
        <p>${hasSelectedAnswer ? `Jawaban benar: ${escapeHtml(question.answers[question.correct])}` : "Skor akan berubah setelah jawaban dipilih."}</p>
      </aside>
    </section>
  `;
}

function renderResults() {
  const result = state.lastResult || {
    name: "Dimas Saputra",
    score: 80,
    total: 100,
  };

  const leaderboard = getLeaderboard();

  const rows =
    leaderboard.length > 0
      ? leaderboard
      : [
        { name: "Dimas Saputra", score: 80 },
        { name: "Siti Nurhaliza", score: 70 },
        { name: "Rizky Pratama", score: 60 },
        { name: "Aulia Rahman", score: 50 },
      ];

  return `
    ${pageHeader(
    "Hasil Kuis & Leaderboard",
    "Skor siswa tersimpan permanen dan masuk daftar peringkat kelas."
  )}

    <section class="result-layout">
      <div class="result-summary card">
        <strong>Tersimpan permanen</strong>

        <div class="badge-circle">
          <span></span>
        </div>

        <h2>${escapeHtml(result.name)}<br />Skor ${result.score}/${result.total}</h2>

        <div class="result-actions">
          <button class="btn primary" type="button" data-restart-quiz>
            Ulangi Kuis
          </button>

          <button class="btn" type="button" data-route-target="materi">
            Kembali Materi
          </button>
        </div>
      </div>

      <div class="leaderboard card">
        <h2>Leaderboard Permanen</h2>

        ${rows
      .slice(0, 4)
      .map(
        (entry, index) => `
              <div class="leaderboard-row ${index % 2 === 0 ? "soft" : ""}">
                <b>#${index + 1}</b>
                <strong>${escapeHtml(entry.name)}</strong>
                <span>${entry.score} poin</span>
              </div>
            `
      )
      .join("")}
      </div>
    </section>
  `;
}

function renderAdminMateriPanel() {
  const form = state.adminForm;

  return `
    <div class="admin-form card">
      <div class="admin-form-head">
        <div>
          <h2>${state.adminEditingId === null ? "Tambah Materi 3D" : "Edit Materi 3D"}</h2>
          <p>Upload model .glb atau .gltf, lalu simpan materi agar muncul di halaman siswa.</p>
        </div>
        <button class="btn compact" type="button" data-admin-clear-form>Bersihkan</button>
      </div>

      ${state.adminMessage ? `<div class="admin-message success">${escapeHtml(state.adminMessage)}</div>` : ""}
      ${state.adminError ? `<div class="admin-message error">${escapeHtml(state.adminError)}</div>` : ""}

      <div class="admin-form-grid">
        <label>
          <span>Judul materi</span>
          <input type="text" data-admin-field="title" value="${escapeHtml(form.title)}" placeholder="Contoh: Proses" />
        </label>

        <label>
          <span>Nama file</span>
          <input type="text" data-admin-field="file" value="${escapeHtml(form.file)}" placeholder="cpu.glb" />
        </label>

        <label class="wide">
          <span>Deskripsi</span>
          <textarea data-admin-field="desc" rows="3" placeholder="Ringkasan materi">${escapeHtml(form.desc)}</textarea>
        </label>

        <label class="wide">
          <span>Komponen</span>
          <input type="text" data-admin-field="items" value="${escapeHtml(form.items)}" placeholder="CPU, RAM, Motherboard" />
        </label>

        <label class="wide">
          <span>URL model 3D</span>
          <input type="text" data-admin-field="modelUrl" value="${escapeHtml(form.modelUrl)}" placeholder="/uploads/models/cpu.glb" />
        </label>

        <label class="admin-upload wide">
          <span>Upload model 3D</span>
          <input type="file" accept=".glb,.gltf" data-admin-upload-model />
        </label>
      </div>

      <div class="admin-actions">
        <button class="btn primary" type="button" data-admin-save-materi>
          ${state.adminEditingId === null ? "Simpan Materi" : "Update Materi"}
        </button>
      </div>
    </div>

    <div class="admin-table card">
      <h2>Materi 3D Tersimpan</h2>
      ${lessons
        .map(
          (lesson) => `
            <div class="admin-row materi-admin-row">
              <span>${escapeHtml(lesson.title)}</span>
              <span>${escapeHtml(lesson.file || "-")}</span>
              <span>${escapeHtml((lesson.items || []).join(", ") || "-")}</span>
              <span class="admin-row-actions">
                <button type="button" data-admin-edit-materi="${escapeHtml(lesson.id ?? lesson.title)}">Edit</button>
                <button type="button" data-admin-delete-materi="${escapeHtml(lesson.id ?? lesson.title)}">Hapus</button>
              </span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderAdminQuizPanel() {
  const form = state.adminQuizForm;

  return `
    <div class="admin-form card">
      <div class="admin-form-head">
        <div>
          <h2>${state.adminQuizEditingId === null ? "Tambah Soal Kuis" : "Edit Soal Kuis"}</h2>
          <p>Tulis pertanyaan, pisahkan pilihan jawaban dengan koma, lalu isi nomor jawaban benar mulai dari 0.</p>
        </div>
        <button class="btn compact" type="button" data-admin-clear-quiz>Bersihkan</button>
      </div>

      ${state.adminQuizMessage ? `<div class="admin-message success">${escapeHtml(state.adminQuizMessage)}</div>` : ""}
      ${state.adminQuizError ? `<div class="admin-message error">${escapeHtml(state.adminQuizError)}</div>` : ""}

      <div class="admin-form-grid">
        <label class="wide">
          <span>Pertanyaan</span>
          <textarea data-admin-quiz-field="question" rows="3" placeholder="Contoh: Komponen apa yang memproses instruksi?">${escapeHtml(form.question)}</textarea>
        </label>

        <label class="wide">
          <span>Pilihan jawaban</span>
          <input type="text" data-admin-quiz-field="answers" value="${escapeHtml(form.answers)}" placeholder="Monitor, Keyboard, CPU, Printer" />
        </label>

        <label>
          <span>Indeks jawaban benar</span>
          <input type="number" min="0" max="3" data-admin-quiz-field="correct" value="${escapeHtml(form.correct)}" />
        </label>
      </div>

      <div class="admin-actions">
        <button class="btn primary" type="button" data-admin-save-quiz>
          ${state.adminQuizEditingId === null ? "Simpan Soal" : "Update Soal"}
        </button>
      </div>
    </div>

    <div class="admin-table card">
      <h2>Bank Soal Kuis</h2>
      ${quizQuestions
        .map(
          (question, index) => `
            <div class="admin-row quiz-admin-row">
              <span>Soal ${index + 1}</span>
              <span>${escapeHtml(question.question)}</span>
              <span>${escapeHtml(question.answers[question.correct] || "-")}</span>
              <span class="admin-row-actions">
                <button type="button" data-admin-edit-quiz="${escapeHtml(question.id ?? index)}">Edit</button>
                <button type="button" data-admin-delete-quiz="${escapeHtml(question.id ?? index)}">Hapus</button>
              </span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderAdmin() {
  const leaderboard = getLeaderboard();
  const tabs = [
    ["materi", "Materi 3D"],
    ["kategori", "Kategori"],
    ["soal", "Soal Kuis"],
    ["logs", "API Logs"],
    ["pengguna", "Pengguna"],
  ];
  const adminPanels = {
    materi: renderAdminMateriPanel(),
    kategori: `
      <div class="admin-table card">
        <h2>Kategori Materi</h2>
        ${lessons
          .map(
            (lesson) => `
              <div class="admin-row">
                <span>${lesson.title}</span>
                <span>${lesson.items.length} komponen</span>
                <span>Aktif</span>
              </div>
            `
          )
          .join("")}
      </div>
    `,
    soal: renderAdminQuizPanel(),
    logs: `
      <div class="logs card">
        <h2>API logs</h2>
        <p><strong>GET /materi</strong><br /><span>Data materi dari backend</span></p>
        <p><strong>GET /quiz</strong><br /><span>Data soal dari backend</span></p>
        <p><strong>POST /leaderboard</strong><br /><span>Simpan skor siswa</span></p>
        <p><strong>DELETE /leaderboard</strong><br /><span>Reset leaderboard</span></p>
        <button class="btn danger admin-reset" type="button" data-reset-leaderboard>
          Reset Leaderboard
        </button>
      </div>
    `,
    pengguna: `
      <div class="admin-table card">
        <h2>Pengguna & Skor</h2>
        ${
          leaderboard.length > 0
            ? leaderboard
                .map(
                  (entry, index) => `
                    <div class="admin-row">
                      <span>#${index + 1}</span>
                      <span>${escapeHtml(entry.name)}</span>
                      <span>${entry.score}</span>
                    </div>
                  `
                )
                .join("")
            : `
              <div class="admin-row">
                <span>Belum ada data</span>
                <span>Kerjakan kuis dulu</span>
                <span>0</span>
              </div>
            `
        }
      </div>
    `,
  };

  return `
    <section class="admin-layout">
      <aside class="admin-sidebar">
        <h2>Admin<br />Informatika</h2>

        ${tabs
          .map(
            ([tab, label]) => `
              <button class="${state.adminTab === tab ? "is-active" : ""}" type="button" data-admin-tab="${tab}">
                ${label}
              </button>
            `
          )
          .join("")}
      </aside>

      <div class="admin-main">
        ${pageHeader(
    "Dashboard Guru Admin",
    "Kelola materi, soal kuis, dan pantau skor siswa."
  )}

        <section class="stats-grid">
          <article class="stat-card card">
            <span></span>
            <p>Materi aktif</p>
            <strong>${lessons.length}</strong>
          </article>

          <article class="stat-card card">
            <span></span>
            <p>Kategori</p>
            <strong>4</strong>
          </article>

          <article class="stat-card card">
            <span></span>
            <p>Soal kuis</p>
            <strong>${quizQuestions.length}</strong>
          </article>

          <article class="stat-card card">
            <span></span>
            <p>Skor tersimpan</p>
            <strong>${leaderboard.length}</strong>
          </article>
        </section>

        <section class="admin-content">
          ${adminPanels[state.adminTab] ?? adminPanels.materi}
        </section>
      </div>
    </section>
  `;
}

function renderPlaceholder(title, subtitle) {
  return `
    <section class="intro">
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </section>
  `;
}

function findLessonByKey(key) {
  return lessons.find((lesson) => {
    return String(lesson.id) === String(key) || lesson.title === key;
  });
}

function findQuizByKey(key) {
  return quizQuestions.find((question, index) => {
    return String(question.id ?? index) === String(key);
  });
}

async function refreshLessonsAfterAdminChange(message) {
  await loadLessonsFromApi();
  state.adminMessage = message;
  state.adminError = "";
  render();
}

async function refreshQuizAfterAdminChange(message) {
  await loadQuizFromApi();
  state.currentQuestion = Math.min(state.currentQuestion, quizQuestions.length - 1);
  state.adminQuizMessage = message;
  state.adminQuizError = "";
  render();
}

async function handleAdminSaveMateri() {
  const payload = normalizeLessonPayload(state.adminForm);

  if (!payload.title) {
    state.adminError = "Judul materi wajib diisi.";
    state.adminMessage = "";
    render();
    return;
  }

  try {
    if (state.adminEditingId === null) {
      await createLesson(payload);
      clearAdminForm();
      await refreshLessonsAfterAdminChange("Materi baru berhasil disimpan.");
      return;
    }

    await updateLesson(state.adminEditingId, payload);
    clearAdminForm();
    await refreshLessonsAfterAdminChange("Materi berhasil diperbarui.");
  } catch (error) {
    state.adminError = error.message || "Gagal menyimpan materi.";
    state.adminMessage = "";
    render();
  }
}

async function handleAdminSaveQuiz() {
  const payload = normalizeQuizPayload(state.adminQuizForm);

  if (!payload.question || payload.answers.length < 2 || !Number.isInteger(payload.correct) || payload.correct < 0 || payload.correct >= payload.answers.length) {
    state.adminQuizError = "Pertanyaan, minimal 2 jawaban, dan indeks jawaban benar harus valid.";
    state.adminQuizMessage = "";
    render();
    return;
  }

  try {
    if (state.adminQuizEditingId === null) {
      await createQuizQuestion(payload);
      clearAdminQuizForm();
      await refreshQuizAfterAdminChange("Soal baru berhasil disimpan.");
      return;
    }

    await updateQuizQuestion(state.adminQuizEditingId, payload);
    clearAdminQuizForm();
    await refreshQuizAfterAdminChange("Soal berhasil diperbarui.");
  } catch (error) {
    state.adminQuizError = error.message || "Gagal menyimpan soal.";
    state.adminQuizMessage = "";
    render();
  }
}

const routes = {
  beranda: renderHome,
  materi: renderLessons,
  viewer: renderViewer,
  detail: renderHotspotDetail,
  kuis: renderQuiz,
  hasil: renderResults,
  admin: renderAdmin,
};

function bindScreenEvents() {
  app.querySelectorAll("[data-route-target]").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.routeTarget));
  });

  const lessonSearch = app.querySelector("[data-search-lessons]");

  if (lessonSearch) {
    lessonSearch.addEventListener("input", (event) => {
      state.lessonSearch = event.target.value;
      render();
    });
  }

  app.querySelectorAll("[data-open-lesson]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedLesson = button.dataset.openLesson;
      const lesson = findLessonByKey(state.selectedLesson);
      state.selectedHotspot = getComponentHotspot(lesson?.items?.[0] || state.selectedLesson);
      setRoute("viewer");
    });
  });

  app.querySelectorAll("[data-open-component]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedLesson = button.dataset.componentLesson || state.selectedLesson;
      state.selectedHotspot = button.dataset.openComponent;
      setRoute("detail");
    });
  });

  app.querySelectorAll("[data-hotspot]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedHotspot = button.dataset.hotspot;
      setRoute("detail");
    });
  });

  app.querySelectorAll("[data-viewer-control]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.viewerControl;

      if (action === "rotate-left") {
        state.viewerRotation -= 15;
      }

      if (action === "rotate-right") {
        state.viewerRotation += 15;
      }

      if (action === "zoom-in") {
        state.viewerZoom = Math.min(1.4, Number((state.viewerZoom + 0.1).toFixed(1)));
      }

      if (action === "zoom-out") {
        state.viewerZoom = Math.max(0.8, Number((state.viewerZoom - 0.1).toFixed(1)));
      }

      if (action === "reset") {
        state.viewerRotation = 0;
        state.viewerZoom = 1;
      }

      render();
    });
  });

  app.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.adminTab = button.dataset.adminTab;
      render();
    });
  });

  app.querySelectorAll("[data-admin-field]").forEach((field) => {
    field.addEventListener("input", (event) => {
      state.adminForm[field.dataset.adminField] = event.target.value;
    });
  });

  app.querySelectorAll("[data-admin-quiz-field]").forEach((field) => {
    field.addEventListener("input", (event) => {
      state.adminQuizForm[field.dataset.adminQuizField] = event.target.value;
    });
  });

  const adminUpload = app.querySelector("[data-admin-upload-model]");

  if (adminUpload) {
    adminUpload.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];

      if (!file) return;

      try {
        state.adminMessage = "Mengupload model 3D...";
        state.adminError = "";
        render();

        const uploadResult = await uploadModel(file);
        state.adminForm.file = uploadResult.fileName;
        state.adminForm.modelUrl = uploadResult.url;
        state.adminMessage = "Model 3D berhasil diupload. Simpan materi untuk memakai model ini.";
        state.adminError = "";
        render();
      } catch (error) {
        state.adminError = error.message || "Upload model 3D gagal.";
        state.adminMessage = "";
        render();
      }
    });
  }

  const saveMateriButton = app.querySelector("[data-admin-save-materi]");

  if (saveMateriButton) {
    saveMateriButton.addEventListener("click", handleAdminSaveMateri);
  }

  const clearFormButton = app.querySelector("[data-admin-clear-form]");

  if (clearFormButton) {
    clearFormButton.addEventListener("click", () => {
      clearAdminForm();
      render();
    });
  }

  app.querySelectorAll("[data-admin-edit-materi]").forEach((button) => {
    button.addEventListener("click", () => {
      const lesson = findLessonByKey(button.dataset.adminEditMateri);

      if (lesson) {
        setAdminFormFromLesson(lesson);
        render();
      }
    });
  });

  app.querySelectorAll("[data-admin-delete-materi]").forEach((button) => {
    button.addEventListener("click", async () => {
      const lesson = findLessonByKey(button.dataset.adminDeleteMateri);

      if (!lesson) return;

      const approved = window.confirm(`Hapus materi ${lesson.title}?`);

      if (!approved) return;

      try {
        await deleteLesson(lesson.id ?? lesson.title);
        clearAdminForm();
        await refreshLessonsAfterAdminChange("Materi berhasil dihapus.");
      } catch (error) {
        state.adminError = error.message || "Gagal menghapus materi.";
        state.adminMessage = "";
        render();
      }
    });
  });

  const saveQuizButton = app.querySelector("[data-admin-save-quiz]");

  if (saveQuizButton) {
    saveQuizButton.addEventListener("click", handleAdminSaveQuiz);
  }

  const clearQuizButton = app.querySelector("[data-admin-clear-quiz]");

  if (clearQuizButton) {
    clearQuizButton.addEventListener("click", () => {
      clearAdminQuizForm();
      render();
    });
  }

  app.querySelectorAll("[data-admin-edit-quiz]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = findQuizByKey(button.dataset.adminEditQuiz);

      if (question) {
        setAdminQuizFormFromQuestion(question);
        render();
      }
    });
  });

  app.querySelectorAll("[data-admin-delete-quiz]").forEach((button) => {
    button.addEventListener("click", async () => {
      const question = findQuizByKey(button.dataset.adminDeleteQuiz);

      if (!question) return;

      const approved = window.confirm("Hapus soal kuis ini?");

      if (!approved) return;

      try {
        await deleteQuizQuestion(question.id);
        clearAdminQuizForm();
        await refreshQuizAfterAdminChange("Soal berhasil dihapus.");
      } catch (error) {
        state.adminQuizError = error.message || "Gagal menghapus soal.";
        state.adminQuizMessage = "";
        render();
      }
    });
  });

  const nameInput = app.querySelector("#studentName");

  if (nameInput) {
    nameInput.addEventListener("input", (event) => {
      state.studentName = event.target.value;
      state.quizNameConfirmed = false;
      state.nameWarning = "";
      state.selectedAnswer = null;
    });
  }

  const confirmQuizNameButton = app.querySelector("[data-confirm-quiz-name]");

  if (confirmQuizNameButton) {
    confirmQuizNameButton.addEventListener("click", () => {
      if (!isStudentNameReady()) {
        state.nameWarning = "Nama harus diisi terlebih dahulu.";
        state.quizNameConfirmed = false;
        render();
        return;
      }

      state.studentName = normalizeName(state.studentName);
      state.quizNameConfirmed = true;
      state.nameWarning = "";
      render();
    });
  }

  app.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canAnswerQuiz()) {
        state.nameWarning = isStudentNameReady()
          ? "Klik Mulai terlebih dahulu sebelum memilih jawaban."
          : "Nama harus diisi sebelum memilih jawaban.";
        render();
        return;
      }

      state.selectedAnswer = Number(button.dataset.answer);
      state.answers[state.currentQuestion] = state.selectedAnswer;
      render();
    });
  });

  const nextButton = app.querySelector("[data-next-question]");

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (!canAnswerQuiz()) {
        state.nameWarning = isStudentNameReady()
          ? "Klik Mulai terlebih dahulu sebelum melanjutkan kuis."
          : "Nama harus diisi sebelum melanjutkan kuis.";
        render();
        return;
      }

      if (state.selectedAnswer === null) return;

      if (state.currentQuestion === quizQuestions.length - 1) {
        finishQuiz();
        return;
      }

      state.currentQuestion += 1;
      state.selectedAnswer = state.answers[state.currentQuestion] ?? null;
      render();
    });
  }
  const restartButton = app.querySelector("[data-restart-quiz]");

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      state.currentQuestion = 0;
      state.selectedAnswer = null;
      state.answers = [];
      state.quizNameConfirmed = false;
      setRoute("kuis");
    });
  }

  const resetLeaderboardButton = app.querySelector("[data-reset-leaderboard]");

  if (resetLeaderboardButton) {
    resetLeaderboardButton.addEventListener("click", () => {
      localStorage.removeItem("informatika3d.leaderboard");
      state.lastResult = null;
      // API DELETE: reset leaderboard di backend melalui tombol admin.
      resetLeaderboardApi()
        .then(() => {
          state.apiMessage = "Leaderboard backend berhasil direset.";
          render();
        })
        .catch(() => {
          state.apiMessage = "Leaderboard lokal direset. API backend tidak aktif.";
          render();
        });
    });
  }
}

function render() {
  updateNav();
  app.innerHTML = routes[state.route]?.() ?? routes.beranda();
  bindScreenEvents();
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => setRoute(button.dataset.route));
});

window.addEventListener("hashchange", syncRouteFromHash);

const initialRoute = window.location.hash.replace("#", "");

if (routes[initialRoute]) {
  state.route = initialRoute;
}

window.Informatika3D = {
  normalizeName,
  getLeaderboard,
  savePermanentScore,
  filterLessons,
  getViewerTransform,
  parseItemsInput,
  normalizeLessonPayload,
  normalizeQuizPayload,
  getLessonModelUrl,
  getComponentModelUrl,
};

render();
// API INIT: setelah UI pertama tampil, frontend mengambil data dari backend.
loadInitialData();
