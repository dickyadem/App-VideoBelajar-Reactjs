import { useEffect, useMemo, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCatalog } from '../context/CatalogContext';


const PAGE_SIZE = 4;
const extraFilters = [
  ['Harga', ['Di bawah Rp 200K', 'Rp 200K - 300K', 'Di atas Rp 300K']],
  ['Durasi', ['Kurang dari 4 Jam', '4 - 8 Jam', 'Lebih dari 8 Jam']],
];

export default function CategoryPage() {
  const { courses, courseDetails, categories } = useCatalog();
  const studyOptions = categories.map(([slug, label]) => [slug, slug === 'design' ? 'Digital & Teknologi' : slug === 'business' ? 'Bisnis Manajemen' : label]);
  const categoryOptions = [['all', 'Semua Kelas'], ...studyOptions];
  const studyCategories = Object.fromEntries(studyOptions.map(([slug, label]) => [label, slug]));
  const filters = [['Bidang Studi', studyOptions.map(([, label]) => label)], ...extraFilters];
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');
  const [category, setCategory] = useState('all');
  const [selectedStudies, setSelectedStudies] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const visibleCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesCategory = category === 'all' || course.category === category;
      const matchesStudy = selectedStudies.length === 0 || selectedStudies.includes(course.category);
      const matchesPrice = !selectedPrice || (selectedPrice === 'low' && course.priceAmount < 200000) || (selectedPrice === 'mid' && course.priceAmount >= 200000 && course.priceAmount <= 300000) || (selectedPrice === 'high' && course.priceAmount > 300000);
      const minutes = courseDetails[course.slug].modules.reduce((total, module) => total + module.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0), 0);
      const matchesDuration = !selectedDuration || (selectedDuration === 'short' && minutes < 240) || (selectedDuration === 'medium' && minutes >= 240 && minutes <= 480) || (selectedDuration === 'long' && minutes > 480);
      const matchesQuery = `${course.title} ${course.description} ${course.instructorName}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesStudy && matchesPrice && matchesDuration && matchesQuery;
    });
    if (sort === 'price') return [...filtered].sort((first, second) => first.priceAmount - second.priceAmount);
    return filtered;
  }, [courses, courseDetails, category, query, selectedStudies, selectedPrice, selectedDuration, sort]);

  const pageCount = Math.ceil(visibleCourses.length / PAGE_SIZE);
  const pageCourses = visibleCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setCategory('all');
    setQuery('');
    setSelectedStudies([]);
    setSelectedPrice('');
    setSelectedDuration('');
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
              <input type={title === 'Bidang Studi' ? 'checkbox' : 'radio'} name={title}
                checked={title === 'Bidang Studi' ? selectedStudies.includes(studyCategories[option]) : title === 'Harga' ? selectedPrice === (option === 'Di bawah Rp 200K' ? 'low' : option === 'Rp 200K - 300K' ? 'mid' : 'high') : selectedDuration === (option === 'Kurang dari 4 Jam' ? 'short' : option === '4 - 8 Jam' ? 'medium' : 'long')}
                onChange={title === 'Bidang Studi' ? () => toggleStudy(studyCategories[option]) : title === 'Harga' ? () => { setSelectedPrice(option === 'Di bawah Rp 200K' ? 'low' : option === 'Rp 200K - 300K' ? 'mid' : 'high'); setPage(1); } : () => { setSelectedDuration(option === 'Kurang dari 4 Jam' ? 'short' : option === '4 - 8 Jam' ? 'medium' : 'long'); setPage(1); }} />
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
          <CategoryTabs categories={categoryOptions} selectedCategory={category} onChange={(value) => { setCategory(value); setPage(1); }} />
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
