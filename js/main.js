// main.js - Script principal pour toutes les pages du site e-commerce

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des éléments d'interface
    initHeader();
    initSearchBar();
    initSideTags();
    initBackToTop();
    setupEventListeners();

    // Charger l'état de connexion et les témoignages utilisateur
    updateUserInterface();
    loadUserTestimonials();

    // Gérer le bouton "Se connecter" pour laisser un avis
    const loginToReviewBtn = document.getElementById('login-to-review');
    if (loginToReviewBtn) {
        loginToReviewBtn.addEventListener('click', showAccountModal);
    }
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

// Barre de recherche améliorée
function initSearchBar() {
    const searchButton = document.getElementById('search-button');
    const searchContainer = document.getElementById('search-container');
    const searchClose = document.getElementById('search-close');

    if (searchButton && searchContainer && searchClose) {
        // Ouvrir la barre de recherche
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            searchContainer.classList.add('active');
            setTimeout(() => {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        });

        // Fermer la barre de recherche
        searchClose.addEventListener('click', function() {
            searchContainer.classList.remove('active');
            clearSearchResults();
        });

        // Fermer en cliquant en dehors
        searchContainer.addEventListener('click', function(e) {
            if (e.target === this) {
                searchContainer.classList.remove('active');
                clearSearchResults();
            }
        });

        // Fermer avec la touche Echap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
                searchContainer.classList.remove('active');
                clearSearchResults();
            }
        });

        // Gestion du formulaire de recherche
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-input');

        if (searchForm && searchInput) {
            // Recherche en temps réel
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const query = this.value.trim();

                if (query.length >= 2) {
                    searchTimeout = setTimeout(() => {
                        performLiveSearch(query);
                    }, 300);
                } else {
                    clearSearchResults();
                }
            });

            // Soumission du formulaire
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (searchInput && searchInput.value.trim()) {
                    // Rediriger vers la page de résultats
                    window.location.href = `products.html?search=${encodeURIComponent(searchInput.value.trim())}`;
                }
            });
        }
    }
}

// Recherche en direct
function performLiveSearch(query) {
    // Créer le conteneur de résultats s'il n'existe pas
    let resultsContainer = document.querySelector('.search-results');

    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.appendChild(resultsContainer);
        }

        // Ajouter les styles
        addSearchResultsStyles();
    }

    // Simuler des résultats de recherche (dans une vraie app, ce serait une requête API)
    const mockResults = [
        { title: 'T-Shirt Premium', category: 'Vêtements', price: '24,99 €', url: 'products.html?category=vetements' },
        { title: 'Baskets Confort', category: 'Chaussures', price: '79,99 €', url: 'products.html?category=chaussures' },
        { title: 'Sac à dos tendance', category: 'Accessoires', price: '49,99 €', url: 'products.html?category=accessoires' },
        { title: 'Écouteurs sans fil', category: 'Électronique', price: '89,99 €', url: 'products.html?category=electronique' },
        { title: 'Montre élégante', category: 'Accessoires', price: '129,99 €', url: 'products.html?category=accessoires' },
        { title: 'Pantalon confort', category: 'Vêtements', price: '59,99 €', url: 'products.html?category=vetements' }
    ];

    // Filtrer les résultats selon la requête
    const filteredResults = mockResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    // Afficher les résultats
    if (filteredResults.length > 0) {
        resultsContainer.innerHTML = filteredResults.slice(0, 5).map(result => `
            <a href="${result.url}" class="search-result-item">
                <div class="result-info">
                    <div class="result-title">${highlightMatch(result.title, query)}</div>
                    <div class="result-category">${result.category}</div>
                </div>
                <div class="result-price">${result.price}</div>
            </a>
        `).join('');

        // Ajouter un lien "Voir tous les résultats"
        resultsContainer.innerHTML += `
            <a href="products.html?search=${encodeURIComponent(query)}" class="search-result-all">
                Voir tous les résultats pour "${query}"
            </a>
        `;

        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <p>Aucun résultat pour "${query}"</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
    }
}

// Surligner les correspondances dans les résultats
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

// Effacer les résultats de recherche
function clearSearchResults() {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
    }
}

// Ajouter les styles des résultats de recherche
function addSearchResultsStyles() {
    if (!document.getElementById('search-results-styles')) {
        const style = document.createElement('style');
        style.id = 'search-results-styles';

        style.textContent = `
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 0 0 12px 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                max-height: 400px;
                overflow-y: auto;
                margin-top: 8px;
                z-index: 10;
                display: none;
            }

            .search-result-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #f0f0f0;
                text-decoration: none;
                color: var(--dark);
                transition: all 0.3s ease;
            }

            .search-result-item:hover {
                background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
                padding-left: 25px;
            }

            .result-info {
                flex: 1;
            }

            .result-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 4px;
                color: var(--dark);
            }

            .result-title strong {
                color: var(--primary);
            }

            .result-category {
                font-size: 13px;
                color: #6c757d;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .result-price {
                font-size: 18px;
                font-weight: 700;
                color: var(--primary);
                margin-left: 15px;
            }

            .search-result-all {
                display: block;
                padding: 15px 20px;
                text-align: center;
                background: linear-gradient(135deg, var(--primary) 0%, #5c9dff 100%);
                color: white;
                text-decoration: none;
                font-weight: 600;
                border-radius: 0 0 12px 12px;
                transition: all 0.3s ease;
            }

            .search-result-all:hover {
                background: linear-gradient(135deg, #2563eb 0%, var(--primary) 100%);
                box-shadow: 0 4px 12px rgba(58, 134, 255, 0.3);
            }

            .search-no-results {
                padding: 30px 20px;
                text-align: center;
                color: #6c757d;
            }

            .search-no-results p {
                margin: 0;
                font-size: 15px;
            }

            /* Scrollbar personnalisée pour les résultats */
            .search-results::-webkit-scrollbar {
                width: 8px;
            }

            .search-results::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 0 0 12px 0;
            }

            .search-results::-webkit-scrollbar-thumb {
                background: var(--primary);
                border-radius: 4px;
            }

            .search-results::-webkit-scrollbar-thumb:hover {
                background: var(--dark);
            }
        `;

        document.head.appendChild(style);
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
                            <label for="login-username">Pseudo</label>
                            <input type="text" id="login-username" required>
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
                    </form>
                </div>
                <div class="tab-content" id="register-tab">
                    <form id="register-form">
                        <div class="form-group">
                            <label for="register-username">Pseudo</label>
                            <input type="text" id="register-username" required minlength="3">
                        </div>
                        <div class="form-group">
                            <label for="register-password">Mot de passe</label>
                            <input type="password" id="register-password" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="register-password-confirm">Confirmer le mot de passe</label>
                            <input type="password" id="register-password-confirm" required minlength="6">
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
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            // Récupérer les utilisateurs enregistrés
            const users = JSON.parse(localStorage.getItem('users') || '{}');

            // Vérifier si l'utilisateur existe et le mot de passe est correct
            if (users[username] && users[username] === password) {
                localStorage.setItem('currentUser', username);
                showNotification('Connexion réussie !');
                modal.classList.remove('active');
                updateUserInterface();
            } else {
                showNotification('Pseudo ou mot de passe incorrect', 'error');
            }
        });

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-password-confirm').value;

            // Vérifier que les mots de passe correspondent
            if (password !== confirmPassword) {
                showNotification('Les mots de passe ne correspondent pas', 'error');
                return;
            }

            // Récupérer les utilisateurs existants
            const users = JSON.parse(localStorage.getItem('users') || '{}');

            // Vérifier si l'utilisateur existe déjà
            if (users[username]) {
                showNotification('Ce pseudo est déjà utilisé', 'error');
                return;
            }

            // Enregistrer le nouvel utilisateur
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', username);

            showNotification('Inscription réussie !');
            modal.classList.remove('active');
            updateUserInterface();
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

// Mettre à jour l'interface utilisateur selon l'état de connexion
function updateUserInterface() {
    const currentUser = localStorage.getItem('currentUser');
    const accountButton = document.getElementById('account-button');

    if (currentUser) {
        // L'utilisateur est connecté
        accountButton.textContent = '👤 ' + currentUser.substring(0, 10);
        accountButton.title = currentUser;

        // Afficher le formulaire de témoignage si on est sur la page d'accueil
        const testimonialFormContainer = document.getElementById('testimonial-form-container');
        if (testimonialFormContainer) {
            testimonialFormContainer.innerHTML = `
                <form id="new-testimonial-form">
                    <div class="form-group">
                        <label for="testimonial-text">Votre avis</label>
                        <textarea id="testimonial-text" rows="4" placeholder="Partagez votre expérience..." required></textarea>
                    </div>
                    <button type="submit" class="btn">Publier mon avis</button>
                </form>
                <button class="btn btn-secondary" id="logout-btn">Se déconnecter</button>
            `;

            // Gérer la soumission du formulaire de témoignage
            const newTestimonialForm = document.getElementById('new-testimonial-form');
            if (newTestimonialForm) {
                newTestimonialForm.addEventListener('submit', handleTestimonialSubmit);
            }

            // Gérer la déconnexion
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logout);
            }
        }
    } else {
        // L'utilisateur n'est pas connecté
        accountButton.textContent = '👤';
        accountButton.title = 'Mon compte';
    }
}

// Gérer la soumission d'un nouveau témoignage
function handleTestimonialSubmit(e) {
    e.preventDefault();
    const currentUser = localStorage.getItem('currentUser');
    const testimonialText = document.getElementById('testimonial-text').value;

    if (!currentUser || !testimonialText) return;

    // Récupérer les témoignages existants
    const userTestimonials = JSON.parse(localStorage.getItem('userTestimonials') || '[]');

    // Ajouter le nouveau témoignage
    const newTestimonial = {
        username: currentUser,
        text: testimonialText,
        date: new Date().toISOString()
    };

    userTestimonials.push(newTestimonial);
    localStorage.setItem('userTestimonials', JSON.stringify(userTestimonials));

    // Ajouter le témoignage au DOM
    addTestimonialToDOM(newTestimonial);

    // Réinitialiser le formulaire
    document.getElementById('testimonial-text').value = '';
    showNotification('Votre avis a été publié avec succès !');
}

// Ajouter un témoignage au DOM
function addTestimonialToDOM(testimonial) {
    const container = document.getElementById('testimonial-container');
    if (!container) return;

    // Choisir une couleur aléatoire pour l'avatar
    const colors = ['#FF6B9D', '#3A86FF', '#06D6A0', '#FFD60A', '#9D4EDD', '#EF476F'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'testimonial-card user-testimonial';
    testimonialCard.innerHTML = `
        <div class="quote">"</div>
        <p class="testimonial-text">${testimonial.text}</p>
        <div class="testimonial-user">
            <div class="user-img">
                <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="${randomColor}"/>
                    <circle cx="50" cy="40" r="18" fill="#FFF"/>
                    <path d="M 25 85 Q 25 65 50 65 Q 75 65 75 85 Z" fill="#FFF"/>
                </svg>
            </div>
            <div class="user-info">
                <h4>${testimonial.username}</h4>
                <p>Client</p>
            </div>
        </div>
    `;

    container.appendChild(testimonialCard);

    // Faire défiler vers le nouveau témoignage
    setTimeout(() => {
        const allCards = container.querySelectorAll('.testimonial-card');
        const lastIndex = allCards.length - 1;
        if (window.initTestimonialSlider) {
            // Réinitialiser le carousel si la fonction existe
            const home = document.querySelector('.testimonials');
            if (home) {
                container.scrollTo({
                    left: lastIndex * (allCards[0].offsetWidth + 30),
                    behavior: 'smooth'
                });
            }
        }
    }, 100);
}

// Déconnexion
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Vous êtes déconnecté');
    updateUserInterface();

    // Recharger le formulaire de connexion
    const testimonialFormContainer = document.getElementById('testimonial-form-container');
    if (testimonialFormContainer) {
        testimonialFormContainer.innerHTML = `
            <p class="login-prompt">Connectez-vous pour laisser votre avis</p>
            <button class="btn" id="login-to-review">Se connecter</button>
        `;

        const loginToReviewBtn = document.getElementById('login-to-review');
        if (loginToReviewBtn) {
            loginToReviewBtn.addEventListener('click', showAccountModal);
        }
    }
}

// Charger les témoignages utilisateur au chargement de la page
function loadUserTestimonials() {
    const userTestimonials = JSON.parse(localStorage.getItem('userTestimonials') || '[]');
    userTestimonials.forEach(testimonial => {
        addTestimonialToDOM(testimonial);
    });
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