document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.demo-form');
  const password = document.querySelector('#register-password');
  const confirmation = document.querySelector('#confirm-password');
  if (!form || !password || !confirmation) return;
  form.addEventListener('submit', (event) => {
    if (password.value !== confirmation.value) {
      event.preventDefault();
      confirmation.setCustomValidity('Konfirmasi kata sandi harus sama.');
      confirmation.reportValidity();
    } else {
      confirmation.setCustomValidity('');
    }
  });
});
