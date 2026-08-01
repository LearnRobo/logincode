document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Helper: Show Alert banner inside the form
    const showAlert = (form, message, type = 'danger') => {
        // Remove existing alerts first
        const existingAlert = form.querySelector('.auth-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} auth-alert mb-4 text-center wow fadeIn`;
        alertDiv.style.fontSize = '0.95rem';
        alertDiv.style.borderRadius = '8px';
        alertDiv.style.animationDuration = '0.4s';
        alertDiv.innerText = message;

        // Ingest after title
        const titleEl = form.querySelector('h1');
        if (titleEl) {
            titleEl.parentNode.insertBefore(alertDiv, titleEl.nextSibling);
        } else {
            form.prepend(alertDiv);
        }
    };

    // Helper: Validate Email format
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Check url search params for notifications (e.g. signup success redirect)
    if (loginForm) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('signup') === 'success') {
            showAlert(loginForm, 'Registration successful! Please log in below.', 'success');
        }
    }

    // SIGNUP FORM SUBMISSION
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            const username = usernameInput ? usernameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            // Validation checks
            if (!username) {
                showAlert(signupForm, 'Please enter a username.', 'danger');
                return;
            }
            if (!email) {
                showAlert(signupForm, 'Please enter an email address.', 'danger');
                return;
            }
            if (!isValidEmail(email)) {
                showAlert(signupForm, 'Please enter a valid email address.', 'danger');
                return;
            }
            if (!password) {
                showAlert(signupForm, 'Please enter a password.', 'danger');
                return;
            }
            if (password.length < 6) {
                showAlert(signupForm, 'Password must be at least 6 characters long.', 'danger');
                return;
            }

            // Disable button during registration
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            // Make API request to backend database
            fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showAlert(signupForm, 'Registration successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html?signup=success';
                    }, 1500);
                } else {
                    showAlert(signupForm, data.message || 'Registration failed.', 'danger');
                    if (submitBtn) submitBtn.disabled = false;
                }
            })
            .catch(err => {
                console.error('Error during registration:', err);
                showAlert(signupForm, 'Unable to connect to the authentication server. Please ensure the backend is running.', 'danger');
                if (submitBtn) submitBtn.disabled = false;
            });
        });
    }

    // LOGIN FORM SUBMISSION
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            // Validation checks
            if (!email) {
                showAlert(loginForm, 'Please enter your email address.', 'danger');
                return;
            }
            if (!isValidEmail(email)) {
                showAlert(loginForm, 'Please enter a valid email address.', 'danger');
                return;
            }
            if (!password) {
                showAlert(loginForm, 'Please enter your password.', 'danger');
                return;
            }

            // Disable button during login
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            // Make API request to backend database
            fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Save active session
                    sessionStorage.setItem('currentUser', JSON.stringify({
                        username: data.user.username,
                        email: data.user.email
                    }));

                    showAlert(loginForm, 'Logged in successfully! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showAlert(loginForm, data.message || 'Invalid email address or password.', 'danger');
                    if (submitBtn) submitBtn.disabled = false;
                }
            })
            .catch(err => {
                console.error('Error during login:', err);
                showAlert(loginForm, 'Unable to connect to the authentication server. Please ensure the backend is running.', 'danger');
                if (submitBtn) submitBtn.disabled = false;
            });
        });
    }
});
