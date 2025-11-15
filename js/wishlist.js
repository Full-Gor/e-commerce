// Script pour la page des favoris
document.addEventListener('DOMContentLoaded', function() {
    // Charger la liste de souhaits depuis localStorage
    loadWishlistFromStorage();

    // Initialiser les fonctionnalités de la liste de souhaits
    initWishlistFunctionality();

    // Initialiser le slider de produits recommandés
    initRecommendationsSlider();

    // Configuration du partage de la liste de souhaits
    setupWishlistSharing();

    // Animation des éléments au défilement
    setupScrollAnimations();

    // Mettre à jour le compteur du panier depuis localStorage
    updateCartCountFromStorage();

    // Mettre à jour le compteur de wishlist
    updateWishlistCountInHeader();
});

// Charger la liste de souhaits depuis localStorage
function loadWishlistFromStorage() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistGrid = document.querySelector('.wishlist-grid');

    if (!wishlistGrid) return;

    // Vider le conteneur
    wishlistGrid.innerHTML = '';

    // Si la wishlist est vide
    if (wishlist.length === 0) {
        checkEmptyWishlist();
        return;
    }

    // Ajouter chaque produit
    wishlist.forEach(item => {
        const wishlistItemHTML = createWishlistItemHTML(item);
        wishlistGrid.insertAdjacentHTML('beforeend', wishlistItemHTML);
    });

    // Réinitialiser les event listeners après avoir chargé les items
    setupRemoveButtons();
    setupAddToCartButtons();

    // Mettre à jour le compteur
    updateWishlistCounter();
}

// Créer le HTML pour un produit de la wishlist
function createWishlistItemHTML(item) {
    return `
        <div class="wishlist-item" data-id="${item.id}">
            <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.title}">
                <button class="remove-from-wishlist">✕</button>
            </div>
            <div class="wishlist-item-content">
                <div class="wishlist-item-category">${item.category || 'Général'}</div>
                <h3 class="wishlist-item-title">${item.title}</h3>
                <div class="wishlist-item-price">
                    <span class="current-price">${typeof item.price === 'number' ? item.price.toFixed(2).replace('.', ',') + ' €' : item.price}</span>
                </div>
                <div class="wishlist-item-stock available">
                    <span class="stock-icon">✓</span> En stock
                </div>
                <button class="btn add-to-cart">Ajouter au panier</button>
            </div>
        </div>
    `;
}

// Sauvegarder un article dans la wishlist localStorage
function saveToWishlist(productId, productData) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    // Vérifier si le produit existe déjà
    const existingIndex = wishlist.findIndex(item => item.id === productId);

    if (existingIndex === -1) {
        wishlist.push(productData);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

// Retirer un article de la wishlist localStorage
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Mettre à jour le compteur du panier depuis localStorage
function updateCartCountFromStorage() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCountElement = document.querySelector('.cart-count');

    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountElement.textContent = totalItems;
    }
}

// Mettre à jour le compteur de wishlist dans le header
function updateWishlistCountInHeader() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistCountElement = document.querySelector('.wishlist-count');

    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlist.length;

        // Animation
        wishlistCountElement.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            wishlistCountElement.style.animation = '';
        }, 500);
    }
}

// Initialiser les fonctionnalités de la liste de souhaits
function initWishlistFunctionality() {
    // Gestion de la suppression d'articles
    setupRemoveButtons();
    
    // Gestion des boutons "Ajouter au panier"
    setupAddToCartButtons();
    
    // Gestion des boutons de notification
    setupNotifyButtons();
    
    // Gestion des actions globales (tout ajouter, vider la liste)
    setupGlobalActions();
    
    // Gestion de la pagination
    setupPagination();
    
    // Vérifier si la liste est vide
    checkEmptyWishlist();
}

// Gestion des boutons de suppression
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-from-wishlist');

    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Empêcher la propagation au parent

            const wishlistItem = this.closest('.wishlist-item');
            const productId = wishlistItem.getAttribute('data-id');

            // Supprimer de localStorage
            if (productId) {
                removeFromWishlist(productId);
            }

            // Simuler une animation de suppression
            wishlistItem.classList.add('removing');

            // Attendre la fin de l'animation avant de supprimer
            setTimeout(() => {
                wishlistItem.remove();

                // Mettre à jour le compteur d'articles
                updateWishlistCounter();

                // Mettre à jour le compteur dans le header
                updateWishlistCountInHeader();

                // Vérifier si la liste est vide après suppression
                checkEmptyWishlist();

                // Afficher une notification
                showNotification('Produit retiré de vos favoris');
            }, 500);
        });
    });
}

// Mise à jour du compteur d'articles dans la liste de souhaits
function updateWishlistCounter() {
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    const countElement = document.getElementById('wishlist-items-count');
    
    if (countElement) {
        // Mettre à jour le compteur
        countElement.textContent = wishlistItems.length;
        
        // Animation
        countElement.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            countElement.style.animation = '';
        }, 500);
    }
}

// Vérifier si la liste de souhaits est vide
function checkEmptyWishlist() {
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    const wishlistSection = document.querySelector('.wishlist-section .container');
    
    if (wishlistItems.length === 0 && wishlistSection) {
        // Remplacer le contenu par un message "liste vide"
        wishlistSection.innerHTML = `
            <div class="empty-wishlist">
                <div class="empty-wishlist-icon">❤️</div>
                <h3>Votre liste de souhaits est vide</h3>
                <p>Vous n'avez pas encore ajouté d'articles à votre liste de souhaits.</p>
                <a href="products.html" class="continue-shopping">Explorer les produits</a>
            </div>
        `;
    }
}

// Gestion des boutons "Ajouter au panier"
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.wishlist-item .add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const wishlistItem = this.closest('.wishlist-item');
            const productId = wishlistItem.getAttribute('data-id');
            const productTitle = wishlistItem.querySelector('.wishlist-item-title').textContent;
            const productPrice = wishlistItem.querySelector('.current-price').textContent;
            const productImage = wishlistItem.querySelector('.wishlist-item-image img').src;
            const productCategory = wishlistItem.querySelector('.wishlist-item-category').textContent;

            // Ajouter au panier dans localStorage
            addToCart({
                id: productId,
                name: productTitle,
                price: productPrice,
                image: productImage,
                category: productCategory,
                quantity: 1
            });

            // Mettre à jour le compteur du panier depuis localStorage
            updateCartCountFromStorage();

            // Animation du bouton
            this.style.transition = 'all 0.3s ease';
            this.style.backgroundColor = '#06d6a0';
            this.textContent = 'Ajouté ✓';

            setTimeout(() => {
                this.style.backgroundColor = '';
                this.textContent = 'Ajouter au panier';
            }, 2000);

            // Afficher une notification
            showNotification(`${productTitle} ajouté au panier`);
        });
    });
}

// Ajouter un article au panier dans localStorage
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Vérifier si le produit existe déjà dans le panier
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        // Augmenter la quantité
        cart[existingProductIndex].quantity += 1;
    } else {
        // Ajouter le nouveau produit
        cart.push(product);
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Gestion des boutons de notification
function setupNotifyButtons() {
    const notifyButtons = document.querySelectorAll('.notify-me');
    
    notifyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const wishlistItem = this.closest('.wishlist-item');
            const productTitle = wishlistItem.querySelector('.wishlist-item-title').textContent;
            
            // Simuler l'inscription à une notification
            this.style.transition = 'all 0.3s ease';
            this.style.backgroundColor = '#06d6a0';
            this.style.color = 'white';
            this.textContent = 'Vous serez notifié ✓';
            this.disabled = true;
            
            // Afficher une notification
            showNotification(`Vous serez notifié lorsque ${productTitle} sera de nouveau en stock`);
        });
    });
}

// Gestion des actions globales
function setupGlobalActions() {
    const addAllButton = document.querySelector('.add-all-to-cart');
    const clearWishlistButton = document.querySelector('.clear-wishlist');

    // Ajouter tous les articles au panier
    if (addAllButton) {
        addAllButton.addEventListener('click', function() {
            const availableItems = document.querySelectorAll('.wishlist-item-stock.available, .wishlist-item-stock.limited');
            
            if (availableItems.length === 0) {
                showNotification('Aucun article disponible à ajouter au panier', 'error');
                return;
            }
            
            // Simuler l'ajout au panier de tous les articles disponibles
            let addedCount = 0;
            
            availableItems.forEach(stockInfo => {
                const wishlistItem = stockInfo.closest('.wishlist-item');
                const addButton = wishlistItem.querySelector('.add-to-cart');
                
                if (addButton) {
                    // Déclencher un clic sur le bouton avec un délai croissant
                    setTimeout(() => {
                        addButton.click();
                    }, addedCount * 300);
                    
                    addedCount++;
                }
            });
            
            // Notification de confirmation après tous les ajouts
            setTimeout(() => {
                showNotification(`${addedCount} article(s) ajouté(s) au panier`);
            }, addedCount * 300 + 100);
        });
    }
    
    // Vider la liste de souhaits
    if (clearWishlistButton) {
        clearWishlistButton.addEventListener('click', function() {
            // Demander confirmation
            if (confirm('Êtes-vous sûr de vouloir vider votre liste de souhaits ?')) {
                const wishlistItems = document.querySelectorAll('.wishlist-item');
                
                // Animation de suppression progressive
                wishlistItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('removing');
                        
                        setTimeout(() => {
                            item.remove();
                            
                            // Vérifier si c'est le dernier élément
                            if (index === wishlistItems.length - 1) {
                                updateWishlistCounter();
                                checkEmptyWishlist();
                                showNotification('Votre liste de souhaits a été vidée');
                            }
                        }, 500);
                    }, index * 100);
                });
            }
        });
    }
}

// Gestion de la pagination
function setupPagination() {
    const paginationLinks = document.querySelectorAll('.wishlist-pagination a:not(.disabled)');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simuler un changement de page
            // Dans une application réelle, cela chargerait une nouvelle page d'articles
            
            // Désactiver les liens actifs
            document.querySelectorAll('.pagination-number').forEach(num => {
                num.classList.remove('active');
            });
            
            // Activer le lien cliqué s'il s'agit d'un numéro de page
            if (this.classList.contains('pagination-number')) {
                this.classList.add('active');
            }
            
            // Simuler un chargement
            showNotification('Chargement de la page...');
            
            // Faire défiler vers le haut
            window.scrollTo({
                top: document.querySelector('.wishlist-section').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
}

// Initialiser le slider de produits recommandés
function initRecommendationsSlider() {
    const slider = document.querySelector('.recommendations-list');
    const prevBtn = document.querySelector('.recommendations-slider .prev');
    const nextBtn = document.querySelector('.recommendations-slider .next');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    // Largeur d'un produit + marge
    const productWidth = 270; // 250px de largeur + 20px de marge
    
    // Défilement vers la gauche
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: -productWidth * 2,
            behavior: 'smooth'
        });
    });
    
    // Défilement vers la droite
    nextBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: productWidth * 2,
            behavior: 'smooth'
        });
    });
    
    // Gestion des boutons des produits recommandés
    setupRecommendedProducts();
}

// Gestion des produits recommandés
function setupRecommendedProducts() {
    const productActionBtns = document.querySelectorAll('.recommendations-list .product-action-btn');
    const addToCartBtns = document.querySelectorAll('.recommendations-list .add-to-cart');
    
    // Gérer les boutons d'action
    productActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const actionType = this.textContent;
            const product = this.closest('.product-card');
            const productTitle = product.querySelector('.product-title').textContent;
            
            if (actionType === '👁️') {
                // Aperçu rapide
                showNotification(`Aperçu rapide de ${productTitle}`);
            } else if (actionType === '🛒') {
                // Ajouter au panier
                const productPrice = product.querySelector('.current-price').textContent;
                const productImage = product.querySelector('.product-img img').src;
                const productCategory = product.querySelector('.product-category').textContent;

                addToCart({
                    id: 'recommend-' + Date.now(),
                    name: productTitle,
                    price: productPrice,
                    image: productImage,
                    category: productCategory,
                    quantity: 1
                });

                updateCartCountFromStorage();
                showNotification(`${productTitle} ajouté au panier`);
            } else if (actionType === '❤️') {
                // Ajouter aux favoris
                showNotification(`${productTitle} est déjà dans vos favoris`);
            }
        });
    });
    
    // Gérer les boutons "Ajouter au panier"
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const product = this.closest('.product-card');
            const productTitle = product.querySelector('.product-title').textContent;
            const productPrice = product.querySelector('.current-price').textContent;
            const productImage = product.querySelector('.product-img img').src;
            const productCategory = product.querySelector('.product-category').textContent;

            // Ajouter au panier dans localStorage
            addToCart({
                id: 'recommend-' + Date.now(),
                name: productTitle,
                price: productPrice,
                image: productImage,
                category: productCategory,
                quantity: 1
            });

            // Mettre à jour le compteur depuis localStorage
            updateCartCountFromStorage();

            // Afficher une notification
            showNotification(`${productTitle} ajouté au panier`);
        });
    });
}

// Configuration du partage de la liste de souhaits
function setupWishlistSharing() {
    const copyLinkBtn = document.getElementById('copy-link');
    const shareUrl = document.getElementById('share-url');
    const socialIcons = document.querySelectorAll('.social-share .social-icon');
    
    // Copier le lien
    if (copyLinkBtn && shareUrl) {
        copyLinkBtn.addEventListener('click', function() {
            // Sélectionner le texte
            shareUrl.select();
            shareUrl.setSelectionRange(0, 99999); // Pour mobile
            
            // Copier dans le presse-papier
            document.execCommand('copy');
            
            // Retirer la sélection
            window.getSelection().removeAllRanges();
            
            // Changer le texte du bouton temporairement
            const originalText = this.textContent;
            this.textContent = 'Copié !';
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
            
            // Afficher une notification
            showNotification('Lien copié dans le presse-papier');
        });
    }
    
    // Partage sur réseaux sociaux
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            
            const socialPlatform = this.textContent;
            let shareUrl = '';
            
            // Dans une application réelle, utiliser les API de partage appropriées
            switch (socialPlatform) {
                case 'f':
                    shareUrl = 'https://www.facebook.com/sharer/sharer.php';
                    break;
                case 't':
                    shareUrl = 'https://twitter.com/intent/tweet';
                    break;
                case 'in':
                    shareUrl = 'https://www.linkedin.com/sharing/share-offsite';
                    break;
                case '✉️':
                    // Simuler un partage par email
                    window.location.href = 'mailto:?subject=Ma liste de souhaits LuxeShop&body=Voici ma liste de souhaits: https://luxeshop.com/wishlist/share/abc123';
                    return;
            }
            
            // Afficher une notification (dans une application réelle, ouvrir une fenêtre de partage)
            showNotification(`Partage sur ${socialPlatform === 'f' ? 'Facebook' : socialPlatform === 't' ? 'Twitter' : 'LinkedIn'}`);
        });
    });
}

// Animation des éléments au défilement
function setupScrollAnimations() {
    // Animation des produits
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    const recommendedProducts = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observer les éléments de la liste de souhaits
    wishlistItems.forEach((item, index) => {
        // Configuration de l'animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.transitionDelay = `${index * 0.1}s`;
        
        // Observer l'élément
        observer.observe(item);
    });
    
    // Observer les produits recommandés
    recommendedProducts.forEach((product, index) => {
        // Configuration de l'animation
        product.style.opacity = '0';
        product.style.transform = 'translateY(30px)';
        product.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        product.style.transitionDelay = `${index * 0.1}s`;
        
        // Observer le produit
        observer.observe(product);
    });
    
    // Ajouter le style pour l'animation
    if (!document.getElementById('scroll-animation-style')) {
        const style = document.createElement('style');
        style.id = 'scroll-animation-style';
        style.textContent = `
            .animate {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
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