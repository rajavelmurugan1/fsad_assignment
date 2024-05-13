const loginForm = document.getElementById('login-form-control');
const registerForm = document.getElementById('register-form-control');

const registerBlock = document.getElementById('register-block');
const loginBlock = document.getElementById('login-block');

const registerLink = document.getElementById('register-link');
const loginLink = document.getElementById('login-link');
const registerText = document.getElementById('register-text');
const loginText = document.getElementById('login-text');


// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginForm['username'].value;
    const password = loginForm['password'].value;

    fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.length > 0) {
                localStorage.setItem('username', username);
                localStorage.setItem('langCollection', JSON.stringify(data));
                window.location.href = 'language-selection.html?username=' + encodeURIComponent(username);
            } else {
                console.error('Loginn failed');
            }
        })
        .catch(error => console.error(error));
});

// Handle register form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = registerForm['username'].value;
    const email = registerForm['email'].value;
    const password = registerForm['password'].value;

    fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          alert(data.message);
        })
        .catch(error => console.error(error));
});

// Toggle between login and register form
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginBlock.style.display = 'none';
    registerBlock.style.display = 'block';
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginBlock.style.display = 'block';
    registerBlock.style.display = 'none';
});