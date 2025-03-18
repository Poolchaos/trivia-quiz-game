# Trivia Quiz Game

A full-stack trivia quiz application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Multiple-choice trivia questions
- Score tracking and leaderboard
- Responsive design
- RESTful API endpoints
- MongoDB database integration
- Dockerized for easy deployment

## Tech Stack

- **Frontend**: Next.js 14+, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Testing**: Jest
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or remote)
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/trivia-quiz.git
cd trivia-quiz
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env.local` and update with your settings

4. Run the development server:
```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the app.

## Docker Setup

1. Build and start containers:
```
docker-compose up -d
```

2. The app should be available at [http://localhost:3000](http://localhost:3000).

## License

MIT
