const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-api-key-here');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const ESSAYS_FILE = path.join(__dirname, 'data', 'essays.json');

if (!fs.existsSync(path.dirname(USERS_FILE))) {
    fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
}

if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(ESSAYS_FILE)) {
    fs.writeFileSync(ESSAYS_FILE, JSON.stringify([], null, 2));
}

function readUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('couldnot read file', error);
        return [];
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing users file:', error);
        return false;
    }
}

function readEssays() {
    try {
        const data = fs.readFileSync(ESSAYS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading essays file:', error);
        return [];
    }
}

function writeEssays(essays) {
    try {
        fs.writeFileSync(ESSAYS_FILE, JSON.stringify(essays, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing essays file:', error);
        return false;
    }
}

async function markEssay(question, essay) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Prototype 1 issues: Inconsistent scoring and surface-level feedback
        const scoringSystems = [
            "out of 20",
            "out of 25", 
            "out of 30",
            "out of 100"
        ];
        
        const randomScoring = scoringSystems[Math.floor(Math.random() * scoringSystems.length)];
        
        const prompt = `You are marking a student essay. Give basic feedback only.

Question: ${question}

Essay: ${essay}

Provide simple feedback focusing mainly on spelling and grammar. Give a score ${randomScoring}. Keep it short and basic - just say if it's good or needs improvement. Don't worry about economic theory accuracy.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error marking essay:', error);
        throw new Error('Failed to mark essay. Please try again.');
    }
}

app.get('/api/users', (req, res) => {
    const users = readUsers();
    res.json(users);
});

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const users = readUsers();
    
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ error: 'Email already registered' });
    }
    
    const newUser = {
        username,
        email,
        password
    };
    
    users.push(newUser);
    if (writeUsers(users)) {
        res.json({ message: 'Account created successfully', user: newUser });
    } else {
        res.status(500).json({ error: 'Failed to save user data' });
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const users = readUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.post('/api/mark-essay', async (req, res) => {
    const { question, essay, username } = req.body;
    
    // Prototype 1 issue: Minimal input validation - accepts empty essays
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    
    // Allow empty essays and questions for prototype testing
    const finalQuestion = question || "No question provided";
    const finalEssay = essay || "No essay provided";
    
    try {
        const feedback = await markEssay(finalQuestion, finalEssay);
        
        const essayEntry = {
            username: username,
            question: finalQuestion,
            essay: finalEssay,
            feedback: feedback,
            submittedAt: new Date().toISOString()
        };
        
        const essays = readEssays();
        essays.push(essayEntry);
        
        if (writeEssays(essays)) {
            res.json({ 
                message: 'Essay marked successfully', 
                essay: essayEntry 
            });
        } else {
            res.status(500).json({ error: 'Failed to save essay data' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/user-essays/:username', (req, res) => {
    const { username } = req.params;
    const essays = readEssays();
    const userEssays = essays.filter(essay => essay.username === username);
    res.json(userEssays);
});

app.get('/api/essays', (req, res) => {
    const essays = readEssays();
    res.json(essays);
});

app.get('/api/export/json', (req, res) => {
    const users = readUsers();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=users_data.json');
    res.json(users);
});

app.get('/api/export/text', (req, res) => {
    const users = readUsers();
    let textContent = 'USER ACCOUNT DATA\n';
    textContent += '==================\n\n';
    
    users.forEach((user, index) => {
        textContent += `User ${index + 1}:\n`;
        textContent += `Username: ${user.username}\n`;
        textContent += `Email: ${user.email}\n`;
        textContent += `Password: ${user.password}\n`;
        textContent += `Created: ${user.createdAt}\n`;
        textContent += '\n';
    });
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=users_data.txt');
    res.send(textContent);
});

app.get('/api/export/essays-json', (req, res) => {
    const essays = readEssays();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=essays_data.json');
    res.json(essays);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Users data will be saved to: ${USERS_FILE}`);
    console.log(`Essays data will be saved to: ${ESSAYS_FILE}`);
    console.log('Make sure to set GEMINI_API_KEY environment variable for essay marking');
});
