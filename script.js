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
};

let lessons = [
  {
    title: "Input",
    desc: "Perangkat untuk memasukkan data ke komputer.",
    file: "input.glb",
    items: ["Keyboard", "Mouse", "Scanner"],
  },
  {
    title: "Proses",
    desc: "Komponen yang mengolah instruksi dan data.",
    file: "cpu.glb",
    items: ["CPU", "RAM", "Motherboard"],
  },
  {
    title: "Output",
    desc: "Perangkat untuk menampilkan hasil pengolahan.",
    file: "output.glb",
    items: ["Monitor", "Printer", "Speaker"],
  },
  {
    title: "Storage",
    desc: "Media penyimpanan data jangka pendek dan panjang.",
    file: "storage.glb",
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

function getViewerTransform({ rotation, zoom }) {
  return `rotateY(${rotation}deg) scale(${zoom})`;
}

function getLessonHotspot(title) {
  const lessonTitle = String(title || "").toLowerCase();

  if (lessonTitle.includes("storage")) return "SSD";
  if (lessonTitle.includes("input")) return "RAM";
  return "CPU";
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
  return `
    <div class="api-status ${state.apiReady ? "is-online" : "is-offline"}">
       ${state.apiMessage}
    </div>
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

        <div class="model-preview">
          <div class="model-body"></div>
          <div class="model-screen"></div>
          <div class="model-glow"></div>
          <div class="model-stand"></div>
          <div class="model-base"></div>
          <span class="hotspot hotspot-ram"></span>
          <span class="hotspot hotspot-cpu"></span>
          <span class="hotspot hotspot-ssd"></span>
        </div>

        <p class="preview-caption">
          Sentuh hotspot CPU, RAM, atau SSD untuk melihat penjelasan komponen.
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
              <span class="category-icon">${lesson.title.charAt(0)}</span>
              <h2>${lesson.title}</h2>
              <p>${lesson.desc}</p>
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
  const selectedLesson = lessons.find((lesson) => lesson.title === state.selectedLesson) ?? lessons[1] ?? lessons[0];

  return `
    ${pageHeader(
    "Viewer 3D Interaktif",
    `Materi aktif: ${selectedLesson?.title ?? "Proses"}. Klik hotspot pada model untuk melihat fungsi komponen.`
  )}

    <section class="viewer-layout">
      <div class="canvas-3d card">
        <div class="viewer-stage" style="transform: ${getViewerTransform({ rotation: state.viewerRotation, zoom: state.viewerZoom })}">
          ${computerModel()}
        </div>

        <div class="floating-label label-cpu">CPU</div>
        <div class="floating-label label-ram">RAM</div>
        <div class="floating-label label-ssd">SSD</div>
      </div>

      <aside class="control-panel card">
        <h2>Kontrol Model</h2>

        <button class="control-button" type="button" data-viewer-control="rotate-left">Putar kiri</button>
        <button class="control-button" type="button" data-viewer-control="rotate-right">Putar kanan</button>
        <button class="control-button" type="button" data-viewer-control="zoom-in">Zoom masuk</button>
        <button class="control-button" type="button" data-viewer-control="zoom-out">Zoom keluar</button>
        <button class="control-button" type="button" data-viewer-control="reset">Reset posisi</button>

        <p>
          <strong>${state.selectedHotspot}</strong>: ${hotspotDetails[state.selectedHotspot]}
        </p>
        <p class="viewer-state">Rotasi ${state.viewerRotation} derajat | Zoom ${Math.round(state.viewerZoom * 100)}%</p>

        <button class="btn success" type="button" data-route-target="kuis">
          Mulai Kuis
        </button>
      </aside>
    </section>
  `;
}

function renderHotspotDetail() {
  const detail = componentDetails[state.selectedHotspot] ?? componentDetails.CPU;

  return `
    ${pageHeader(detail.title, detail.subtitle)}

    <section class="detail-layout">
      <div class="detail-visual card">
        <div class="chip-visual">
          <div class="chip-core">${detail.visual}</div>
        </div>

        <p>Visual komponen ${detail.visual} pada perangkat keras komputer.</p>
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
    throw new Error(`API error ${response.status}`);
  }

  return response.json();
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
      fetchJson("/materi"),
      fetchJson("/quiz"),
    ]);

    if (Array.isArray(materiData) && materiData.length > 0) {
      lessons = materiData;
    }

    if (Array.isArray(quizData) && quizData.length > 0) {
      quizQuestions = quizData;
    }

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

  return correctAnswers.length * 20;
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

  return `
    ${pageHeader(
    "Kuis Perangkat Keras",
    "Isi nama dulu. Skor masuk leaderboard permanen setelah selesai."
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
    <small class="name-warning">
    ${escapeHtml(state.nameWarning || "")}
    </small>
      <strong>Leaderboard permanen</strong>
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
                  class="answer-button ${state.selectedAnswer === index ? "is-selected" : ""}"
                  type="button"
                  data-answer="${index}"
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

      <aside class="score-side card">
        <h2>Status kuis</h2>
        <strong class="score-number">${calculateScore(state.answers)}</strong>
        <span>poin sementara</span>

        <p><b>Nama:</b> ${escapeHtml(state.studentName || "belum diisi")}</p>
        <p>${state.selectedAnswer === null ? "Pilih salah satu jawaban" : "Jawaban sudah tersimpan"}</p>
        <p>Benar/salah tidak tampil di tombol</p>
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
    materi: `
      <div class="admin-table card">
        <h2>Materi table</h2>
        ${lessons
          .map(
            (lesson) => `
              <div class="admin-row">
                <span>${lesson.title}</span>
                <span>${lesson.file}</span>
                <span>Aktif</span>
              </div>
            `
          )
          .join("")}
      </div>
    `,
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
    soal: `
      <div class="admin-table card">
        <h2>Bank Soal Kuis</h2>
        ${quizQuestions
          .map(
            (question, index) => `
              <div class="admin-row question-admin-row">
                <span>Soal ${index + 1}</span>
                <span>${question.question}</span>
                <span>${question.answers[question.correct]}</span>
              </div>
            `
          )
          .join("")}
      </div>
    `,
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
            <strong>12</strong>
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
      state.selectedHotspot = getLessonHotspot(state.selectedLesson);
      setRoute("viewer");
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

  const nameInput = app.querySelector("#studentName");

  if (nameInput) {
    nameInput.addEventListener("input", (event) => {
      state.studentName = event.target.value;
      state.nameWarning = "";
    });
  }

  app.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedAnswer = Number(button.dataset.answer);
      state.answers[state.currentQuestion] = state.selectedAnswer;
      render();
    });
  });

  const nextButton = app.querySelector("[data-next-question]");

  if (nextButton) {
    nextButton.addEventListener("click", () => {
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
};

render();
// API INIT: setelah UI pertama tampil, frontend mengambil data dari backend.
loadInitialData();
