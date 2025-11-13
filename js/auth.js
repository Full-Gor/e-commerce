// Système d'authentification pour la page login.html

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginContent = document.getElementById('login-content');
    const registerContent = document.getElementById('register-content');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToRegister = document.getElementById('switch-to-register');
    const authSwitchText = document.getElementById('auth-switch-text');

    // Vérifier si l'utilisateur est déjà connecté
    checkIfLoggedIn();

    // Gestion des onglets
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Lien pour basculer vers l'inscription
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('register');
        });
    }

    // Formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Formulaire d'inscription
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Boutons sociaux (simulation)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification('Fonctionnalité ' + platform + ' à venir !', 'info');
        });
    });
});

// Basculer entre les onglets
function switchTab(tabName) {
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginContent = document.getElementById('login-content');
    const registerContent = document.getElementById('register-content');
    const authSwitchText = document.getElementById('auth-switch-text');

    authTabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    if (tabName === 'login') {
        loginContent.classList.add('active');
        registerContent.classList.remove('active');
        authSwitchText.innerHTML = 'Pas encore de compte ? <a href="#" id="switch-to-register">Inscrivez-vous</a>';
    } else {
        registerContent.classList.add('active');
        loginContent.classList.remove('active');
        authSwitchText.innerHTML = 'Déjà un compte ? <a href="#" id="switch-to-login">Connectez-vous</a>';
    }

    // Réattacher les événements
    const switchLink = document.getElementById(tabName === 'login' ? 'switch-to-register' : 'switch-to-login');
    if (switchLink) {
        switchLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(tabName === 'login' ? 'register' : 'login');
        });
    }
}

// Gérer la connexion
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Validation
    if (!username || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }

    // Récupérer les utilisateurs
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    // Vérifier les identifiants
    if (users[username] && users[username] === password) {
        // Connexion réussie
        localStorage.setItem('currentUser', username);
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', username);
        }

        showNotification('Connexion réussie ! Redirection...', 'success');

        // Rediriger après 1 seconde
        setTimeout(() => {
            const redirectTo = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
            window.location.href = redirectTo;
        }, 1000);
    } else {
        showNotification('Pseudo ou mot de passe incorrect', 'error');
    }
}

// Gérer l'inscription
function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;
    const acceptTerms = document.getElementById('accept-terms').checked;

    // Validation
    if (!username || !password || !confirmPassword) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    if (username.length < 3) {
        showNotification('Le pseudo doit contenir au moins 3 caractères', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }

    if (!acceptTerms) {
        showNotification('Vous devez accepter les conditions d\'utilisation', 'error');
        return;
    }

    // Vérifier si le pseudo existe déjà
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username]) {
        showNotification('Ce pseudo est déjà utilisé', 'error');
        return;
    }

    // Créer le compte
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));

    // Sauvegarder l'email si fourni
    if (email) {
        const emails = JSON.parse(localStorage.getItem('userEmails') || '{}');
        emails[username] = email;
        localStorage.setItem('userEmails', JSON.stringify(emails));
    }

    // Connecter automatiquement
    localStorage.setItem('currentUser', username);

    showNotification('Compte créé avec succès ! Redirection...', 'success');

    // Rediriger après 1 seconde
    setTimeout(() => {
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
        window.location.href = redirectTo;
    }, 1000);
}

// Vérifier si déjà connecté
function checkIfLoggedIn() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        // Afficher un message et rediriger
        showNotification('Vous êtes déjà connecté en tant que ' + currentUser, 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Auto-remplir le pseudo si "Se souvenir de moi" était coché
    const rememberedUser = localStorage.getItem('rememberMe');
    if (rememberedUser) {
        const loginUsername = document.getElementById('login-username');
        if (loginUsername) {
            loginUsername.value = rememberedUser;
        }
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    if (!notification) {
        console.log(message);
        return;
    }

    notification.textContent = message;
    notification.className = 'notification show';
    
    if (type === 'success') {
        notification.classList.add('success');
    } else if (type === 'error') {
        notification.classList.add('error');
    }

    // Masquer après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
