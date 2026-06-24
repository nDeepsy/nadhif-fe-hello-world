const app = document.querySelector("#app");
const navButtons = [...document.querySelectorAll("[data-route]")];

const state = {
  route: "beranda",
};

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
  materi: () =>
    renderPlaceholder(
      "Daftar Materi",
      "Kategori materi perangkat keras akan ditampilkan di halaman ini."
    ),
  viewer: () =>
    renderPlaceholder(
      "Viewer 3D Interaktif",
      "Model komputer 3D dan hotspot komponen akan ditampilkan di halaman ini."
    ),
  kuis: () =>
    renderPlaceholder(
      "Kuis Perangkat Keras",
      "Input nama, soal, skor, dan leaderboard permanen akan ditampilkan di halaman ini."
    ),
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