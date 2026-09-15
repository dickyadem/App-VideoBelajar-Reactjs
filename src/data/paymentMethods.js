// Biaya tetap untuk demo lokal, bukan tarif resmi penyedia pembayaran.
export const ADMIN_FEE = 7000;
export const formatRupiah = (amount) => `Rp ${amount.toLocaleString('id-ID')}`;

export const paymentGroups = [
  { id: 'bank', title: 'Transfer Bank', options: [
    { id: 'bca', name: 'Bank BCA', brand: 'BCA', color: '#0065a8' },
    { id: 'bni', name: 'Bank BNI', brand: 'BNI', color: '#ed6a13' },
    { id: 'bri', name: 'Bank BRI', brand: 'BRI', color: '#00529c' },
    { id: 'mandiri', name: 'Bank Mandiri', brand: 'mandiri', color: '#003b70' },
  ] },
  { id: 'ewallet', title: 'E-Wallet', options: [
    { id: 'dana', name: 'Dana', brand: 'DANA', color: '#008ceb' },
    { id: 'ovo', name: 'OVO', brand: 'OVO', color: '#62459b' },
    { id: 'linkaja', name: 'LinkAja', brand: 'LinkAja!', color: '#e8212c' },
    { id: 'shopeepay', name: 'Shopee Pay', brand: 'S', color: '#ee4d2d' },
  ] },
  { id: 'card', title: 'Kartu Kredit/Debit', options: [
    { id: 'card', name: 'Kartu Kredit/Debit', brands: ['Mastercard', 'VISA', 'JCB'] },
  ] },
];
