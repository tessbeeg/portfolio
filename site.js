document.querySelectorAll('.yr').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Homepage: hovering (or tabbing to) a project shows its picture, or plays its video, in the blue panel
const poster = document.querySelector('.poster:not(.poster-cs)');
if (poster && window.matchMedia('(min-width: 901px)').matches) {
  const img = poster.querySelector('.poster-preview img');
  const vid = poster.querySelector('.poster-preview video');
  const cap = poster.querySelector('.poster-preview figcaption');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const show = (row) => {
    const d = row.dataset;
    if (d.video && !still) {
      if (vid.dataset.current !== d.video) {
        // offer both formats; each browser plays the first one it supports
        vid.innerHTML = `<source src="${d.video}.webm" type="video/webm"><source src="${d.video}.mp4" type="video/mp4">`;
        vid.dataset.current = d.video; if (d.poster) vid.poster = d.poster; vid.load();
      }
      vid.hidden = false; img.hidden = true;
      vid.currentTime = 0; vid.play().catch(() => {});
    } else {
      img.src = d.preview || d.poster; img.hidden = false; vid.hidden = true; vid.pause();
    }
    cap.textContent = d.title;
    poster.classList.add('previewing');
  };
  const hide = () => { poster.classList.remove('previewing'); vid.pause(); };
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
