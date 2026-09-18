import { getCourseCatalog, readCollection } from './courseService';

const categoryLabels = { marketing: 'Pemasaran', design: 'Desain', personal: 'Pengembangan Diri', business: 'Bisnis' };
const paymentLabels = { bank: 'Transfer Bank', ewallet: 'E-Wallet', card: 'Kartu Kredit/Debit' };

export async function getCatalog() {
  const [catalog, categories, methods] = await Promise.all([
    getCourseCatalog(),
    readCollection('categories'),
    readCollection('payment-methods'),
  ]);

  const paymentGroups = [];
  methods.filter((method) => method.isActive === true).forEach((method) => {
    let group = paymentGroups.find((item) => item.id === method.type);
    if (!group) {
      group = { id: method.type, title: paymentLabels[method.type] || method.type, options: [] };
      paymentGroups.push(group);
    }
    // The original seed omitted card brands; these are display metadata only.
    group.options.push(method.id === 'card' ? { ...method, brands: method.brands || ['Mastercard', 'VISA', 'JCB'] } : method);
  });

  return {
    ...catalog,
    categories: categories.map((category) => {
      const slug = category.slug || category.id;
      return [slug, categoryLabels[slug] || category.name || slug];
    }),
    paymentGroups,
  };
}
