document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      button.textContent = visible ? 'Sembunyikan' : 'Tampilkan';
    });
  });

  document.querySelectorAll('.demo-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const password = form.querySelector('#register-password');
      const confirmation = form.querySelector('#confirm-password');
      if (password && confirmation && password.value !== confirmation.value) {
        confirmation.setCustomValidity('Konfirmasi kata sandi harus sama.');
        confirmation.reportValidity();
        return;
      }
      if (confirmation) confirmation.setCustomValidity('');
      const message = form.querySelector('.form-message');
      if (message) message.textContent = form.dataset.success || 'Data berhasil diproses.';
      form.reset();
    });
  });
});
