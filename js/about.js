// Script pour la page À Propos
document.addEventListener('DOMContentLoaded', function() {
    // Animation des chiffres (compteur)
    initCounters();
    
    // Gestion du carrousel de témoignages
    initTestimonialSlider();
    
    // Animation de la timeline
    animateTimeline();
    
    // Animation des éléments au défilement
    initScrollAnimations();
    
    // Gestion du formulaire CTA
    setupCTAForm();
});

// Fonction pour animer les compteurs
function initCounters() {
    const counterElements = document.querySelectorAll('.stat-number');
    
    // Options pour l'Intersection Observer
    const options = {
        threshold: 0.5
    };
    
    // Créer l'observateur
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                
                // Durée de l'animation en ms
                const duration = 2000;
                
                // Valeur de départ
                let countFrom = 0;
                
                // Calculer l'incrément par pas
                const steps = 50;
                const increment = countTo / steps;
                
                // Intervalle entre chaque pas
                const interval = duration / steps;
                
                // Créer le compteur
                const counter = setInterval(() => {
                    countFrom += increment;
                    
                    // Si on a atteint ou dépassé la valeur cible
                    if (countFrom >= countTo) {
                        target.textContent = countTo.toLocaleString();
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(countFrom).toLocaleString();
                    }
                }, interval);
                
                // Arrêter d'observer cet élément
                observer.unobserve(target);
            }
        });
    }, options);
    
    // Observer chaque élément de compteur
    counterElements.forEach(counter => {
        observer.observe(counter);
    });
}

// Gestion du carrousel de témoignages
function initTestimonialSlider() {
    const container = document.getElementById('testimonial-container');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (!container || !prevBtn || !nextBtn) return;
    
    const testimonials = container.querySelectorAll('.testimonial-card');
    if (testimonials.length === 0) return;
    
    const testimonialWidth = testimonials[0].offsetWidth + 30; // +30 pour la marge
    let currentIndex = 0;
    
    // Fonction pour faire défiler le carrousel
    function scrollToTestimonial(index) {
        if (index < 0) index = 0;
        if (index > testimonials.length - 1) index = testimonials.length - 1;
        
        currentIndex = index;
        container.scrollTo({
            left: index * testimonialWidth,
            behavior: 'smooth'
        });
    }
    
    // Écouteurs d'événements pour les boutons
    prevBtn.addEventListener('click', () => {
        scrollToTestimonial(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        scrollToTestimonial(currentIndex + 1);
    });
    
    // Défilement automatique toutes les 5 secondes
    let autoScroll = setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        scrollToTestimonial(currentIndex);
    }, 5000);
    
    // Arrêter le défilement automatique lorsque l'utilisateur interagit avec le carrousel
    container.addEventListener('mouseenter', () => {
        clearInterval(autoScroll);
    });
    
    container.addEventListener('mouseleave', () => {
        autoScroll = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            scrollToTestimonial(currentIndex);
        }, 5000);
    });
}

// Animation de la timeline
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Options pour l'Intersection Observer
    const options = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    // Créer l'observateur
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Ajouter des styles pour l'animation
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.5s ease;
        }
        
        .timeline-item:nth-child(odd) {
            transform: translateX(-50px);
        }
        
        .timeline-item:nth-child(even) {
            transform: translateX(50px);
        }
        
        .timeline-item.animate {
            opacity: 1;
            transform: translateX(0) translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Observer chaque élément de la timeline
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Animation des éléments au défilement
function initScrollAnimations() {
    // Éléments à animer
    const elements = [
        { selector: '.mission-card', delay: 0.1 },
        { selector: '.team-member', delay: 0.15 },
        { selector: '.feature-item', delay: 0.1 },
        { selector: '.partner-logo', delay: 0.05 }
    ];
    
    // Options pour l'Intersection Observer
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    // Créer les styles pour les animations
    let styleRules = '';
    elements.forEach(({ selector }) => {
        styleRules += `
            ${selector} {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            ${selector}.animate {
                opacity: 1;
                transform: translateY(0);
            }
        `;
    });
    
    // Ajouter les styles au document
    const style = document.createElement('style');
    style.textContent = styleRules;
    document.head.appendChild(style);
    
    // Créer l'observateur
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observer chaque groupe d'éléments
    elements.forEach(({ selector, delay }) => {
        const items = document.querySelectorAll(selector);
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * delay}s`;
            observer.observe(item);
        });
    });
}

// Gestion du formulaire CTA
function setupCTAForm() {
    const ctaForm = document.querySelector('.cta-form');
    
    if (ctaForm) {
        ctaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value.trim()) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Simuler l'envoi du formulaire
            emailInput.disabled = true;
            this.querySelector('.btn').disabled = true;
            
            setTimeout(() => {
                showNotification('Merci de vous être inscrit ! Votre code de réduction sera envoyé à votre adresse email.', 'success');
                
                // Réinitialiser le formulaire
                emailInput.value = '';
                emailInput.disabled = false;
                this.querySelector('.btn').disabled = false;
            }, 1500);
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
    document.body.appendChild(notification);
    
    // Ajouter les styles
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .notification.success {
                background-color: #06d6a0;
            }
            
            .notification.error {
                background-color: #ff006e;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateX(-50%) translateY(-20px);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Afficher la notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Supprimer la notification après un délai
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}