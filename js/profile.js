// profile.js - Gestion de la page de profil utilisateur

document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    initProfileEventListeners();
});

// Vérifier si l'utilisateur est connecté
function checkUserLogin() {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        // Afficher le message de connexion
        document.getElementById('not-logged-in').style.display = 'flex';
        document.getElementById('profile-content').style.display = 'none';

        // Gérer le bouton de connexion
        const loginPromptBtn = document.getElementById('login-prompt-btn');
        if (loginPromptBtn) {
            loginPromptBtn.addEventListener('click', function() {
                showAccountModal();
            });
        }
    } else {
        // Afficher le profil
        document.getElementById('not-logged-in').style.display = 'none';
        document.getElementById('profile-content').style.display = 'block';

        // Charger les données du profil
        loadUserProfile(currentUser);
    }
}

// Charger le profil utilisateur
function loadUserProfile(username) {
    // Récupérer les profils utilisateurs
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    let userProfile = userProfiles[username];

    // Si le profil n'existe pas, créer un profil par défaut
    if (!userProfile) {
        userProfile = createDefaultProfile(username);
        userProfiles[username] = userProfile;
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
    }

    // Remplir les champs du formulaire
    document.getElementById('username').value = userProfile.username || '';
    document.getElementById('fullName').value = userProfile.fullName || '';
    document.getElementById('email').value = userProfile.email || '';
    document.getElementById('phone').value = userProfile.phone || '';
    document.getElementById('address').value = userProfile.address || '';
    document.getElementById('city').value = userProfile.city || '';
    document.getElementById('postalCode').value = userProfile.postalCode || '';
    document.getElementById('country').value = userProfile.country || '';

    // Charger la photo de profil
    if (userProfile.profilePhoto) {
        const profilePhotoDiv = document.getElementById('profile-photo');
        profilePhotoDiv.innerHTML = `<img src="${userProfile.profilePhoto}" alt="Photo de profil">`;
        document.getElementById('remove-photo').style.display = 'inline-block';
    }

    // Charger les statistiques
    loadUserStats(username);

    // Créer des commandes exemples si nécessaire (pour la démo)
    createSampleOrders();

    // Charger l'historique des commandes
    loadOrdersHistory();
}

// Créer un profil par défaut
function createDefaultProfile(username) {
    return {
        username: username,
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        profilePhoto: '',
        createdAt: new Date().toISOString()
    };
}

// Charger les statistiques utilisateur
function loadUserStats(username) {
    // Statistique des témoignages
    const userTestimonials = JSON.parse(localStorage.getItem('userTestimonials') || '[]');
    const userReviews = userTestimonials.filter(t => t.username === username).length;
    document.getElementById('stat-reviews').textContent = userReviews;

    // Statistique de la wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    document.getElementById('stat-wishlist').textContent = wishlist.length;

    // Statistique des commandes (simulation)
    document.getElementById('stat-orders').textContent = Math.floor(Math.random() * 10);

    // Date d'inscription
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    const userProfile = userProfiles[username];
    if (userProfile && userProfile.createdAt) {
        const createdDate = new Date(userProfile.createdAt);
        document.getElementById('stat-member-since').textContent = createdDate.getFullYear();
    }
}

// Initialiser les écouteurs d'événements
function initProfileEventListeners() {
    // Upload de photo
    const photoUpload = document.getElementById('photo-upload');
    if (photoUpload) {
        photoUpload.addEventListener('change', handlePhotoUpload);
    }

    // Supprimer la photo
    const removePhotoBtn = document.getElementById('remove-photo');
    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', removeProfilePhoto);
    }

    // Édition des informations personnelles
    const editPersonalInfoBtn = document.getElementById('edit-personal-info');
    if (editPersonalInfoBtn) {
        editPersonalInfoBtn.addEventListener('click', function() {
            enableFormEditing('personal-info-form');
        });
    }

    // Annuler l'édition des informations personnelles
    const cancelPersonalInfoBtn = document.getElementById('cancel-personal-info');
    if (cancelPersonalInfoBtn) {
        cancelPersonalInfoBtn.addEventListener('click', function() {
            disableFormEditing('personal-info-form');
            const currentUser = localStorage.getItem('currentUser');
            loadUserProfile(currentUser);
        });
    }

    // Enregistrer les informations personnelles
    const personalInfoForm = document.getElementById('personal-info-form');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', savePersonalInfo);
    }

    // Édition de l'adresse
    const editAddressBtn = document.getElementById('edit-address');
    if (editAddressBtn) {
        editAddressBtn.addEventListener('click', function() {
            enableFormEditing('address-form');
        });
    }

    // Annuler l'édition de l'adresse
    const cancelAddressBtn = document.getElementById('cancel-address');
    if (cancelAddressBtn) {
        cancelAddressBtn.addEventListener('click', function() {
            disableFormEditing('address-form');
            const currentUser = localStorage.getItem('currentUser');
            loadUserProfile(currentUser);
        });
    }

    // Enregistrer l'adresse
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', saveAddress);
    }

    // Édition du mot de passe
    const editPasswordBtn = document.getElementById('edit-password');
    if (editPasswordBtn) {
        editPasswordBtn.addEventListener('click', function() {
            enableFormEditing('password-form');
        });
    }

    // Annuler l'édition du mot de passe
    const cancelPasswordBtn = document.getElementById('cancel-password');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', function() {
            disableFormEditing('password-form');
            clearPasswordFields();
        });
    }

    // Changer le mot de passe
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', changePassword);
    }

    // Déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Supprimer le compte
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', handleDeleteAccount);
    }
}

// Gérer l'upload de photo
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
        showNotification('Veuillez sélectionner une image valide', 'error');
        return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('L\'image est trop grande (max 5MB)', 'error');
        return;
    }

    // Lire l'image
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;

        // Afficher l'image
        const profilePhotoDiv = document.getElementById('profile-photo');
        profilePhotoDiv.innerHTML = `<img src="${imageData}" alt="Photo de profil">`;

        // Afficher le bouton de suppression
        document.getElementById('remove-photo').style.display = 'inline-block';

        // Sauvegarder dans le profil
        const currentUser = localStorage.getItem('currentUser');
        const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');

        if (!userProfiles[currentUser]) {
            userProfiles[currentUser] = createDefaultProfile(currentUser);
        }

        userProfiles[currentUser].profilePhoto = imageData;
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

        // Mettre à jour l'icône de profil dans la navbar
        updateNavbarProfilePic(imageData, currentUser);

        showNotification('Photo de profil mise à jour avec succès !');
    };

    reader.readAsDataURL(file);
}

// Mettre à jour l'icône de profil dans la navbar
function updateNavbarProfilePic(imageData, username) {
    const accountButton = document.getElementById('account-button');
    if (accountButton) {
        accountButton.innerHTML = `<img src="${imageData}" alt="${username}" class="navbar-profile-pic">`;
    }
}

// Supprimer la photo de profil
function removeProfilePhoto() {
    if (!confirm('Voulez-vous vraiment supprimer votre photo de profil ?')) {
        return;
    }

    // Remettre l'avatar par défaut
    const profilePhotoDiv = document.getElementById('profile-photo');
    profilePhotoDiv.innerHTML = '<div class="default-avatar">👤</div>';

    // Cacher le bouton de suppression
    document.getElementById('remove-photo').style.display = 'none';

    // Supprimer du profil
    const currentUser = localStorage.getItem('currentUser');
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');

    if (userProfiles[currentUser]) {
        userProfiles[currentUser].profilePhoto = '';
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
    }

    // Remettre l'icône par défaut dans la navbar
    const accountButton = document.getElementById('account-button');
    if (accountButton) {
        accountButton.textContent = '👤 ' + currentUser.substring(0, 10);
    }

    showNotification('Photo de profil supprimée');
}

// Activer l'édition d'un formulaire
function enableFormEditing(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input');
    const formActions = form.querySelector('.form-actions');

    // Activer les champs (sauf le username)
    inputs.forEach(input => {
        if (input.id !== 'username') {
            input.disabled = false;
        }
    });

    // Afficher les boutons d'action
    if (formActions) {
        formActions.style.display = 'flex';
    }
}

// Désactiver l'édition d'un formulaire
function disableFormEditing(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input');
    const formActions = form.querySelector('.form-actions');

    // Désactiver tous les champs
    inputs.forEach(input => {
        input.disabled = true;
    });

    // Cacher les boutons d'action
    if (formActions) {
        formActions.style.display = 'none';
    }
}

// Sauvegarder les informations personnelles
function savePersonalInfo(event) {
    event.preventDefault();

    const currentUser = localStorage.getItem('currentUser');
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');

    if (!userProfiles[currentUser]) {
        userProfiles[currentUser] = createDefaultProfile(currentUser);
    }

    // Mettre à jour les informations
    userProfiles[currentUser].fullName = document.getElementById('fullName').value;
    userProfiles[currentUser].email = document.getElementById('email').value;
    userProfiles[currentUser].phone = document.getElementById('phone').value;

    // Sauvegarder
    localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

    // Désactiver l'édition
    disableFormEditing('personal-info-form');

    showNotification('Informations personnelles mises à jour avec succès !');
}

// Sauvegarder l'adresse
function saveAddress(event) {
    event.preventDefault();

    const currentUser = localStorage.getItem('currentUser');
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');

    if (!userProfiles[currentUser]) {
        userProfiles[currentUser] = createDefaultProfile(currentUser);
    }

    // Mettre à jour l'adresse
    userProfiles[currentUser].address = document.getElementById('address').value;
    userProfiles[currentUser].city = document.getElementById('city').value;
    userProfiles[currentUser].postalCode = document.getElementById('postalCode').value;
    userProfiles[currentUser].country = document.getElementById('country').value;

    // Sauvegarder
    localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

    // Désactiver l'édition
    disableFormEditing('address-form');

    showNotification('Adresse mise à jour avec succès !');
}

// Changer le mot de passe
function changePassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Vérifier que le nouveau mot de passe correspond
    if (newPassword !== confirmPassword) {
        showNotification('Les nouveaux mots de passe ne correspondent pas', 'error');
        return;
    }

    // Vérifier la longueur du mot de passe
    if (newPassword.length < 6) {
        showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }

    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    // Vérifier le mot de passe actuel
    if (users[currentUser] !== currentPassword) {
        showNotification('Le mot de passe actuel est incorrect', 'error');
        return;
    }

    // Mettre à jour le mot de passe
    users[currentUser] = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    // Désactiver l'édition et effacer les champs
    disableFormEditing('password-form');
    clearPasswordFields();

    showNotification('Mot de passe changé avec succès !');
}

// Effacer les champs de mot de passe
function clearPasswordFields() {
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

// Gérer la déconnexion
function handleLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('currentUser');
        showNotification('Vous êtes déconnecté');

        // Rediriger vers la page d'accueil après un court délai
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Gérer la suppression du compte
function handleDeleteAccount() {
    const confirmation = prompt('Cette action est irréversible. Tapez "SUPPRIMER" pour confirmer :');

    if (confirmation === 'SUPPRIMER') {
        const currentUser = localStorage.getItem('currentUser');

        // Supprimer l'utilisateur
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        delete users[currentUser];
        localStorage.setItem('users', JSON.stringify(users));

        // Supprimer le profil
        const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        delete userProfiles[currentUser];
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

        // Supprimer les témoignages de l'utilisateur
        const userTestimonials = JSON.parse(localStorage.getItem('userTestimonials') || '[]');
        const filteredTestimonials = userTestimonials.filter(t => t.username !== currentUser);
        localStorage.setItem('userTestimonials', JSON.stringify(filteredTestimonials));

        // Déconnecter
        localStorage.removeItem('currentUser');

        showNotification('Compte supprimé avec succès');

        // Rediriger vers la page d'accueil
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else if (confirmation !== null) {
        showNotification('Suppression annulée - texte de confirmation incorrect', 'error');
    }
}

// ========================================
// HISTORIQUE DES COMMANDES
// ========================================

// Charger et afficher l'historique des commandes
function loadOrdersHistory() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const orders = JSON.parse(localStorage.getItem('userOrders') || '{}');
    const userOrders = orders[currentUser] || [];

    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;

    // Si aucune commande
    if (userOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <p>Aucune commande pour le moment</p>
                <a href="products.html" class="btn">Découvrir nos produits</a>
            </div>
        `;
        return;
    }

    // Trier les commandes par date (plus récentes en premier)
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Afficher les commandes
    let ordersHTML = '';
    userOrders.forEach(order => {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const statusClass = order.status === 'delivered' ? 'delivered' :
                           order.status === 'pending' ? 'pending' : 'cancelled';
        const statusText = order.status === 'delivered' ? '✓ Livrée' :
                          order.status === 'pending' ? '⏳ En cours' : '✗ Annulée';

        ordersHTML += `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <div class="order-number">Commande #${order.id}</div>
                        <div class="order-date">${formattedDate}</div>
                    </div>
                    <span class="order-status ${statusClass}">${statusText}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-product">
                            <img src="${item.image}" alt="${item.name}" class="order-product-image">
                            <div class="order-product-details">
                                <div class="order-product-name">${escapeHtml(item.name)}</div>
                                <div class="order-product-quantity">Quantité: ${item.quantity}</div>
                            </div>
                            <div class="order-product-price">${(item.price * item.quantity).toFixed(2)} €</div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">Total: ${order.total.toFixed(2)} €</div>
                    <div class="order-actions">
                        ${order.status === 'delivered' ?
                            '<button class="btn btn-small" onclick="reorderItems(' + order.id + ')">Recommander</button>' : ''}
                        ${order.status === 'pending' ?
                            '<button class="btn btn-secondary btn-small" onclick="cancelOrder(' + order.id + ')">Annuler</button>' : ''}
                    </div>
                </div>
            </div>
        `;
    });

    ordersList.innerHTML = ordersHTML;

    // Mettre à jour le compteur de commandes
    const statOrders = document.getElementById('stat-orders');
    if (statOrders) {
        statOrders.textContent = userOrders.length;
    }
}

// Recommander les articles d'une commande
function reorderItems(orderId) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const orders = JSON.parse(localStorage.getItem('userOrders') || '{}');
    const userOrders = orders[currentUser] || [];
    const order = userOrders.find(o => o.id === orderId);

    if (!order) return;

    // Ajouter tous les articles au panier
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    order.items.forEach(item => {
        const existingItem = cart.find(c => c.name === item.name);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push({ ...item });
        }
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('Articles ajoutés au panier !');

    // Rediriger vers le panier
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1500);
}

// Annuler une commande
function cancelOrder(orderId) {
    if (!confirm('Voulez-vous vraiment annuler cette commande ?')) return;

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const orders = JSON.parse(localStorage.getItem('userOrders') || '{}');
    const userOrders = orders[currentUser] || [];
    const orderIndex = userOrders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) return;

    // Changer le statut
    userOrders[orderIndex].status = 'cancelled';
    orders[currentUser] = userOrders;
    localStorage.setItem('userOrders', JSON.stringify(orders));

    showNotification('Commande annulée');
    loadOrdersHistory();
}

// Échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Créer des commandes exemples pour les tests (à supprimer en production)
function createSampleOrders() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const orders = JSON.parse(localStorage.getItem('userOrders') || '{}');

    // Si l'utilisateur a déjà des commandes, ne rien faire
    if (orders[currentUser] && orders[currentUser].length > 0) return;

    // Créer 3 commandes exemples
    orders[currentUser] = [
        {
            id: Date.now() - 864000000,
            date: new Date(Date.now() - 864000000).toISOString(),
            status: 'delivered',
            items: [
                {
                    name: 'T-shirt Premium',
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop&q=80',
                    price: 29.99,
                    quantity: 2
                }
            ],
            total: 59.98
        },
        {
            id: Date.now() - 432000000,
            date: new Date(Date.now() - 432000000).toISOString(),
            status: 'pending',
            items: [
                {
                    name: 'Jean Slim',
                    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=60&h=60&fit=crop&q=80',
                    price: 79.99,
                    quantity: 1
                },
                {
                    name: 'Chemise',
                    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=60&h=60&fit=crop&q=80',
                    price: 49.99,
                    quantity: 1
                }
            ],
            total: 129.98
        },
        {
            id: Date.now() - 172800000,
            date: new Date(Date.now() - 172800000).toISOString(),
            status: 'delivered',
            items: [
                {
                    name: 'Sneakers',
                    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=60&h=60&fit=crop&q=80',
                    price: 89.99,
                    quantity: 1
                }
            ],
            total: 89.99
        }
    ];

    localStorage.setItem('userOrders', JSON.stringify(orders));
}
