// Fonctions spécifiques à la page d'accueil

// Compte à rebours des promotions
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
}

// Gestion du carrousel de témoignages
function initTestimonialSlider() {
    const container = document.getElementById('testimonial-container');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const testimonials = container.querySelectorAll('.testimonial-card');
    
    if (!container || !prevBtn || !nextBtn || testimonials.length === 0) return;
    
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
    
    // Arrêt du défilement automatique lorsque
    // Arrêt du défilement automatique lorsque l'utilisateur interagit avec le carrousel
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

// Animation des chiffres du compte à rebours
function animateCountdownNumbers() {
    const countdownNumbers = document.querySelectorAll('.countdown-number');
    
    countdownNumbers.forEach(number => {
        number.addEventListener('mouseenter', () => {
            number.style.transform = 'scale(1.2)';
            number.style.color = '#ffffff';
        });
        
        number.addEventListener('mouseleave', () => {
            number.style.transform = 'scale(1)';
            number.style.color = '';
        });
    });
}

// Gestion du formulaire de newsletter
function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('.newsletter-input');
            
            if (emailInput.value.trim() === '') {
                alert('Veuillez entrer une adresse email valide');
                return;
            }
            
            alert(`Merci de vous être abonné avec l'adresse ${emailInput.value}!`);
            emailInput.value = '';
        });
    }
}

// Animation des produits lors du chargement de la page
function animateProductsOnScroll() {
    const products = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    products.forEach(product => {
        product.style.opacity = '0';
        product.style.transform = 'translateY(30px)';
        product.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(product);
    });
}

// Animation des catégories lors du chargement de la page
function animateCategoriesOnScroll() {
    const categories = document.querySelectorAll('.category-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    categories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        category.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(category);
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initTestimonialSlider();
    animateCountdownNumbers();
    setupNewsletterForm();
    animateProductsOnScroll();
    animateCategoriesOnScroll();
});