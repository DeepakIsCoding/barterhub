// ========== AUTHENTICATION ==========

function initUsers() {
  if (!localStorage.getItem('users')) {
    const sampleUsers = [
      { name: 'Alice', email: 'alice@example.com', password: '123456' },
      { name: 'Bob', email: 'bob@example.com', password: '123456' }
    ];
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
}

function checkAuth() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

function handleLogin(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password, ...safeUser } = user;
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
    return safeUser; // return user for welcome message
  }
  return null;
}

function handleRegister(name, email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.email === email)) return null;
  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  const { password: p, ...safeUser } = newUser;
  localStorage.setItem('currentUser', JSON.stringify(safeUser));
  return safeUser;
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// ========== ITEMS MANAGEMENT ==========

function initItems() {
  if (!localStorage.getItem('items')) {
    const sampleItems = [
      { id: 1, name: 'Vintage Camera', description: 'Fully functional analog camera with lens. Perfect for photography enthusiasts.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', ownerEmail: 'alice@example.com', ownerName: 'Alice' },
      { id: 2, name: 'Mountain Bike', description: 'Trek mountain bike, size M, recently serviced. Great for trails.', image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400', ownerEmail: 'bob@example.com', ownerName: 'Bob' },
      { id: 3, name: 'Acoustic Guitar', description: 'Yamaha F310, with padded case and extra strings. Excellent condition.', image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400', ownerEmail: 'alice@example.com', ownerName: 'Alice' },
    ];
    localStorage.setItem('items', JSON.stringify(sampleItems));
  }
}

function getAllItems() {
  return JSON.parse(localStorage.getItem('items')) || [];
}

function getItemsByOwner(email) {
  return getAllItems().filter(item => item.ownerEmail === email);
}

function addItem(name, description, image, owner) {
  const items = getAllItems();
  const newItem = {
    id: Date.now(),
    name,
    description,
    image: image || 'https://images.unsplash.com/photo-1588099768523-f4e6a5679f88?w=400', // placeholder
    ownerEmail: owner.email,
    ownerName: owner.name
  };
  items.push(newItem);
  localStorage.setItem('items', JSON.stringify(items));
  return newItem;
}

function deleteItem(id) {
  let items = getAllItems();
  items = items.filter(item => item.id !== id);
  localStorage.setItem('items', JSON.stringify(items));
}

// ========== UI RENDERING ==========

function loadAllItems() {
  const items = getAllItems();
  const grid = document.getElementById('allItemsGrid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '<p class="empty-message">No items yet. Be the first to list one!</p>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="item-card" onclick="showItemDetails(${item.id})">
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1588099768523-f4e6a5679f88?w=400'">
      </div>
      <div class="item-content">
        <h3 class="item-title">${item.name}</h3>
        <p class="item-description">${item.description.substring(0, 60)}${item.description.length > 60 ? '…' : ''}</p>
        <div class="item-meta">
          <span class="item-owner"><i class="fas fa-user"></i> ${item.ownerName}</span>
          <button class="btn-icon" onclick="event.stopPropagation(); showItemDetails(${item.id})"><i class="fas fa-eye"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

function loadMyItems() {
  const user = getCurrentUser();
  if (!user) return;
  const items = getItemsByOwner(user.email);
  const grid = document.getElementById('myItemsGrid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '<p class="empty-message">You haven\'t listed any items yet.</p>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="item-card" onclick="showItemDetails(${item.id})">
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1588099768523-f4e6a5679f88?w=400'">
      </div>
      <div class="item-content">
        <h3 class="item-title">${item.name}</h3>
        <p class="item-description">${item.description.substring(0, 60)}${item.description.length > 60 ? '…' : ''}</p>
        <div class="item-meta">
          <span class="item-owner"><i class="fas fa-user"></i> You</span>
          <div class="item-actions">
            <button class="btn-icon" onclick="event.stopPropagation(); editItemPrompt(${item.id})"><i class="fas fa-edit"></i></button>
            <button class="btn-icon delete" onclick="event.stopPropagation(); deleteItemPrompt(${item.id})"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ========== MODAL DETAILS ==========
let currentItem = null;

function showItemDetails(itemId) {
  const items = getAllItems();
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  currentItem = item;

  const modal = document.getElementById('itemModal');
  const contentDiv = document.getElementById('modalContent');
  
  contentDiv.innerHTML = `
    <img class="modal-item-image" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1588099768523-f4e6a5679f88?w=400'">
    <div class="modal-item-details">
      <h2>${item.name}</h2>
      <p>${item.description}</p>
    </div>
    <div class="modal-owner-info">
      <i class="fas fa-user-circle modal-owner-icon"></i>
      <div class="modal-owner-text">
        <h4>${item.ownerName}</h4>
        <p>${item.ownerEmail}</p>
      </div>
    </div>
    <button class="modal-contact-btn" id="contactOwnerBtn"><i class="fas fa-paper-plane"></i> Contact for barter</button>
  `;

  modal.style.display = 'flex';

  // Add contact button handler
  setTimeout(() => {
    const contactBtn = document.getElementById('contactOwnerBtn');
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        alert(`📨 Interest sent to ${item.ownerName} (demo). They will contact you soon.`);
      });
    }
  }, 100);
}

function setupModal() {
  const modal = document.getElementById('itemModal');
  const closeBtn = document.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// ========== EDIT/DELETE PROMPTS ==========
function editItemPrompt(id) {
  const items = getAllItems();
  const item = items.find(i => i.id === id);
  if (!item) return;

  const newName = prompt('Edit item name:', item.name);
  if (newName !== null && newName.trim() !== '') item.name = newName.trim();
  const newDesc = prompt('Edit description:', item.description);
  if (newDesc !== null && newDesc.trim() !== '') item.description = newDesc.trim();
  const newImage = prompt('Edit image URL (optional):', item.image);
  if (newImage !== null) item.image = newImage.trim() || item.image;

  localStorage.setItem('items', JSON.stringify(items));
  loadMyItems();
  alert('✅ Item updated successfully!');
}

function deleteItemPrompt(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    deleteItem(id);
    loadMyItems();
    alert('🗑️ Item deleted.');
  }
}

// ========== SETUP ADD ITEM FORM ==========
function setupAddItemForm() {
  const form = document.getElementById('addItemForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const image = document.getElementById('itemImage').value.trim();
    const user = getCurrentUser();

    if (!name || !description) {
      alert('Please fill in name and description.');
      return;
    }

    addItem(name, description, image, user);
    form.reset();
    loadMyItems();
    alert('🎉 Item posted successfully!');
  });
}

// ========== AUTH PAGE SETUP ==========
function setupAuthPage() {
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const switchToRegister = document.getElementById('switchToRegisterBtn');
  const switchToLogin = document.getElementById('switchToLoginBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  function setActivePanel(panel) {
    if (panel === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginPanel.classList.add('active');
      registerPanel.classList.remove('active');
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerPanel.classList.add('active');
      loginPanel.classList.remove('active');
    }
  }

  if (tabLogin) tabLogin.addEventListener('click', (e) => { e.preventDefault(); setActivePanel('login'); });
  if (tabRegister) tabRegister.addEventListener('click', (e) => { e.preventDefault(); setActivePanel('register'); });
  if (switchToRegister) switchToRegister.addEventListener('click', (e) => { e.preventDefault(); setActivePanel('register'); });
  if (switchToLogin) switchToLogin.addEventListener('click', (e) => { e.preventDefault(); setActivePanel('login'); });

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const user = handleLogin(email, password);
      if (user) {
        alert(`👋 Welcome back, ${user.name}!`);
        window.location.href = 'home.html';
      } else {
        alert('Invalid email or password');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirm = document.getElementById('regConfirm').value;

      if (!name || !email || !password || !confirm) {
        alert('All fields are required');
        return;
      }
      if (password !== confirm) {
        alert('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }
      const user = handleRegister(name, email, password);
      if (user) {
        alert(`🎉 Welcome, ${user.name}! Your account has been created.`);
        window.location.href = 'home.html';
      } else {
        alert('Email already exists');
      }
    });
  }
}

// ========== LOGOUT SETUP ==========
function setupLogout() {
  const btn = document.getElementById('logoutBtn');
  if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  initUsers();
  initItems();

  if (document.getElementById('tabLogin')) {
    setupAuthPage();
  }
});