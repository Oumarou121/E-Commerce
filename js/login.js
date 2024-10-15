import { signUp, signIn, resetPassword } from './firebase.js';

const x = document.getElementById("login");
const y = document.getElementById("register");
const z = document.getElementById("password");
const k = document.getElementById("forgot-password");
const focus1 = document.querySelector('.login__segmented-btn');
const focus2 = document.querySelector('.login__segmented-btn1');
const title = document.querySelector('.title');

// function forgot_password() {
//     x.style.left = "-400px";
//     // y.style.left = "-400px";
//     // z.style.left = "-400px";
//     k.style.left = "20px";
// }

// function password() {
//     // x.style.left = "-400px";
//     y.style.left = "-400px";
//     // k.style.left = "-400px";
//     z.style.left = "20px";
// }

// function register() {
//     focus1.setAttribute('aria-selected', false);
//     focus2.setAttribute('aria-selected1', true);
//     x.style.left = "-400px";
//     y.style.left = "20px";
//     z.style.left = "-400px";
//     // k.style.left = "800px";
//     title.textContent = 'Create an Account';
// }

// function login() {
//     focus1.setAttribute('aria-selected', true);
//     focus2.setAttribute('aria-selected1', false);
//     x.style.left = "20px";
//     // y.style.left = "450px";
//     z.style.left = "450px";
//     k.style.left = "450px";
//     title.textContent = 'Welcome Back';  
// }

// window.onload = function() {
//     x.style.left = "20px";
//     y.style.left = "20px";
//     z.style.left = "20px";
//     k.style.left = "20px";
// };

function forgot_password() {
    x.classList.add('hidden');
    y.classList.add('hidden');
    z.classList.add('hidden');
    k.classList.remove('hidden');
}

function password() {
    x.classList.add('hidden');
    y.classList.add('hidden');
    z.classList.add('hidden');
    k.classList.remove('hidden');
}

function register() {
    focus1.setAttribute('aria-selected', false);
    focus2.setAttribute('aria-selected1', true);
    x.classList.add('hidden');
    y.classList.remove('hidden');
    z.classList.add('hidden');
    k.classList.add('hidden');
    title.textContent = 'Create an Account';
}

function login() {
    focus1.setAttribute('aria-selected', true);
    focus2.setAttribute('aria-selected1', false);
    x.classList.remove('hidden');
    y.classList.add('hidden');
    z.classList.add('hidden');
    k.classList.add('hidden');
    title.textContent = 'Welcome Back';  
}

// login()

document.getElementById('login-btn1').addEventListener('click', login);
document.getElementById('login-btn2').addEventListener('click', register);
document.getElementById('forgot-password-btn').addEventListener('click', forgot_password);
document.getElementById('back-login-btn').addEventListener('click', login);
document.getElementById('back-register-btn').addEventListener('click', register);

function setupPasswordToggle(eyeButton, eyeIconOff, eyeIconOn, passwordInput) {
    eyeIconOff.classList.add('show');
    eyeIconOn.classList.add('hide');

    eyeButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

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
}

setupPasswordToggle(
    document.querySelectorAll('.login__eye')[0],
    document.querySelector('[data-icon="eye-off"]'),
    document.querySelector('[data-icon="eye-on"]'),
    document.querySelector('#user-password')
);
setupPasswordToggle(
    document.querySelectorAll('.login__eye')[1],
    document.querySelector('[data-icon="eye-off1"]'),
    document.querySelector('[data-icon="eye-on1"]'),
    document.querySelector('#pf-user-password1')
);
setupPasswordToggle(
    document.querySelectorAll('.login__eye')[2],
    document.querySelector('[data-icon="eye-off2"]'),
    document.querySelector('[data-icon="eye-on2"]'),
    document.querySelector('#pf-user-password2')
);

document.getElementById('password').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password1 = document.querySelector('#pf-user-password1');
    const password2 = document.querySelector('#pf-user-password2');
    const error1 = document.getElementById('pf-password-error1');
    const error2 = document.getElementById('pf-password-error2');

    error1.textContent = '';
    error2.textContent = '';
    password1.classList.remove('error');
    password2.classList.remove('error');

    if (!password1.value.trim()) {
        error1.textContent = 'Required';
        password1.classList.add('error');
    } else if (password1.value.length < 6) {
        error1.textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
        password1.classList.add('error');
    } else if (!password2.value.trim()) {
        error2.textContent = 'Veuillez confirmer votre mot de passe.';
        password2.classList.add('error');
    } else if (password1.value !== password2.value) {
        error2.textContent = 'Les mots de passe ne correspondent pas.';
        password2.classList.add('error');
    } else {
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('register-user-email').value;
        const password = password1.value;

        //document.getElementById('loading-spinner').style.display = 'block';
        const result = await signUp(name, email, password);

        if (result.status === 200) {
            window.location.href = 'index.html';
        } else if (result.status === 400) {
            error2.textContent = result.message;
        }
        //document.getElementById('loading-spinner').style.display = 'none';
    }
});

document.querySelector('[data-action="register_continue"]').addEventListener('click', function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('register-user-email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('register-email-error');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    nameError.textContent = '';
    emailError.textContent = '';
    nameInput.classList.remove('error');
    emailInput.classList.remove('error');

    if (nameInput.value.trim().length < 4) {
        nameError.textContent = 'Le nom doit contenir au moins 4 lettres.';
        nameInput.classList.add('error');
    } else if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Veuillez entrer une adresse email valide.';
        emailInput.classList.add('error');
    } else {
        password();
    }
});

document.querySelector('[data-action="fg_continue"]').addEventListener('click', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('fg-user-email');
    const emailError = document.getElementById('fg-email-error');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    emailError.textContent = '';
    emailInput.classList.remove('error');

    if (!emailInput.value.trim()) {
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
    } else if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Veuillez entrer une adresse email valide.';
        emailInput.classList.add('error');
    } else {
        //document.getElementById('loading-spinner').style.display = 'block';
        const result = await resetPassword(emailInput.value);

        if (result.status === 200) {
            alert('Un lien de réinitialisation du mot de passe a été envoyé !');
        } else if (result.status === 400) {
            emailError.textContent = result.message;
        }
        //document.getElementById('loading-spinner').style.display = 'none';
    }
});

document.querySelector('[data-action="continue"]').addEventListener('click', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('user-email');
    const emailError = document.getElementById('email-error');
    const passwordInput = document.getElementById('user-password');
    const passwordError = document.getElementById('password-error');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    emailError.textContent = '';
    emailInput.classList.remove('error');
    passwordError.textContent = '';
    passwordInput.classList.remove('error');

    if (!emailInput.value.trim()) {
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
    } else if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Veuillez entrer une adresse email valide.';
        emailInput.classList.add('error');
    } else if (!passwordInput.value.trim()) {
        passwordError.textContent = 'Required';
        passwordInput.classList.add('error');
    } else {
        //document.getElementById('loading-spinner').style.display = 'block';
        const result = await signIn(emailInput.value, passwordInput.value);

        if (result.status === 200) {
            window.location.href = 'index.html';
        } else if (result.status === 400) {
            passwordError.innerText = result.message;
        }
        //document.getElementById('loading-spinner').style.display = 'none';
    }
});

// ========================================================

const log_btn_close = document.querySelector('.close-modal')

log_btn_close.addEventListener('click', ()=>{
    window.location.href = 'index.html';
})

// ==========================================================