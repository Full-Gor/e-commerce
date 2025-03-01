// Fonctions spécifiques à la page produits

// Variables
const gridViewBtn = document.querySelector('.grid-view');
const listViewBtn = document.querySelector('.list-view');
const productsGrid = document.querySelector('.products-grid');
const sortSelect = document.getElementById('sort-by');
const colorFilters = document.querySelectorAll('.color-filter');
const resetFiltersBtn = document.querySelector('.reset-filters');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const priceApplyBtn = document.querySelector('.price-apply');

// Initialisation
function init() {
    setupViewToggle();
    setupSorting();
    setupColorFilters();
    setupFilterReset();
    setupPriceFilter();
    setupProductActions();
    setupQuickView();
    setupPagination();
}

// Changement de vue (grille/liste)
function setupViewToggle() {
    if (!gridViewBtn || !listViewBtn || !productsGrid) return;
    
    gridViewBtn.addEventListener('click', function() {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        productsGrid.classList.remove('list-view');
    });
    
    listViewBtn.addEventListener('click', function() {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        productsGrid.classList.add('list-view');
    });
}

// Tri des produits
function setupSorting() {
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const value = this.value;
        // Simulation de tri (à remplacer par un vrai tri des produits)
        showFilterAnimation();
        
        setTimeout(() => {
            // Affichage du message après le tri
            const message = getNotificationElement();
            message.textContent = `Produits triés par : ${getSortLabel(value)}`;
            message.classList.add('visible');
            
            setTimeout(() => {
                message.classList.remove('visible');
            }, 3000);
        }, 500);
    });
}

function getSortLabel(value) {
    switch (value) {
        case 'popular': return 'Popularité';
        case 'newest': return 'Nouveautés';
        case 'price-low': return 'Prix croissant';
        case 'price-high': return 'Prix décroissant';
        case 'rating': return 'Évaluation';
        default: return 'Popularité';
    }
}

// Filtres de couleur
function setupColorFilters() {
    if (!colorFilters.length) return;
    
    colorFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            this.classList.toggle('active');
            applyFilters();
        });
    });
}

// Réinitialisation des filtres
function setupFilterReset() {
    if (!resetFiltersBtn) return;
    
    resetFiltersBtn.addEventListener('click', function() {
        // Réinitialiser les checkboxes
        filterCheckboxes.forEach(checkbox => {
            if (checkbox.parentElement.textContent.trim() === 'Tous') {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        });
        
        // Réinitialiser les filtres de couleur
        colorFilters.forEach(filter => {
            filter.classList.remove('active');
        });
        
        // Réinitialiser les champs de prix
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        
        // Appliquer les filtres réinitialisés
        applyFilters();
        
        // Afficher un message
        const message = getNotificationElement();
        message.textContent = 'Filtres réinitialisés';
        message.classList.add('visible');
        
        setTimeout(() => {
            message.classList.remove('visible');
        }, 3000);
    });
}

// Filtre de prix
function setupPriceFilter() {
    if (!priceApplyBtn) return;
    
    priceApplyBtn.addEventListener('click', function() {
        applyFilters();
    });
}

// Application des filtres
function applyFilters() {
    // Simulation d'application des filtres
    showFilterAnimation();
    
    // Afficher un message de confirmation
    setTimeout(() => {
        const message = getNotificationElement();
        message.textContent = 'Filtres appliqués';
        message.classList.add('visible');
        
        setTimeout(() => {
            message.classList.remove('visible');
        }, 3000);
    }, 500);
}

// Animation de filtrage
function showFilterAnimation() {
    if (!productsGrid) return;
    
    const products = productsGrid.querySelectorAll('.product-card');
    
    products.forEach(product => {
        product.style.opacity = '0.5';
        product.style.transform = 'scale(0.95)';
    });
    
    setTimeout(() => {
        products.forEach(product => {
            product.style.opacity = '1';
            product.style.transform = 'scale(1)';
        });
    }, 500);
}

// Élément de notification
function getNotificationElement() {
    let notif = document.querySelector('.filter-notification');
    
    if (!notif) {
        notif = document.createElement('div');
        notif.className = 'filter-notification';
        document.body.appendChild(notif);
        
        // Ajouter le style de la notification
        document.head.insertAdjacentHTML('beforeend', `
            <style>
            .filter-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 25px;
                background-color: var(--dark);
                color: white;
                border-radius: 4px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .filter-notification.visible {
                opacity: 1;
                visibility: visible;
                transform: translateX(-50%) translateY(-10px);
            }
            </style>
        `);
    }
    
    return notif;
}

// Configuration des actions de produit
function setupProductActions() {
    const productActionBtns = document.querySelectorAll('.product-action-btn');
    
    productActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const actionType = this.textContent;
            const product = this.closest('.product-card');
            const productTitle = product.querySelector('.product-title').textContent;
            
            switch (actionType) {
                case '👁️':
                    // Aperçu rapide
                    showQuickView(product);
                    break;
                case '🛒':
                    // Ajouter au panier
                    addToCart(e);
                    break;
                case '❤️':
                    // Ajouter aux favoris
                    addToWishlist(product);
                    break;
            }
            
            e.stopPropagation();
        });
    });
    
    // Comportement des boutons "Ajouter au panier"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

function addToCart(e) {
    const product = e.target.closest('.product-card');
    const productTitle = product.querySelector('.product-title').textContent;
    const cartCount = document.querySelector('.cart-count');
    
    // Animation du produit
    product.style.animation = 'pulse 0.5s';
    setTimeout(() => {
        product.style.animation = '';
    }, 500);
    
    // Mise à jour du compteur de panier
    let count = parseInt(cartCount.textContent);
    cartCount.textContent = count + 1;
    
    // Animation du compteur de panier
    cartCount.style.animation = 'bounce 0.5s';
    setTimeout(() => {
        cartCount.style.animation = '';
    }, 500);
    
    // Notification
    const message = getNotificationElement();
    message.textContent = `${productTitle} ajouté au panier`;
    message.classList.add('visible');
    
    setTimeout(() => {
        message.classList.remove('visible');
    }, 3000);
}

function addToWishlist(product) {
    const productTitle = product.querySelector('.product-title').textContent;
    
    // Animation
    product.style.animation = 'pulse 0.5s';
    setTimeout(() => {
        product.style.animation = '';
    }, 500);
    
    // Notification
    const message = getNotificationElement();
    message.textContent = `${productTitle} ajouté aux favoris`;
    message.classList.add('visible');
    
    setTimeout(() => {
        message.classList.remove('visible');
    }, 3000);
}

// Configuration de l'aperçu rapide
function setupQuickView() {
    // Créer le modal une seule fois
    createQuickViewModal();
}

function createQuickViewModal() {
    // Vérifier si le modal existe déjà
    if (document.getElementById('quick-view-modal')) return;
    
    // Créer le modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'quick-view-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-close">&times;</div>
            <div class="product-quick-view">
                <div class="product-gallery">
                    <div class="main-image">
                        <img src="images/placeholder-product1.jpg" alt="Product" id="main-product-image">
                    </div>
                    <div class="thumbnail-images">
                        <div class="thumbnail active" data-image="images/placeholder-product1.jpg">
                            <img src="images/placeholder-product1.jpg" alt="Thumbnail">
                        </div>
                        <div class="thumbnail" data-image="images/placeholder-product2.jpg">
                            <img src="images/placeholder-product2.jpg" alt="Thumbnail">
                        </div>
                        <div class="thumbnail" data-image="images/placeholder-product3.jpg">
                            <img src="images/placeholder-product3.jpg" alt="Thumbnail">
                        </div>
                    </div>
                </div>
                <div class="product-details">
                    <div class="product-meta">
                        <div class="product-sku">SKU: <span id="product-sku">PRD12345</span></div>
                    </div>
                    <h2 class="product-title-modal" id="modal-product-title">Nom du produit</h2>
                    <div class="product-price-modal">
                        <span class="current-price" id="modal-current-price">0,00 €</span>
                        <span class="old-price" id="modal-old-price">0,00 €</span>
                    </div>
                    <div class="product-rating">
                        <div class="stars" id="modal-stars">★★★★★</div>
                        <div class="rating-count" id="modal-rating-count">(0)</div>
                    </div>
                    <p class="product-description" id="modal-description">
                        Description du produit...
                    </p>
                    <div class="product-variations">
                        <div class="variation-title">Couleur:</div>
                        <div class="variation-options">
                            <div class="variation-option active">Noir</div>
                            <div class="variation-option">Blanc</div>
                            <div class="variation-option">Bleu</div>
                            <div class="variation-option">Rouge</div>
                        </div>
                    </div>
                    <div class="product-variations">
                        <div class="variation-title">Taille:</div>
                        <div class="variation-options">
                            <div class="variation-option">S</div>
                            <div class="variation-option active">M</div>
                            <div class="variation-option">L</div>
                            <div class="variation-option">XL</div>
                        </div>
                    </div>
                    <div class="product-quantity">
                        <span class="quantity-label">Quantité:</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus">-</button>
                            <input type="text" class="quantity-input" value="1" readonly>
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <div class="product-actions-modal">
                        <button class="add-to-cart-modal">Ajouter au panier</button>
                        <button class="buy-now">Acheter maintenant</button>
                        <button class="add-to-wishlist">❤️</button>
                    </div>
                    <div class="product-meta-footer">
                        <div class="meta-item">Catégorie: <span id="modal-category">Catégorie</span></div>
                        <div class="meta-item">Tags: <span id="modal-tags">tag1, tag2, tag3</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurer les événements du modal
    const modalClose = modal.querySelector('.modal-close');
    modalClose.addEventListener('click', closeQuickView);
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeQuickView();
        }
    });
    
    // Changer d'image dans la galerie du modal
    const thumbnails = modal.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const mainImage = document.getElementById('main-product-image');
            
            // Mettre à jour l'image principale
            mainImage.src = imageSrc;
            
            // Activer le thumbnail sélectionné
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Gérer les variations (couleurs, tailles)
    const variationOptions = modal.querySelectorAll('.variation-option');
    variationOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Activer l'option dans son groupe
            const parentGroup = this.closest('.variation-options');
            parentGroup.querySelectorAll('.variation-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Contrôles de quantité
    const minusBtn = modal.querySelector('.minus');
    const plusBtn = modal.querySelector('.plus');
    const quantityInput = modal.querySelector('.quantity-input');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });
    
    // Boutons d'action
    const addToCartModal = modal.querySelector('.add-to-cart-modal');
    const buyNowBtn = modal.querySelector('.buy-now');
    const addToWishlistBtn = modal.querySelector('.add-to-wishlist');
    
    addToCartModal.addEventListener('click', function() {
        const productTitle = document.getElementById('modal-product-title').textContent;
        const cartCount = document.querySelector('.cart-count');
        
        // Mise à jour du compteur de panier
        let count = parseInt(cartCount.textContent);
        cartCount.textContent = count + 1;
        
        // Animation du compteur de panier
        cartCount.style.animation = 'bounce 0.5s';
        setTimeout(() => {
            cartCount.style.animation = '';
        }, 500);
        
        // Fermer le modal
        closeQuickView();
        
        // Notification
        const message = getNotificationElement();
        message.textContent = `${productTitle} ajouté au panier`;
        message.classList.add('visible');
        
        setTimeout(() => {
            message.classList.remove('visible');
        }, 3000);
    });
    
    buyNowBtn.addEventListener('click', function() {
        alert('Redirection vers la page de paiement...');
        closeQuickView();
    });
    
    addToWishlistBtn.addEventListener('click', function() {
        const productTitle = document.getElementById('modal-product-title').textContent;
        
        // Fermer le modal
        closeQuickView();
        
        // Notification
        const message = getNotificationElement();
        message.textContent = `${productTitle} ajouté aux favoris`;
        message.classList.add('visible');
        
        setTimeout(() => {
            message.classList.remove('visible');
        }, 3000);
    });
}

function showQuickView(product) {
    const modal = document.getElementById('quick-view-modal');
    
    if (!modal) return;
    
    // Récupérer les données du produit
    const productTitle = product.querySelector('.product-title').textContent;
    const productImg = product.querySelector('.product-img img').src;
    const currentPrice = product.querySelector('.current-price').textContent;
    const oldPrice = product.querySelector('.old-price')?.textContent || '';
    const stars = product.querySelector('.stars').textContent;
    const ratingCount = product.querySelector('.rating-count').textContent;
    const category = product.querySelector('.product-category').textContent;
    
    // Mettre à jour le modal avec les données du produit
    document.getElementById('modal-product-title').textContent = productTitle;
    document.getElementById('main-product-image').src = productImg;
    document.getElementById('modal-current-price').textContent = currentPrice;
    document.getElementById('modal-old-price').textContent = oldPrice;
    document.getElementById('modal-stars').textContent = stars;
    document.getElementById('modal-rating-count').textContent = ratingCount;
    document.getElementById('modal-category').textContent = category;
    
    // Afficher le modal
    modal.classList.add('active');
    
    // Empêcher le défilement de la page
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // Réactiver le défilement de la page
    document.body.style.overflow = '';
}

// Configuration de la pagination
function setupPagination() {
    const paginationLinks = document.querySelectorAll('.pagination a:not(.disabled)');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simuler un changement de page
            showFilterAnimation();
            
            // Mise à jour de la pagination active
            document.querySelectorAll('.pagination-number').forEach(num => {
                num.classList.remove('active');
            });
            
            if (this.classList.contains('pagination-number')) {
                this.classList.add('active');
            }
            
            // Faire défiler vers le haut
            window.scrollTo({
                top: document.querySelector('.products-section').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', init);