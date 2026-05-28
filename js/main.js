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

      const orderItems = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return `${product.name} x${item.qty} = ${product.price * item.qty}₽`;
      }).join('\n');

      const orderItemsList = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return `${product.emoji} ${product.name} x${item.qty} = ${product.price * item.qty}₽`;
      }).join('\n');

      const msg = `🛒 <b>НОВЫЙ ЗАКАЗ</b>\n\n👤 ${name}\n📞 ${phone}\n🚚 ${delivery === 'pickup' ? 'Самовывоз' : 'Доставка'}${comment ? '\n💬 ' + comment : ''}\n\n<b>Товары:</b>\n${orderItemsList}\n\n━━━━━━━━━━━━━━━\n<b>Итого: ${getCartTotal()} ₽</b>\n━━━━━━━━━━━━━━━\n<a href="https://kazanskiy1191-glitch.github.io/vapeshop/cart.html">Открыть корзину</a>`;

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
});
