import bcaLogo from '../../assets/images/BCA.png';
import bniLogo from '../../assets/images/BNI.png';
import briLogo from '../../assets/images/BRI.png';
import mandiriLogo from '../../assets/images/Mandiri.png';
import danaLogo from '../../assets/images/Dana.png';
import ovoLogo from '../../assets/images/OPO.png';
import linkajaLogo from '../../assets/images/Link Aja!.png';
import shopeepayLogo from '../../assets/images/Shopeepay.png';
import mastercardLogo from '../../assets/images/Master Card.png';
import visaLogo from '../../assets/images/VISA.png';
import jcbLogo from '../../assets/images/JCB.png';

export const paymentLogos = {
  bca: bcaLogo,
  bni: bniLogo,
  bri: briLogo,
  mandiri: mandiriLogo,
  dana: danaLogo,
  ovo: ovoLogo,
  linkaja: linkajaLogo,
  shopeepay: shopeepayLogo,
  mastercard: mastercardLogo,
  visa: visaLogo,
  jcb: jcbLogo,
};

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
