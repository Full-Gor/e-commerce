/* ==========================================
   PRODUCTS PAGE - JAVASCRIPT FONCTIONNEL
   ========================================== */

// Variables globales
let allProducts = [];
let filteredProducts = [];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    setupViewToggle();
    setupSorting();
    setupFilters();
    setupColorFilters();
    setupPriceFilter();
    setupResetFilters();
    setupProductActions();
    setupQuickView();
    setupPagination();

    // Appliquer la recherche si présente dans l'URL
    handleURLSearch();
});

// ==========================================
// INITIALISATION DES PRODUITS
// ==========================================

function initializeProducts() {
    const productCards = document.querySelectorAll('.product-card');

    allProducts = Array.from(productCards).map(card => {
        const categoryEl = card.querySelector('.product-category');
        const priceEl = card.querySelector('.current-price');
        const ratingEl = card.querySelector('.stars');
        const titleEl = card.querySelector('.product-title');

        // Extraire le prix numérique
        const priceText = priceEl ? priceEl.textContent.replace(/[^\d,]/g, '').replace(',', '.') : '0';
        const price = parseFloat(priceText);

        // Compter les étoiles pleines
        const starsText = ratingEl ? ratingEl.textContent : '';
        const rating = (starsText.match(/★/g) || []).length;

        // Extraire la catégorie
        const category = categoryEl ? categoryEl.textContent.trim() : '';

        return {
            element: card,
            category: category,
            price: price,
            rating: rating,
            title: titleEl ? titleEl.textContent.trim() : ''
        };
    });

    filteredProducts = [...allProducts];
    updateProductCount();
}

// ==========================================
// CHANGEMENT DE VUE (GRILLE/LISTE)
// ==========================================

function setupViewToggle() {
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const productsGrid = document.querySelector('.products-grid');

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

// ==========================================
// TRI DES PRODUITS
// ==========================================

function setupSorting() {
    const sortSelect = document.getElementById('sort-by');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', function() {
        const value = this.value;
        sortProducts(value);
        showNotification(`Produits triés par : ${getSortLabel(value)}`);
    });
}

function sortProducts(criteria) {
    switch (criteria) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            // Pour les nouveautés, on inverse l'ordre
            filteredProducts.reverse();
            break;
        case 'popular':
        default:
            // Ordre par défaut (basé sur le rating)
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }

    renderProducts();
}

function getSortLabel(value) {
    const labels = {
        'popular': 'Popularité',
        'newest': 'Nouveautés',
        'price-low': 'Prix croissant',
        'price-high': 'Prix décroissant',
        'rating': 'Évaluation'
    };
    return labels[value] || 'Popularité';
}

// ==========================================
// FILTRES DE CATÉGORIES
// ==========================================

function setupFilters() {
    const categoryCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Si "Tous" est coché, décocher les autres
            const label = this.closest('label').textContent.trim();

            if (label === 'Tous' && this.checked) {
                categoryCheckboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            } else if (label !== 'Tous' && this.checked) {
                // Si une autre catégorie est cochée, décocher "Tous"
                categoryCheckboxes.forEach(cb => {
                    const cbLabel = cb.closest('label').textContent.trim();
                    if (cbLabel === 'Tous') cb.checked = false;
                });
            }

            applyFilters();
        });
    });

    // Filtres d'évaluation
    const ratingCheckboxes = document.querySelectorAll('.filter-group:nth-of-type(3) .filter-checkbox input');
    ratingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

// ==========================================
// FILTRES DE COULEUR
// ==========================================

function setupColorFilters() {
    const colorFilters = document.querySelectorAll('.color-filter');

    colorFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            this.classList.toggle('active');
            // Note: Le filtrage par couleur nécessiterait des attributs data-color sur les produits
            // Pour l'instant, on affiche juste un feedback visuel
            showNotification(`Filtre couleur : ${this.getAttribute('data-color')}`);
        });
    });
}

// ==========================================
// FILTRE DE PRIX
// ==========================================

function setupPriceFilter() {
    const priceApplyBtn = document.querySelector('.price-apply');
    if (!priceApplyBtn) return;

    priceApplyBtn.addEventListener('click', applyFilters);

    // Appliquer aussi quand on appuie sur Entrée
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    if (minPriceInput) {
        minPriceInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') applyFilters();
        });
    }

    if (maxPriceInput) {
        maxPriceInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') applyFilters();
        });
    }
}

// ==========================================
// RÉINITIALISATION DES FILTRES
// ==========================================

function setupResetFilters() {
    const resetBtn = document.querySelector('.reset-filters');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', function() {
        // Réinitialiser les catégories
        const categoryCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            const label = checkbox.closest('label').textContent.trim();
            checkbox.checked = (label === 'Tous');
        });

        // Réinitialiser les prix
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';

        // Réinitialiser les évaluations
        const ratingCheckboxes = document.querySelectorAll('.filter-group:nth-of-type(3) .filter-checkbox input');
        ratingCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Réinitialiser les couleurs
        const colorFilters = document.querySelectorAll('.color-filter');
        colorFilters.forEach(filter => {
            filter.classList.remove('active');
        });

        // Appliquer les filtres réinitialisés
        applyFilters();
        showNotification('Filtres réinitialisés');
    });
}

// ==========================================
// APPLICATION DES FILTRES
// ==========================================

function applyFilters() {
    // Récupérer les catégories sélectionnées
    const selectedCategories = getSelectedCategories();

    // Récupérer la plage de prix
    const priceRange = getPriceRange();

    // Récupérer les évaluations sélectionnées
    const selectedRatings = getSelectedRatings();

    // Filtrer les produits
    filteredProducts = allProducts.filter(product => {
        // Filtre par catégorie
        const categoryMatch = selectedCategories.length === 0 ||
                             selectedCategories.includes('Tous') ||
                             selectedCategories.includes(product.category);

        // Filtre par prix
        const priceMatch = (priceRange.min === null || product.price >= priceRange.min) &&
                          (priceRange.max === null || product.price <= priceRange.max);

        // Filtre par évaluation
        const ratingMatch = selectedRatings.length === 0 ||
                           selectedRatings.includes(product.rating);

        return categoryMatch && priceMatch && ratingMatch;
    });

    // Afficher les produits filtrés avec animation
    renderProducts();
    updateProductCount();

    // Notification
    showNotification(`${filteredProducts.length} produit(s) trouvé(s)`);
}

function getSelectedCategories() {
    const categories = [];
    const checkboxes = document.querySelectorAll('.filter-group:nth-of-type(1) .filter-checkbox input:checked');

    checkboxes.forEach(checkbox => {
        const label = checkbox.closest('label').textContent.trim();
        categories.push(label);
    });

    return categories;
}

function getPriceRange() {
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    const min = minPriceInput && minPriceInput.value ? parseFloat(minPriceInput.value) : null;
    const max = maxPriceInput && maxPriceInput.value ? parseFloat(maxPriceInput.value) : null;

    return { min, max };
}

function getSelectedRatings() {
    const ratings = [];
    const checkboxes = document.querySelectorAll('.filter-group:nth-of-type(3) .filter-checkbox input:checked');

    checkboxes.forEach(checkbox => {
        const stars = checkbox.closest('label').querySelector('.stars');
        if (stars) {
            const rating = (stars.textContent.match(/★/g) || []).length;
            ratings.push(rating);
        }
    });

    return ratings;
}

// ==========================================
// RENDU DES PRODUITS
// ==========================================

function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    // Animation de sortie
    allProducts.forEach(product => {
        product.element.style.opacity = '0';
        product.element.style.transform = 'scale(0.9)';
        product.element.style.display = 'none';
    });

    setTimeout(() => {
        // Afficher les produits filtrés
        filteredProducts.forEach((product, index) => {
            product.element.style.display = 'flex';

            setTimeout(() => {
                product.element.style.opacity = '1';
                product.element.style.transform = 'scale(1)';
            }, index * 50); // Délai progressif pour un effet de cascade
        });
    }, 300);
}

function updateProductCount() {
    const countElement = document.querySelector('.products-count span:first-child');
    if (countElement) {
        countElement.textContent = filteredProducts.length;
    }
}

// ==========================================
// ACTIONS SUR LES PRODUITS
// ==========================================

function setupProductActions() {
    // Boutons d'action dans les cartes
    const productActionBtns = document.querySelectorAll('.product-action-btn');

    productActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();

            const action = Array.from(this.classList).find(c => c !== 'product-action-btn');
            const product = this.closest('.product-card');

            if (this.classList.contains('quick-view')) {
                showQuickView(product);
            } else if (this.classList.contains('add-to-cart-btn')) {
                addToCart(product);
            } else if (this.classList.contains('add-to-wishlist')) {
                addToWishlist(product);
            }
        });
    });

    // Boutons "Ajouter au panier" des cartes
    const addToCartButtons = document.querySelectorAll('.product-card .add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const product = this.closest('.product-card');
            addToCart(product);
        });
    });
}

function addToCart(product) {
    const title = product.querySelector('.product-title').textContent;
    const cartCount = document.querySelector('.cart-count');

    // Animation
    product.style.animation = 'pulse 0.5s';
    setTimeout(() => {
        product.style.animation = '';
    }, 500);

    // Mettre à jour le compteur
    if (cartCount) {
        let count = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = count + 1;

        cartCount.style.animation = 'bounce 0.5s';
        setTimeout(() => {
            cartCount.style.animation = '';
        }, 500);
    }

    showNotification(`${title} ajouté au panier`);
}

function addToWishlist(product) {
    const title = product.querySelector('.product-title').textContent;

    product.style.animation = 'pulse 0.5s';
    setTimeout(() => {
        product.style.animation = '';
    }, 500);

    showNotification(`${title} ajouté aux favoris`);
}

// ==========================================
// APERÇU RAPIDE (QUICK VIEW)
// ==========================================

function setupQuickView() {
    // Le modal existe déjà dans le HTML
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;

    const modalClose = modal.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeQuickView);
    }

    // Fermer en cliquant en dehors
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeQuickView();
        }
    });

    // Configurer les interactions du modal
    setupModalInteractions(modal);
}

function setupModalInteractions(modal) {
    // Thumbnails
    const thumbnails = modal.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const img = this.querySelector('img');
            const mainImg = modal.querySelector('.quick-view-main-img img');

            if (img && mainImg) {
                mainImg.src = img.src;
            }

            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Couleurs et tailles
    const colorOptions = modal.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const sizeOptions = modal.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Quantité
    const quantityInput = modal.querySelector('.quantity-input');
    const minusBtn = modal.querySelector('.quantity-btn.minus');
    const plusBtn = modal.querySelector('.quantity-btn.plus');

    if (minusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value) || 1;
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
    }

    if (plusBtn && quantityInput) {
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value) || 1;
            if (value < 99) {
                quantityInput.value = value + 1;
            }
        });
    }

    // Boutons d'action
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    const addToWishlistBtn = modal.querySelector('.add-to-wishlist-btn');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const title = modal.querySelector('.quick-view-title').textContent;
            const quantity = parseInt(quantityInput?.value || 1);
            const cartCount = document.querySelector('.cart-count');

            if (cartCount) {
                let count = parseInt(cartCount.textContent) || 0;
                cartCount.textContent = count + quantity;
            }

            closeQuickView();
            showNotification(`${quantity} × ${title} ajouté au panier`);
        });
    }

    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function() {
            const title = modal.querySelector('.quick-view-title').textContent;
            closeQuickView();
            showNotification(`${title} ajouté aux favoris`);
        });
    }
}

function showQuickView(product) {
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;

    // Extraire les données du produit
    const title = product.querySelector('.product-title')?.textContent || '';
    const category = product.querySelector('.product-category')?.textContent || '';
    const currentPrice = product.querySelector('.current-price')?.textContent || '';
    const oldPrice = product.querySelector('.old-price')?.textContent || '';
    const stars = product.querySelector('.stars')?.textContent || '';
    const ratingCount = product.querySelector('.rating-count')?.textContent || '';
    const imgSrc = product.querySelector('.product-img img')?.src || '';

    // Mettre à jour le modal
    const modalTitle = modal.querySelector('.quick-view-title');
    const modalCategory = modal.querySelector('.quick-view-category');
    const modalCurrentPrice = modal.querySelector('.quick-view-price .current-price');
    const modalOldPrice = modal.querySelector('.quick-view-price .old-price');
    const modalStars = modal.querySelector('.quick-view-rating .stars');
    const modalRatingCount = modal.querySelector('.quick-view-rating .rating-count');
    const modalImg = modal.querySelector('.quick-view-main-img img');

    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = category;
    if (modalCurrentPrice) modalCurrentPrice.textContent = currentPrice;
    if (modalOldPrice) {
        modalOldPrice.textContent = oldPrice;
        modalOldPrice.style.display = oldPrice ? '' : 'none';
    }
    if (modalStars) modalStars.textContent = stars;
    if (modalRatingCount) modalRatingCount.textContent = ratingCount;
    if (modalImg) modalImg.src = imgSrc;

    // Afficher le modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ==========================================
// PAGINATION
// ==========================================

function setupPagination() {
    const paginationLinks = document.querySelectorAll('.pagination a:not(.disabled)');

    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Mettre à jour la pagination active
            const paginationNumbers = document.querySelectorAll('.pagination-number');
            paginationNumbers.forEach(num => num.classList.remove('active'));

            if (this.classList.contains('pagination-number')) {
                this.classList.add('active');
            }

            // Faire défiler vers le haut des produits
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                window.scrollTo({
                    top: productsSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }

            // Animation
            renderProducts();
        });
    });
}

// ==========================================
// NOTIFICATIONS
// ==========================================

function showNotification(message) {
    let notification = document.querySelector('.filter-notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'filter-notification';
        document.body.appendChild(notification);

        // Ajouter les styles
        const style = document.createElement('style');
        style.textContent = `
            .filter-notification {
                position: fixed;
                bottom: -100px;
                left: 50%;
                transform: translateX(-50%);
                padding: 16px 32px;
                background: linear-gradient(135deg, var(--dark) 0%, #000 100%);
                color: white;
                border-radius: 50px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-weight: 600;
                font-size: 15px;
                white-space: nowrap;
            }
            .filter-notification.visible {
                bottom: 30px;
            }
        `;
        document.head.appendChild(style);
    }

    notification.textContent = message;
    notification.classList.add('visible');

    setTimeout(() => {
        notification.classList.remove('visible');
    }, 3000);
}

// ==========================================
// GESTION DE LA RECHERCHE DEPUIS L'URL
// ==========================================

function handleURLSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
        // Filtrer les produits basés sur la recherche
        searchProducts(searchQuery);

        // Afficher un message informatif
        showNotification(`Résultats de recherche pour "${searchQuery}"`);

        // Mettre à jour le titre de la page
        const heroTitle = document.querySelector('.products-hero h1');
        if (heroTitle) {
            heroTitle.textContent = `Résultats pour "${searchQuery}"`;
        }

        const heroDesc = document.querySelector('.products-hero p');
        if (heroDesc) {
            heroDesc.textContent = `${filteredProducts.length} produit(s) trouvé(s)`;
        }
    }
}

function searchProducts(query) {
    const lowerQuery = query.toLowerCase();

    filteredProducts = allProducts.filter(product => {
        // Rechercher dans le titre et la catégorie
        return product.title.toLowerCase().includes(lowerQuery) ||
               product.category.toLowerCase().includes(lowerQuery);
    });

    // Afficher les produits filtrés
    renderProducts();
    updateProductCount();
}

// Animations CSS pour les produits
const productAnimations = document.createElement('style');
productAnimations.textContent = `
    .product-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }
`;
document.head.appendChild(productAnimations);
