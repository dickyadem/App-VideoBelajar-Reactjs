# videobelajar — ReactJS

Aplikasi frontend pembelajaran video berbasis ReactJS dan Vite. Navigasi menggunakan React Router dengan halaman Beranda, Kategori, Detail Kelas, Login, dan Register.

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
- Paginasi katalog menampilkan empat kelas per halaman. Jumlah halaman mengikuti hasil pencarian/filter, dengan tombol angka serta panah sebelumnya/berikutnya. Perubahan pencarian, filter, atau urutan mengembalikan tampilan ke halaman pertama.
- Detail untuk setiap kelas: hero, deskripsi, tutor, accordion kurikulum, contoh ulasan, informasi pembelian, dan tiga rekomendasi kelas terkait.
- Kartu kelas dapat diklik untuk membuka detail. Tombol Bagikan Kelas menyalin tautan, dengan pilihan salin manual jika clipboard tidak tersedia.
- Form Login dan Register dengan validasi HTML native, konfirmasi kata sandi, dan tombol tampil/sembunyikan kata sandi.
- Login dan registrasi simulasi yang mengarahkan pengguna ke Beranda.
- Header dengan inisial pengguna, tombol keluar, dan menu navigasi mobile.
- Status login bertahan setelah halaman dimuat ulang melalui `localStorage`.

### Batasan saat ini

Data kelas berasal dari `src/data/courses.js`. Autentikasi dan newsletter masih berupa simulasi frontend tanpa backend; kredensial tidak diverifikasi oleh server dan newsletter tidak mengirim email. Tombol Google SSO, pemulihan kata sandi, dan filter Harga/Durasi belum memiliki fungsi lengkap.

Pembelian pada halaman detail merupakan simulasi tanpa pembayaran atau pendaftaran kelas. Kurikulum, profil tutor, dan ulasan menggunakan konten demo; video, dokumen, ujian, dan sertifikat belum tersedia. Harga detail selalu mengikuti harga katalog.

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
| `/course/:slug` | Detail kelas, misalnya `/course/design-thinking-praktis` |
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
│   ├── pages/            # Home, Category, CourseDetail, Login, Register, dan pengujian
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

## Mengelola detail kelas

Semua kelas menggunakan satu template `src/pages/CourseDetailPage.jsx` dengan styling di `assets/css/course-detail.css`. Interaksi pembelian dan bagikan berada di `src/components/PurchaseCard.jsx`. Tidak perlu membuat halaman baru untuk setiap produk.

1. Ubah informasi katalog di `src/data/courses.js`. Setiap kelas memiliki `slug` unik dan tetap sebagai bagian URL; pertahankan slug ketika hanya mengganti judul.
2. Tambahkan konten dengan key slug yang sama di `src/data/courseDetails.js`: `description`, `tutorBio`, `modules` (judul bagian dan daftar `lessons` berisi `title` serta `minutes`), dan `reviews` (nama, batch, teks).
3. Kartu kelas otomatis menuju `/course/:slug`. Jumlah video dihitung dari daftar pelajaran dan jumlah dokumen demo mengikuti jumlah modul.
4. Jalankan `npm test` dan `npm run build` setelah perubahan. Slug yang tidak ditemukan menampilkan tautan kembali ke katalog.
