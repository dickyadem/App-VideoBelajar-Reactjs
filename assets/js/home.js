document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.category-btn[data-category]');
  const cards = document.querySelectorAll('.course-card');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      buttons.forEach((item) => item.classList.toggle('active', item === button));
      cards.forEach((card) => { card.hidden = category !== 'all' && card.dataset.category !== category; });
    });
  });
});
