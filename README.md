# videobelajar — ReactJS

**Live demo:** [Buka VideoBelajar](https://dickyadem.github.io/App-VideoBelajar-Reactjs/)

Aplikasi frontend pembelajaran video berbasis ReactJS dan Vite. Mencakup katalog kelas, simulasi pembayaran, profil, kelas saya, pembelajaran, penilaian, review, dan sertifikat. Navigasi menggunakan React Router.

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
- Checkout responsif dengan pilihan bank, e-wallet, dan kartu; accordion metode; ringkasan pesanan; serta tahapan Pilih Metode → Bayar → Selesai dalam simulasi lokal.
- Form Login dan Register dengan validasi HTML native, konfirmasi kata sandi, dan tombol tampil/sembunyikan kata sandi.
- Login dan registrasi simulasi yang mengarahkan pengguna ke Beranda.
- Header dengan inisial pengguna, tombol keluar, dan menu navigasi mobile.
- Status login bertahan setelah halaman dimuat ulang melalui `localStorage`.
- Halaman profil, pesanan, dan kelas saya.
- Halaman belajar dimulai dari Pre-Test, dilanjutkan video, rangkuman, Quiz, dan Ujian Akhir. Tombol sebelumnya/berikutnya mengikuti urutan daftar.
- Progres dinamis dan centang hijau untuk materi selesai, tersimpan per nama akun dan slug kelas di browser.
- Pre-Test, Quiz, dan Ujian Akhir dengan daftar soal, pilihan jawaban, konfirmasi pengumpulan, hasil nilai, serta tombol ulangi yang kembali ke aturan submodul terkait.
- Download rangkuman `.txt` berisi deskripsi kelas dan daftar materi.
- Modal **Beri Review & Rating** dengan pilihan 1–5 bintang, teks review, pembatalan, dan penyimpanan lokal.
- Pop-up penyelesaian seluruh modul menuju halaman sertifikat dengan nama peserta, informasi kelas, dan download gambar SVG.
- Layout mobile untuk halaman pembelajaran dan ujian, dengan tombol sentuh, teks jawaban, serta header progres yang disesuaikan.

### Batasan saat ini

Data kelas berasal dari `src/data/courses.js`. Autentikasi dan newsletter masih berupa simulasi frontend tanpa backend; kredensial tidak diverifikasi oleh server dan newsletter tidak mengirim email. Tombol Google SSO, pemulihan kata sandi, dan filter Harga/Durasi belum memiliki fungsi lengkap.

Tombol beli pada detail membuka metode pembayaran. Checkout merupakan simulasi tanpa payment gateway, pembayaran, atau pendaftaran kelas. Tidak ada data kartu yang diminta. Biaya admin tetap Rp7.000 adalah contoh untuk demo. Harga detail dan checkout mengikuti harga katalog.

Kurikulum, profil tutor, ulasan, dan soal ujian menggunakan konten demo. Pemutar video belum memutar materi asli; progres video dicatat ketika berpindah lewat tombol next di bawah. Rangkuman merupakan deskripsi dan daftar materi, bukan transkrip video. Sertifikat SVG dibuat lokal dan belum diverifikasi atau diterbitkan oleh server.

Login, progres, dan review memakai `localStorage`, sehingga tidak tersinkron antarperangkat/browser. Identitas penyimpanan progres dan review memakai nama akun serta slug kelas; perubahan nama akun dapat membuat data lama tidak terbaca, dan akun dengan nama sama berbagi data lokal. Proteksi route dan kelulusan di frontend bukan pengamanan backend.

## Menjalankan secara lokal

Gunakan Node.js `20.19+` pada versi 20, atau `22.12+`, serta npm sesuai persyaratan Vite yang terpasang.

Dari direktori proyek, jalankan:

```sh
npm ci
npm run dev
```

Buka alamat yang ditampilkan Vite di terminal. Aplikasi saat ini tidak memerlukan konfigurasi `.env`.

Di PowerShell, jika `npm.ps1` diblokir execution policy, gunakan `npm.cmd` sebagai pengganti `npm`.

| URL | Halaman |
| --- | --- |
| `/` | Beranda dan koleksi kelas |
| `/category` | Katalog, pencarian, dan filter kelas |
| `/course/:slug` | Detail kelas, misalnya `/course/design-thinking-praktis` |
| `/course/:slug/payment` | Pilihan metode pembayaran dan simulasi checkout untuk kelas tersebut |
| `/course/:slug/pay` | Instruksi pembayaran dan hasil pembayaran demo |
| `/profile` | Profil pengguna |
| `/orders` | Pesanan pengguna |
| `/classes` | Kelas saya |
| `/learn/:slug` | Submodul belajar, rangkuman, dan progres |
| `/learn/:slug/pretest` | Soal dan hasil Pre-Test |
| `/learn/:slug/quiz` | Soal dan hasil Quiz |
| `/learn/:slug/exam` | Soal dan hasil Ujian Akhir |
| `/course/:slug/certificate` | Pratinjau dan download sertifikat setelah seluruh modul selesai |
| `/login` | Form masuk |
| `/register` | Form pendaftaran |

Halaman pembayaran, profil, pesanan, kelas saya, belajar, ujian, dan sertifikat memerlukan login simulasi.

## Menguji alur belajar sampai sertifikat

1. Login, kemudian buka `/learn/big-4-auditor-financial-analyst`.
2. Klik **Mulai Pre-Test**, lalu kumpulkan melalui **Selesaikan → Selesai**. Pengumpulan Pre-Test dihitung selesai tanpa syarat nilai.
3. Kembali ke halaman belajar, pilih video pertama, dan gunakan tombol **next di bagian bawah** untuk melewati setiap video. Memilih video dari sidebar saja belum menandainya selesai.
4. Pada submodul Rangkuman, klik **Download Rangkuman** untuk mencatat penyelesaian.
5. Kerjakan Quiz dan Ujian Akhir dengan nilai minimal **60**. Untuk pengujian data demo saat ini, opsi pertama adalah jawaban benar pada setiap soal.
6. Setelah semua selesai, progres kelas contoh menjadi **11/11** (7 video, Pre-Test, rangkuman, Quiz, dan Ujian Akhir). Jumlah mengikuti data kelas, bukan angka tetap.
7. Pop-up **Modul sudah selesai** muncul. Klik **Ambil Sertifikat** untuk membuka halaman sertifikat, lalu **Download Sertifikat** untuk mengunduh SVG.

Centang hijau menunjukkan materi selesai; latar hijau menunjukkan materi yang sedang dipilih. Ringkasan progres dibuka dengan mengklik angka progres di header dan ditutup dengan klik di luar, Escape, atau klik tombol lagi.

Tombol **Ulangi** kembali ke aturan Pre-Test/Quiz/Ujian Akhir yang sesuai. Memulai lagi mengosongkan jawaban percobaan, tetapi tidak menghapus progres modul yang sebelumnya selesai.

Untuk menguji review, klik **Beri Review & Rating**, pilih bintang dan isi review, lalu klik **Selesai**. Buka kembali untuk memeriksa hasil tersimpan. **Batal** membuang perubahan yang belum disimpan.

Untuk mengulang progres dari nol, hapus key `videobelajar-progress:<nama>:<slug>` melalui DevTools → Application → Local Storage, lalu refresh. Review memakai key `videobelajar-review:<nama>:<slug>` dan status login memakai `videobelajar-user`.

## Pengujian dan build

### GitHub Pages

Konfigurasi build menggunakan base `/App-VideoBelajar-Reactjs/` dan `HashRouter` agar route bisa dimuat ulang di hosting statis. URL aplikasi menggunakan `/#/`, misalnya `https://dickyadem.github.io/App-VideoBelajar-Reactjs/#/category`. Saat development gunakan alamat Vite dengan `/#/learn/...` untuk membuka halaman belajar langsung.

1. Push perubahan proyek ke branch `main`.
2. Buka repository → **Settings → Pages**, lalu pilih **GitHub Actions** sebagai Source.
3. Workflow `.github/workflows/deploy.yml` menjalankan instalasi, tes, build, dan deploy. Bisa dijalankan ulang melalui **Actions → Deploy to GitHub Pages → Run workflow**.
4. Setelah workflow berhasil, buka `https://dickyadem.github.io/App-VideoBelajar-Reactjs/`.

Hasil build berada di `dist/`; folder ini tidak perlu di-commit. Jika nama repository berubah, sesuaikan `base` di `vite.config.js`. Panduan: [Deploy Vite ke GitHub Pages](https://vite.dev/guide/static-deploy#github-pages).

### Perintah

```sh
# Menjalankan pengujian sekali
npm test

# Membuat hasil build produksi di dist/
npm run build

# Menguji bagian belajar dan sertifikat saja
npm test -- src/pages/LearningPage.test.jsx src/pages/QuizPage.test.jsx src/components/CourseProgress.test.jsx src/components/ReviewButton.test.jsx src/pages/CertificatePage.test.jsx

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
│   ├── components/       # Header, Footer, CourseProgress, ReviewButton, form, dll.
│   ├── context/          # AuthContext dan pengujiannya
│   ├── data/             # Data kelas dan pengujiannya
│   ├── pages/            # Katalog, checkout, belajar, Quiz, Certificate, dan pengujian
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

## Mengelola metode pembayaran

- Harga kelas disimpan sebagai angka rupiah (`priceAmount`) di `src/data/courses.js`; label harga katalog dan perhitungan checkout berasal dari nilai tersebut.
- Kelompok metode, nama penyedia, dan biaya admin demo berada di `src/data/paymentMethods.js`. Pilihan awal adalah BCA; hanya satu metode aktif pada satu waktu.
- `src/components/PaymentMethods.jsx` menangani pilihan dan accordion. `src/pages/PaymentMethodPage.jsx` menangani ringkasan dan tahapan simulasi, dengan styling di `assets/css/payment-method.css`.
- Alur pembayaran memakai `PaymentMethodPage.jsx` untuk pemilihan metode dan `PaymentPage.jsx` untuk instruksi serta hasil pembayaran demo. Memuat ulang halaman mengulang status simulasi pembayaran.
- Ringkasan kelas berada di kanan pada desktop dan di atas pilihan metode pada mobile; gambar kelas disembunyikan pada mobile. Logo metode pembayaran memakai aset PNG lokal di `assets/images/`, termasuk bank, e-wallet, Mastercard, VISA, dan JCB.
