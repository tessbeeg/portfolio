document.querySelectorAll('.yr').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Homepage: hovering (or tabbing to) a project shows its picture in the blue panel
const poster = document.querySelector('.poster:not(.poster-cs)');
if (poster && window.matchMedia('(min-width: 901px)').matches) {
  const img = poster.querySelector('.poster-preview img');
  const cap = poster.querySelector('.poster-preview figcaption');
  const show = (row) => {
    img.src = row.dataset.preview; img.hidden = false;
    cap.textContent = row.dataset.title;
    poster.classList.add('previewing');
  };
  const hide = () => poster.classList.remove('previewing');
  document.querySelectorAll('.work-row').forEach((row) => {
    row.addEventListener('mouseenter', () => show(row));
    row.addEventListener('focus', () => show(row));
    row.addEventListener('mouseleave', hide);
    row.addEventListener('blur', hide);
  });
}

// "Back to top" scrolls the right-hand column (desktop) or the page (phones)
document.querySelectorAll('a[href="#top"]').forEach((a) => {
  a.addEventListener('click', (ev) => {
    ev.preventDefault();
    const col = document.querySelector('.column');
    if (col && col.scrollHeight > col.clientHeight) col.scrollTo({ top: 0 });
    else window.scrollTo({ top: 0 });
  });
});

// Scrolling over the blue panel moves the right-hand column too
const col = document.querySelector('.column');
document.querySelectorAll('.poster').forEach((panel) => {
  panel.addEventListener('wheel', (ev) => {
    if (!col || col.scrollHeight <= col.clientHeight) return;
    if (panel.classList.contains('poster-cs') && panel.scrollHeight > panel.clientHeight + 2) return; // a tall case study panel scrolls itself
    col.scrollBy({ top: ev.deltaY, left: 0, behavior: 'auto' });
  }, { passive: true });
});
