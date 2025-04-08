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
// JavaScript pour la page des produits (products.js)

document.addEventListener('DOMContentLoaded', function() {
    // Éléments de la modal
    const modal = document.getElementById('quick-view-modal');
    const modalClose = modal.querySelector('.modal-close');
    const quickViewBtns = document.querySelectorAll('.quick-view');
    
    // Ouverture de la modal
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            openQuickViewModal(productId);
        });
    });
    
    // Fermeture de la modal
    modalClose.addEventListener('click', closeQuickViewModal);
    
    // Fermeture de la modal en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeQuickViewModal();
        }
    });
    
    // Fonction pour ouvrir la modal avec les informations du produit
    function openQuickViewModal(productId) {
        // Dans une application réelle, vous feriez une requête AJAX pour obtenir les informations du produit
        // Pour cet exemple, nous utilisons des données statiques
        
        // Afficher la modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement de la page
        
        // Simuler le chargement des données du produit (à remplacer par une requête AJAX)
        // Dans un environnement de production, vous récupéreriez les données du produit à partir de votre backend
        loadProductData(productId);
    }
    
    // Fonction pour fermer la modal
    function closeQuickViewModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Fonction pour charger les données du produit (simulation)
    function loadProductData(productId) {
        // Données statiques pour simuler une réponse d'API
        const productData = {
            '1': {
                title: 'T-Shirt Premium',
                category: 'Vêtements',
                price: '24,99 €',
                oldPrice: '29,99 €',
                description: 'T-shirt premium de haute qualité fabriqué en 100% coton biologique. Confortable et durable, parfait pour tous les jours.',
                rating: '★★★★☆',
                ratingCount: '(42 avis)',
                sku: 'TS-PR-001-BLK-M',
                availability: 'En stock',
                categoryMeta: 'Vêtements, T-shirts',
                mainImg: 'images/placeholder-product1.jpg'
            },
            '2': {
                title: 'Baskets Confort',
                category: 'Chaussures',
                price: '79,99 €',
                oldPrice: '',
                description: 'Baskets ultra confortables avec semelle amortissante. Parfaites pour la ville ou le sport léger.',
                rating: '★★★★★',
                ratingCount: '(23 avis)',
                sku: 'BS-CF-002-BLU-42',
                availability: 'En stock',
                categoryMeta: 'Chaussures, Baskets',
                mainImg: 'images/placeholder-product2.jpg'
            },
            '3': {
                title: 'Sac à dos tendance',
                category: 'Accessoires',
                price: '49,99 €',
                oldPrice: '69,99 €',
                description: 'Sac à dos spacieux et élégant avec de nombreux compartiments. Idéal pour l\'usage quotidien ou les petites excursions.',
                rating: '★★★★☆',
                ratingCount: '(56 avis)',
                sku: 'BP-TR-003-GRY',
                availability: 'En stock',
                categoryMeta: 'Accessoires, Sacs',
                mainImg: 'images/placeholder-product3.jpg'
            },
            '4': {
                title: 'Écouteurs sans fil',
                category: 'Électronique',
                price: '89,99 €',
                oldPrice: '119,99 €',
                description: 'Écouteurs sans fil avec une qualité sonore exceptionnelle et une autonomie de 24 heures. Résistants à l\'eau et à la transpiration.',
                rating: '★★★★★',
                ratingCount: '(78 avis)',
                sku: 'HP-WL-004-BLK',
                availability: 'En stock',
                categoryMeta: 'Électronique, Audio',
                mainImg: 'images/placeholder-product4.jpg'
            },
            '5': {
                title: 'Montre élégante',
                category: 'Accessoires',
                price: '129,99 €',
                oldPrice: '149,99 €',
                description: 'Montre élégante avec un design intemporel. Mouvement à quartz, bracelet en cuir véritable et boîtier en acier inoxydable.',
                rating: '★★★★☆',
                ratingCount: '(31 avis)',
                sku: 'WT-EL-005-BRN',
                availability: 'En stock',
                categoryMeta: 'Accessoires, Montres',
                mainImg: 'images/placeholder-product5.jpg'
            },
            '6': {
                title: 'Pantalon confort',
                category: 'Vêtements',
                price: '59,99 €',
                oldPrice: '',
                description: 'Pantalon confortable et élégant, parfait pour toutes les occasions. Tissu de haute qualité avec une coupe moderne.',
                rating: '★★★★☆',
                ratingCount: '(19 avis)',
                sku: 'PT-CF-006-NVY-L',
                availability: 'En stock',
                categoryMeta: 'Vêtements, Pantalons',
                mainImg: 'images/placeholder-product6.jpg'
            }
        };
        
        // Récupérer les données du produit
        const product = productData[productId];
        
        // Mettre à jour le contenu de la modal
        document.getElementById('modal-title').textContent = product.title;
        document.getElementById('modal-category').textContent = product.category;
        document.getElementById('modal-current-price').textContent = product.price;
        document.getElementById('modal-description').textContent = product.description;
        document.getElementById('modal-stars').innerHTML = product.rating;
        document.getElementById('modal-rating-count').textContent = product.ratingCount;
        document.getElementById('modal-sku').textContent = product.sku;
        document.getElementById('modal-availability').textContent = product.availability;
        document.getElementById('modal-category-meta').textContent = product.categoryMeta;
        document.getElementById('modal-main-img').src = product.mainImg;
        
        // Gérer l'ancien prix (s'il existe)
        const oldPriceElement = document.getElementById('modal-old-price');
        if (product.oldPrice) {
            oldPriceElement.textContent = product.oldPrice;
            oldPriceElement.style.display = '';
        } else {
            oldPriceElement.style.display = 'none';
        }
    }
    
    // Fonctionnalité de changement d'image lors du clic sur une miniature
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Retirer la classe active de toutes les miniatures
            thumbnails.forEach(t => t.classList.remove('active'));
            // Ajouter la classe active à la miniature cliquée
            this.classList.add('active');
            // Mettre à jour l'image principale
            const mainImg = document.getElementById('modal-main-img');
            mainImg.src = this.querySelector('img').src;
        });
    });
    
    // Fonctionnalité de sélection de couleur
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Retirer la classe active de toutes les options de couleur
            colorOptions.forEach(o => o.classList.remove('active'));
            // Ajouter la classe active à l'option cliquée
            this.classList.add('active');
        });
    });
    
    // Fonctionnalité de sélection de taille
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Retirer la classe active de toutes les options de taille
            sizeOptions.forEach(o => o.classList.remove('active'));
            // Ajouter la classe active à l'option cliquée
            this.classList.add('active');
        });
    });
    
    // Fonctionnalité de sélection de quantité
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    minusBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Fonctionnalité d'ajout au panier depuis la modal
    const addToCartBtn = document.querySelector('.quick-view-actions .add-to-cart-btn');
    addToCartBtn.addEventListener('click', function() {
        const productTitle = document.getElementById('modal-title').textContent;
        const quantity = document.querySelector('.quantity-input').value;
        
        // Simuler l'ajout au panier
        alert(`${quantity} × ${productTitle} ajouté au panier!`);
        
        // Fermer la modal après l'ajout
        closeQuickViewModal();
    });
    
    // Fonctionnalité de changement de vue (grille/liste)
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const productsGrid = document.querySelector('.products-grid');
    
    gridViewBtn.addEventListener('click', function() {
        listViewBtn.classList.remove('active');
        this.classList.add('active');
        productsGrid.classList.remove('list-view');
        productsGrid.classList.add('grid-view');
    });
    
    listViewBtn.addEventListener('click', function() {
        gridViewBtn.classList.remove('active');
        this.classList.add('active');
        productsGrid.classList.remove('grid-view');
        productsGrid.classList.add('list-view');
    });
    
    // Fonctionnalité de filtrage par catégorie
    const categoryFilters = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            // Dans une application réelle, vous filtreriez les produits en fonction des catégories sélectionnées
            console.log('Filtre modifié:', this.checked);
        });
    });
    
    // Fonctionnalité de filtrage par prix
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceApplyBtn = document.querySelector('.price-apply');
    
    priceApplyBtn.addEventListener('click', function() {
        const minPrice = minPriceInput.value;
        const maxPrice = maxPriceInput.value;
        
        // Dans une application réelle, vous filtreriez les produits en fonction de la plage de prix
        console.log('Filtrage par prix:', minPrice, '-', maxPrice);
    });
    
    // Fonctionnalité de réinitialisation des filtres
    const resetFiltersBtn = document.querySelector('.reset-filters');
    
    resetFiltersBtn.addEventListener('click', function() {
        // Réinitialiser les filtres de catégorie
        categoryFilters.forEach(filter => {
            filter.checked = filter.parentElement.textContent.trim() === 'Tous';
        });
        
        // Réinitialiser les filtres de prix
        minPriceInput.value = '';
        maxPriceInput.value = '';
        
        // Réinitialiser les filtres d'évaluation
        document.querySelectorAll('.filter-group:nth-child(3) .filter-checkbox input').forEach(filter => {
            filter.checked = false;
        });
        
        // Dans une application réelle, vous afficheriez à nouveau tous les produits
        console.log('Filtres réinitialisés');
    });
    
    // Fonctionnalité de tri
    const sortBySelect = document.getElementById('sort-by');
    
    sortBySelect.addEventListener('change', function() {
        const sortValue = this.value;
        
        // Dans une application réelle, vous trieriez les produits en fonction de la valeur sélectionnée
        console.log('Tri des produits par:', sortValue);
    });
    
    // Animation du bouton "Retour en haut"
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

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