# Informatika 3D - SMPN 2 Tasikmalaya

Media pembelajaran interaktif berbasis web untuk materi Informatika kelas 7. Aplikasi ini menampilkan materi perangkat keras komputer, simulasi viewer 3D, kuis interaktif, hasil kuis, leaderboard permanen, dan dashboard admin sederhana.

## Fitur Utama

- Halaman beranda sesuai rancangan UI/UX Figma.
- Daftar materi perangkat keras komputer.
- Viewer 3D interaktif dengan hotspot CPU, RAM, dan SSD.
- Detail komponen perangkat keras.
- Kuis perangkat keras dengan input nama siswa.
- Tombol jawaban netral tanpa memberi tahu benar atau salah.
- Skor sementara saat kuis berlangsung.
- Hasil kuis dan leaderboard permanen menggunakan localStorage.
- Dashboard admin untuk melihat materi, statistik, API logs, dan reset leaderboard.

## Teknologi

- HTML
- CSS
- JavaScript
- localStorage
- Git dan GitHub

## Cara Menjalankan

1. Clone atau download repository ini.
2. Buka folder project di Visual Studio Code.
3. Buka file `index.html` di browser.
4. Jika memakai extension Live Server, klik kanan `index.html`, lalu pilih **Open with Live Server**.

## Cara Menjalankan Test

Jalankan perintah berikut di terminal:

```bash
node tests/quiz.test.js