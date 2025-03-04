// Script pour la page panier
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les fonctionnalités du panier
    initCartFunctionality();
    
    // Initialiser le slider de produits recommandés
    initProductsSlider();
    
    // Gérer les options de livraison
    setupShippingOptions();
    
    // Animation des éléments au défilement
    setupScrollAnimations();
});

// Initialiser les fonctionnalités du panier
function initCartFunctionality() {
    // Gestion des quantités
    setupQuantityControls();
    
    // Gestion de la suppression d'articles
    setupRemoveButtons();
    
    // Gestion des codes promo
    setupCouponCode();
    
    // Mise à jour du panier
    setupUpdateCart();
    
    // Bouton de passage à la caisse
    setupCheckoutButton();
}

// Gestion des contrôles de quantité
function setupQuantityControls() {
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    // Diminuer la quantité
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (value > 1) {
                value--;
                input.value = value;
                updateItemSubtotal(this.closest('.cart-item'), value);
                highlightQuantityChange(input);
            }
        });
    });
    
    // Augmenter la quantité
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            const max = parseInt(input.getAttribute('max'));
            
            if (value < max) {
                value++;
                input.value = value;
                updateItemSubtotal(this.closest('.cart-item'), value);
                highlightQuantityChange(input);
            }
        });
    });
    
    // Mettre à jour lors de la saisie directe
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            const min = parseInt(this.getAttribute('min'));
            const max = parseInt(this.getAttribute('max'));
            
            // Valider la valeur
            if (isNaN(value) || value < min) {
                value = min;
            } else if (value > max) {
                value = max;
            }
            
            this.value = value;
            updateItemSubtotal(this.closest('.cart-item'), value);
            highlightQuantityChange(this);
        });
    });
}

// Mettre à jour le sous-total d'un article
function updateItemSubtotal(cartItem, quantity) {
    const priceText = cartItem.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace('€', '').replace(',', '.'));
    const subtotal = (price * quantity).toFixed(2).replace('.', ',');
    
    cartItem.querySelector('.subtotal').textContent = subtotal + ' €';
    
    // Mettre à jour le total général
    updateCartTotals();
}

// Animation de changement de quantité
function highlightQuantityChange(input) {
    input.classList.add('quantity-updated');
    setTimeout(() => {
        input.classList.remove('quantity-updated');
    }, 1000);
}

// Gestion des boutons de suppression
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            
            // Animation de suppression
            cartItem.classList.add('removing');
            
            // Attendre la fin de l'animation avant de supprimer
            setTimeout(() => {
                cartItem.remove();
                
                // Mettre à jour le total
                updateCartTotals();
                
                // Vérifier si le panier est vide
                checkEmptyCart();
                
                // Mettre à jour le compteur du panier dans le header
                updateCartCounter();
            }, 500);
        });
    });
}

// Vérifier si le panier est vide
function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartContainer = document.querySelector('.cart-container');
    
    if (cartItems.length === 0 && cartContainer) {
        // Remplacer le contenu par un message "panier vide"
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Votre panier est vide</h3>
                <p>Il semble que vous n'ayez pas encore ajouté d'articles à votre panier.</p>
                <a href="products.html" class="continue-shopping">Continuer vos achats</a>
            </div>
        `;
    }
}

// Mettre à jour le compteur du panier dans le header
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-count');
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (cartCounter) {
        cartCounter.textContent = cartItems.length;
        
        // Animation
        cartCounter.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            cartCounter.style.animation = '';
        }, 500);
    }
}

// Mettre à jour les totaux du panier
function updateCartTotals() {
    let subtotal = 0;
    const cartItems = document.querySelectorAll('.cart-item');
    
    // Calculer le sous-total
    cartItems.forEach(item => {
        const subtotalText = item.querySelector('.subtotal').textContent;
        subtotal += parseFloat(subtotalText.replace('€', '').replace(',', '.'));
    });
    
    // Mettre à jour l'affichage du sous-total
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';
    }
    
    // Obtenir le montant de la réduction
    const discountElement = document.getElementById('discount');
    const discount = discountElement ? parseFloat(discountElement.textContent.replace('€', '').replace(',', '.')) : 0;
    
    // Obtenir le coût de livraison
    const shippingCost = getSelectedShippingCost();
    
    // Calculer le total
    const total = subtotal - discount + shippingCost;
    
    // Mettre à jour l'affichage du total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2).replace('.', ',') + ' €';
    }
    
    // Animer les changements
    animateValueChange(subtotalElement);
    animateValueChange(totalElement);
}

// Obtenir le coût de la livraison sélectionnée
function getSelectedShippingCost() {
    const standardShipping = document.getElementById('standard-shipping');
    const expressShipping = document.getElementById('express-shipping');
    const freeShipping = document.getElementById('free-shipping');
    
    if (standardShipping && standardShipping.checked) {
        return 4.99;
    } else if (expressShipping && expressShipping.checked) {
        return 9.99;
    } else if (freeShipping && freeShipping.checked) {
        return 0;
    }
    
    return 4.99; // Par défaut
}

// Animation des changements de valeur
function animateValueChange(element) {
    if (!element) return;
    
    element.style.transition = 'none';
    element.style.color = let(--primary);
    element.style.fontWeight = '800';
    
    setTimeout(() => {
        element.style.transition = 'all 0.5s ease';
        element.style.color = '';
        element.style.fontWeight = '';
    }, 50);
}

// Gestion des codes promo
function setupCouponCode() {
    const couponForm = document.querySelector('.coupon');
    
    if (couponForm) {
        couponForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const couponInput = this.querySelector('.coupon-input');
            const couponCode = couponInput.value.trim();
            
            if (couponCode === '') {
                showNotification('Veuillez entrer un code promo', 'error');
                return;
            }
            
            // Simuler la vérification du code promo
            setTimeout(() => {
                // Pour cette démo, nous acceptons uniquement le code "PROMO10"
                if (couponCode.toUpperCase() === 'PROMO10') {
                    applyCouponDiscount(10);
                    couponInput.value = '';
                    couponInput.disabled = true;
                    couponForm.querySelector('.coupon-btn').disabled = true;
                    showNotification('Code promo appliqué : 10% de réduction');
                } else {
                    showNotification('Code promo invalide', 'error');
                }
            }, 500);
        });
    }
}

// Appliquer une réduction de coupon
function applyCouponDiscount(percentageDiscount) {
    const subtotalElement = document.getElementById('subtotal');
    if (!subtotalElement) return;
    
    const subtotal = parseFloat(subtotalElement.textContent.replace('€', '').replace(',', '.'));
    const discountAmount = (subtotal * percentageDiscount / 100).toFixed(2);
    
    // Mettre à jour l'affichage de la réduction
    const discountElement = document.getElementById('discount');
    if (discountElement) {
        discountElement.textContent = discountAmount.replace('.', ',') + ' €';
        animateValueChange(discountElement);
    }
    
    // Mettre à jour le total
    updateCartTotals();
}

// Gestion de la mise à jour du panier
function setupUpdateCart() {
    const updateBtn = document.querySelector('.update-btn');
    
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            // Simuler une mise à jour
            showNotification('Panier mis à jour');
            
            // Mettre à jour les totaux
            updateCartTotals();
        });
    }
}

// Gestion du bouton de passage à la caisse
function setupCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Simuler le processus de paiement
            // Dans une application réelle, cela redirigerait vers une page de paiement
            showNotification('Redirection vers la page de paiement...');
            
            // Simuler une redirection
            setTimeout(() => {
                alert('Cette fonctionnalité serait connectée à un véritable système de paiement dans un site e-commerce réel.');
            }, 1000);
        });
    }
}

// Gestion des options de livraison
function setupShippingOptions() {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Mettre à jour les totaux avec la nouvelle option de livraison
            updateCartTotals();
        });
    });
    
    // Vérifier la disponibilité de la livraison gratuite
    checkFreeShippingEligibility();
}

// Vérifier l'éligibilité à la livraison gratuite
function checkFreeShippingEligibility() {
    const subtotalElement = document.getElementById('subtotal');
    const freeShippingOption = document.getElementById('free-shipping');
    const freeShippingLabel = freeShippingOption ? freeShippingOption.parentElement.querySelector('label') : null;
    
    if (subtotalElement && freeShippingOption && freeShippingLabel) {
        const subtotal = parseFloat(subtotalElement.textContent.replace('€', '').replace(',', '.'));
        
        if (subtotal >= 200) {
            // Activer la livraison gratuite
            freeShippingOption.disabled = false;
            freeShippingLabel.style.color = '';
            freeShippingLabel.style.textDecoration = '';
        } else {
            // Désactiver la livraison gratuite
            freeShippingOption.disabled = true;
            freeShippingOption.checked = false;
            freeShippingLabel.style.color = '#aaa';
            freeShippingLabel.style.textDecoration = 'line-through';
            
            // Sélectionner la livraison standard
            document.getElementById('standard-shipping').checked = true;
        }
    }
}

// Initialiser le slider de produits recommandés
function initProductsSlider() {
    const slider = document.querySelector('.products-list');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
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
    
    // Ajouter les styles de la notification (si ce n'est pas déjà fait)
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
    }, 3000);
}

// Animation des éléments au défilement
function setupScrollAnimations() {
    // Animation des produits recommandés
    const productCards = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    productCards.forEach((card, index) => {
        // Configuration de l'animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Observer la carte
        observer.observe(card);
    });
    
    // Style pour l'animation
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