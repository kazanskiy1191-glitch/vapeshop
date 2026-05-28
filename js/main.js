function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function confirmAge() {
  document.getElementById('ageModal').classList.remove('age-modal--active');
  localStorage.setItem('vapeshop_age', 'confirmed');
}

function denyAge() {
  window.location.href = 'https://google.com';
}

function initAgeModal() {
  if (localStorage.getItem('vapeshop_age') === 'confirmed') return;
  document.getElementById('ageModal')?.classList.add('age-modal--active');
}

function initBurger() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
  });

  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('nav--open');
    }
  });
}

function initFeatured() {
  const featured = products.filter(p => p.featured);
  renderProducts('featuredProducts', featured);
}

function initModal() {
  const modal = document.getElementById('orderModal');
  const closeBtn = document.getElementById('modalClose');
  const overlay = modal?.querySelector('.modal__overlay');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const orderForm = document.getElementById('orderForm');

  if (!modal) return;

  function openModal() {
    if (cart.length === 0) {
      showToast('Корзина пуста', 'error');
      return;
    }
    modal.classList.add('modal--open');
  }

  function closeModal() {
    modal.classList.remove('modal--open');
  }

  if (checkoutBtn) checkoutBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('orderName').value;
      const phone = document.getElementById('orderPhone').value;
      const delivery = document.querySelector('input[name="delivery"]:checked')?.value;
      const comment = document.getElementById('orderComment').value;
      const pickupTime = document.getElementById('pickupTime')?.value || '';
      const deliveryMethod = delivery === 'pickup' ? 'Самовывоз' + (pickupTime ? ' в ' + pickupTime : '') : 'Доставка';

      const orderItems = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return `${product.name} x${item.qty} = ${product.price * item.qty}₽`;
      }).join('\n');

      const orderItemsList = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return `${product.emoji} ${product.name} x${item.qty} = ${product.price * item.qty}₽`;
      }).join('\n');

      const msg = `🛒 <b>НОВЫЙ ЗАКАЗ</b>\n\n👤 ${name}\n📞 ${phone}\n🚚 ${deliveryMethod}${comment ? '\n💬 ' + comment : ''}\n\n<b>Товары:</b>\n${orderItemsList}\n\n━━━━━━━━━━━━━━━\n<b>Итого: ${getCartTotal()} ₽</b>\n━━━━━━━━━━━━━━━\n<a href="https://cloud-glitch.github.io/vapeshop/cart.html">Открыть корзину</a>`;

      sendTelegram(msg);

      showToast('Заказ отправлен! Мы свяжемся с вами.', 'success');
      closeModal();
      clearCart();
      orderForm.reset();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const msg = document.getElementById('contactMessage').value;
    sendTelegram(`💬 <b>Новое сообщение с сайта</b>\n\n👤 ${name}\n📞 ${phone}\n📝 ${msg}`);
    showToast('Сообщение отправлено! Мы ответим вам в ближайшее время.', 'success');
    form.reset();
  });
}

function initClearCart() {
  const btn = document.getElementById('clearCartBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (cart.length === 0) return;
    if (confirm('Очистить корзину?')) {
      clearCart();
    }
  });
}

function connectTelegram() {
  const input = document.getElementById('chatIdInput');
  if (!input || !input.value.trim()) {
    showToast('Введите Chat ID', 'error');
    return;
  }
  setChatId(input.value.trim());
  updateTgStatus();
  showToast('Telegram подключён!', 'success');
}

function testTelegram() {
  if (!TELEGRAM_CHAT_ID) {
    showToast('Сначала подключи Telegram', 'error');
    return;
  }
  sendTelegram('🔔 <b>Тестовое уведомление</b>\nВсё работает!');
  showToast('Тест отправлен!', 'success');
}

function updateTgStatus() {
  const el = document.getElementById('tgStatus');
  if (!el) return;
  el.textContent = TELEGRAM_CHAT_ID ? '✅ Подключено' : '❌ Не подключено';
}

function togglePickupTime() {
  const pickup = document.querySelector('input[name="delivery"]:checked')?.value === 'pickup';
  const group = document.getElementById('pickupTimeGroup');
  if (group) group.style.display = pickup ? 'block' : 'none';
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal--left, .reveal--right').forEach(el => {
    observer.observe(el);
  });
}

function initTiltCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.classList.add('tilt-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

function initHeroSearch() {
  const input = document.getElementById('heroSearchInput');
  const results = document.getElementById('heroSearchResults');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.classList.remove('hero-search__results--visible'); return; }
    const found = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ).slice(0, 6);
    if (found.length === 0) { results.classList.remove('hero-search__results--visible'); return; }
    results.innerHTML = found.map(p => `
      <div class="hero-search__item" onclick="addToCart(${p.id}); document.getElementById('heroSearchInput').value=''; document.getElementById('heroSearchResults').classList.remove('hero-search__results--visible')">
        <span class="hero-search__item-emoji">${p.emoji}</span>
        <div class="hero-search__item-info">
          <div class="hero-search__item-name">${p.name}</div>
          <div class="hero-search__item-price">${p.price} ₽</div>
        </div>
        <button class="btn btn--small btn--primary">В корзину</button>
      </div>
    `).join('');
    results.classList.add('hero-search__results--visible');
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.remove('hero-search__results--visible');
    }
  });
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const saved = localStorage.getItem('vapeshop_theme');
  if (saved === 'light') { document.documentElement.setAttribute('data-theme', 'light'); btn.textContent = '☀️'; }
  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('vapeshop_theme', 'dark');
      btn.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('vapeshop_theme', 'light');
      btn.textContent = '☀️';
    }
  });
}

function initParticles() {
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
      o: Math.random() * 0.5 + 0.1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 136, 255, ' + p.o + ')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function initVisitorCounter() {
  const el = document.getElementById('visitorCount');
  if (!el) return;
  const base = Math.floor(Math.random() * 5) + 8;
  el.textContent = base;
  setInterval(() => {
    const diff = Math.floor(Math.random() * 3) - 1;
    let val = parseInt(el.textContent) + diff;
    if (val < 5) val = 5;
    if (val > 20) val = 20;
    el.textContent = val;
  }, 8000);
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartCount();
  initBurger();
  initFeatured();
  renderCart();
  initModal();
  initContactForm();
  initClearCart();
  updateTgStatus();
  togglePickupTime();
  initScrollReveal();
  initTiltCards();
  initVisitorCounter();
  initAgeModal();
  initHeroSearch();
  initThemeToggle();
  initParticles();
});
