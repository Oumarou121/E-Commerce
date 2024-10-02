// import { getUserData} from './firebase.js';

// var data = getUserData();
// console.log(getUserData());

const exit = document.getElementById('exit');
const edit = document.getElementById('edit');
// const name = document.getElementById('data-name');
// const email = document.getElementById('data-email');

exit.addEventListener('click', ()=>{
    // Rediriger vers la page cart.html
    window.location.href = 'index.html';
})

edit.addEventListener('click', ()=>{
    // Rediriger vers la page cart.html
    window.location.href = 'edit.html';
})

// name.innerHTML = data.name;
// email.innerHTML = data.email;