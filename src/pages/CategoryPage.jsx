import { useMemo, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { courses } from '../data/courses';

const PAGE_SIZE = 4;
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
  const [page, setPage] = useState(1);

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

  const pageCount = Math.ceil(visibleCourses.length / PAGE_SIZE);
  const pageCourses = visibleCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setCategory('all');
    setQuery('');
    setSelectedStudies([]);
    setPage(1);
  }

  function toggleStudy(value) {
    setSelectedStudies((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
    setPage(1);
  }

  return <><Header /><main className="category-page">
    <div className="container">
      <header className="category-intro">
        <h1>Koleksi Video Pembelajaran Unggulan</h1>
        <p>Jelajahi Dunia Pengetahuan Melalui Pilihan Kami</p>
      </header>
      <div className="category-layout">
        <aside className="filter-panel">
          <div className="filter-heading"><strong>Filter</strong><button type="button" onClick={resetFilters}>Reset</button></div>
          {filters.map(([title, options]) => <fieldset className="filter-group" key={title}>
            <legend>{title}<span aria-hidden="true">⌃</span></legend>
            {options.map((option) => <label key={option}>
              <input type={title === 'Durasi' ? 'radio' : 'checkbox'} name={title}
                checked={title === 'Bidang Studi' ? selectedStudies.includes(studyCategories[option]) : undefined}
                onChange={title === 'Bidang Studi' ? () => toggleStudy(studyCategories[option]) : undefined} />
              <span>{option}</span>
            </label>)}
          </fieldset>)}
        </aside>
        <section className="catalog" aria-label="Katalog kelas">
          <div className="catalog-controls">
            <select aria-label="Urutkan" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
              <option value="default">Urutkan</option><option value="price">Harga</option>
            </select>
            <label className="search-box">
              <span className="sr-only">Cari Kelas</span>
              <input placeholder="Cari Kelas" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
              <span aria-hidden="true">⌕</span>
            </label>
          </div>
          <CategoryTabs categories={[
            ['all', 'Semua Kelas'], ['marketing', 'Pemasaran'], ['design', 'Digital & Teknologi'],
            ['personal', 'Pengembangan Diri'], ['business', 'Bisnis Manajemen'],
          ]} selectedCategory={category} onChange={(value) => { setCategory(value); setPage(1); }} />
          <div className="category-course-grid">
            {pageCourses.map((course) => <CourseCard key={course.slug} course={course} />)}
          </div>
          {pageCount === 0 ? <p role="status">Tidak ada kelas yang sesuai. Coba pencarian atau filter lain.</p> : <>
            <p className="catalog-page-summary" role="status">Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, visibleCourses.length)} dari {visibleCourses.length} kelas</p>
            <nav className="pagination" aria-label="Paginasi">
              <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button
                className={page === number ? 'active' : ''} type="button" key={number}
                aria-current={page === number ? 'page' : undefined} onClick={() => setPage(number)}>{number}</button>)}
              <button type="button" aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => setPage(page + 1)}>›</button>
            </nav>
          </>}
        </section>
      </div>
    </div>
  </main><Footer /></>;
}
