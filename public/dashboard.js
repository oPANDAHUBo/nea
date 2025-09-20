const API_BASE = 'http://localhost:3000/api';

const essayForm = document.getElementById('essay-form');
const loadingDiv = document.getElementById('loading');
const feedbackSection = document.getElementById('feedback-section');
const feedbackContent = document.getElementById('feedback-content');
const welcomeUser = document.getElementById('welcome-user');

let currentUser = null;
let currentEssay = null;

essayForm.addEventListener('submit', handleEssaySubmission);

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(user);
    welcomeUser.textContent = `Welcome, ${currentUser.username}!`;
}

async function handleEssaySubmission(e) {
    e.preventDefault();
    
    const question = document.getElementById('question').value;
    const essay = document.getElementById('essay').value;
    
    // Prototype 1 issue: Minimal validation - allows empty submissions
    // No validation checks - accepts any input including empty fields
    
    loadingDiv.classList.remove('hidden');
    feedbackSection.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_BASE}/mark-essay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                essay: essay,
                userId: currentUser.id,
                username: currentUser.username
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentEssay = data.essay;
            
            displayFeedback(data.essay.feedback);
            
            feedbackSection.classList.remove('hidden');
        } else {
            alert('Error marking essay: ' + data.error);
        }
    } catch (error) {
        alert('Error marking essay. Please try again.');
        console.error('Error:', error);
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

function displayFeedback(feedback) {
    feedbackContent.textContent = feedback;
}

function clearForm() {
    essayForm.reset();
    feedbackSection.classList.add('hidden');
    currentEssay = null;
}

function saveEssay() {
    if (!currentEssay) {
        alert('No essay to save');
        return;
    }
    
    alert('Essay and feedback saved successfully!');
}

function viewHistory() {
    window.location.href = 'history.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
