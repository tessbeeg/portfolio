document.querySelectorAll('.yr').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Locked case studies: decrypt the write-up in the browser once the right password is entered.
// The password is remembered for this browser tab, so other case studies open straight away.
document.querySelectorAll('.locked').forEach((box) => {
  const form = box.querySelector('.unlock');
  const input = box.querySelector('input');
  const error = box.querySelector('.unlock-error');
  async function open(pw) {
    try {
      const raw = Uint8Array.from(atob(box.dataset.locked), (c) => c.charCodeAt(0));
      const salt = raw.slice(0, 16), iv = raw.slice(16, 28), data = raw.slice(28);
      const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
      const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: +box.dataset.iter, hash: 'SHA-256' },
        base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      const html = new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data));
      box.outerHTML = html;
      try { sessionStorage.setItem('cs-pass', pw); } catch (e) {}
      return true;
    } catch (e) { return false; }
  }
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault(); error.hidden = true; box.classList.add('opening');
    const ok = await open(input.value);
    if (!ok) { box.classList.remove('opening'); error.hidden = false; input.select(); }
  });
  let saved = null;
  try { saved = sessionStorage.getItem('cs-pass'); } catch (e) {}
  if (saved) open(saved);
});

// Homepage headline: type a line, scribble it out, then type the replacement
const rewrite = document.querySelector('.rewrite');
if (rewrite) {
  const FIRST = 'Persuasive reasons to consider this applicant';
  const SECOND = 'Why Tess?';
  const draft = rewrite.querySelector('.draft');
  const final = rewrite.querySelector('.final');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const caret = document.createElement('span'); caret.className = 'caret';
  const svgNS = 'http://www.w3.org/2000/svg';
  const scribble = document.createElementNS(svgNS, 'svg'); scribble.setAttribute('class', 'scribble');
  rewrite.appendChild(scribble);

  async function type(el, text, slow) {
    const node = document.createTextNode(''); el.append(node, caret);
    for (const ch of text) {
      node.data += ch;
      await wait((slow ? 110 : 45) + Math.random() * (slow ? 90 : 55) + (ch === ' ' ? 60 : 0));
    }
  }
  // Zigzag over each line of the first sentence, like a pen crossing it out
  function drawScribble(animate) {
    scribble.innerHTML = '';
    const box = rewrite.getBoundingClientRect();
    const range = document.createRange(); range.selectNodeContents(draft);
    const lines = [...range.getClientRects()].filter((r) => r.width > 4);
    const size = parseFloat(getComputedStyle(draft).fontSize);
    let delay = 0;
    lines.forEach((r) => {
      const x0 = r.left - box.left - size * .1, x1 = r.right - box.left + size * .1;
      const mid = r.top - box.top + r.height * .55, amp = size * .26, step = size * .42;
      let d = `M${x0} ${mid}`, up = true;
      for (let x = x0 + step; x < x1 + step; x += step) {
        d += ` L${Math.min(x, x1)} ${mid + (up ? -amp : amp) + (Math.random() - .5) * size * .1}`;
        up = !up;
      }
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d); path.style.strokeWidth = Math.max(2.5, size * .085) + 'px';
      scribble.appendChild(path);
      if (animate) {
        const len = path.getTotalLength(), dur = Math.min(700, 180 + (x1 - x0) * 1.1);
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { duration: dur, delay, easing: 'ease-in-out', fill: 'forwards' });
        delay += dur * .85;
      }
    });
    return delay;
  }
  async function run() {
    if (calm) {
      draft.textContent = FIRST; final.textContent = SECOND;
      draft.classList.add('struck'); drawScribble(false); return;
    }
    await wait(500);
    await type(draft, FIRST, false);
    await wait(900);
    caret.remove();
    const t = drawScribble(true);
    await wait(t + 250);
    draft.classList.add('struck');
    await wait(350);
    await type(final, SECOND, true);
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(run);
  window.addEventListener('resize', () => { if (draft.classList.contains('struck')) drawScribble(false); });
}

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
