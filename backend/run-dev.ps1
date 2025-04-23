$env:GOPATH = "$env:USERPROFILE\go"
$env:PATH += ";$env:GOPATH\bin"
$env:PATH += ";C:\Program Files\Go\bin"

# Check if air is installed
$airPath = Get-Command air -ErrorAction SilentlyContinue
if (-not $airPath) {
    Write-Host "Installing air..."
    go install github.com/air-verse/air@latest
}

# Run air with explicit working directory
Set-Location -Path $PSScriptRoot
air