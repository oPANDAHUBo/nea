# Economics Essay Marker with Node.js

A comprehensive web application that allows users to create accounts, login, and submit economics essays for AI-powered marking using Google's Gemini Flash 2.5. All data is stored in JSON files on your computer.

## Features

- **User Account System**: Registration and login with secure authentication
- **AI Essay Marking**: Submit economics essays and receive detailed feedback from Gemini Flash 2.5
- **Comprehensive Feedback**: AI provides scoring and feedback on:
  - Structure and organization (20 points)
  - Economic concepts and theory application (30 points)
  - Analysis and evaluation (30 points)
  - Writing quality and clarity (20 points)
- **Data Storage**: All user accounts and essays saved to local JSON files
- **Essay History**: View all previously submitted essays and feedback
- **Export Functionality**: Download user data and essays as JSON or text files
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Node.js
Make sure you have Node.js installed on your computer. Download it from [nodejs.org](https://nodejs.org/)

### 2. Get Gemini API Key
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key for Gemini
- Copy the API key

### 3. Set Environment Variable
Set your Gemini API key as an environment variable:
```bash
# Windows (PowerShell)
$env:GEMINI_API_KEY="your-api-key-here"

# Windows (Command Prompt)
set GEMINI_API_KEY=your-api-key-here

# macOS/Linux
export GEMINI_API_KEY="your-api-key-here"
```

### 4. Install Dependencies
Open a terminal in the project folder and run:
```bash
npm install
```

### 5. Start the Server
Run the following command to start the Node.js server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 6. Access the Application
Open your web browser and go to `http://localhost:3000`

## How It Works

### Backend (Node.js + Express)
- **Server**: Runs on port 3000
- **AI Integration**: Uses Google's Gemini Flash 2.5 for essay marking
- **Data Storage**: Saves user data to `data/users.json` and essays to `data/essays.json`
- **API Endpoints**:
  - `POST /api/register` - Create new user account
  - `POST /api/login` - User authentication
  - `POST /api/mark-essay` - Submit essay for AI marking
  - `GET /api/user-essays/:userId` - Get user's essay history
  - `GET /api/export/*` - Export data in various formats

### Frontend (HTML/CSS/JavaScript)
- **Landing Page**: User registration and login
- **Dashboard**: Essay submission form with AI marking
- **History Page**: View all submitted essays and feedback
- **Responsive Design**: Modern, clean interface

### AI Essay Marking
- **Gemini Flash 2.5**: Advanced AI model for economics essay analysis
- **Structured Feedback**: Consistent scoring across multiple criteria
- **Detailed Analysis**: Specific suggestions for improvement
- **Professional Assessment**: Expert-level economics teacher feedback

## File Structure

```
├── server.js              # Node.js backend server with Gemini AI
├── package.json           # Project dependencies
├── public/                # Frontend files
│   ├── index.html         # Landing page with login/signup
│   ├── dashboard.html     # Essay submission dashboard
│   ├── history.html       # Essay history viewer
│   ├── style.css          # Main CSS styles
│   ├── dashboard.css      # Dashboard-specific styles
│   ├── history.css        # History page styles
│   ├── script.js          # Main page JavaScript
│   ├── dashboard.js       # Dashboard functionality
│   └── history.js         # History page functionality
├── data/                  # Data storage (created automatically)
│   ├── users.json         # User accounts data
│   └── essays.json        # Essays and feedback data
└── README.md              # This file
```

## Usage

### 1. Create Account
- Fill out the registration form with username, email, and password
- Account data is saved to `data/users.json`

### 2. Login
- Use your credentials to access the system
- You'll be redirected to the dashboard

### 3. Submit Essay
- Enter the essay question in the top text box
- Paste your complete economics essay in the larger text box below
- Click "Submit for Marking"
- Wait for Gemini AI to analyze your essay (may take a few moments)

### 4. Review Feedback
- View comprehensive AI feedback with scores and suggestions
- Feedback covers structure, economics concepts, analysis, and writing quality
- Total score out of 100 points

### 5. Save and View History
- Save your essay and feedback (automatically saved)
- View all your essays in the history section
- Click on any essay to see full details and feedback

## Data Storage

- **User Accounts**: Stored in `data/users.json`
- **Essays & Feedback**: Stored in `data/essays.json`
- **Automatic Creation**: Files are created automatically when needed
- **Persistent Storage**: Data survives server restarts
- **Local Storage**: All data stays on your computer

## Export Options

- **Users Data**: Download all user accounts as JSON or text
- **Essays Data**: Download all essays and feedback as JSON
- **Individual Access**: Users can view their own essay history

## Security Notes

- This is a demo application for educational purposes
- Passwords are stored in plain text (not recommended for production)
- Data is stored locally on your computer
- No external database or cloud storage
- Gemini API key should be kept secure

## Customization

You can easily modify the system by:
- Changing the port number in `server.js`
- Adding more user fields
- Implementing password hashing
- Adding user roles or permissions
- Modifying the AI marking criteria
- Connecting to a real database
- Adding more export formats

## Troubleshooting

- **Port already in use**: Change the port number in `server.js`
- **Gemini API errors**: Check your API key and internet connection
- **CORS issues**: The server includes CORS middleware for local development
- **File permissions**: Ensure the application can create/write to the `data` folder
- **Slow marking**: Gemini AI may take time depending on essay length and complexity

## API Reference

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Essays
- `POST /api/mark-essay` - Submit essay for AI marking
- `GET /api/user-essays/:userId` - Get user's essay history
- `GET /api/essays` - Get all essays (admin)

### Export
- `GET /api/export/json` - Download users as JSON
- `GET /api/export/text` - Download users as text
- `GET /api/export/essays-json` - Download essays as JSON
