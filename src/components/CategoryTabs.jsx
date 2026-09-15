export default function CategoryTabs({ categories, selectedCategory, onChange }) {
  return <div className="category-list" role="tablist" aria-label="Kategori kelas">
    {categories.map(([value, label]) => <button className={`category-btn ${selectedCategory === value ? 'active' : ''}`} data-category={value} key={value} onClick={() => onChange(value)} type="button">{label}</button>)}
  </div>;
}
