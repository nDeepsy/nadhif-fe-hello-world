const app = document.querySelector("#app");
const navButtons = [...document.querySelectorAll("[data-route]")];

const state = {
  route: "beranda",
  selectedHotspot: "CPU",
  studentName: "",
  currentQuestion: 0,
  selectedAnswer: null,
  answers: [],
};

const lessons = [
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

const quizQuestions = [
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
  return `
    ${pageHeader(
    "Daftar Materi",
    "Pilih kategori perangkat keras, baca ringkasan, lalu lanjutkan ke viewer 3D."
  )}

    <div class="search-field">Cari materi, komponen, atau model 3D</div>

    <section class="category-grid">
      ${lessons
      .map(
        (lesson) => `
            <article class="category-card card">
              <span class="category-icon">${lesson.title.charAt(0)}</span>
              <h2>${lesson.title}</h2>
              <p>${lesson.desc}</p>
              <button class="btn compact" type="button" data-route-target="viewer">
                Buka ${lesson.title}
              </button>
            </article>
          `
      )
      .join("")}
    </section>

    <section class="lesson-layout">
      <div class="card lesson-list">
        <h2>Materi unggulan</h2>

        ${lessons
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

  return `
    ${pageHeader(
    "Viewer 3D Interaktif",
    "Klik hotspot pada model untuk melihat fungsi komponen."
  )}

    <section class="viewer-layout">
      <div class="canvas-3d card">
        ${computerModel()}

        <div class="floating-label label-cpu">CPU</div>
        <div class="floating-label label-ram">RAM</div>
        <div class="floating-label label-ssd">SSD</div>
      </div>

      <aside class="control-panel card">
        <h2>Kontrol Model</h2>

        <button class="control-button" type="button">Putar kiri</button>
        <button class="control-button" type="button">Putar kanan</button>
        <button class="control-button" type="button">Zoom masuk</button>
        <button class="control-button" type="button">Zoom keluar</button>
        <button class="control-button" type="button">Reset posisi</button>

        <p>
          <strong>${state.selectedHotspot}</strong>: ${hotspotDetails[state.selectedHotspot]}
        </p>

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

function calculateScore(answers) {
  const correctAnswers = answers.filter((answer, index) => {
    return quizQuestions[index]?.correct === answer;
  });

  return correctAnswers.length * 20;
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
        value="${state.studentName}"
        placeholder="Masukkan nama kamu"
        autocomplete="name"
      />
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

        <p><b>Nama:</b> ${state.studentName || "belum diisi"}</p>
        <p>${state.selectedAnswer === null ? "Pilih salah satu jawaban" : "Jawaban sudah tersimpan"}</p>
        <p>Benar/salah tidak tampil di tombol</p>
      </aside>
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
  admin: () =>
    renderPlaceholder(
      "Dashboard Guru Admin",
      "Panel guru untuk mengelola materi, soal kuis, dan data siswa."
    ),
};

function bindScreenEvents() {
  app.querySelectorAll("[data-route-target]").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.routeTarget));
  });

  app.querySelectorAll("[data-hotspot]").forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedHotspot = button.dataset.hotspot;
    setRoute("detail");
  });
});

const nameInput = app.querySelector("#studentName");

if (nameInput) {
  nameInput.addEventListener("input", (event) => {
    state.studentName = event.target.value;
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

    if (state.currentQuestion < quizQuestions.length - 1) {
      state.currentQuestion += 1;
      state.selectedAnswer = state.answers[state.currentQuestion] ?? null;
      render();
    }
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

render();