import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courses } from '../data/courses';
import { courseDetails } from '../data/courseDetails';
import '../../assets/css/learning.css';

const pretest = { type: 'pretest', title: 'Pre-Test: Introduction to HR', minutes: 5 };
const quiz = { type: 'quiz', title: 'Quiz: Introduction to HR', minutes: 10 };
const exam = { type: 'exam', title: 'Ujian Akhir: Introduction to HR', minutes: 10 };

function LessonList({ detail, selectedLesson, onSelect }) {
  return <aside className="learning-sidebar" aria-label="Daftar modul"><div className="learning-certificate"><strong>25% Modul Telah Selesai</strong><p>Selesaikan Semua Modul Untuk Mendapatkan Sertifikat</p><button type="button" disabled>Ambil Sertifikat</button></div><div className="learning-modules"><section><h2>Introduction to HR <span aria-hidden="true">⌃</span></h2><button type="button" className={selectedLesson.type === 'pretest' ? 'is-selected' : ''} onClick={() => onSelect(pretest)}><span aria-hidden="true">♧</span><span>Pre-Test: Introduction to HR<small>10 Pertanyaan</small></span></button>{detail.modules.flatMap((module) => module.lessons).map((lesson) => <button key={lesson.title} type="button" className={selectedLesson.title === lesson.title ? 'is-selected' : ''} onClick={() => onSelect(lesson)}><span aria-hidden="true">{selectedLesson.title === lesson.title ? '●' : '▷'}</span><span>{lesson.title}<small>{lesson.minutes} Menit</small></span></button>)}<button type="button" className={selectedLesson.type === 'quiz' ? 'is-selected' : ''} onClick={() => onSelect(quiz)}><span aria-hidden="true">▣</span><span>Quiz: Introduction to HR<small>10 Pertanyaan</small></span></button><button type="button" className={selectedLesson.type === 'exam' ? 'is-selected' : ''} onClick={() => onSelect(exam)}><span aria-hidden="true">♧</span><span>Ujian Akhir: Introduction to HR<small>10 Pertanyaan</small></span></button></section></div><button className="learning-review" type="button">☆ Beri Review & Rating</button></aside>;
}

export default function LearningPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const course = courses.find((item) => item.slug === slug);
  const detail = course && courseDetails[slug];
  const lessons = detail?.modules.flatMap((module) => module.lessons) || [];
  const [selectedLesson, setSelectedLesson] = useState(pretest);
  const moduleItems = [pretest, ...lessons, quiz, exam];
  const lessonIndex = moduleItems.findIndex((lesson) => lesson.title === selectedLesson.title);
  const previous = moduleItems[lessonIndex - 1];
  const next = moduleItems[lessonIndex + 1];
  const moduleLabel = useMemo(() => selectedLesson.type === 'pretest' ? 'Introduction to HR' : detail?.modules.find((module) => module.lessons.some((lesson) => lesson.title === selectedLesson.title))?.title || '', [detail, selectedLesson]);
  if (!course || !detail) return <><Header /><main className="container learning-not-found"><h1>Kelas tidak ditemukan</h1><Link className="btn btn-primary" to="/classes">Kembali ke Kelas Saya</Link></main><Footer /></>;
  const isPretest = selectedLesson.type === 'pretest';
  const isQuiz = selectedLesson.type === 'quiz';
  const isExam = selectedLesson.type === 'exam';
  const isAssessment = isPretest || isQuiz || isExam;
  const assessmentName = isExam ? 'Ujian Akhir' : isQuiz ? 'Quiz' : 'Pre-Test';
  const assessmentCopy = isPretest ? 'Kerjakan pretest dengan sebaik mungkin untuk mengukur pemahaman awalmu terkait materi yang akan kamu pelajari' : isQuiz ? 'Kerjakan quiz dengan sebaik mungkin untuk mengukur pemahaman terkait materi yang telah kamu pelajari' : 'Kerjakan ujian akhir dengan sebaik mungkin untuk mengukur pemahamanmu terkait seluruh materi yang telah kamu pelajari';
  return <div className="learning-page"><header className="learning-header"><Link to="/classes" aria-label="Kembali ke Kelas Saya">←</Link><strong>{course.title}</strong><div className="learning-progress"><span /><b>10/12⌄</b></div><span className="learning-avatar" aria-hidden="true">DA</span></header><main className="learning-main"><section className="learning-content">{isAssessment ? <div className="learning-pretest-hero" style={{ backgroundImage: `url("${course.image}")` }}><span>RULES</span></div> : <div className="learning-video"><button type="button" aria-label={`Mulai pelajaran ${selectedLesson.title}`}>▶</button></div>}<div className="learning-info">{isAssessment ? <><h1>Aturan</h1><p>{assessmentCopy}</p><p>Syarat Nilai Kelulusan: {isPretest ? '-' : '60%'}<br />Durasi Ujian: {isPretest ? '5 Menit' : '10 Menit'}</p><p>{isPretest ? 'Jangan khawatir, total skor tidak akan memengaruhi kelulusan dan penilaian akhirmu dalam rangkaian kelas ini' : 'Kerjakan dengan sebaik mungkin untuk mencapai skor minimal agar kamu dapat melanjutkan ke modul berikutnya'}</p><button className="btn btn-primary" type="button" onClick={() => isAssessment ? navigate(`/learn/${slug}/${isPretest ? 'pretest' : isQuiz ? 'quiz' : 'exam'}`) : undefined}>Mulai {assessmentName}</button></> : <><p className="learning-module">{moduleLabel}</p><h1>{selectedLesson.title}</h1><p>{detail.description}</p><div className="learning-tutor"><img src={course.instructorImage} alt="" /><span><strong>{course.instructorName}</strong><small>{course.instructorRole}</small></span></div><div className="learning-rating"><span>★★★☆☆</span> <u>{course.rating}</u></div></>}</div></section><LessonList detail={detail} selectedLesson={selectedLesson} onSelect={setSelectedLesson} /></main><footer className="learning-bottom"><button type="button" disabled={!previous} onClick={() => setSelectedLesson(previous)}>‹ <span>{previous?.title || 'Sebelumnya'}</span></button><button type="button" disabled={!next} onClick={() => setSelectedLesson(next)}><span>{next?.title || 'Selesai'}</span> ›</button></footer></div>;
}
