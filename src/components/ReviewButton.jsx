import { useId, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../../assets/css/review.css';

export default function ReviewButton({ className }) {
  const { slug } = useParams();
  const { user } = useAuth();
  const dialog = useRef(null);
  const id = useId();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const storageKey = `videobelajar-review:${user?.name}:${slug}`;

  function openReview() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { saved = null; }
    setRating(Number.isInteger(saved?.rating) && saved.rating >= 1 && saved.rating <= 5 ? saved.rating : 0);
    setReview(typeof saved?.review === 'string' ? saved.review : '');
    setError('');
    setMessage('');
    dialog.current.showModal();
  }

  function submit(event) {
    event.preventDefault();
    if (!rating || !review.trim()) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ rating, review: review.trim() }));
      dialog.current.close();
      setMessage('Review tersimpan di browser ini. Terima kasih!');
    } catch {
      setError('Review belum tersimpan. Silakan coba lagi.');
    }
  }

  return <>
    <button className={className} type="button" onClick={openReview}>☆ Beri Review &amp; Rating</button>
    {message && <p className="review-notice" role="status">{message}</p>}
    <dialog className="review-dialog" ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
      <form onSubmit={submit}>
        <h2 id={`${id}-title`}>Tulis Review Terbaikmu!</h2>
        <p id={`${id}-description`}>Bagikan pengalaman belajarmu dan berikan rating untuk kelas ini.</p>
        <fieldset className="review-stars">
          <legend className="review-sr-only">Rating kelas</legend>
          {[1, 2, 3, 4, 5].map((value) => <label key={value}>
            <input type="radio" name={`${id}-rating`} value={value} checked={rating === value} onChange={() => setRating(value)} aria-label={`${value} bintang`} required />
            <span aria-hidden="true" className={value <= rating ? 'is-filled' : ''}>★</span>
          </label>)}
        </fieldset>
        <label className="review-sr-only" htmlFor={`${id}-text`}>Review</label>
        <textarea id={`${id}-text`} placeholder="Masukkan Review" value={review} onChange={(event) => setReview(event.target.value)} maxLength={2000} required />
        {error && <p role="alert">{error}</p>}
        <div className="review-actions">
          <button type="button" onClick={() => dialog.current.close()}>Batal</button>
          <button type="submit" disabled={!rating || !review.trim()}>Selesai</button>
        </div>
      </form>
    </dialog>
  </>;
}
