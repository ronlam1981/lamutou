document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  menu.innerHTML = open ? '收起 <span aria-hidden="true">×</span>' : '目錄 <span aria-hidden="true">☰</span>';
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  const wasOpen = menu.getAttribute('aria-expanded') === 'true';
  setMenu(false);
  if (wasOpen) {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll:true});
    }
  }
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); } });
window.matchMedia('(max-width:640px)').addEventListener('change', () => setMenu(false));
