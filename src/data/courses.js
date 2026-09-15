const image = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=85&w=700`;
const avatar = (seed, color) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${color}`;

export const courses = [
  ['business', '1554224155-6726b3ff858f', 'Big 4 Auditor Financial Analyst', 'Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan...', 'Jenna Ortega', 'Senior Accountant di Gojek', 'Jenna', 'ffdfbf', 'Rp 300K'],
  ['marketing', '1454165804606-c3d57bc86b40', 'Strategi Marketing Berbasis Data', 'Susun kampanye yang terukur dari riset audiens sampai evaluasi performa.', 'Andra Ramadhan', 'Digital Marketer', 'Andra', 'c0aede', 'Rp 250K'],
  ['design', '1542435503-956c469947f6', 'Design Thinking Praktis', 'Ubah masalah pengguna menjadi solusi yang sederhana, relevan, dan berdampak.', 'Nadia Sari', 'UI/UX Designer', 'Nadia', 'ffd5dc', 'Rp 275K'],
  ['personal', '1434030216411-0b793f4b4173', 'Fokus dan Produktif Setiap Hari', 'Bangun sistem sederhana untuk mengatur energi, waktu, dan prioritas.', 'Dimas Mahendra', 'Productivity Coach', 'Dimas', 'd1d4f9', 'Rp 180K'],
  ['business', '1517245386807-bb43f82c33c4', 'Bangun Tim yang Kolaboratif', 'Pelajari cara membangun komunikasi dan budaya kerja yang sehat.', 'Raka Firmansyah', 'Business Consultant', 'Raka', 'b6e3f4', 'Rp 220K'],
  ['marketing', '1501504905252-473c47e087f8', 'Content Planning yang Konsisten', 'Buat kalender konten yang rapi dan tetap dekat dengan kebutuhan audiens.', 'Laras Nirmala', 'Content Strategist', 'Laras', 'ffdfbf', 'Rp 200K'],
].map(([category, imageId, title, description, instructorName, instructorRole, seed, color, price]) => ({ category, image: image(imageId), imageAlt: title, title, description, instructorName, instructorRole, instructorImage: avatar(seed, color), rating: '3.5 (86)', price }));
