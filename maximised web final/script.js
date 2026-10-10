const cards = document.querySelectorAll('.card');
const body = document.body;

cards.forEach(card => {
  card.addEventListener('click', () => {
    cards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    body.className = '';
    const cursorName = card.getAttribute('data-cursor');
    body.classList.add(`cursor-${cursorName}`);
  });
});

/* ============================================================
   VISUAL EFFECTS: NON-INTRUSIVE PARTICLE TRAIL & CLICK RIPPLE
   ============================================================ */
(() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.id = 'fx-canvas-overlay';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const ripples = [];
  const colors = ['#60a5fa', '#a855f7', '#38bdf8', '#c084fc', '#f43f5e'];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5 - 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= this.decay;
      if (this.size > 0.2) this.size -= 0.05;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Ripple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = 50;
      this.alpha = 0.8;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.radius += (this.maxRadius - this.radius) * 0.12 + 1;
      this.alpha -= 0.025;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  window.addEventListener(
    'mousemove',
    (e) => {
      particles.push(new Particle(e.clientX, e.clientY));
    },
    { passive: true }
  );

  window.addEventListener(
    'click',
    (e) => {
      ripples.push(new Ripple(e.clientX, e.clientY));
      for (let i = 0; i < 8; i++) {
        const p = new Particle(e.clientX, e.clientY);
        p.speedX = (Math.random() - 0.5) * 4;
        p.speedY = (Math.random() - 0.5) * 4;
        p.size = Math.random() * 5 + 2;
        particles.push(p);
      }
    },
    { passive: true }
  );

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0 || particles[i].size <= 0.2) {
        particles.splice(i, 1);
      }
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].draw();
      if (ripples[i].alpha <= 0 || ripples[i].radius >= ripples[i].maxRadius) {
        ripples.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();

/* ============================================================
   AMBIENT CURSOR GLOW (NON-INTRUSIVE)
   ============================================================ */
(() => {
  const glow = document.createElement('div');
  glow.id = 'cursor-ambient-glow';
  glow.style.position = 'fixed';
  glow.style.top = '0';
  glow.style.left = '0';
  glow.style.width = '350px';
  glow.style.height = '350px';
  glow.style.borderRadius = '50%';
  glow.style.pointerEvents = 'none';
  glow.style.zIndex = '999998';
  glow.style.opacity = '0';
  glow.style.transition = 'opacity 0.4s ease';
  glow.style.transform = 'translate(-50%, -50%)';
  glow.style.background =
    'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(96, 165, 250, 0.12) 35%, rgba(0, 0, 0, 0) 70%)';

  document.body.appendChild(glow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isHovering = false;

  window.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isHovering) {
        glow.style.opacity = '1';
        isHovering = true;
      }
    },
    { passive: true }
  );

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    isHovering = false;
  });

  function renderGlow() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;

    requestAnimationFrame(renderGlow);
  }

  renderGlow();
})();

/* ============================================================
   DOM INITIALIZATION & CONTROLS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs
  const tabs = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.page-view');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      pages.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPage = document.getElementById(tab.dataset.target);
      if (targetPage) targetPage.classList.add('active');
    });
  });

  // Elements
  const fontSelect = document.getElementById('fontSelect');
  const textColor = document.getElementById('textColor');
  const textSize = document.getElementById('textSize');
  const themeSelect = document.getElementById('themeSelect');
  const letterCard = document.getElementById('letterCard');
  const letterInput = document.getElementById('letterInput');
  const customThemeControls = document.getElementById('customThemeControls');
  const customBgColor = document.getElementById('customBgColor');
  const customBorderColor = document.getElementById('customBorderColor');

  // Font Management
  const FONTS = [
    "Abel", "Abril Fatface", "Alex Brush", "Alfa Slab One", "Alice", "Allura", "Amatic SC", "Anton", "Architects Daughter", "Archivo Black",
    "Arima Madurai", "Bad Script", "Balsamiq Sans", "Bangers", "Barlow Condensed", "Bebas Neue", "Berkshire Swash", "Bitter", "Black Ops One",
    "Bungee", "Cabin Sketch", "Cairo", "Caveat", "Chakra Petch", "Charm", "Cinzel", "Cinzel Decorative", "Comfortaa", "Cookie",
    "Courgette", "Covered By Your Grace", "Creepster", "Damion", "Dancing Script", "DM Serif Display", "Dosis", "Electrolize", "Exo 2", "Faster One",
    "Federo", "Fjalla One", "Fondamento", "Fredericka the Great", "Fredoka", "Gloria Hallelujah", "Great Vibes", "Handlee", "Henny Penny", "Homemade Apple",
    "Indie Flower", "Italianno", "Jomhuria", "Josefin Sans", "Kaushan Script", "Kavoon", "Lobster", "Lobster Two", "Lora", "Marck Script",
    "Meddon", "Monoton", "Montserrat", "Mr Dafoe", "Nanum Pen Script", "Neucha", "Niconne", "Nothing You Could Do", "Nova Square", "Orbitron",
    "Oswald", "Pacifico", "Parisienne", "Permanent Marker", "Pinyon Script", "Playball", "Playfair Display", "Poiret One", "Press Start 2P", "Prata",
    "Quicksand", "Rajdhani", "Reenie Beanie", "Righteous", "Rochester", "Rock Salt", "Rokkitt", "Sacramento", "Satisfy", "Shadows Into Light",
    "Shrikhand", "Sigmar One", "Silkscreen", "Special Elite", "Syne", "Tangerine", "VT323", "Wallpoet", "Yellowtail", "Zeyada"
  ];

  function loadAndApplyFont(fontName) {
    if (!fontName) return;
    const fontId = `font-${fontName.replace(/\s+/g, "-")}`;
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    }
    if (letterInput) {
      letterInput.style.fontFamily = `"${fontName}", sans-serif`;
    }
  }

  // Populate Dropdown
  if (fontSelect) {
    fontSelect.innerHTML = '';
    FONTS.forEach(font => {
      const opt = document.createElement("option");
      opt.value = font;
      opt.textContent = font;
      fontSelect.appendChild(opt);
    });

    fontSelect.addEventListener('change', (e) => {
      loadAndApplyFont(e.target.value);
    });

    loadAndApplyFont(FONTS[0]);
  }

  // Letter Controls
  if (letterInput) {
    if (textColor) {
      textColor.addEventListener('input', (e) => {
        letterInput.style.color = e.target.value;
      });
    }

    if (textSize) {
      textSize.addEventListener('input', (e) => {
        letterInput.style.fontSize = `${e.target.value}px`;
      });
    }
  }

  // Theme Controls
  function applyCustomTheme() {
    if (letterCard && customBgColor && customBorderColor) {
      letterCard.style.setProperty('--custom-bg', customBgColor.value);
      letterCard.style.setProperty('--custom-border', customBorderColor.value);
    }
  }

  if (themeSelect && letterCard) {
    themeSelect.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      letterCard.className = 'letter-card';
      letterCard.classList.add(selectedTheme);

      if (selectedTheme === 'theme-custom' && customThemeControls) {
        customThemeControls.style.display = 'flex';
        applyCustomTheme();
      } else if (customThemeControls) {
        customThemeControls.style.display = 'none';
      }
    });
  }

  if (customBgColor) customBgColor.addEventListener('input', applyCustomTheme);
  if (customBorderColor) customBorderColor.addEventListener('input', applyCustomTheme);
});
