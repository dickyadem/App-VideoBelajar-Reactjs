# videobelajar — ReactJS

Aplikasi frontend pembelajaran video berbasis ReactJS dan Vite. Navigasi menggunakan React Router dengan empat halaman: Beranda, Kategori, Login, dan Register.

## Teknologi

- React 19 dan React DOM untuk antarmuka berbasis komponen.
- React Router DOM 7 untuk navigasi halaman.
- Vite 8 dan plugin React untuk development server dan build.
- CSS untuk styling dan layout responsif.
- Context API dan `localStorage` untuk status login simulasi.
- Vitest, React Testing Library, jest-dom, dan jsdom untuk pengujian.

## Fitur

- Beranda responsif dengan hero, koleksi kelas, filter kategori, newsletter, dan footer.
- Katalog dengan pencarian berdasarkan judul, deskripsi, atau nama instruktur; filter kategori dan bidang studi; serta pilihan pengurutan harga.
- Form Login dan Register dengan validasi HTML native, konfirmasi kata sandi, dan tombol tampil/sembunyikan kata sandi.
- Login dan registrasi simulasi yang mengarahkan pengguna ke Beranda.
- Header dengan inisial pengguna, tombol keluar, dan menu navigasi mobile.
- Status login bertahan setelah halaman dimuat ulang melalui `localStorage`.

### Batasan saat ini

Data kelas berasal dari `src/data/courses.js`. Autentikasi dan newsletter masih berupa simulasi frontend tanpa backend; kredensial tidak diverifikasi oleh server dan newsletter tidak mengirim email. Tombol Google SSO, pemulihan kata sandi, filter Harga/Durasi, dan paginasi belum memiliki fungsi lengkap.

## Menjalankan secara lokal

Gunakan Node.js `20.19+` pada versi 20, atau `22.12+`, serta npm sesuai persyaratan Vite yang terpasang.

Dari direktori proyek, jalankan:

```sh
npm ci
npm run dev
```

Buka alamat yang ditampilkan Vite di terminal. Aplikasi saat ini tidak memerlukan konfigurasi `.env`.

| URL | Halaman |
| --- | --- |
| `/` | Beranda dan koleksi kelas |
| `/category` | Katalog, pencarian, dan filter kelas |
| `/login` | Form masuk |
| `/register` | Form pendaftaran |

## Pengujian dan build

```sh
# Menjalankan pengujian sekali
npm test

# Membuat hasil build produksi di dist/
npm run build

# Meninjau hasil build secara lokal
npx vite preview
```

Konfigurasi pengujian ada di `vite.config.js`, dengan setup di `src/test/setup.js`. File pengujian ditempatkan di dekat halaman, komponen, konteks autentikasi, dan data yang diuji.

## Struktur proyek

```text
videobelajar/
├── src/
│   ├── main.jsx          # Entry point, router, provider, dan impor CSS
│   ├── App.jsx           # Definisi route aplikasi
│   ├── App.test.jsx      # Pengujian aplikasi
│   ├── components/       # Header, Footer, CourseCard, form, dan komponen lain
│   ├── context/          # AuthContext dan pengujiannya
│   ├── data/             # Data kelas dan pengujiannya
│   ├── pages/            # Home, Category, Login, Register, dan pengujian
│   └── test/setup.js     # Setup lingkungan pengujian
├── assets/css/           # Stylesheet yang diimpor oleh aplikasi React
├── public/assets/        # Logo dan ikon statis
├── index.html            # HTML utama dengan root aplikasi React
├── vite.config.js        # Konfigurasi Vite dan Vitest
├── package.json          # Dependency dan script npm
├── package-lock.json     # Versi dependency terkunci
├── .gitignore
└── README.md
```

File `login.html`, `register.html`, dan folder `assets/js/` merupakan peninggalan versi HTML sebelumnya. Halaman aplikasi React berada di `src/pages/` dan diakses melalui route di atas. Gambar kelas dan avatar instruktur dimuat dari layanan eksternal sehingga memerlukan koneksi internet.
