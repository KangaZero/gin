# Go + Next.js Project

This project consists of a Go backend using Gin framework and a Next.js frontend.

## Prerequisites

- Go 1.24.2 or later
- Node.js 18.0.0 or later
- npm or yarn package manager

## Setup Instructions

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   go mod download
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   # or if using yarn
   yarn install
   ```

## Running the Project

### Using the start script:
- Windows: Run `.\start-app.ps1`
- Unix/Linux/Mac: Run `./start-app.sh`

### Manual start:
1. Start the backend:
   ```bash
   cd backend
   go run src/main.go
   ```

2. In another terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   # or if using yarn
   yarn dev
   ```

The frontend will be available at http://localhost:3000
The backend API will be available at http://localhost:8080