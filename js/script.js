/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1800);
});

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);
});

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── MOBILE DROPDOWN TOGGLE ── */
const navDropdown = document.querySelector('.nav-dropdown');
if (navDropdown) {
  navDropdown.addEventListener('click', function(e) {
    if(window.innerWidth <= 768) {
      this.querySelector('.dropdown-menu').classList.toggle('active');
    }
  });
}

/* ── SCROLL TO TOP ── */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── TYPING EFFECT ── */
const roles = [
  'Data Science Intern Candidate',
  'Machine Learning Enthusiast',
  'Data Analyst',
  'AI & IoT Developer',
  'NLP Pipeline Builder'
];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  const current = roles[roleIdx];
  if (isDeleting) {
    typedEl.textContent = current.slice(0, --charIdx);
  } else {
    typedEl.textContent = current.slice(0, ++charIdx);
  }
  let delay = isDeleting ? 50 : 90;
  if (!isDeleting && charIdx === current.length) { delay = 1800; isDeleting = true; }
  else if (isDeleting && charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 300; }
  setTimeout(typeLoop, delay);
}
typeLoop();

/* ── HERO CANVAS – particle network ── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();
  window.addEventListener('resize', () => { resize(); initParticles(); });
})();

/* ── COUNTER ANIMATION ── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let count = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(timer);
    }, 50);
  });
}

/* ── SKILLS TABS ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    panel.classList.add('active');
    animateSkillBars(panel);
  });
});

function animateSkillBars(container) {
  container.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 50);
  });
}

/* ── PROJECT FILTER ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ── INTERSECTION OBSERVER ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Skill bars on first active panel
    if (el.id === 'skills') {
      animateSkillBars(document.querySelector('.skills-panel.active'));
    }
    // Counters
    if (el.id === 'home') animateCounters();
    // Also handle GPA display as 3.48
    document.querySelectorAll('.stat-num[data-target="348"]').forEach(el => { if (el.textContent === '348') el.textContent = '3.48'; });

    // Reveal animation
    el.classList.add('visible');
    observer.unobserve(el);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section, #home').forEach(s => observer.observe(s));

// Also animate counters on page load after loader
setTimeout(animateCounters, 2000);

/* ── CONTACT FORM ── */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';

  const data = new FormData(form);

  try {
    const res = await fetch('https://formspree.io/f/mwvynvlq', { 
      method: 'POST', 
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (res.ok) {
      status.textContent = '✅ Message sent! I\'ll get back to you soon.';
      status.className = 'form-status success';
      form.reset();
    } else {
      const json = await res.json();
      throw new Error(json.error || 'Something went wrong');
    }
  } catch (err) {
    status.textContent = '❌ Oops! There was a problem sending your message.';
    status.className = 'form-status error';
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
  setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
});

/* ── ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});
