/* =============================================
   CUT & DRY BARBER SHOP — MAIN JS
   ============================================= */

// ── Navbar scroll effect ──────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Scroll-triggered fade-up animations ───────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.service-card, .testi-card, .info-card, .gallery-item, .about-img-col, .about-text-col'
).forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ── Active nav link on scroll ─────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
  });
}, { passive: true });


/* =============================================
   BOOKING SYSTEM
   ============================================= */

const db = window.__supabaseClient; // null si config non remplie

// Horaires : 9h00 → 20h30, toutes les 30 min
const ALL_SLOTS = (() => {
  const slots = [];
  for (let h = 9; h < 21; h++) {
    slots.push(`${String(h).padStart(2,'0')}:00`);
    slots.push(`${String(h).padStart(2,'0')}:30`);
  }
  return slots;
})();

// État de la réservation
const booking = { service: null, date: null, time: null, name: null, phone: null };

// ── Étape 1 — Choix prestation ────────────────
const serviceRadios = document.querySelectorAll('input[name="service"]');
const toStep2Btn    = document.getElementById('toStep2');

serviceRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    booking.service = radio.value;
    toStep2Btn.disabled = false;
  });
});

toStep2Btn.addEventListener('click', () => goToStep(2));

// ── Étape 2 — Date & heure ───────────────────
const dateInput  = document.getElementById('bookingDate');
const timeSlotsEl = document.getElementById('timeSlots');
const toStep3Btn  = document.getElementById('toStep3');
const toStep1Back = document.getElementById('toStep1Back');

// Date min = aujourd'hui
const todayISO = new Date().toISOString().split('T')[0];
dateInput.min = todayISO;

dateInput.addEventListener('change', async () => {
  booking.date = dateInput.value;
  booking.time = null;
  toStep3Btn.disabled = true;
  await renderTimeSlots(booking.date);
});

async function renderTimeSlots(dateStr) {
  timeSlotsEl.innerHTML = '<p class="slot-hint">Chargement des créneaux…</p>';
  let takenSlots = [];

  if (db) {
    const { data, error } = await db
      .from('bookings')
      .select('booking_time')
      .eq('booking_date', dateStr)
      .neq('status', 'cancelled');

    if (!error && data) {
      takenSlots = data.map(r => r.booking_time.slice(0, 5));
    }
  }

  timeSlotsEl.innerHTML = '';
  ALL_SLOTS.forEach(slot => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-slot' + (takenSlots.includes(slot) ? ' taken' : '');
    btn.textContent = slot;
    btn.disabled = takenSlots.includes(slot);

    btn.addEventListener('click', () => {
      if (btn.classList.contains('taken')) return;
      timeSlotsEl.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      booking.time = slot;
      toStep3Btn.disabled = false;
    });

    timeSlotsEl.appendChild(btn);
  });
}

toStep1Back.addEventListener('click', () => goToStep(1));
toStep3Btn.addEventListener('click',  () => {
  renderRecap();
  goToStep(3);
});

// ── Étape 3 — Infos client ───────────────────
const nameInput   = document.getElementById('clientName');
const phoneInput  = document.getElementById('clientPhone');
const confirmBtn  = document.getElementById('confirmBooking');
const toStep2Back = document.getElementById('toStep2Back');
const errorBox    = document.getElementById('bookingError');
const errorMsg    = document.getElementById('errorMsg');

toStep2Back.addEventListener('click', () => goToStep(2));

function renderRecap() {
  const recap = document.getElementById('bookingRecap');
  const [day, month, year] = [
    booking.date.slice(8,10),
    booking.date.slice(5,7),
    booking.date.slice(0,4)
  ];
  recap.innerHTML = `
    <div class="recap-item">
      <span class="recap-label">Prestation</span>
      <span class="recap-value">${booking.service}</span>
    </div>
    <div class="recap-item">
      <span class="recap-label">Date</span>
      <span class="recap-value">${day}/${month}/${year}</span>
    </div>
    <div class="recap-item">
      <span class="recap-label">Heure</span>
      <span class="recap-value">${booking.time}</span>
    </div>
  `;
}

confirmBtn.addEventListener('click', async () => {
  booking.name  = nameInput.value.trim();
  booking.phone = phoneInput.value.trim();

  errorBox.hidden = true;

  if (!booking.name || !booking.phone) {
    showError('Merci de renseigner votre prénom/nom et votre téléphone.');
    return;
  }
  if (!/^[\d\s().+\-]{6,20}$/.test(booking.phone)) {
    showError('Numéro de téléphone invalide.');
    return;
  }

  confirmBtn.classList.add('loading');
  confirmBtn.textContent = 'Enregistrement';

  try {
    if (db) {
      const { error } = await db.from('bookings').insert({
        name:         booking.name,
        phone:        booking.phone,
        service:      booking.service,
        booking_date: booking.date,
        booking_time: booking.time,
        status:       'pending'
      });
      if (error) throw error;
    }
    // Afficher succès (même sans DB pour demo)
    showSuccess();
  } catch (err) {
    confirmBtn.classList.remove('loading');
    confirmBtn.textContent = 'Confirmer le RDV ✓';
    showError('Erreur lors de l\'enregistrement. Réessayez ou appelez-nous directement.');
    console.error(err);
  }
});

function showSuccess() {
  const [day, month, year] = [
    booking.date.slice(8,10),
    booking.date.slice(5,7),
    booking.date.slice(0,4)
  ];
  document.getElementById('successDetails').innerHTML = `
    📋 <strong>${booking.service}</strong><br/>
    📅 Le ${day}/${month}/${year} à ${booking.time}<br/>
    👤 ${booking.name} — ${booking.phone}
  `;
  goToStep('success');
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.hidden = false;
  errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('newBooking').addEventListener('click', () => {
  // Reset
  booking.service = booking.date = booking.time = booking.name = booking.phone = null;
  serviceRadios.forEach(r => r.checked = false);
  dateInput.value = '';
  nameInput.value = '';
  phoneInput.value = '';
  timeSlotsEl.innerHTML = '<p class="slot-hint">Sélectionnez une date pour voir les créneaux</p>';
  toStep2Btn.disabled = true;
  toStep3Btn.disabled = true;
  errorBox.hidden = true;
  document.getElementById('bookingRecap').innerHTML = '';
  goToStep(1);
});

// ── Navigation entre étapes ───────────────────
function goToStep(step) {
  document.querySelectorAll('.booking-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.bstep').forEach((s, i) => {
    s.classList.remove('active', 'done');
    const n = parseInt(s.dataset.step);
    if (typeof step === 'number') {
      if (n === step) s.classList.add('active');
      if (n < step)  s.classList.add('done');
    }
  });

  const panelId = step === 'success' ? 'bpanel-success' : `bpanel-${step}`;
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.add('active');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
