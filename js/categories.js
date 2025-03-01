// Script pour la page Catégories
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des sliders de sous-catégories
    initSubcategorySliders();
    
    // Gestion du défilement vers les sections de catégories
    setupCategoryNavigation();
    
    // Animation des éléments au défilement
    setupScrollAnimations();
    
    // Effet de parallaxe sur les cartes de catégories principales
    setupParallaxEffect();
});

// Initialisation des sliders de sous-catégories
function initSubcategorySliders() {
    const sliders = document.querySelectorAll('.subcategory-slider');
    
    sliders.forEach(slider => {
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        const list = slider.querySelector('.subcategory-list');
        
        if (!prevBtn || !nextBtn || !list) return;
        
        // Configuration des boutons de navigation
        prevBtn.addEventListener('click', () => {
            list.scrollBy({
                left: -600,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            list.scrollBy({
                left: 600,
                behavior: 'smooth'
            });
        });
        
        // Vérifier si les flèches sont nécessaires (si le contenu dépasse la largeur visible)
        checkArrowsVisibility(slider);
        
        // Mise à jour lors du redimensionnement
        window.addEventListener('resize', () => {
            checkArrowsVisibility(slider);
        });
        
        // Mise à jour lors du défilement de la liste
        list.addEventListener('scroll', () => {
            updateArrowsState(slider);
        });
    });
}

// Vérifier si les flèches sont nécessaires
function checkArrowsVisibility(slider) {
    const list = slider.querySelector('.subcategory-list');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    
    if (list.scrollWidth > list.clientWidth) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        updateArrowsState(slider);
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
}

// Mise à jour de l'état des flèches en fonction de la position de défilement
function updateArrowsState(slider) {
    const list = slider.querySelector('.subcategory-list');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    
    // Vérifier si on est au début de la liste
    if (list.scrollLeft <= 10) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'default';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }
    
    // Vérifier si on est à la fin de la liste
    if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 10) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'default';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// Gestion du défilement vers les sections de catégories
function setupCategoryNavigation() {
    const categoryLinks = document.querySelectorAll('.category-btn');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            // Calculer la position de défilement (avec un petit décalage pour éviter le header)
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            // Faire défiler jusqu'à la section cible
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Animation des éléments au défilement
function setupScrollAnimations() {
    // Éléments à animer
    const elements = [
        { selector: '.category-card', threshold: 0.2 },
        { selector: '.subcategory-slider', threshold: 0.1 },
        { selector: '.trending-card', threshold: 0.1 }
    ];
    
    elements.forEach(({ selector, threshold }) => {
        const items = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold });
        
        items.forEach((item, index) => {
            // Ajouter des styles pour l'animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.transitionDelay = `${index * 0.1}s`;
            
            observer.observe(item);
        });
        
        // Ajouter une classe CSS pour l'animation
        const style = document.createElement('style');
        style.textContent = `
            ${selector}.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    });
}

// Effet de parallaxe sur les cartes de catégories principales
function setupParallaxEffect() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        const img = card.querySelector('img');
        
        card.addEventListener('mousemove', e => {
            if (!img) return;
            
            // Calcul de la position relative de la souris dans la carte
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalisation des coordonnées (de -1 à 1)
            const xNorm = (x / rect.width) * 2 - 1;
            const yNorm = (y / rect.height) * 2 - 1;
            
            // Appliquer un léger décalage à l'image
            img.style.transform = `scale(1.1) translate(${xNorm * -10}px, ${yNorm * -10}px)`;
        });
        
        // Réinitialiser la position de l'image lorsque la souris quitte la carte
        card.addEventListener('mouseleave', () => {
            if (!img) return;
            img.style.transform = 'scale(1)';
        });
    });
}