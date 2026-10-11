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

// Only owner-approved, published entries belong here. Draft and private material stay out.
const archiveEntries = [];
const archiveSearch = document.querySelector('#archive-search');
const archiveTopic = document.querySelector('#archive-topic');
const archiveYear = document.querySelector('#archive-year');
const archiveClear = document.querySelector('#archive-clear');
const archiveResults = document.querySelector('#archive-results');
const archiveCount = document.querySelector('#archive-count');

function addFilterOptions(select, values) {
  [...new Set(values.filter(Boolean))].sort((a, b) => String(b).localeCompare(String(a), 'zh-Hant')).forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function renderArchive() {
  const query = archiveSearch.value.trim().toLocaleLowerCase('zh-Hant');
  const matches = archiveEntries.filter(entry => {
    const text = `${entry.title} ${entry.summary || ''} ${entry.topic || ''}`.toLocaleLowerCase('zh-Hant');
    return (!query || text.includes(query)) && (!archiveTopic.value || entry.topic === archiveTopic.value) && (!archiveYear.value || entry.year === archiveYear.value);
  });
  archiveCount.textContent = `${matches.length} 篇已發布文章`;
  archiveResults.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = archiveEntries.length ? '沒有符合目前篩選條件的文章。' : '尚未匯入已確認發布的典藏文章。';
    archiveResults.append(empty);
    return;
  }
  matches.forEach(entry => {
    const article = document.createElement('article');
    article.className = 'archive-item';
    article.innerHTML = `<time datetime="${entry.published}">原刊：${entry.publishedLabel}</time><div><h3><a href="${entry.url}">${entry.title}</a></h3><p>${entry.summary || ''}</p></div><small>${entry.topic}<br>網站更新：${entry.updatedLabel}</small>`;
    archiveResults.append(article);
  });
}

addFilterOptions(archiveTopic, archiveEntries.map(entry => entry.topic));
addFilterOptions(archiveYear, archiveEntries.map(entry => entry.year));
[archiveSearch, archiveTopic, archiveYear].forEach(control => control.addEventListener('input', renderArchive));
archiveClear.addEventListener('click', () => {
  archiveSearch.value = '';
  archiveTopic.value = '';
  archiveYear.value = '';
  renderArchive();
  archiveSearch.focus();
});
renderArchive();

const lightbox = document.querySelector('.image-lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
let lightboxTrigger = null;
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-lightbox]');
  if (!trigger) return;
  const image = trigger.querySelector('img');
  if (!image) return;
  lightboxTrigger = trigger;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = trigger.closest('figure')?.querySelector('figcaption')?.textContent || '';
  lightbox.showModal();
});
function closeLightbox() {
  lightbox.close();
  lightboxTrigger?.focus();
}
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
