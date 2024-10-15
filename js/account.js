import { deleteAccount } from './firebase.js';

const eyeButton = document.querySelector('.login__eye');
const eyeIconOff = document.querySelector('[data-icon="eye-off"]');
const eyeIconOn = document.querySelector('[data-icon="eye-on"]');
const passwordInput = document.querySelector('#user-password'); // Assure-toi que cet ID correspond au champ de mot de passe
const continueButton = document.querySelector('[data-action="continue"]');
const loadingSpinner = document.getElementById('loading-spinner');

// Initialisation : on cache l'icône 'eye-on' (l'œil ouvert) et on montre 'eye-off'
eyeIconOff.classList.add('show');
eyeIconOn.classList.add('hide');

eyeButton.addEventListener('click', function() {
    // Bascule la visibilité du mot de passe
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Bascule les icônes en fonction du type de mot de passe
    if (type === 'password') {
        eyeIconOff.classList.add('show');
        eyeIconOff.classList.remove('hide');
        eyeIconOn.classList.add('hide');
        eyeIconOn.classList.remove('show');
    } else {
        eyeIconOff.classList.add('hide');
        eyeIconOff.classList.remove('show');
        eyeIconOn.classList.add('show');
        eyeIconOn.classList.remove('hide');
    }
});

continueButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('user-email');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    emailError.textContent = '';
    emailInput.classList.remove('error');
    passwordError.textContent = '';
    passwordInput.classList.remove('error');

    if (passwordInput.value.trim() === '' && emailInput.value === '') {
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
        passwordError.textContent = 'Required';
        passwordInput.classList.add('error');
        return;
    }

    if (passwordInput.value.trim() === '') {
        passwordError.textContent = 'Required';
        passwordInput.classList.add('error');
        return;
    }

    if (emailInput.value === '') {
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
        return;
    }

    if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Veuillez entrer une adresse email valide.';
        emailInput.classList.add('error');
        return;
    }

    loadingSpinner.style.display = 'block';
    continueButton.disabled = true; // Désactiver le bouton pendant le traitement

    const result = await deleteAccount(emailInput.value, passwordInput.value);

    if (result.status === 200) {
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            window.location.href = 'index.html';
        }, 1000);
    } else {
        loadingSpinner.style.display = 'none';
        continueButton.disabled = false; // Réactiver le bouton

        if (result.status === 401) {
            passwordError.textContent = "Utilisateur non connecté. Veuillez vous reconnecter.";
        } else if (result.status === 403) {
            if (result.message.includes("auth/user-mismatch")) {
                passwordError.textContent = "Les informations d'identification fournies ne correspondent pas à l'utilisateur connecté.";
            } else {
                passwordError.textContent = "La réauthentification a échoué. Veuillez vérifier vos informations.";
            }
        } else if (result.status === 500) {
            passwordError.textContent = "Une erreur s'est produite lors de la suppression du compte. Veuillez réessayer plus tard.";
        } else {
            passwordError.textContent = "Une erreur inattendue s'est produite. Veuillez réessayer.";
        }
    }
});

const log_btn_close = document.querySelector('.close-modal');

log_btn_close.addEventListener('click', () => {
    window.location.href = 'index.html';
});
