// main.js - Script principal pour toutes les pages du site e-commerce

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des éléments d'interface
    initHeader();
    initSearchBar();
    initSideTags();
    initBackToTop();
    setupEventListeners();
});

// Gestion du header responsive et du scroll
function initHeader() {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Effet de scroll pour le header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Menu hamburger pour mobile
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// Barre de recherche
function initSearchBar() {
    const searchButton = document.getElementById('search-button');
    const searchContainer = document.getElementById('search-container');
    const searchClose = document.getElementById('search-close');
    
    if (searchButton && searchContainer && searchClose) {
        // Ouvrir la barre de recherche
        searchButton.addEventListener('click', function() {
            searchContainer.classList.add('active');
            setTimeout(() => {
                document.querySelector('.search-input').focus();
            }, 300);
        });
        
        // Fermer la barre de recherche
        searchClose.addEventListener('click', function() {
            searchContainer.classList.remove('active');
        });
        
        // Fermer en cliquant en dehors
        searchContainer.addEventListener('click', function(e) {
            if (e.target === this) {
                searchContainer.classList.remove('active');
            }
        });
        
        // Gestion du formulaire de recherche
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchInput = this.querySelector('.search-input');
                if (searchInput && searchInput.value.trim()) {
                    // Rediriger vers la page de résultats (simulation)
                    window.location.href = `products.html?search=${encodeURIComponent(searchInput.value.trim())}`;
                }
            });
        }
    }
}

// Gestion des étiquettes latérales
function initSideTags() {
    const sideTags = document.querySelectorAll('.side-tag');
    
    sideTags.forEach((tag, index) => {
        // Animation d'entrée
        tag.style.animationDelay = `${index * 0.2}s`;
        
        // Effet au clic
        tag.addEventListener('click', function() {
            const tagText = this.textContent;
            
            // Simulation de l'application de la promotion
            showNotification(`Promotion activée : ${tagText}`);
            
            // Rediriger vers la page appropriée
            if (tagText.includes('RÉDUCTION')) {
                window.location.href = 'promotions.html';
            } else if (tagText.includes('NOUVEAU')) {
                window.location.href = 'products.html?new=true';
            } else if (tagText.includes('LIVRAISON')) {
                window.location.href = 'products.html?shipping=free';
            } else if (tagText.includes('FLASH')) {
                window.location.href = 'promotions.html#flash';
            }
        });
    });
}

// Bouton "Retour en haut"
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        // Afficher/masquer le bouton en fonction du défilement
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        // Action du bouton
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Configuration des écouteurs d'événements généraux
function setupEventListeners() {
    // Liens de navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Fermer le menu mobile si ouvert
            const hamburger = document.querySelector('.hamburger');
            const navContainer = document.querySelector('.nav-links');
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navContainer.classList.remove('active');
            }
        });
    });
    
    // Boutons d'icônes dans le header
    setupHeaderIcons();
    
    // Gestion de la newsletter
    setupNewsletter();
    
    // Gestion des animations au défilement
    setupScrollAnimations();
}

// Configuration des icônes du header
function setupHeaderIcons() {
    const cartButton = document.getElementById('cart-button');
    const wishlistButton = document.getElementById('wishlist-button');
    const accountButton = document.getElementById('account-button');
    
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }
    
    if (wishlistButton) {
        wishlistButton.addEventListener('click', function() {
            window.location.href = 'wishlist.html';
        });
    }
    
    if (accountButton) {
        accountButton.addEventListener('click', function() {
            // Simpler une modal de connexion/inscription
            showAccountModal();
        });
    }
}

// Simulation de modal de compte
function showAccountModal() {
    // Vérifier si la modal existe déjà
    let modal = document.getElementById('account-modal');
    
    if (!modal) {
        // Créer la modal
        modal = document.createElement('div');
        modal.id = 'account-modal';
        modal.classList.add('modal');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-close">&times;</div>
                <div class="modal-tabs">
                    <button class="tab-button active" data-tab="login">Connexion</button>
                    <button class="tab-button" data-tab="register">Inscription</button>
                </div>
                <div class="tab-content active" id="login-tab">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Mot de passe</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <div class="form-group checkbox-group">
                            <label>
                                <input type="checkbox"> Se souvenir de moi
                            </label>
                        </div>
                        <button type="submit" class="btn">Se connecter</button>
                        <div class="form-footer">
                            <a href="#">Mot de passe oublié?</a>
                        </div>
                    </form>
                </div>
                <div class="tab-content" id="register-tab">
                    <form id="register-form">
                        <div class="form-group">
                            <label for="register-name">Nom complet</label>
                            <input type="text" id="register-name" required>
                        </div>
                        <div class="form-group">
                            <label for="register-email">Email</label>
                            <input type="email" id="register-email" required>
                        </div>
                        <div class="form-group">
                            <label for="register-password">Mot de passe</label>
                            <input type="password" id="register-password" required>
                        </div>
                        <div class="form-group checkbox-group">
                            <label>
                                <input type="checkbox" required> J'accepte les <a href="#">conditions d'utilisation</a>
                            </label>
                        </div>
                        <button type="submit" class="btn">S'inscrire</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Gérer la fermeture de la modal
        const closeButton = modal.querySelector('.modal-close');
        closeButton.addEventListener('click', function() {
            modal.classList.remove('active');
        });
        
        // Gérer les onglets
        const tabButtons = modal.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Désactiver tous les onglets
                tabButtons.forEach(btn => btn.classList.remove('active'));
                const tabContents = modal.querySelectorAll('.tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Activer l'onglet sélectionné
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Gérer les formulaires
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Connexion réussie !');
            modal.classList.remove('active');
        });
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Inscription réussie !');
            modal.classList.remove('active');
        });
        
        // Ajouter des styles pour la modal
        addModalStyles();
    }
    
    // Afficher la modal
    modal.classList.add('active');
}

// Ajouter les styles de la modal
function addModalStyles() {
    // Vérifier si les styles existent déjà
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-content {
                background-color: white;
                border-radius: 8px;
                max-width: 400px;
                width: 90%;
                padding: 30px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                transform: scale(0.8);
                transition: all 0.3s ease;
            }
            
            .modal.active .modal-content {
                transform: scale(1);
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                font-size: 24px;
                color: #777;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                color: var(--primary);
                transform: rotate(90deg);
            }
            
            .modal-tabs {
                display: flex;
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .tab-button {
                flex: 1;
                background: none;
                border: none;
                padding: 10px;
                font-size: 16px;
                font-weight: 600;
                color: #777;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .tab-button.active {
                color: var(--primary);
                border-bottom: 2px solid var(--primary);
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: var(--dark);
            }
            
            .form-group input[type="text"],
            .form-group input[type="email"],
            .form-group input[type="password"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .form-group input:focus {
                border-color: var(--primary);
                box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.1);
                outline: none;
            }
            
            .checkbox-group {
                display: flex;
                align-items: center;
            }
            
            .checkbox-group input {
                margin-right: 10px;
            }
            
            .checkbox-group a {
                color: var(--primary);
                text-decoration: none;
            }
            
            .checkbox-group a:hover {
                text-decoration: underline;
            }
            
            .form-footer {
                margin-top: 15px;
                text-align: center;
            }
            
            .form-footer a {
                color: var(--primary);
                text-decoration: none;
            }
            
            .form-footer a:hover {
                text-decoration: underline;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Gestion de la newsletter
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter-input');
            if (emailInput && emailInput.value.trim()) {
                showNotification('Merci de vous être abonné à notre newsletter !');
                emailInput.value = '';
            } else {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
            }
        });
    }
}

// Fonction pour afficher une notification
function showNotification(message, type = 'success') {
    // Supprimer toute notification existante
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Ajouter la notification au document
    document.body.appendChild(notification);
    
    // Ajouter les styles de la notification
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 4px;
                background-color: #06d6a0;
                color: white;
                font-weight: 500;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .notification.error {
                background-color: #ff006e;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateX(-50%) translateY(-10px);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Afficher la notification avec animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Masquer la notification après un délai
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Animation des éléments au défilement
function setupScrollAnimations() {
    // Éléments à animer lors du défilement
    const animatedElements = document.querySelectorAll('.product-card, .category-card, .testimonial-card, .feature-item');
    
    // Configuration de l'observateur d'intersection
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Créer l'observateur
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observer chaque élément
    animatedElements.forEach((element, index) => {
        // Configurer l'animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.transitionDelay = `${index % 4 * 0.1}s`;
        
        // Ajouter à l'observateur
        observer.observe(element);
    });
    
    // Ajouter la classe d'animation
    if (!document.getElementById('scroll-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'scroll-animation-styles';
        
        style.textContent = `
            .animate {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        
        document.head.appendChild(style);
    }
}