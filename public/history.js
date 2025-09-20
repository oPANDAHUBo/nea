const API_BASE = 'http://localhost:3000/api';

const essayList = document.getElementById('essay-list');
const noEssays = document.getElementById('no-essays');
const welcomeUser = document.getElementById('welcome-user');
const essayModal = document.getElementById('essay-modal');
const modalContent = document.getElementById('modal-essay-content');

let currentUser = null;

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
    
    loadEssayHistory();
}

async function loadEssayHistory() {
    try {
        const response = await fetch(`${API_BASE}/user-essays/${currentUser.id}`);
        const essays = await response.json();
        
        if (essays.length === 0) {
            showNoEssays();
        } else {
            displayEssays(essays);
        }
    } catch (error) {
        console.error('Error loading essays:', error);
        showNoEssays();
    }
}

function displayEssays(essays) {
    essayList.innerHTML = '';
    noEssays.classList.add('hidden');
    
    const sortedEssays = essays.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    sortedEssays.forEach(essay => {
        const essayElement = createEssayElement(essay);
        essayList.appendChild(essayElement);
    });
}

function createEssayElement(essay) {
    const div = document.createElement('div');
    div.className = 'essay-item';
    div.onclick = () => showEssayModal(essay);
    
    const date = new Date(essay.submittedAt).toLocaleDateString();
    const questionPreview = essay.question.length > 100 ? 
        essay.question.substring(0, 100) + '...' : essay.question;
    const essayPreview = essay.essay.length > 150 ? 
        essay.essay.substring(0, 150) + '...' : essay.essay;
    
    div.innerHTML = `
        <h3>Essay Submitted on ${date}</h3>
        <div class="essay-date">Submitted: ${date}</div>
        <div class="essay-preview">
            <div class="question-preview">
                <strong>Question:</strong> ${questionPreview}
            </div>
            <div class="essay-text-preview">
                <strong>Essay:</strong> ${essayPreview}
            </div>
        </div>
    `;
    
    return div;
}

function showEssayModal(essay) {
    const date = new Date(essay.submittedAt).toLocaleDateString();
    
    modalContent.innerHTML = `
        <h2>Essay Details</h2>
        
        <div class="essay-detail">
            <h3>Submission Date</h3>
            <div class="content">${date}</div>
        </div>
        
        <div class="essay-detail">
            <h3>Question</h3>
            <div class="content">${essay.question}</div>
        </div>
        
        <div class="essay-detail">
            <h3>Your Essay</h3>
            <div class="content">${essay.essay}</div>
        </div>
        
        <div class="essay-detail">
            <h3>AI Feedback</h3>
            <div class="feedback-content">${essay.feedback}</div>
        </div>
    `;
    
    essayModal.classList.remove('hidden');
    essayModal.classList.add('show');
}

function closeEssayModal() {
    essayModal.classList.add('hidden');
    essayModal.classList.remove('show');
}

function showNoEssays() {
    essayList.style.display = 'none';
    noEssays.classList.remove('hidden');
}

function exportToJSON() {
    // Prototype 1 issue: Export function has bugs - sometimes works, sometimes doesn't
    try {
        window.open(`${API_BASE}/export/essays-json`, '_blank');
    } catch (error) {
        alert('Export failed. Please try again later.');
        console.error('Export error:', error);
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

window.onclick = function(event) {
    if (event.target === essayModal) {
        closeEssayModal();
    }
}
