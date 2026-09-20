import { Link } from 'react-router-dom';
import { useState } from 'react';
import PasswordInput from './PasswordInput';

export default function AuthForm({ title, description, fields, submitLabel, secondaryLabel, secondaryTo, successMessage, requiresConfirmation = false, onSuccess }) {
  const initialValues = Object.fromEntries(fields.map(({ id }) => [id, '']));
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (id) => (event) => setValues({ ...values, [id]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (requiresConfirmation && values.password !== values.confirmation) { setMessage('Konfirmasi kata sandi harus sama.'); return; }
    setSubmitting(true); setMessage('');
    try {
      await onSuccess?.(values);
      setMessage(successMessage);
      setValues(initialValues);
      form.reset();
    } catch (error) { setMessage(error?.message || 'Proses gagal. Periksa data lalu coba lagi.'); }
    finally { setSubmitting(false); }
  }
  return <main className="auth-main"><section className="auth-card" aria-labelledby="auth-title"><h1 id="auth-title">{title}</h1><p>{description}</p><form onSubmit={submit}>{fields.map((field) => field.type === 'password' ? <PasswordInput key={field.id} id={field.id} label={field.label} value={values[field.id]} onChange={update(field.id)} placeholder={field.placeholder} /> : <div className="form-group" key={field.id}><label className="form-label" htmlFor={field.id}>{field.label} <span className="required" aria-hidden="true">*</span></label>{field.id === 'phone' ? <div className="phone-row"><span className="country-code" aria-label="Kode negara Indonesia">+62</span><input className="form-input" id={field.id} type="tel" value={values[field.id]} onChange={update(field.id)} placeholder={field.placeholder} required /></div> : <input className="form-input" id={field.id} type={field.type} value={values[field.id]} onChange={update(field.id)} placeholder={field.placeholder} required />}</div>)}<a className="forgot" href="#auth-title" onClick={(event) => { event.preventDefault(); document.getElementById('auth-title')?.scrollIntoView(); }}>Lupa Password?</a><div className="form-actions"><button className="btn btn-primary" type="submit" disabled={submitting}>{submitLabel}</button><Link className="btn btn-soft" to={secondaryTo}>{secondaryLabel}</Link></div><div className="divider"><span>atau</span></div><button className="btn btn-google" type="button"><img className="google-icon" src={`${import.meta.env.BASE_URL}assets/icons/logos_google-icon.png`} alt="" />{title === 'Masuk ke Akun' ? 'Masuk dengan Google' : 'SSO dengan Google'}</button><p className="form-message" aria-live="polite">{message}</p></form></section></main>;
}
