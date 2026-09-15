# videobelajar

MVP landing page pembelajaran video dengan tiga halaman: Beranda, Login, dan Register.

## Demo

Live demo: https://dickyadem.github.io/videobelajar/

## Struktur

```text
videobelajar/
├── index.html
├── login.html
├── register.html
├── assets/
│   ├── css/
│   │   ├── global.css       # Reset, font, variable, komponen umum
│   │   ├── home.css         # Beranda, course card, newsletter, footer
│   │   ├── login.css        # Layout form autentikasi
│   │   ├── register.css     # Field khusus Register
│   │   └── responsive.css   # Breakpoint desktop, tablet, mobile
│   ├── js/
│   │   ├── main.js          # Toggle password dan form demo
│   │   ├── home.js          # Filter kategori course
│   │   ├── login.js         # Hook halaman Login
│   │   └── register.js      # Validasi konfirmasi password
│   ├── images/
│   │   ├── logo.png
│   │   └── courses/
│   └── icons/
│       ├── facebook.png
│       ├── instagram.png
│       ├── linkedin.png
│       └── twitter.png
└── README.md
```

## Menjalankan

```powershell
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite. Halaman tersedia di `/`, `/login`, dan `/register`.

Untuk verifikasi:

```powershell
npm test
npm run build
```

## Fitur

- Beranda React responsif dengan hero panel, kategori, course card, newsletter, dan footer.
- Filter course berdasarkan kategori.
- Login dan Register dengan validasi HTML native.
- Toggle tampil/sembunyikan password.
- Form autentikasi dan newsletter menggunakan simulasi lokal tanpa backend.
