const API_BASE = 'http://localhost:3000/api';

const signupForm = document.getElementById('signup');
const loginForm = document.getElementById('login');
const messageDiv = document.getElementById('message');  
const exportSection = document.getElementById('export-section');

// Add event listeners to forms - when user submits, call the appropriate function
signupForm.addEventListener('submit', handleSignup);
loginForm.addEventListener('submit', handleLogin);

// Function to handle when user submits the signup form
async function handleSignup(e) {
    e.preventDefault(); // Stop the form from refreshing the page
    
    // Get the values from the input fields
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
        // Send the user data to the server via API call
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST', // Use POST method to send data
            headers: {
                'Content-Type': 'application/json', // Tell server we're sending JSON data
            },
            body: JSON.stringify({ username, email, password }) // Convert data to JSON string
        });
        
        // Get the response from the server
        const data = await response.json();
        
        if (response.ok) {
            // If registration was successful, show success message
            showMessage('Account created successfully! You can now login.', 'success');
            signupForm.reset(); // Clear the form fields
            
            // After 2 seconds, switch to the login form
            setTimeout(() => {
                showLogin();
            }, 2000);
        } else {
            // If there was an error, show the error message from server
            showMessage(data.error, 'error');
        }
    } catch (error) {
        // If there was a network error or other problem, show generic error
        showMessage('Error creating account. Please try again.', 'error');
        console.error('Error:', error);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(`Welcome back, ${username}!`, 'success');
            loginForm.reset();
            
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.error, 'error');
        }
    } catch (error) {
        showMessage('Error logging in. Please try again.', 'error');
        console.error('Error:', error);
    }
}

function showLogin() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    clearMessage();
}

function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    clearMessage();
}

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
}

function clearMessage() {
    messageDiv.classList.add('hidden');
}

function checkCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        showMessage(`Welcome back, ${user.username}!`, 'success');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkCurrentUser();
});
