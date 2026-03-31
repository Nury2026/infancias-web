/* Extracted from original index.html */
// Año automático
  document.getElementById('year').textContent = new Date().getFullYear();

  // Tabs accesibles
  const tabs = Array.from(document.querySelectorAll('.tabBtn'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  //function activateTab(index){
    //tabs.forEach((t,i)=>{
      //const selected = i === index;
      //t.setAttribute('aria-selected', selected ? 'true' : 'false');
      //panels[i].classList.toggle('active', selected);
      // Quita y pone active para que corra la transición
      //panels[i].classList.remove('active');
      //if(selected){
        //requestAnimationFrame(()=> panels[i].classList.add('active'));
      //}
        //if(selected){
          //panels[i].classList.add('active');
        //} else {
          //panels[i].classList.remove('active');
        //}
    //});
    //tabs[index].focus();
  //}

  //tabs.forEach((btn, i)=>{
    //btn.addEventListener('click', ()=> activateTab(i));
    //btn.addEventListener('keydown', (e)=>{
      //if(e.key === 'ArrowRight') activateTab((i+1)%tabs.length);
      //if(e.key === 'ArrowLeft') activateTab((i-1+tabs.length)%tabs.length);
    //});
  //});
  function activateTab(index, shouldFocus = false){
    tabs.forEach((t,i)=>{
      const selected = i === index;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      panels[i].classList.toggle('active', selected);
    });
    if (shouldFocus) tabs[index].focus();
  }

  // Click + teclado
  tabs.forEach((btn, i)=>{
    btn.addEventListener('click', ()=> activateTab(i, true));
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowRight') { e.preventDefault(); activateTab((i+1)%tabs.length, true); }
      if(e.key === 'ArrowLeft')  { e.preventDefault(); activateTab((i-1+tabs.length)%tabs.length, true); }
    });
  });

  // Asegura que SIEMPRE haya un panel activo al cargar
  activateTab(0);

  // Leer más / Leer menos (Nosotros)
  document.querySelectorAll('.moreBtn').forEach((btn)=>{
    btn.addEventListener('click', ()=>{
      const member = btn.closest('.member');
      const longBox = member.querySelector('.bio-long');
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      btn.textContent = expanded ? 'Leer más' : 'Leer menos';

      if(expanded){
        longBox.hidden = true;
      } else {
        longBox.hidden = false;
      }
    });
  });

  // ===== MODAL: Nosotros (Leer más) =====
  const modal = document.getElementById('teamModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalRole = document.getElementById('modalRole');
  const modalBody = document.getElementById('modalBody');
  const modalImg = document.getElementById('modalImg');

  let lastFocusedBtn = null;

  function openModalFromButton(btn){
    lastFocusedBtn = btn;

    modalTitle.textContent = btn.dataset.name || 'Integrante';
    modalRole.textContent = btn.dataset.role || '';
    modalBody.textContent = btn.dataset.full || '';
    const imgSrc = btn.dataset.img || '';
    modalImg.src = imgSrc;
    modalImg.alt = `Foto de ${btn.dataset.name || 'integrante'}`;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // Evita scroll del fondo
    document.body.style.overflow = 'hidden';

    // Mueve foco al botón de cerrar (accesible)
    modalCloseBtn.focus();
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Devuelve foco al botón que abrió el modal
    if(lastFocusedBtn) lastFocusedBtn.textContent = 'Leer más';
    if(lastFocusedBtn) lastFocusedBtn.focus();
  }

  // Abrir modal
  document.querySelectorAll('.moreBtn').forEach((btn)=>{
    btn.addEventListener('click', ()=> openModalFromButton(btn));
  });

  // Cerrar con X
  modalCloseBtn.addEventListener('click', closeModal);

  // Cerrar con click fuera de la tarjeta
  modal.addEventListener('click', (e)=>{
    if(e.target === modal) closeModal();
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Forzar inicio al recargar, incluso si hay #hash (ej. #video-infografia)
  window.addEventListener('load', () => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  });

  // Menú hamburguesa (mobile)
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.textContent = isOpen ? '✕' : '☰';
    });

    // Cierra el menú al hacer clic en un enlace
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.textContent = '☰';
      });
    });

    // Cierra si haces clic fuera
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.textContent = '☰';
      }
    });
  }

  // ===== MATRIZ PNG: modal con zoom y arrastre =====
  document.addEventListener('DOMContentLoaded', () => {
    // ===== MATRIZ PNG: modal con zoom + arrastre + pinch =====
    const imgModal = document.getElementById('imgModal');
    const imgClose = document.getElementById('imgClose');
    const imgEl = document.getElementById('imgModalEl');
    const viewport = document.getElementById('imgViewport');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const zoomResetBtn = document.getElementById('zoomReset');

    if (!imgModal || !imgClose || !imgEl || !viewport || !zoomInBtn || !zoomOutBtn || !zoomResetBtn) {
      console.warn('Modal de imagen: faltan elementos. Revisa IDs imgModal/imgClose/imgModalEl/imgViewport/zoomIn/zoomOut/zoomReset');
      return;
    }

    let scale = 1;
    let x = 0, y = 0;

    // Mouse pan
    let isPanning = false;
    let startX = 0, startY = 0;

    // Touch pinch
    let isPinching = false;
    let startDist = 0;
    let startScale = 1;

    function applyTransform() {
      imgEl.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    function clampScale(v) {
      return Math.min(Math.max(v, 0.5), 4);
    }

    function fitImageToViewport() {
      const vw = viewport.clientWidth;
      const vh = viewport.clientHeight;

      const iw = imgEl.naturalWidth;
      const ih = imgEl.naturalHeight;
      if (!iw || !ih) return;

      const scaleX = vw / iw;
      const scaleY = vh / ih;
      scale = Math.min(scaleX, scaleY, 1);

      x = Math.max(10, (vw - iw * scale) / 2);
      y = Math.max(10, (vh - ih * scale) / 2);
      applyTransform();
    }

    function openImageModal(src, alt) {
      imgEl.src = src;
      imgEl.alt = alt || 'Imagen ampliada';

      imgModal.classList.add('open');
      imgModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // reset
      scale = 1; x = 0; y = 0;
      applyTransform();

      imgEl.onload = () => fitImageToViewport();
      imgClose.focus();
    }

    function closeImageModal() {
      imgModal.classList.remove('open');
      imgModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Abrir desde preview
    document.querySelectorAll('.matrixPreview[data-img]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Evita que el click “suba” y dispare otros listeners
        e.stopPropagation();
        const src = btn.dataset.img;
        const alt = btn.querySelector('img')?.alt || 'Matriz';
        openImageModal(src, alt);
      });
    });

    // Botones zoom
    zoomInBtn.addEventListener('click', () => {
      scale = clampScale(scale + 0.25);
      applyTransform();
    });

    zoomOutBtn.addEventListener('click', () => {
      scale = clampScale(scale - 0.25);
      applyTransform();
    });

    zoomResetBtn.addEventListener('click', () => {
      fitImageToViewport();
    });

    // Mouse wheel zoom (desktop)
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      const next = delta > 0 ? scale - 0.15 : scale + 0.15;
      scale = clampScale(next);
      applyTransform();
    }, { passive: false });

    // Mouse drag pan (desktop)
    viewport.addEventListener('mousedown', (e) => {
      isPanning = true;
      startX = e.clientX - x;
      startY = e.clientY - y;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      x = e.clientX - startX;
      y = e.clientY - startY;
      applyTransform();
    });

    window.addEventListener('mouseup', () => {
      isPanning = false;
    });

    // === Touch: pan 1 dedo + pinch 2 dedos (mobile) ===
    function distance(t1, t2) {
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      return Math.hypot(dx, dy);
    }

    viewport.addEventListener('touchstart', (e) => {
      if (!imgModal.classList.contains('open')) return;

      if (e.touches.length === 1) {
        isPanning = true;
        isPinching = false;
        startX = e.touches[0].clientX - x;
        startY = e.touches[0].clientY - y;
      }

      if (e.touches.length === 2) {
        isPanning = false;
        isPinching = true;
        startDist = distance(e.touches[0], e.touches[1]);
        startScale = scale;
      }
    }, { passive: false });

    viewport.addEventListener('touchmove', (e) => {
      if (!imgModal.classList.contains('open')) return;

      // Evita scroll mientras interactúas
      e.preventDefault();

      if (isPanning && e.touches.length === 1) {
        x = e.touches[0].clientX - startX;
        y = e.touches[0].clientY - startY;
        applyTransform();
      }

      if (isPinching && e.touches.length === 2) {
        const newDist = distance(e.touches[0], e.touches[1]);
        const ratio = newDist / startDist;
        scale = clampScale(startScale * ratio);
        applyTransform();
      }
    }, { passive: false });

    viewport.addEventListener('touchend', () => {
      isPanning = false;
      isPinching = false;
    });

    // Cerrar modal
    imgClose.addEventListener('click', closeImageModal);

    imgModal.addEventListener('click', (e) => {
      if (e.target === imgModal) closeImageModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && imgModal.classList.contains('open')) closeImageModal();
    });
  });



// ===== Scroll reveal suave (microinteracción) =====
(() => {
  const els = document.querySelectorAll('section, .card, .miniCard, .member');
  els.forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(ent => { if (ent.isIntersecting) ent.target.classList.add('is-visible'); });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();



// =========================================================
// UI/UX extras: progress, back-to-top, tab indicator, timeline, theme toggle
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Reading progress
  const bar = document.getElementById('readingProgress');
  const onScroll = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (bar) bar.style.width = pct.toFixed(2) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top
  const back = document.getElementById('backToTop');
  const toggleBack = () => {
    if (!back) return;
    if (window.scrollY > 420) back.classList.add('show');
    else back.classList.remove('show');
  };
  window.addEventListener('scroll', toggleBack, { passive: true });
  toggleBack();
  back?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Tabs indicator
  const tabsWrap = document.querySelector('.tabs');
  const indicator = document.querySelector('.tabIndicator');
  const tabs = Array.from(document.querySelectorAll('.tabBtn'));
  function moveIndicator(){
    if (!tabsWrap || !indicator || tabs.length === 0) return;
    const active = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    const rect = active.getBoundingClientRect();
    const wrapRect = tabsWrap.getBoundingClientRect();
    const x = rect.left - wrapRect.left;
    indicator.style.width = rect.width + 'px';
    indicator.style.transform = `translateX(${x}px)`;
  }
  window.addEventListener('resize', moveIndicator);
  // move once now and after any tab click
  tabs.forEach(t => t.addEventListener('click', () => setTimeout(moveIndicator, 0)));
  setTimeout(moveIndicator, 0);

  // Timeline interaction
  const nodes = Array.from(document.querySelectorAll('.timelineNode'));
  const panels = Array.from(document.querySelectorAll('.timelinePanel'));
  function activateTimeline(id){
    panels.forEach(p => p.classList.toggle('active', p.id === id));
    nodes.forEach(n => n.setAttribute('aria-expanded', n.dataset.target === id ? 'true' : 'false'));
  }
  nodes.forEach(n => n.addEventListener('click', () => activateTimeline(n.dataset.target)));
  if (nodes.length) activateTimeline(nodes[0].dataset.target);

  // Theme toggle (auto by system + manual override)
  /*const btn = document.getElementById('themeToggle');
  const icon = btn?.querySelector('.themeIcon');
  const STORAGE_KEY = 'infancias_theme'; // 'auto' | 'dark' | 'light'

  function applyTheme(mode){
    document.documentElement.dataset.userTheme = mode;
    if (!icon) return;

    if (mode === 'dark') icon.textContent = '☀️';
    else if (mode === 'light') icon.textContent = '🌙';
    else icon.textContent = '🌓';
  }

  function getSystemTheme(){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function effectiveTheme(){
    const mode = localStorage.getItem(STORAGE_KEY) || 'auto';
    if (mode === 'auto') return getSystemTheme();
    return mode;
  }

  // We keep CSS auto dark via prefers-color-scheme, but improve by setting attribute for future extension
  const saved = localStorage.getItem(STORAGE_KEY) || 'auto';
  applyTheme(saved);

  btn?.addEventListener('click', () => {
    const current = localStorage.getItem(STORAGE_KEY) || 'auto';
    const next = current === 'auto' ? 'dark' : (current === 'dark' ? 'light' : 'auto');
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);

    // If user chooses explicit dark/light, toggle a class to help CSS if needed
    document.documentElement.classList.toggle('force-dark', next === 'dark');
    document.documentElement.classList.toggle('force-light', next === 'light');
  });

  // Listen system changes when auto
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
  mq?.addEventListener?.('change', () => {
    const mode = localStorage.getItem(STORAGE_KEY) || 'auto';
    if (mode === 'auto') applyTheme('auto');
  });*/
});

// ===== HERO Carousel (simple, lightweight) =====
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const dots = Array.from(document.querySelectorAll('.carouselDots .dot'));
  const prev = document.querySelector('.carouselBtn.prev');
  const next = document.querySelector('.carouselBtn.next');
  if (!track || dots.length === 0) return;

  let idx = 0;
  const max = dots.length;

  const go = (i) => {
    idx = (i + max) % max;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('is-active', di === idx));
  };

  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  prev?.addEventListener('click', () => go(idx - 1));
  next?.addEventListener('click', () => go(idx + 1));

  // Auto play (pausa con hover)
  let timer = setInterval(() => go(idx + 1), 6500);
  const carousel = document.querySelector('.heroCarousel');
  carousel?.addEventListener('mouseenter', () => { clearInterval(timer); });
  carousel?.addEventListener('mouseleave', () => { timer = setInterval(() => go(idx + 1), 6500); });

  // Teclado (← →)
  carousel?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(idx - 1);
    if (e.key === 'ArrowRight') go(idx + 1);
  });

  go(0);
});

// ===== Theme toggle: Auto → Dark → Light =====
/*document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggle');
  const icon = btn?.querySelector('.themeIcon');
  const KEY = 'infancias_theme_mode';

  const apply = (mode) => {
    document.documentElement.classList.toggle('force-dark', mode === 'dark');
    document.documentElement.classList.toggle('force-light', mode === 'light');
    if (icon) icon.textContent = mode === 'dark' ? '☀️' : (mode === 'light' ? '🌙' : '🌓');
  };

  apply(localStorage.getItem(KEY) || 'auto');

  btn?.addEventListener('click', () => {
    const now = localStorage.getItem(KEY) || 'auto';
    const next = now === 'auto' ? 'dark' : (now === 'dark' ? 'light' : 'auto');
    localStorage.setItem(KEY, next);
    apply(next);
  });
});*/

// ===== Theme Switch (Auto / Dark / Light) =====
document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'infancias_theme_mode';
  const buttons = Array.from(document.querySelectorAll('.themeOpt'));

  const apply = (mode) => {
    // limpia siempre
    document.documentElement.classList.remove('force-dark', 'force-light');

    // aplica según selección
    if (mode === 'dark') document.documentElement.classList.add('force-dark');
    if (mode === 'light') document.documentElement.classList.add('force-light');

    buttons.forEach(btn => {
      const active = btn.dataset.theme === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  apply(localStorage.getItem(KEY) || 'auto');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.theme;
      localStorage.setItem(KEY, mode);
      apply(mode);
    });
  });
});

// ===== Zoom desde carrusel (reutiliza modal de imagen si existe) =====
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-zoom]');
  if (!btn) return;

  const src = btn.getAttribute('data-zoom');
  // Si ya tienes un modal de imagen (como el de la matriz) busca tu función openImageModal y úsala.
  // Si no existe, abre en nueva pestaña:
  window.open(src, '_blank');
});

// ===== PDF.js: Preview + Modal con zoom/arrastre/descarga (BLINDADO) =====
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Si no cargó PDF.js, dejamos descarga funcionando y mostramos fallback
  /*if (!window.pdfjsLib) {
    console.warn('PDF.js no cargó. Revisa que pdf.min.js esté antes de app.js');
    document.querySelectorAll('.pdfPreview[data-pdf]').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.dataset.pdf;
        // Abre el modal pero solo con descarga (sin render)
        const pdfModal = document.getElementById('pdfModal');
        const download = document.getElementById('pdfDownload');
        const pdfCanvas = document.getElementById('pdfCanvas');
        const pdfViewport = document.getElementById('pdfViewport');
        const pdfClose = document.getElementById('pdfClose');

        if (!pdfModal || !download || !pdfCanvas || !pdfViewport || !pdfClose) return;

        download.href = src;
        pdfModal.classList.add('open');
        pdfModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // mensaje visible en el canvas
        const ctx = pdfCanvas.getContext('2d');
        pdfCanvas.width = Math.max(600, pdfViewport.clientWidth);
        pdfCanvas.height = Math.max(300, pdfViewport.clientHeight);
        ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
        ctx.font = '20px system-ui';
        ctx.fillStyle = '#888';
        ctx.fillText('No se pudo cargar el visor. Usa ⬇ para descargar.', 20, 40);

        pdfClose.focus();
      });
    });
    return;
  }*/

// Espera breve a que el module cargue y exponga window.pdfjsLib
async function waitForPdfJsLib(ms = 1200){
  const start = Date.now();
  while (!window.pdfjsLib && (Date.now() - start) < ms) {
    await new Promise(r => setTimeout(r, 50));
    const pdfjsLib = window.pdfjsLib;
  }
  return window.pdfjsLib;
}

const lib = await waitForPdfJsLib();
if (!lib) {
  console.warn('PDF.js no cargó. Revisa que el script type="module" esté antes de app.js');
  // aquí dejas tu fallback (modal con descarga)
  return;
}
// y abajo en vez de pdfjsLib usa lib (o vuelve a usar window.pdfjsLib)

  // Worker correcto
  /*pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js";*/

  // Elements
  const pdfModal = document.getElementById('pdfModal');
  const pdfClose = document.getElementById('pdfClose');
  const pdfCanvas = document.getElementById('pdfCanvas');
  const pdfViewport = document.getElementById('pdfViewport');
  const zoomIn = document.getElementById('pdfZoomIn');
  const zoomOut = document.getElementById('pdfZoomOut');
  const zoomReset = document.getElementById('pdfZoomReset');
  const download = document.getElementById('pdfDownload');
  const titleEl = document.getElementById('pdfModalTitle');

  if (!pdfModal || !pdfClose || !pdfCanvas || !pdfViewport || !zoomIn || !zoomOut || !zoomReset || !download) {
    console.warn('PDF modal: faltan elementos/IDs');
    return;
  }

  let pdfDoc = null;
  let scale = 1;
  let baseScale = 1;
  let x = 0, y = 0;

  let isPanning = false;
  let startX = 0, startY = 0;

  function applyTransform() {
    pdfCanvas.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }
  function clampScale(v) { return Math.min(Math.max(v, 0.5), 4); }

  function showLoading(text = 'Cargando PDF…') {
    // pinta algo visible mientras carga (evita pantalla “vacía”)
    const ctx = pdfCanvas.getContext('2d');
    pdfCanvas.width = Math.max(600, pdfViewport.clientWidth);
    pdfCanvas.height = Math.max(300, pdfViewport.clientHeight);
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    ctx.font = '20px system-ui';
    ctx.fillStyle = '#888';
    ctx.fillText(text, 20, 40);
    x = 10; y = 10; scale = 1; baseScale = 1;
    applyTransform();
  }

  async function renderFirstPage(src) {
    pdfDoc = await pdfjsLib.getDocument(src).promise;
    const page = await pdfDoc.getPage(1);
    const viewport1 = page.getViewport({ scale: 1 });

    const ctx = pdfCanvas.getContext('2d');
    pdfCanvas.width = Math.floor(viewport1.width);
    pdfCanvas.height = Math.floor(viewport1.height);

    await page.render({ canvasContext: ctx, viewport: viewport1 }).promise;

    // Fit
    const vw = pdfViewport.clientWidth;
    const vh = pdfViewport.clientHeight;
    const sx = vw / viewport1.width;
    const sy = vh / viewport1.height;

    baseScale = Math.min(sx, sy, 1);
    scale = baseScale;

    x = Math.max(10, (vw - viewport1.width * scale) / 2);
    y = Math.max(10, (vh - viewport1.height * scale) / 2);
    applyTransform();
  }

  function openModalBase(src) {
    // abre modal SIEMPRE, así haya error
    download.href = src;                 // descarga siempre funciona
    if (titleEl) titleEl.textContent = 'Matriz • Trayectos históricos';
    pdfModal.classList.add('open');
    pdfModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showLoading('Cargando PDF…');
    pdfClose.focus();
  }

  function closeModal() {
    pdfModal.classList.remove('open');
    pdfModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Abrir desde preview
  document.querySelectorAll('.pdfPreview[data-pdf]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const src = btn.dataset.pdf;
      openModalBase(src);

      try {
        await renderFirstPage(src);
      } catch (err) {
        console.warn('No se pudo cargar el PDF:', err);
        showLoading('No se pudo cargar el PDF. Usa ⬇ para descargar.');
      }
    });
  });

  // Zoom
  zoomIn.addEventListener('click', () => { scale = clampScale(scale + 0.25); applyTransform(); });
  zoomOut.addEventListener('click', () => { scale = clampScale(scale - 0.25); applyTransform(); });
  zoomReset.addEventListener('click', () => { scale = baseScale; applyTransform(); });

  // Pan desktop
  pdfViewport.addEventListener('mousedown', (e) => {
    isPanning = true;
    startX = e.clientX - x;
    startY = e.clientY - y;
  });
  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    x = e.clientX - startX;
    y = e.clientY - startY;
    applyTransform();
  });
  window.addEventListener('mouseup', () => { isPanning = false; });

  // Wheel zoom
  pdfViewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    scale = clampScale(delta > 0 ? scale - 0.15 : scale + 0.15);
    applyTransform();
  }, { passive: false });

  // Cerrar
  pdfClose.addEventListener('click', closeModal);
  pdfModal.addEventListener('click', (e) => { if (e.target === pdfModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pdfModal.classList.contains('open')) closeModal(); });

  // Preview thumb: dibuja primera página en cada canvas mini
  const thumbs = Array.from(document.querySelectorAll('.pdfPreview[data-pdf] canvas.pdfThumb'));
  for (const c of thumbs) {
    const parent = c.closest('.pdfPreview');
    const src = parent?.dataset.pdf;
    if (!src) continue;

    try {
      const doc = await pdfjsLib.getDocument(src).promise;
      const p = await doc.getPage(1);
      const vp = p.getViewport({ scale: 0.9 });
      c.width = Math.floor(vp.width);
      c.height = Math.floor(vp.height);
      const ctx = c.getContext('2d');
      await p.render({ canvasContext: ctx, viewport: vp }).promise;
    } catch (err) {
      console.warn('PDF preview error:', err);
      // Si falla el preview, no rompemos la UI
    }
  }
});

// ===== Cierre del modal PDF (siempre, con o sin PDF.js) =====
document.addEventListener('DOMContentLoaded', () => {
  const pdfModal = document.getElementById('pdfModal');
  const pdfClose = document.getElementById('pdfClose');

  if (!pdfModal || !pdfClose) return;

  const closePdf = () => {
    pdfModal.classList.remove('open');
    pdfModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  pdfClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closePdf();
  });

  pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) closePdf();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal.classList.contains('open')) closePdf();
  });
});