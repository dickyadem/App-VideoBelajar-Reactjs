import congratsImage from '../../assets/images/information-image/congrats.webp';
import tryAgainImage from '../../assets/images/information-image/tryAgain.webp';
import submitImage from '../../assets/images/information-image/submit.webp';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import CourseProgress, { ModuleIcon, useCourseProgress } from '../components/CourseProgress';
import ReviewButton from '../components/ReviewButton';
import Footer from '../components/Footer';
import { courses } from '../data/courses';
import { courseDetails } from '../data/courseDetails';
import '../../assets/css/quiz.css';

const questions = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  correctIndex: 0,
  text: 'Memikirkan dan mengantisipasi secara teliti adanya user secara tidak sengaja mengutak-atik konfigurasi, namun dapat diatasi dengan membuat default yang mengurangi kepanikan pada user adalah pengertian dari ...',
  options: ['Memikirkan tentang default', 'Mempertimbangkan page layout berdasarkan suatu tujuan tertentu', 'Memastikan bahwa sistem berjalan sesuai dengan apa yang terjadi saat itu juga', 'Menciptakan konsistensi dan menggunakan elemen UI umum'],
}));

function Modules({ detail, assessmentTitle, assessment, progress }) {
  const { slug } = useParams();
  return <aside className="quiz-modules" aria-label="Daftar modul"><h2>Daftar Modul</h2><section><h3>Introduction to HR <span aria-hidden="true">⌃</span></h3>{detail.modules.flatMap((module) => module.lessons).map((lesson) => <div className="quiz-module-item" key={lesson.title}><ModuleIcon completed={progress.completed.includes(lesson.title)}>▷</ModuleIcon><span>{lesson.title}<small>{lesson.minutes} Menit</small></span></div>)}<Link className="quiz-module-item" to={`/learn/${slug}`} state={{ assessment: 'summary' }}><ModuleIcon completed={progress.completed.includes('summary')}>▤</ModuleIcon><span>Rangkuman: Introduction to HR<small>Dokumen rangkuman</small></span></Link><div className="quiz-module-item is-selected"><ModuleIcon completed={progress.completed.includes(assessment)}>▣</ModuleIcon><span>{assessmentTitle}: Introduction to HR<small>10 Pertanyaan</small></span></div></section><ReviewButton className="quiz-review" /></aside>;
}

export default function QuizPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const assessment = pathname.split('/').pop();
  const course = courses.find((item) => item.slug === slug);
  const detail = course && courseDetails[slug];
  const progress = useCourseProgress(slug, detail);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState(null);
  const question = questions[current];
  const assessmentTitle = assessment === 'pretest' ? 'Pre-Test' : assessment === 'exam' ? 'Ujian Akhir' : 'Quiz';
  if (!course || !detail) return <><Header /><main className="container quiz-not-found"><h1>Kelas tidak ditemukan</h1><Link className="btn btn-primary" to="/classes">Kembali ke Kelas Saya</Link></main><Footer /></>;
  const selectAnswer = (answer) => setAnswers((existing) => ({ ...existing, [question.id]: answer }));
  const finish = () => setConfirmOpen(true);
  const completeAssessment = () => {
    const correct = questions.filter((item) => answers[item.id] === item.options[item.correctIndex]).length;
    setConfirmOpen(false);
    if (assessment === 'pretest' || correct >= 6) progress.markComplete(assessment);
    setResult({ passed: correct >= 6, score: correct * 10, correct, wrong: questions.length - correct });
  };
  if (result) return <div className="quiz-page"><header className="learning-header"><Link to={`/learn/${slug}`} aria-label="Kembali ke kelas">←</Link><strong>{course.title}</strong><CourseProgress progress={progress} course={course} /><Link className="learning-avatar" to="/profile" aria-label="Profil Saya">{user?.photo ? <img className="user-avatar-photo" src={user.photo} alt="" /> : user?.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</Link></header><main className="quiz-result"><section className="quiz-result-content"><img className="quiz-result-image" src={result.passed ? congratsImage : tryAgainImage} alt={result.passed ? 'Selamat, penilaian selesai' : 'Coba lagi'} /><h1>{result.passed ? 'Selesai!' : 'Sedikit Lagi!'}</h1><p>Tanggal {assessmentTitle}:<br />23 September 2022, 10:20 AM</p><div className="quiz-score"><div><small>Nilai</small><strong>{result.score}</strong></div><div><small>Soal</small><strong>10</strong></div><div><small>Benar</small><strong>✓ {result.correct}</strong></div><div><small>Salah</small><strong>× {result.wrong}</strong></div></div><p>{result.passed ? `${assessmentTitle} sudah selesai dan kami sudah mengetahui progresmu.` : `Kamu sudah menyelesaikan ${assessmentTitle.toLowerCase()} dengan baik namun nilaimu belum cukup untuk melanjutkan materi.`}</p><button className="btn btn-primary" type="button" onClick={() => navigate(`/learn/${slug}`, { state: { assessment } })}>{result.passed ? 'Mulai Kelas' : `Ulangi ${assessmentTitle}`}</button></section><Modules detail={detail} assessmentTitle={assessmentTitle} assessment={assessment} progress={progress} /></main><footer className="learning-bottom"><button type="button">‹ <span>{course.title}</span></button><button type="button"><span>{course.title}</span> ›</button></footer></div>;
  return <div className="quiz-page"><header className="learning-header"><Link to={`/learn/${slug}`} aria-label="Kembali ke kelas">←</Link><strong>{course.title}</strong><CourseProgress progress={progress} course={course} /><Link className="learning-avatar" to="/profile" aria-label="Profil Saya">{user?.photo ? <img className="user-avatar-photo" src={user.photo} alt="" /> : user?.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</Link></header><main className="quiz-main"><aside className="question-list"><h1>List Soal</h1><div>{questions.map((item, index) => <button key={item.id} type="button" className={`${current === index ? 'is-current ' : ''}${answers[item.id] ? 'is-answered' : ''}`} onClick={() => setCurrent(index)}>{item.id}</button>)}</div><p>Selesaikan semua soal untuk mengakhiri {assessmentTitle.toLowerCase()}</p></aside><section className="question-content"><h1>{assessmentTitle} - Pertanyaan {question.id}</h1><p className="question-text">{question.text}</p><div className="answer-list">{question.options.map((option) => <label key={option} className={answers[question.id] === option ? 'is-selected' : ''}><input type="radio" name={`question-${question.id}`} checked={answers[question.id] === option} onChange={() => selectAnswer(option)} /><span>{option}{option === question.options[0] && ' *'}</span></label>)}</div><div className="question-actions"><button type="button" disabled={current === 0} onClick={() => setCurrent(current - 1)}>← Sebelumnya</button>{current === questions.length - 1 ? <button className="finish-button" type="button" onClick={finish}>Selesaikan →</button> : <button className="next-button" type="button" aria-label="Selanjutnya" onClick={() => setCurrent(current + 1)}>Selanjutnya →</button>}</div></section><Modules detail={detail} assessmentTitle={assessmentTitle} assessment={assessment} progress={progress} /></main><footer className="learning-bottom"><button type="button">‹ <span>{course.title}</span></button><button type="button"><span>{course.title}</span> ›</button></footer>{confirmOpen && <div className="quiz-modal-backdrop" role="presentation"><section className="quiz-submit-modal" role="dialog" aria-modal="true" aria-labelledby="submit-title"><img className="quiz-submit-image" src={submitImage} alt="" /><h2 id="submit-title">Selesaikan {assessmentTitle}</h2><p>Apakah kamu yakin untuk menyelesaikan {assessmentTitle.toLowerCase()} ini?</p><div><button type="button" onClick={() => setConfirmOpen(false)}>Batal</button><button className="quiz-submit-confirm" type="button" onClick={completeAssessment}>Selesai</button></div></section></div>}</div>;
}
