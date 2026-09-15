import { useState } from 'react';

export default function PasswordInput({ id, label, value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);
  return <div className="form-group"><label className="form-label" htmlFor={id}>{label} <span className="required" aria-hidden="true">*</span></label><div className="input-wrap"><input className="form-input" id={id} type={visible ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} minLength="6" required /><button className="password-toggle" type="button" onClick={() => setVisible(!visible)}>{visible ? 'Sembunyikan' : 'Tampilkan'}</button></div></div>;
}
