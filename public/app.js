/* ============================================================
   YOSHI ヨシ — Frontend JavaScript (Category Name Slider + Search + Product Click + Showcase Animations)
   ============================================================ */

// ── CURSOR ─────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
});
function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  if (follower) { follower.style.left = fx + 'px'; follower.style.top = fy + 'px'; }
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .menu-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor?.classList.add('hovering'); follower?.classList.add('hovering'); });
  el.addEventListener('mouseleave', () => { cursor?.classList.remove('hovering'); follower?.classList.remove('hovering'); });
});

// ── NAV SCROLL ─────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── NAV MOBILE TOGGLE ──────────────────────────────
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('mobile-open');
  });
}

// ── THREE.JS HERO ───────────────────────────────────
(function initThreeScene() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 1, 5);

  scene.add(new THREE.AmbientLight(0xffffff, 0.15));
  const amberLight = new THREE.PointLight(0xFFBF00, 2.5, 12);
  amberLight.position.set(2, 3, 3);
  scene.add(amberLight);
  const rimLight = new THREE.PointLight(0xFFBF00, 1.2, 10);
  rimLight.position.set(-3, -1, 2);
  scene.add(rimLight);

  const bowlGroup = new THREE.Group();
  scene.add(bowlGroup);

  const bowl = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 64, 40, 0, Math.PI * 2, 0, Math.PI * 0.65),
    new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.35, emissive: 0x221100, emissiveIntensity: 0.15 })
  );
  bowl.position.y = -0.3;
  bowlGroup.add(bowl);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.18, 0.045, 16, 100),
    new THREE.MeshPhysicalMaterial({ color: 0xFFBF00, metalness: 0.9, roughness: 0.1, emissive: 0xFFBF00, emissiveIntensity: 0.4 })
  );
  rim.position.y = 0.42;
  rim.rotation.x = Math.PI / 2;
  bowlGroup.add(rim);

  const broth = new THREE.Mesh(
    new THREE.CircleGeometry(1.1, 64),
    new THREE.MeshPhysicalMaterial({ color: 0x3d1c00, roughness: 0.9, transparent: true, opacity: 0.92 })
  );
  broth.rotation.x = -Math.PI / 2;
  broth.position.y = 0.38;
  bowlGroup.add(broth);

  for (let i = 0; i < 4; i++) {
    const noodle = new THREE.Mesh(
      new THREE.TorusGeometry(0.55 + i * 0.12, 0.012, 8, 40),
      new THREE.MeshPhysicalMaterial({ color: 0xf5e6c8, roughness: 0.7 })
    );
    noodle.rotation.x = Math.random() * 0.4 - 0.2;
    noodle.rotation.z = Math.random() * 0.4 - 0.2;
    noodle.position.y = 0.37;
    bowlGroup.add(noodle);
  }

  const particleCount = 80;
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 2;
    pPos[i * 3 + 1] = Math.random() * 3 + 0.5;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xFFBF00, size: 0.025, transparent: true, opacity: 0.5 }));
  scene.add(particles);

  for (let i = 0; i < 3; i++) {
    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(1.6 + i * 0.5, 1.62 + i * 0.5, 80),
      new THREE.MeshBasicMaterial({ color: 0xFFBF00, transparent: true, opacity: 0.06 - i * 0.01, side: THREE.DoubleSide })
    );
    orbit.rotation.x = Math.PI / 2 + i * 0.15;
    bowlGroup.add(orbit);
  }

  let tRx = 0, tRy = 0, cRx = 0, cRy = 0;
  document.addEventListener('mousemove', e => {
    tRy = (e.clientX / window.innerWidth - 0.5) * 0.6;
    tRx = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    cRx += (tRx - cRx) * 0.04;
    cRy += (tRy - cRy) * 0.04;
    bowlGroup.rotation.y = t * 0.18 + cRy;
    bowlGroup.rotation.x = Math.sin(t * 0.4) * 0.06 + cRx;
    bowlGroup.position.y = Math.sin(t * 0.7) * 0.08;
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += 0.005;
      if (pos[i * 3 + 1] > 3.5) pos[i * 3 + 1] = 0.5;
    }
    pGeo.attributes.position.needsUpdate = true;
    amberLight.intensity = 2.2 + Math.sin(t * 1.5) * 0.5;
    renderer.render(scene, camera);
  })();
})();

// ══════════════════════════════════════════════════
//  FULLY DYNAMIC MENU WITH CATEGORIES FROM API
// ══════════════════════════════════════════════════
const menuGrid    = document.getElementById('menuGrid');
const menuLoading = document.getElementById('menuLoading');
const menuFilters = document.getElementById('menuFilters');
let allMenuItems  = [];
let allCategories = [];
let currentSearchTerm = '';
let currentCategory = 'all';

// ── FETCH CATEGORIES FROM API ──────────────────────
async function fetchCategories() {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      allCategories = await res.json();
      console.log('Categories loaded:', allCategories.length);
      renderCategoryFilters();
      return allCategories;
    }
  } catch (e) {
    console.warn('Could not fetch categories:', e.message);
    allCategories = [];
  }
  renderCategoryFilters();
  return [];
}

// ── RENDER DYNAMIC CATEGORY FILTERS ────────────────
function renderCategoryFilters() {
  if (!menuFilters) return;
  
  menuFilters.innerHTML = '';
  
  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.dataset.cat = 'all';
  allBtn.textContent = 'All';
  allBtn.onclick = () => {
    currentCategory = 'all';
    currentSearchTerm = '';
    const searchInput = document.getElementById('menuSearchInput');
    if (searchInput) searchInput.value = '';
    updateSearchResultsCount();
    renderFilteredMenu();
  };
  menuFilters.appendChild(allBtn);
  
  allCategories.forEach(cat => {
    if (cat.isActive !== false) {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.cat = cat.slug;
      btn.innerHTML = `${cat.icon || '🍽'} ${cat.name}`;
      btn.onclick = () => {
        currentCategory = cat.slug;
        updateSearchResultsCount();
        renderFilteredMenu();
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
      menuFilters.appendChild(btn);
    }
  });
}

// ── FETCH MENU FROM API ────────────────────────────
async function fetchMenuFromAPI() {
  try {
    const res = await fetch('/api/menu');
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (e) {
    console.warn('Could not reach /api/menu:', e.message);
    return [];
  }
}

// ── GET CATEGORY INFO ──────────────────────────────
function getCategoryInfo(slug) {
  const cat = allCategories.find(c => c.slug === slug);
  return cat || { name: slug, icon: '🍽' };
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ── BUILD MENU CARD WITH HIGHLIGHT AND CLICK ─────────────────
function buildMenuCardWithHighlight(item, searchTerm) {
  const cat = item.category || '';
  const catInfo = getCategoryInfo(cat);
  const emoji = catInfo.icon;
  const avail = item.available !== false;
  const name = item.name || 'Untitled';
  const price = item.price || 0;
  const desc = item.description || '';
  
  let highlightedName = escapeHtml(name);
  let highlightedDesc = desc ? escapeHtml(desc) : '';
  
  if (searchTerm) {
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    highlightedName = escapeHtml(name).replace(regex, `<mark>$1</mark>`);
    if (desc) {
      highlightedDesc = escapeHtml(desc).replace(regex, `<mark>$1</mark>`);
    }
  }
  
  const card = document.createElement('div');
  card.className = 'menu-card';
  card.dataset.cat = cat;
  
  card.style.cursor = 'pointer';
  card.onclick = (e) => {
    if (e.target.classList.contains('add-to-order')) {
      e.stopPropagation();
      return;
    }
    window.location.href = `product-details.html?id=${item._id}`;
  };
  
  const imgHtml = item.imageUrl
    ? `<img src="${item.imageUrl}"
            class="menu-card-img"
            alt="${name}"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
       >
       <div class="menu-card-img-placeholder" style="display:none">${emoji}</div>`
    : `<div class="menu-card-img-placeholder">${emoji}</div>`;
  
  card.innerHTML = `
    ${imgHtml}
    <div class="menu-card-body">
      <div class="menu-card-cat">${catInfo.name}</div>
      <div class="menu-card-name">${highlightedName}</div>
      ${desc ? `<div class="menu-card-desc">${highlightedDesc}</div>` : ''}
      <div class="menu-card-footer">
        <div class="menu-card-price">৳ ${price}</div>
        ${avail ? `<button class="add-to-order">+</button>` : `<span class="sold-out-badge">Sold Out</span>`}
      </div>
    </div>`;
  return card;
}

// ── RENDER FILTERED MENU WITH SEARCH ───────────────
function renderFilteredMenu() {
  if (!menuGrid) return;
  
  menuGrid.querySelectorAll('.menu-card, .menu-empty, .menu-empty-search').forEach(c => c.remove());
  
  let items = allMenuItems;
  
  if (currentCategory !== 'all') {
    items = items.filter(i => (i.category || '') === currentCategory);
  }
  
  if (currentSearchTerm) {
    items = items.filter(item => 
      item.name.toLowerCase().includes(currentSearchTerm) ||
      (item.description || '').toLowerCase().includes(currentSearchTerm) ||
      (item.category || '').toLowerCase().includes(currentSearchTerm)
    );
  }
  
  console.log(`Rendering ${items.length} items for category: ${currentCategory}, search: "${currentSearchTerm}"`);
  
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'menu-empty-search';
    empty.innerHTML = `
      <span class="search-emoji">🔍</span>
      <h4>No items found</h4>
      <p>We couldn't find any items matching "${escapeHtml(currentSearchTerm)}"</p>
      <button class="btn-ghost sm" onclick="clearSearchAndReset()" style="margin-top:20px">Clear Search</button>
    `;
    menuGrid.appendChild(empty);
    return;
  }
  
  items.forEach((item, idx) => {
    const card = buildMenuCardWithHighlight(item, currentSearchTerm);
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    menuGrid.appendChild(card);
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, idx * 60);
  });
}

// ── UPDATE SEARCH RESULTS COUNT ────────────────────
function updateSearchResultsCount() {
  const countEl = document.getElementById('searchResultsCount');
  if (!countEl) return;
  
  let filteredItems = allMenuItems;
  
  if (currentCategory !== 'all') {
    filteredItems = filteredItems.filter(i => (i.category || '') === currentCategory);
  }
  
  const totalItems = filteredItems.length;
  
  if (currentSearchTerm) {
    const matchedItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(currentSearchTerm) ||
      (item.description || '').toLowerCase().includes(currentSearchTerm) ||
      (item.category || '').toLowerCase().includes(currentSearchTerm)
    );
    countEl.innerHTML = `🔍 Found <span>${matchedItems.length}</span> of <span>${totalItems}</span> items matching "<span style="color:var(--amber)">${escapeHtml(currentSearchTerm)}</span>"`;
  } else {
    countEl.innerHTML = `📋 Showing <span>${totalItems}</span> items`;
  }
}

// ── CLEAR SEARCH AND RESET ─────────────────────────
function clearSearchAndReset() {
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  
  if (searchInput) {
    searchInput.value = '';
    currentSearchTerm = '';
    if (clearBtn) clearBtn.style.display = 'none';
  }
  
  updateSearchResultsCount();
  renderFilteredMenu();
}

// ── INIT SEARCH ────────────────────────────────────
function initSearch() {
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase().trim();
    
    if (clearBtn) {
      clearBtn.style.display = currentSearchTerm ? 'flex' : 'none';
    }
    
    updateSearchResultsCount();
    renderFilteredMenu();
  });
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchTerm = '';
      clearBtn.style.display = 'none';
      updateSearchResultsCount();
      renderFilteredMenu();
      searchInput.focus();
    });
  }
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      renderFilteredMenu();
    }
  });
}

// ═══════════════════════════════════════════════════════════
//  CATEGORY NAME SLIDER ONLY (শুধু ক্যাটাগরির নাম ঘুরবে)
// ═══════════════════════════════════════════════════════════

async function loadCategorySliders() {
  const container = document.getElementById('categorySlidersContainer');
  if (!container) {
    console.log('Category sliders container not found!');
    return;
  }
  
  try {
    console.log('Loading category name slider...');
    
    const categoriesRes = await fetch('/api/categories');
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    
    console.log('Categories found:', categories.length);
    
    if (categories.length === 0) {
      container.innerHTML = '<div class="empty-slider-message">✨ No categories yet. Add categories from admin panel.</div>';
      return;
    }
    
    let sliderItemsHTML = '';
    const duplicatedCategories = [...categories, ...categories, ...categories];
    
    duplicatedCategories.forEach(cat => {
      sliderItemsHTML += `
        <div class="category-slider-item" onclick="filterMenuFromSlider('${cat.slug}')" style="cursor: pointer;">
          <span class="category-slider-item-icon">${cat.icon || '🍽'}</span>
          <span class="category-slider-item-name">${escapeHtml(cat.name)}</span>
        </div>
      `;
    });
    
    const speed = Math.max(15, Math.min(40, categories.length * 1.2));
    
    container.innerHTML = `
      <div class="category-slider-section">
        <div class="category-slider-track" style="animation-duration: ${speed}s;">
          ${sliderItemsHTML}
        </div>
      </div>
    `;
    
    console.log('✅ Category name slider loaded successfully');
    
  } catch (error) {
    console.error('Error loading category slider:', error);
    container.innerHTML = '<div class="empty-slider-message">⚠️ Unable to load categories. Make sure server is running.</div>';
  }
}

// ── FILTER MENU FROM SLIDER ────────────────────────
function filterMenuFromSlider(category) {
  currentCategory = category;
  currentSearchTerm = '';
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  updateSearchResultsCount();
  renderFilteredMenu();
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.dataset.cat === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// ── LOAD MENU ──────────────────────────────────────
async function loadMenu() {
  if (menuLoading) menuLoading.remove();
  
  await fetchCategories();
  allMenuItems = await fetchMenuFromAPI();
  currentCategory = 'all';
  currentSearchTerm = '';
  updateSearchResultsCount();
  renderFilteredMenu();
  
  await loadCategorySliders();
  initSearch();
}

// ═══════════════════════════════════════════════════════════
//  SHOWCASE ENHANCEMENTS (Animation + Drag to Scroll)
// ═══════════════════════════════════════════════════════════

// Add animation delay to showcase cards
function initShowcaseAnimations() {
  const showcaseCards = document.querySelectorAll('.showcase-card');
  showcaseCards.forEach((card, index) => {
    card.style.setProperty('--index', index);
  });
  
  // Mouse drag to scroll showcase
  const showcaseScroll = document.getElementById('showcaseScroll');
  if (showcaseScroll) {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    showcaseScroll.addEventListener('mousedown', (e) => {
      isDown = true;
      showcaseScroll.style.cursor = 'grabbing';
      startX = e.pageX - showcaseScroll.offsetLeft;
      scrollLeft = showcaseScroll.scrollLeft;
    });
    
    showcaseScroll.addEventListener('mouseleave', () => {
      isDown = false;
      showcaseScroll.style.cursor = 'grab';
    });
    
    showcaseScroll.addEventListener('mouseup', () => {
      isDown = false;
      showcaseScroll.style.cursor = 'grab';
    });
    
    showcaseScroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - showcaseScroll.offsetLeft;
      const walk = (x - startX) * 2;
      showcaseScroll.scrollLeft = scrollLeft - walk;
    });
  }
}

// ── RESERVATION FORM ───────────────────────────────
const reserveForm = document.getElementById('reserveForm');
const formMsg     = document.getElementById('formMsg');

if (reserveForm) {
  const dateInput = reserveForm.querySelector('[name="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  
  reserveForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('reserveBtn');
    if (btn) {
      btn.textContent = 'Submitting...';
      btn.disabled = true;
    }
    
    const data = Object.fromEntries(new FormData(reserveForm));
    
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        formMsg.textContent = '✓ Reservation confirmed! We\'ll call you shortly.';
        formMsg.className = 'form-msg success';
        reserveForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      formMsg.textContent = '✓ Request received! We\'ll contact you to confirm.';
      formMsg.className = 'form-msg success';
      reserveForm.reset();
    }
    
    if (btn) {
      btn.textContent = 'Confirm Reservation';
      btn.disabled = false;
    }
    setTimeout(() => { formMsg.textContent = ''; formMsg.className = 'form-msg'; }, 5000);
  });
}

// ── SCROLL ANIMATIONS ──────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.about-grid, .reserve-grid, .section-header, .showcase-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = '.in-view { opacity: 1 !important; transform: none !important; }';
document.head.appendChild(style);

// Make functions global for HTML onclick
window.filterMenuFromSlider = filterMenuFromSlider;
window.clearSearchAndReset = clearSearchAndReset;

// ── START ──────────────────────────────────────────
loadMenu();
initShowcaseAnimations();

console.log('✅ YOSHI frontend loaded with category name slider + search + product click + showcase animations!');