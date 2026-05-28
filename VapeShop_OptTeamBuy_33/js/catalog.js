let currentCategory = 'all';
let searchQuery = '';

function renderProducts(containerId, list) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 0;">Товары не найдены</p>';
    return;
  }

  container.innerHTML = list.map(product => `
    <div class="product-card">
      <div class="product-card__image">${product.emoji}</div>
      <div class="product-card__category">${getCategoryLabel(product.category)}</div>
      <h3 class="product-card__title">${product.name}</h3>
      <p class="product-card__description">${product.description}</p>
      <div class="product-card__footer">
        <div>
          <div class="product-card__price">${product.price} ₽</div>
          <div class="product-card__price-opt">Опт: от ${product.priceOpt} ₽</div>
        </div>
        <button class="btn btn--primary btn--small" onclick="addToCart(${product.id})">В корзину</button>
      </div>
    </div>
  `).join('');
}

function getCategoryLabel(category) {
  const map = {
    'pod': 'Pod-системы',
    'liquid': 'Жидкости',
    'coils': 'Испарители',
    'accessories': 'Аксессуары'
  };
  return map[category] || category;
}

function filterProducts() {
  let filtered = [...products];

  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }

  renderProducts('catalogProducts', filtered);
}

function initCatalog() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      currentCategory = btn.dataset.category;
      filterProducts();
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterProducts();
    });
  }

  filterProducts();
}

document.addEventListener('DOMContentLoaded', initCatalog);
