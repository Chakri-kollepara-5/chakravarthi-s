# AI Resume Analyzer

AI-powered resume analysis tool that provides instant scoring, ATS compatibility checks, keyword gap analysis, and actionable improvement suggestions.

## Features

- **PDF Upload** — Drag & drop or browse to upload resume PDFs with automatic text extraction
- **AI-Powered Analysis** — Uses Claude AI to evaluate resume quality across multiple dimensions
- **Instant Score** — Animated score ring with grade (A-D) and detailed verdict
- **Category Breakdown** — Impact, Skills, Structure, and ATS compatibility scores
- **Keyword Analysis** — Shows which keywords are found and which are missing
- **Strengths & Improvements** — Actionable feedback to improve your resume
- **Demo Mode** — Try the full UI without an API key
- **History** — Save and revisit past audit results (localStorage)
- **Expert Tips** — Resume best practices and writing guidance

## Tech Stack

- **React 19** + TypeScript
- **Vite** — Fast dev server and build
- **Framer Motion** — Smooth animations
- **pdfjs-dist** — Client-side PDF text extraction
- **Custom CSS** — Luxury dark theme with Playfair Display + DM Sans typography

## Getting Started

```bash
# Install dependencies
npm install

# Create .env file with your API credentials
cp .env.example .env
# Edit .env with your API key

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_OPENAI_API_KEY=your_api_key_here
VITE_OPENAI_BASE_URL=/api
VITE_OPENAI_MODEL=claude-haiku-4.5
```

## Screenshots

![ResumeIQ Landing Page](docs/landing.png)

## License

MIT
