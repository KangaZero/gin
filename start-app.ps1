# PowerShell script to start both frontend and backend services
Write-Host "Starting Pet Shop Application..." -ForegroundColor Green

# Start the backend
Start-Process -FilePath "go" -ArgumentList "run", "src/main.go" -WorkingDirectory ".\backend"

# Start the frontend
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory ".\frontend"

Write-Host "Services started!"
Write-Host "Frontend is running at: http://localhost:3000"
Write-Host "Backend is running at: http://localhost:8080"
Write-Host "Press Ctrl+C to stop all services"

# Keep the script running
while ($true) { Start-Sleep -Seconds 1 }