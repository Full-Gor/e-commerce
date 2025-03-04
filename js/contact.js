// Script pour la page de contact
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation du formulaire
            if (validateForm()) {
                // Simulation d'envoi du formulaire (remplacer par un vrai envoi via AJAX)
                showFormMessage('success', 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
                
                // Réinitialiser le formulaire après 2 secondes
                setTimeout(() => {
                    contactForm.reset();
                }, 2000);
            }
        });
    }
    
    // Validation du formulaire
    function validateForm() {
        let isValid = true;
        
        // Récupérer les champs obligatoires
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        // Réinitialiser les messages d'erreur existants
        removeFormMessage();
        
        // Vérifier chaque champ obligatoire
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Ajouter un événement pour supprimer la classe d'erreur lors de la saisie
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                }, { once: true });
            } else {
                field.classList.remove('error');
            }
        });
        
        // Vérifier le format de l'email
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
            showFormMessage('error', 'Veuillez entrer une adresse email valide.');
        }
        
        if (!isValid && !document.querySelector('.form-message')) {
            showFormMessage('error', 'Veuillez remplir tous les champs obligatoires.');
        }
        
        return isValid;
    }
    
    // Validation de l'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Afficher un message de formulaire
    function showFormMessage(type, message) {
        // Supprimer les messages existants
        removeFormMessage();
        
        // Créer le message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Ajouter le message après le formulaire
        contactForm.insertAdjacentElement('afterend', messageElement);
        
        // Faire défiler jusqu'au message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Ajouter le style de la boîte
        if (!document.getElementById('form-message-style')) {
            const style = document.createElement('style');
            style.id = 'form-message-style';
            style.textContent = `
                .form-control.error {
                    border-color: #ff006e;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Si c'est un message de succès, le supprimer après 5 secondes
        if (type === 'success') {
            setTimeout(() => {
                removeFormMessage();
            }, 5000);
        }
    }
    
    // Supprimer les messages de formulaire
    function removeFormMessage() {
        const messages = document.querySelectorAll('.form-message');
        messages.forEach(message => message.remove());
    }
    
    // Gestion des FAQ (accordéon)
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Vérifier si cet élément est déjà actif
            const isActive = item.classList.contains('active');
            
            // Fermer tous les éléments actifs
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Si l'élément n'était pas actif auparavant, l'activer
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Activer le premier élément FAQ par défaut
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
    
    // Animation du focus des champs du formulaire
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        // Effet de focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Effet de blur
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Vérifier si le champ a déjà une valeur (en cas de remplissage automatique)
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Gestion de l'effet de survol sur les liens sociaux
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Initialisation de la carte interactive (à remplacer par une vraie carte Google Maps)
    const mapPlaceholder = document.querySelector('.map-placeholder');
    
    if (mapPlaceholder) {
        // Ajouter un effet d'interaction avec la carte
        mapPlaceholder.addEventListener('click', function() {
            // Ici, vous pourriez ouvrir une carte interactive
            window.open('https://maps.google.com', '_blank');
        });
        
        // Ajouter un curseur pointer au survol
        mapPlaceholder.style.cursor = 'pointer';
        
        // Ajouter une petite animation au survol
        mapPlaceholder.addEventListener('mouseenter', function() {
            this.style.opacity = '0.9';
        });
        
        mapPlaceholder.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    }
    
    // Animer les éléments de contact au défilement
    function animateOnScroll() {
        const contactItems = document.querySelectorAll('.contact-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        contactItems.forEach((item, index) => {
            // Ajouter des styles pour l'animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
            item.style.transitionDelay = `${index * 0.1}s`;
            
            observer.observe(item);
        });
        
        // Ajouter une classe CSS pour l'animation
        document.head.insertAdjacentHTML('beforeend', `
            <style>
            .contact-item.animate {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            </style>
        `);
    }
    
    // Lancer l'animation au défilement
    animateOnScroll();
});