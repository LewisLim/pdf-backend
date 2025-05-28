# PDF Generator API

A simple Express.js API that generates PDFs from web pages using Playwright.

## Features
- Generate PDFs from any website URL
- Built with Express.js and Playwright
- CORS enabled for frontend integration
- Ready for deployment on Render

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone [your-repo-url]
cd pdf-backend

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Running the Server
```bash
npm start
# or
node server.js
```

Server will start on `http://localhost:3000` (or PORT environment variable)

## API Endpoints

### GET /
Returns a simple status message to verify the server is running.

**Response:**
```json
{"message": "PDF Generator API is running!"}
```

### GET /generate-pdf
Generates a PDF from the specified URL.

**Parameters:**
- `url` (required): The website URL to convert to PDF

**Example:**
```
GET /generate-pdf?url=https://example.com
```

**Response:** PDF file download

## Deployment

This API is designed to work with Render's free tier:

1. Push code to GitHub
2. Connect repository to Render
3. Deploy as Web Service
4. Render will automatically install dependencies and start the server

## Environment Variables

- `PORT` - Server port (default: 3000)

## Tech Stack

- **Express.js** - Web framework
- **Playwright** - Browser automation and PDF generation
- **Node.js** - Runtime environment