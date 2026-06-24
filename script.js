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

function renderPlaceholder(title, subtitle) {
  return `
    <section class="intro">
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </section>
  `;
}

const routes = {
  beranda: () =>
    renderPlaceholder(
      "Media Pembelajaran Informatika 3D",
      "Belajar perangkat keras komputer dengan materi, model 3D, dan kuis interaktif."
    ),
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

function render() {
  updateNav();
  app.innerHTML = routes[state.route]?.() ?? routes.beranda();
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => setRoute(button.dataset.route));
});

const initialRoute = window.location.hash.replace("#", "");

if (routes[initialRoute]) {
  state.route = initialRoute;
}

render();