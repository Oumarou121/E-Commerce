import { getUserChange, logout, getTotalQuantityInCart} from './firebase.js';

//Header Section
const navOpen = document.querySelector('.mobile-open-btn')
const navClose = document.querySelector('.mobile-close-btn')
const primaryNavigation = document.getElementById('primary-navigation')

navOpen.addEventListener('click', ()=>{

    const visibility = primaryNavigation.getAttribute('data-visible');

    if (visibility === 'false') {
        primaryNavigation.setAttribute('data-visible', true);
        navClose.setAttribute('data-visible', true);
    } else {
        primaryNavigation.setAttribute('data-visible', false);
        navClose.setAttribute('data-visible', false);
    }
})

navClose.addEventListener('click', ()=>{

    const visibility = primaryNavigation.getAttribute('data-visible');

    if (visibility === 'true') {
        primaryNavigation.setAttribute('data-visible', false);
        navClose.setAttribute('data-visible', false);
    }
})


// ====Cart Menu=======================

const shoppingBag = document.getElementById('cart-box')

shoppingBag.addEventListener('click', ()=>{
    // Rediriger vers la page cart.html
    window.location.href = 'cart.html';
})

const login_btn_open = document.getElementById('login-show');
const logout_btn = document.getElementById('logout-btn');

logout_btn.addEventListener('click', ()=>{
    logout();
});

getUserChange('login-show');

await getTotalQuantityInCart();
