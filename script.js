// ========== AUTHENTICATION ==========

// Initialize users if not exist
function initUsers() {
  if (!localStorage.getItem('users')) {
    const sampleUsers = [
      { name: 'Alice', email: 'alice@example.com', password: '123456' },
      { name: 'Bob', email: 'bob@example.com', password: '123456' }
    ];
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
}

// Check if user is logged in, redirect to login if not
function checkAuth() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Get current user object
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// Login
function handleLogin(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Store user (without password) in currentUser
    const { password, ...safeUser } = user;
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
    return true;
  }
  return false;
}

// Register
function handleRegister(name, email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.email === email)) {
    return false; // email exists
  }
  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  // Auto login after register
  const { password: p, ...safeUser } = newUser;
  localStorage.setItem('currentUser', JSON.stringify(safeUser));
  return true;
}

// Logout
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// ========== ITEMS MANAGEMENT ==========

// Initialize sample items
function initItems() {
  if (!localStorage.getItem('items')) {
    const sampleItems = [
      { id: 1, name: 'Vintage Camera', description: 'Works perfectly', image: 'https://via.placeholder.com/300?text=📷', ownerEmail: 'alice@example.com', ownerName: 'Alice' },
      { id: 2, name: 'Mountain Bike', description: 'Size M, great condition', image: 'https://via.placeholder.com/300?text=🚲', ownerEmail: 'bob@example.com', ownerName: 'Bob' },
      { id: 3, name: 'Acoustic Guitar', description: 'Yamaha, with case', image: 'https://via.placeholder.com/300?text=🎸', ownerEmail: 'alice@example.com', ownerName: 'Alice' },
    ];
    localStorage.setItem('items', JSON.stringify(sampleItems));
  }
}

// Get all items
function getAllItems() {
  return JSON.parse(localStorage.getItem('items')) || [];
}

// Get items by owner email
function getItemsByOwner(email) {
  const items = getAllItems();
  return items.filter(item => item.ownerEmail === email);
}

// Add new item
function addItem(name, description, image, owner) {
  const items = getAllItems();
  const newItem = {
    id: Date.now(),
    name,
    description,
    image: image || '',
    ownerEmail: owner.email,
    ownerName: owner.name
  };
  items.push(newItem);
  localStorage.setItem('items', JSON.stringify(items));
  return newItem;
}

// Update item
function updateItem(id, updatedFields) {
  let items = getAllItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedFields };
    localStorage.setItem('items', JSON.stringify(items));
    return true;
  }
  return false;
}

// Delete item
function deleteItem(id) {
  let items = getAllItems();
  items = items.filter(item => item.id !== id);
  localStorage.setItem('items', JSON.stringify(items));
}

// ========== UI RENDERING ==========

// Load all items on home page
function loadAllItems() {
  const items = getAllItems();
  const grid = document.getElementById('allItemsGrid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '<p class="empty-message">No items yet. Be the first to list one!</p>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="item-card">
      <div class="item-image">
        <img src="${item.image || 'https://via.placeholder.com/300?text=📦'}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300?text=📦'">
      </div>
      <div class="item-content">
        <h3 class="item-title">${item.name}</h3>
        <p class="item-description">${item.description}</p>
        <div class="item-meta">
          <span class="item-owner"><i class="fas fa-user"></i> ${item.ownerName}</span>
          <button class="btn-icon exchange-btn" onclick="alert('Interest sent to ${item.ownerName}! (demo)')"><i class="fas fa-exchange-alt"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

// Load current user's items on dashboard
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
    <div class="item-card" data-id="${item.id}">
      <div class="item-image">
        <img src="${item.image || 'https://via.placeholder.com/300?text=📦'}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300?text=📦'">
      </div>
      <div class="item-content">
        <h3 class="item-title">${item.name}</h3>
        <p class="item-description">${item.description}</p>
        <div class="item-meta">
          <span class="item-owner"><i class="fas fa-user"></i> You</span>
          <div class="item-actions">
            <button class="btn-icon" onclick="editItemPrompt(${item.id})"><i class="fas fa-edit"></i></button>
            <button class="btn-icon delete" onclick="deleteItemPrompt(${item.id})"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Edit item with prompt (simple demo)
function editItemPrompt(id) {
  const items = getAllItems();
  const item = items.find(i => i.id === id);
  if (!item) return;

  const newName = prompt('Edit item name:', item.name);
  if (newName !== null && newName.trim() !== '') {
    item.name = newName.trim();
  }
  const newDesc = prompt('Edit description:', item.description);
  if (newDesc !== null && newDesc.trim() !== '') {
    item.description = newDesc.trim();
  }
  const newImage = prompt('Edit image URL (optional):', item.image);
  if (newImage !== null) {
    item.image = newImage.trim();
  }
  updateItem(id, { name: item.name, description: item.description, image: item.image });
  loadMyItems();
}

// Delete item with confirmation
function deleteItemPrompt(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    deleteItem(id);
    loadMyItems();
  }
}

// Setup add item form
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
    loadMyItems(); // refresh
    alert('Item added!');
  });
}

// ========== LOGIN/REGISTER PAGE LOGIC ==========
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
      if (handleLogin(email, password)) {
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
      if (handleRegister(name, email, password)) {
        window.location.href = 'home.html';
      } else {
        alert('Email already exists');
      }
    });
  }
}

// Setup logout button on home/dashboard
function setupLogout() {
  const btn = document.getElementById('logoutBtn');
  if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
}

// ========== INIT ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
  initUsers();
  initItems();

  // If on index.html, setup auth page
  if (document.getElementById('tabLogin')) {
    setupAuthPage();
  }
});