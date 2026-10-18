document.querySelectorAll('.yr').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Homepage: hovering (or tabbing to) a project shows its picture, or plays its video, in the blue panel
const poster = document.querySelector('.poster:not(.poster-cs)');
if (poster && window.matchMedia('(min-width: 901px)').matches) {
  const img = poster.querySelector('.poster-preview img');
  const vid = poster.querySelector('.poster-preview video');
  const dev = vid.parentElement; // phone frame by default, or a desktop screen
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
      dev.classList.toggle('desktop', d.frame === 'desktop');
      dev.hidden = false; img.hidden = true;
      vid.currentTime = 0; vid.play().catch(() => {});
    } else {
      img.src = d.preview || d.poster; img.hidden = false; dev.hidden = true; vid.pause();
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

// About carousel: copy the photos once so the strip can loop seamlessly, and set a gentle speed
document.querySelectorAll('.carousel-track').forEach((track) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  [...track.children].forEach((li) => {
    const copy = li.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelector('img').alt = '';
    track.appendChild(copy);
  });
  const speed = () => track.style.setProperty('--dur', (track.scrollWidth / 2 / 45) + 's'); // about 45px a second
  track.querySelectorAll('img').forEach((img) => img.addEventListener('load', speed));
  window.addEventListener('resize', speed);
  speed();
});

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
