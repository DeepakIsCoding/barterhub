// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // ----- DOM elements -----
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  
  const switchToRegister = document.getElementById('switchToRegisterBtn');
  const switchToLogin = document.getElementById('switchToLoginBtn');

  // Forms
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // ----- helper: set active tab & panel -----
  function setActivePanel(panelType) {
    if (panelType === 'login') {
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

  // ----- event listeners for tabs -----
  tabLogin.addEventListener('click', function(e) {
    e.preventDefault();
    setActivePanel('login');
  });

  tabRegister.addEventListener('click', function(e) {
    e.preventDefault();
    setActivePanel('register');
  });

  // ----- links inside panels (for convenience) -----
  if (switchToRegister) {
    switchToRegister.addEventListener('click', function(e) {
      e.preventDefault();
      setActivePanel('register');
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener('click', function(e) {
      e.preventDefault();
      setActivePanel('login');
    });
  }

  // ----- LOGIN submission (demo validation) -----
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      alert('⚠️ Both email and password are required.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      alert('📧 Please enter a valid email address.');
      return;
    }
    alert(`✨ Demo login welcome, ${email}!\n(No actual authentication — this is a frontend demo.)`);
  });

  // ----- REGISTER submission (with password match) -----
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pwd = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    if (!name || !email || !pwd || !confirm) {
      alert('🟡 All fields are required.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      alert('📧 Please provide a valid email address.');
      return;
    }
    if (pwd.length < 6) {
      alert('🔒 Password must be at least 6 characters.');
      return;
    }
    if (pwd !== confirm) {
      alert('❌ Passwords do not match.');
      return;
    }

    alert(`🎉 Registration demo for ${name} (${email}) — looks good!\n(Your password is safe: no data sent to server.)`);
  });
});