let cart = [];

function loadCart() {
  try {
    const data = localStorage.getItem('vapeshop_cart');
    cart = data ? JSON.parse(data) : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem('vapeshop_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty += 1;
  } else {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    cart.push({ id: productId, qty: 1 });
  }
  saveCart();
  updateCartCount();
  showToast('Товар добавлен в корзину', 'success');

  const product = products.find(p => p.id === productId);
  if (product) {
    sendTelegram(`🛒 <b>Новый товар в корзине</b>\n\n${product.emoji} ${product.name}\n💰 ${product.price} ₽\n📦 Всего в корзине: ${getCartCount()} шт.\n🌐 <a href="https://kazanskiy1191-glitch.github.io/vapeshop/cart.html">Открыть корзину</a>`);
  }
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartCount();
  renderCart();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart();
  updateCartCount();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
  showToast('Корзина очищена', 'info');
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = count;
  });
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const summary = document.getElementById('cartSummary');
  const totalItems = document.getElementById('cartTotalItems');
  const totalPrice = document.getElementById('cartTotalPrice');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__icon">🛒</div>
        <h2 class="cart-empty__title">Корзина пуста</h2>
        <p class="cart-empty__text">Добавьте товары из каталога</p>
        <a href="catalog.html" class="btn btn--primary">Перейти в каталог</a>
      </div>
    `;
    if (summary) summary.style.display = 'none';
    return;
  }

  if (summary) summary.style.display = 'block';

  container.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return '';
    return `
      <div class="cart-item">
        <div class="cart-item__image">${product.emoji}</div>
        <div class="cart-item__info">
          <h3>${product.name}</h3>
          <p>${product.price} ₽ / шт.</p>
        </div>
        <div class="cart-item__controls">
          <button class="cart-item__qty-btn" onclick="updateQty(${product.id}, -1)">−</button>
          <span class="cart-item__qty">${item.qty}</span>
          <button class="cart-item__qty-btn" onclick="updateQty(${product.id}, 1)">+</button>
          <span class="cart-item__price">${product.price * item.qty} ₽</span>
          <button class="cart-item__remove" onclick="removeFromCart(${product.id})">✕</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalItems) totalItems.textContent = getCartCount();
  if (totalPrice) totalPrice.textContent = getCartTotal() + ' ₽';
}
