// Konten demo. Key harus sama dengan slug di courses.js.
export const courseDetails = {
  'big-4-auditor-financial-analyst': {
    description: 'Bangun fondasi untuk berkarier di bidang audit dan analisis keuangan. Pelajari cara membaca laporan keuangan, mengenali risiko, dan menyusun temuan audit melalui studi kasus perusahaan. Cocok untuk mahasiswa akuntansi dan profesional yang ingin memperkuat kemampuan analisisnya.',
    tutorBio: 'Jenna membimbing pembelajaran akuntansi melalui latihan membaca laporan keuangan dan menyusun analisis bisnis yang mudah dipahami.',
    modules: [
      { title: 'Dasar Laporan Keuangan', lessons: [{ title: 'Memahami neraca dan laba rugi', minutes: 12 }, { title: 'Membaca laporan arus kas', minutes: 18 }, { title: 'Latihan analisis rasio keuangan', minutes: 20 }] },
      { title: 'Proses dan Risiko Audit', lessons: [{ title: 'Merencanakan audit berbasis risiko', minutes: 15 }, { title: 'Mengumpulkan bukti audit', minutes: 18 }] },
      { title: 'Studi Kasus Financial Analyst', lessons: [{ title: 'Menyusun temuan dan rekomendasi', minutes: 25 }, { title: 'Presentasi analisis perusahaan', minutes: 20 }] },
    ],
    reviews: [{ name: 'Aulia Putri', batch: 'Alumni Batch 2', text: 'Latihan membaca arus kas membantu saya memahami kondisi perusahaan dengan lebih terstruktur.' }, { name: 'Rizky Pratama', batch: 'Alumni Batch 4', text: 'Studi kasus audit membuat hubungan antara risiko dan bukti jadi lebih mudah dipahami.' }],
  },
  'strategi-marketing-berbasis-data': {
    description: 'Rancang kampanye pemasaran dengan keputusan yang didukung data. Mulai dari memahami audiens, memilih metrik yang relevan, hingga mengevaluasi hasil eksperimen. Di akhir materi, susun rencana kampanye dan dashboard sederhana untuk kebutuhan bisnis Anda.',
    tutorBio: 'Andra membawakan pendekatan pemasaran yang menghubungkan riset audiens, eksperimen kampanye, dan evaluasi metrik bisnis.',
    modules: [
      { title: 'Mengenal Audiens dan Tujuan', lessons: [{ title: 'Riset audiens dan segmentasi', minutes: 15 }, { title: 'Menyusun persona pelanggan', minutes: 12 }, { title: 'Menentukan KPI kampanye', minutes: 18 }] },
      { title: 'Eksperimen Kampanye', lessons: [{ title: 'Membuat hipotesis dan A/B test', minutes: 20 }, { title: 'Mengalokasikan anggaran', minutes: 15 }] },
      { title: 'Analisis Performa', lessons: [{ title: 'Membaca funnel konversi', minutes: 18 }, { title: 'Menyusun laporan kampanye', minutes: 22 }] },
    ],
    reviews: [{ name: 'Dewi Ananda', batch: 'Alumni Batch 1', text: 'Sekarang saya lebih terarah dalam memilih KPI dan mengevaluasi hasil kampanye.' }, { name: 'Bagas Saputra', batch: 'Alumni Batch 3', text: 'Contoh A/B test membantu saya menyusun eksperimen yang bisa diukur.' }],
  },
  'design-thinking-praktis': {
    description: 'Temukan solusi yang berangkat dari kebutuhan pengguna. Ikuti proses design thinking dari empati, perumusan masalah, dan eksplorasi ide sampai prototipe serta pengujian. Kelas ini cocok untuk pemula yang ingin mempraktikkan cara berpikir desain dalam proyek nyata.',
    tutorBio: 'Nadia mengajak peserta memahami kebutuhan pengguna melalui riset sederhana, prototipe, dan pengujian desain secara bertahap.',
    modules: [
      { title: 'Empati dan Riset Pengguna', lessons: [{ title: 'Pengantar design thinking', minutes: 12 }, { title: 'Menyiapkan wawancara pengguna', minutes: 18 }, { title: 'Membuat empathy map', minutes: 15 }] },
      { title: 'Definisi Masalah dan Ideasi', lessons: [{ title: 'Menyusun problem statement', minutes: 15 }, { title: 'Eksplorasi dan prioritas ide', minutes: 20 }] },
      { title: 'Prototipe dan Validasi', lessons: [{ title: 'Membuat prototipe sederhana', minutes: 25 }, { title: 'Melakukan usability testing', minutes: 20 }] },
    ],
    reviews: [{ name: 'Sinta Maharani', batch: 'Alumni Batch 2', text: 'Alur dari wawancara sampai prototipe mudah diikuti untuk proyek desain pertama saya.' }, { name: 'Fajar Aditya', batch: 'Alumni Batch 3', text: 'Latihan problem statement membantu tim kami fokus pada masalah pengguna.' }],
  },
  'fokus-dan-produktif-setiap-hari': {
    description: 'Bangun kebiasaan kerja yang membantu Anda menyelesaikan hal penting tanpa mengabaikan waktu istirahat. Kenali pola energi, tentukan prioritas, dan rancang jadwal yang realistis. Materi dilengkapi latihan refleksi untuk menyesuaikan sistem produktivitas dengan keseharian Anda.',
    tutorBio: 'Dimas memandu latihan mengatur prioritas, membangun kebiasaan kecil, dan mengevaluasi ritme kerja yang berkelanjutan.',
    modules: [
      { title: 'Kenali Pola Kerja Anda', lessons: [{ title: 'Audit waktu dan energi', minutes: 12 }, { title: 'Mengenali sumber distraksi', minutes: 10 }, { title: 'Menentukan prioritas harian', minutes: 15 }] },
      { title: 'Membangun Sistem Fokus', lessons: [{ title: 'Praktik time blocking', minutes: 18 }, { title: 'Menjaga fokus dan waktu istirahat', minutes: 12 }] },
      { title: 'Kebiasaan yang Berkelanjutan', lessons: [{ title: 'Merancang kebiasaan kecil', minutes: 15 }, { title: 'Refleksi dan evaluasi mingguan', minutes: 15 }] },
    ],
    reviews: [{ name: 'Nabila Rahma', batch: 'Alumni Batch 1', text: 'Latihan audit waktu membantu saya menyusun jadwal yang lebih realistis.' }, { name: 'Arif Hidayat', batch: 'Alumni Batch 2', text: 'Saya terbantu dengan contoh kebiasaan kecil dan evaluasi mingguan.' }],
  },
  'bangun-tim-yang-kolaboratif': {
    description: 'Bangun kerja sama tim melalui tujuan yang jelas, pembagian peran, dan komunikasi yang sehat. Pelajari cara memberikan umpan balik, memfasilitasi diskusi, serta menyelesaikan perbedaan pendapat. Cocok untuk pemimpin tim baru maupun anggota tim yang ingin berkolaborasi lebih efektif.',
    tutorBio: 'Raka membimbing peserta merancang kesepakatan kerja tim, menjalankan diskusi produktif, dan memberikan umpan balik yang membangun.',
    modules: [
      { title: 'Fondasi Kerja Sama Tim', lessons: [{ title: 'Menyepakati tujuan bersama', minutes: 15 }, { title: 'Memetakan peran dan tanggung jawab', minutes: 18 }, { title: 'Membangun rasa aman dalam tim', minutes: 15 }] },
      { title: 'Komunikasi dan Umpan Balik', lessons: [{ title: 'Mendengar secara aktif', minutes: 12 }, { title: 'Memberikan feedback yang jelas', minutes: 20 }] },
      { title: 'Kolaborasi dalam Praktik', lessons: [{ title: 'Mengelola konflik secara sehat', minutes: 22 }, { title: 'Memfasilitasi retrospektif tim', minutes: 18 }] },
    ],
    reviews: [{ name: 'Maya Lestari', batch: 'Alumni Batch 2', text: 'Panduan menyepakati peran membantu mengurangi pekerjaan yang tumpang tindih di tim.' }, { name: 'Yoga Permana', batch: 'Alumni Batch 4', text: 'Contoh percakapan feedback mudah diterapkan saat diskusi dengan rekan kerja.' }],
  },
  'content-planning-yang-konsisten': {
    description: 'Susun strategi konten yang konsisten dengan tujuan bisnis dan kebutuhan audiens. Tentukan pilar konten, buat kalender editorial, dan atur proses produksi yang bisa dijalankan tim. Pelajari juga cara mengevaluasi konten agar ide berikutnya semakin relevan.',
    tutorBio: 'Laras mengajarkan perencanaan konten mulai dari riset ide hingga kalender editorial dan evaluasi performa publikasi.',
    modules: [
      { title: 'Strategi dan Pilar Konten', lessons: [{ title: 'Memahami kebutuhan audiens', minutes: 12 }, { title: 'Menentukan pilar konten', minutes: 18 }, { title: 'Mengembangkan bank ide', minutes: 15 }] },
      { title: 'Kalender dan Produksi', lessons: [{ title: 'Menyusun kalender editorial', minutes: 20 }, { title: 'Membuat brief konten', minutes: 15 }] },
      { title: 'Distribusi dan Evaluasi', lessons: [{ title: 'Mengadaptasi konten lintas kanal', minutes: 18 }, { title: 'Mengevaluasi performa konten', minutes: 20 }] },
    ],
    reviews: [{ name: 'Intan Safitri', batch: 'Alumni Batch 1', text: 'Kalender editorial membuat proses produksi konten saya lebih teratur.' }, { name: 'Reza Mahendra', batch: 'Alumni Batch 3', text: 'Materi pilar konten membantu saya mencari ide tanpa keluar dari tujuan brand.' }],
  },
};
