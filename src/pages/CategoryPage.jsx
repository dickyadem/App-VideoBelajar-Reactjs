import { useMemo, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { courses } from '../data/courses';

const filters = [
  ['Bidang Studi', ['Pemasaran', 'Digital & Teknologi', 'Pengembangan Diri', 'Bisnis Manajemen']],
  ['Harga', ['Pemasaran', 'Digital & Teknologi', 'Pengembangan Diri', 'Bisnis Manajemen']],
  ['Durasi', ['Kurang dari 4 Jam', '4 - 8 Jam', 'Lebih dari 8 Jam']],
];
const studyCategories = { Pemasaran: 'marketing', 'Digital & Teknologi': 'design', 'Pengembangan Diri': 'personal', 'Bisnis Manajemen': 'business' };

export default function CategoryPage() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');
  const [category, setCategory] = useState('all');
  const [selectedStudies, setSelectedStudies] = useState([]);

  const visibleCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesCategory = category === 'all' || course.category === category;
      const matchesStudy = selectedStudies.length === 0 || selectedStudies.includes(course.category);
      const matchesQuery = `${course.title} ${course.description} ${course.instructorName}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesStudy && matchesQuery;
    });
    if (sort === 'price') return [...filtered].sort((first, second) => first.price.localeCompare(second.price));
    return filtered;
  }, [category, query, selectedStudies, sort]);

  return <><Header /><main className="category-page"><div className="container"><header className="category-intro"><h1>Koleksi Video Pembelajaran Unggulan</h1><p>Jelajahi Dunia Pengetahuan Melalui Pilihan Kami</p></header><div className="category-layout"><aside className="filter-panel"><div className="filter-heading"><strong>Filter</strong><button type="button" onClick={() => { setCategory('all'); setQuery(''); setSelectedStudies([]); }}>Reset</button></div>{filters.map(([title, options]) => <fieldset className="filter-group" key={title}><legend>{title}<span aria-hidden="true">⌃</span></legend>{options.map((option) => <label key={option}><input type={title === 'Durasi' ? 'radio' : 'checkbox'} name={title} checked={title === 'Bidang Studi' ? selectedStudies.includes(studyCategories[option]) : undefined} onChange={title === 'Bidang Studi' ? () => setSelectedStudies((current) => current.includes(studyCategories[option]) ? current.filter((value) => value !== studyCategories[option]) : [...current, studyCategories[option]]) : undefined} /><span>{option}</span></label>)}</fieldset>)}</aside><section className="catalog" aria-label="Katalog kelas"><div className="catalog-controls"><select aria-label="Urutkan" value={sort} onChange={(event) => setSort(event.target.value)}><option value="default">Urutkan</option><option value="price">Harga</option></select><label className="search-box"><span className="sr-only">Cari Kelas</span><input placeholder="Cari Kelas" value={query} onChange={(event) => setQuery(event.target.value)} /><span aria-hidden="true">⌕</span></label></div><CategoryTabs categories={[['all', 'Semua Kelas'], ['marketing', 'Pemasaran'], ['design', 'Digital & Teknologi'], ['personal', 'Pengembangan Diri'], ['business', 'Bisnis Manajemen']]} selectedCategory={category} onChange={setCategory} /><div className="category-course-grid">{visibleCourses.map((course) => <CourseCard key={course.title} course={course} />)}</div><nav className="pagination" aria-label="Paginasi"><button type="button" aria-label="Halaman sebelumnya">‹</button>{[1, 2, 3, 4, 5, 6].map((page) => <button className={page === 1 ? 'active' : ''} type="button" key={page}>{page}</button>)}<button type="button" aria-label="Halaman berikutnya">›</button></nav></section></div></div></main><Footer /></>;
}