// Script pour la page des promotions
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le compte à rebours
    initCountdown();
    
    // Initialiser les onglets de catégories
    initCategoryTabs();
    
    // Configurer les actions des cartes de promotion
    setupDealCards();
    
    // Configurer les boutons de copie pour les coupons
    setupCoupons();
    
    // Animation des éléments au défilement
    setupScrollAnimations();
});

// Initialiser le compte à rebours
function initCountdown() {
    // Date de fin (7 jours à partir de maintenant)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    // Mise à jour du compte à rebours chaque seconde
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = endDate - now;
        
        if (timeLeft <= 0) {
            // Si le compte à rebours est terminé
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        // Calcul des jours, heures, minutes et secondes restantes
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Mise à jour des éléments HTML
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Appel initial
    updateCountdown();
    
    // Animation des éléments du compte à rebours
    const countdownItems = document.querySelectorAll('.countdown-item');
    countdownItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Initialiser les onglets de catégories
function initCategoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Gérer les clics sur les boutons d'onglet
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Masquer tous les contenus d'onglet
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Afficher le contenu d'onglet correspondant
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Simuler le chargement des produits lorsqu'un onglet est activé
    const loadProducts = function(tabId) {
        const tabContent = document.getElementById(tabId + '-tab');
        const productsGrid = tabContent.querySelector('.products-grid');
        
        // Créer un effet de chargement
        productsGrid.innerHTML = '<div class="loading">Chargement des produits...</div>';
        productsGrid.style.minHeight = '300px';
        productsGrid.style.display = 'flex';
        productsGrid.style.justifyContent = 'center';
        productsGrid.style.alignItems = 'center';
        
        // Simuler un délai de chargement
        setTimeout(() => {
            // Dans une application réelle, vous chargeriez des produits depuis une API
            // Pour cette démo, nous utilisons des éléments statiques
            // Vous pouvez ajouter ici votre code AJAX pour charger des produits
            
            // Pour l'exemple, nous utilisons le contenu de l'onglet Mode
            // et le clonons pour les autres onglets
            const modeTab = document.getElementById('mode-tab');
            const modeProducts = modeTab.querySelector('.products-grid').innerHTML;
            
            productsGrid.innerHTML = modeProducts;
            
            // Animer l'apparition des produits
            const products = productsGrid.querySelectorAll('.product-card');
            products.forEach((product, index) => {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    product.style.transition = 'all 0.5s ease';
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 1000);
    };
    
    // Charger les produits lors du changement d'onglet (sauf pour le premier onglet qui est déjà chargé)
    tabButtons.forEach(button => {
        if (!button.classList.contains('active')) {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                if (tabId !== 'mode') {
                    loadProducts(tabId);
                }
            });
        }
    });
}

// Configurer les actions des cartes de promotion
function setupDealCards() {
    const dealCards = document.querySelectorAll('.deal-card');
    
    dealCards.forEach(card => {
        // Gérer l'animation au survol
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        // Gérer les actions (panier, favoris)
        const actions = card.querySelectorAll('.deal-action');
        actions.forEach(action => {
            action.addEventListener('click', function(e) {
                e.preventDefault();
                const actionType = this.textContent;
                const productTitle = card.querySelector('.deal-title').textContent;
                
                if (actionType === '🛒') {
                    // Ajouter au panier
                    showNotification(`${productTitle} ajouté au panier`);
                    
                    // Mettre à jour le compteur de panier
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        cartCount.textContent = parseInt(cartCount.textContent) + 1;
                        cartCount.style.animation = 'pulse 0.5s';
                        setTimeout(() => {
                            cartCount.style.animation = '';
                        }, 500);
                    }
                } else if (actionType === '❤️') {
                    // Ajouter aux favoris
                    showNotification(`${productTitle} ajouté aux favoris`);
                }
            });
        });
    });
    
    // Animer les barres de progression
    animateProgressBars();
}

// Animer les barres de progression
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease';
            bar.style.width = width;
        }, 500);
    });
}

// Configurer les boutons de copie pour les coupons
function setupCoupons() {
    const couponCards = document.querySelectorAll('.coupon-card');
    
    // Générer les codes et ajouter des boutons de copie
    couponCards.forEach((card, index) => {
        // Générer un code de coupon aléatoire
        const couponCode = generateCouponCode();
        
        // Créer l'élément de code
        const codeElement = document.createElement('div');
        codeElement.className = 'coupon-code';
        codeElement.innerHTML = `
            <div class="code-text">${couponCode}</div>
            <button class="copy-btn">Copier</button>
        `;
        
        // Ajouter à la carte
        const couponDetails = card.querySelector('.coupon-details');
        couponDetails.appendChild(codeElement);
        
        // Configurer le bouton de copie
        const copyBtn = codeElement.querySelector('.copy-btn');
        copyBtn.addEventListener('click', function() {
            // Copier le code dans le presse-papier
            copyToClipboard(couponCode);
            
            // Changer le texte du bouton temporairement
            const originalText = this.textContent;
            this.textContent = 'Copié !';
            this.style.backgroundColor = '#06d6a0';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
            
            // Afficher une notification
            showNotification('Code de coupon copié dans le presse-papier');
        });
    });
}

// Générer un code de coupon aléatoire
function generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Copier du texte dans le presse-papier
function copyToClipboard(text) {
    // Créer un élément temporaire
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    // Exécuter la commande de copie
    document.execCommand('copy');
    
    // Supprimer l'élément temporaire
    document.body.removeChild(tempInput);
}

// Afficher une notification
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
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
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
    }, 3000);
}

// Animation des éléments au défilement
function setupScrollAnimations() {
    // Éléments à animer lors du défilement
    const animatedElements = [
        { selector: '.deal-card', delay: 0.1 },
        { selector: '.product-card', delay: 0.1 },
        { selector: '.coupon-card', delay: 0.1 }
    ];
    
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
    
    // Observer chaque groupe d'éléments
    animatedElements.forEach(({ selector, delay }) => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach((element, index) => {
            // Configurer l'animation
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.transitionDelay = `${index % 4 * delay}s`;
            
            // Ajouter à l'observateur
            observer.observe(element);
        });
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