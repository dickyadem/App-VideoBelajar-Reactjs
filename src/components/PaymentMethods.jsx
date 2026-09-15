import { useState } from 'react';
import { paymentGroups } from '../data/paymentMethods';

export default function PaymentMethods({ selectedPayment, onChange }) {
  const [openGroup, setOpenGroup] = useState('bank');

  return <section className="payment-methods" aria-label="Pilihan metode pembayaran">
    {paymentGroups.map((group) => {
      const selected = group.options.find((option) => option.id === selectedPayment);
      const isOpen = openGroup === group.id;
      return <div className="payment-group" key={group.id}>
        <button className="payment-group-toggle" type="button" aria-expanded={isOpen}
          aria-controls={`payment-options-${group.id}`} onClick={() => setOpenGroup(isOpen ? null : group.id)}>
          <span>{group.title}{!isOpen && selected && <small> — {selected.name}</small>}</span>
          <span className="payment-chevron" aria-hidden="true">{isOpen ? '⌃' : '⌄'}</span>
        </button>
        <div id={`payment-options-${group.id}`} hidden={!isOpen}>
          {group.options.map((option) => <label className="payment-option" key={option.id}>
            <input type="radio" name="payment-method" value={option.id} checked={selectedPayment === option.id}
              onChange={() => onChange(option.id)} aria-label={option.name} />
            {option.brands ? <span className="payment-card-brands" aria-hidden="true">
              <span className="brand-mastercard"><span /><span /><small>mastercard</small></span>
              <span className="brand-visa">VISA</span><span className="brand-jcb">JCB</span>
            </span> : <span className="payment-option-name">
              <span className={`payment-brand payment-brand-${option.id}`} style={{ '--brand-color': option.color }} aria-hidden="true">{option.brand}</span>
              <span>{option.name}</span>
            </span>}
            <span className="payment-selected" aria-hidden="true">✓</span>
          </label>)}
        </div>
      </div>;
    })}
  </section>;
}
