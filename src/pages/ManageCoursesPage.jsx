import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { addCourse, editCourse, removeCourse } from '../store/redux/coursesReducer';
import '../../assets/css/manage-courses.css';

const emptyForm = { title: '', category: '', priceAmount: '', description: '', image: '', instructorName: '', instructorRole: '', instructorImage: '' };

export default function ManageCoursesPage() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses);
  const categories = useSelector((state) => state.catalog.categories);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const reset = () => { setForm(emptyForm); setEditing(null); };
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function save(event) {
    event.preventDefault();
    if (busy) return;
    setError(''); setMessage('');
    const priceAmount = Number(form.priceAmount);
    if (!form.title.trim() || !form.category || form.priceAmount === '' || !Number.isFinite(priceAmount) || priceAmount < 0) {
      setError('Isi judul, kategori, dan harga yang valid.');
      return;
    }
    const data = { ...form, title: form.title.trim(), priceAmount };
    setBusy(true);
    try {
      await dispatch(editing ? editCourse({ id: editing, changes: data }) : addCourse({ ...data, status: 'published' })).unwrap();
      reset();
      setMessage('Kelas berhasil disimpan.');
    } catch {
      setError('Gagal menyimpan kelas. Periksa koneksi dan izin pengelolaan kelas, lalu coba lagi.');
    } finally { setBusy(false); }
  }

  async function remove(course) {
    if (busy || !window.confirm(`Hapus kelas "${course.title}" dari katalog?`)) return;
    setBusy(true); setError(''); setMessage('');
    try {
      await dispatch(removeCourse(course.id)).unwrap();
      if (editing === course.id) reset();
      setMessage('Kelas berhasil dihapus.');
    } catch {
      setError('Gagal menghapus kelas. Periksa koneksi dan izin pengelolaan kelas, lalu coba lagi.');
    } finally { setBusy(false); }
  }

  return <><Header /><main className="container section manage-courses">
    <h1>Kelola Kelas</h1>
    <p>Tambah dan perbarui kelas yang dipublikasikan di katalog. Perubahan membutuhkan akun dengan izin pengelolaan kelas.</p>
    <Link className="text-link" to="/">Lihat katalog</Link>
    <form onSubmit={save}>
      <h2>{editing ? 'Edit kelas' : 'Tambah kelas'}</h2>
      <fieldset disabled={busy}>
        <label>Judul kelas<input name="title" value={form.title} onChange={change} required /></label>
        <label>Kategori<select name="category" value={form.category} onChange={change} required>
          <option value="">Pilih kategori</option>
          {categories.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select></label>
        <label>Harga (Rp)<input name="priceAmount" type="number" min="0" step="1" value={form.priceAmount} onChange={change} required /></label>
        <label>Deskripsi<textarea name="description" value={form.description} onChange={change} /></label>
        <label>Gambar kelas (URL)<input name="image" value={form.image} onChange={change} placeholder="https://... atau /assets/..." /></label>
        <label>Nama tutor<input name="instructorName" value={form.instructorName} onChange={change} /></label>
        <label>Profesi tutor<input name="instructorRole" value={form.instructorRole} onChange={change} /></label>
        <label>Foto tutor (URL)<input name="instructorImage" value={form.instructorImage} onChange={change} /></label>
        <div className="manage-course-actions">
          <button className="btn btn-primary" type="submit">{busy ? 'Menyimpan...' : editing ? 'Simpan perubahan' : 'Tambah kelas'}</button>
          {editing && <button className="btn btn-soft" type="button" onClick={reset}>Batal edit</button>}
        </div>
      </fieldset>
    </form>
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    <h2>Daftar kelas</h2>
    {!courses.length && <p>Belum ada kelas tersedia.</p>}
    <ul className="manage-course-list">{courses.map((course) => <li key={course.id}>
      <div><Link to={`/course/${course.slug}`}>{course.title}</Link><p>{course.price}</p></div>
      <div className="manage-course-actions">
        <button className="btn btn-soft" type="button" disabled={busy} aria-label={`Edit ${course.title}`} onClick={() => {
          setEditing(course.id);
          setForm(Object.fromEntries(Object.keys(emptyForm).map((key) => [key, course[key] ?? ''])));
          setError(''); setMessage('');
        }}>Edit</button>
        <button className="btn btn-soft" type="button" disabled={busy} aria-label={`Hapus ${course.title}`} onClick={() => remove(course)}>Hapus</button>
      </div>
    </li>)}</ul>
  </main><Footer /></>;
}
