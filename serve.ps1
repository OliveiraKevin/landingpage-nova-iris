$ErrorActionPreference = "Stop"

$port = 5500
while (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
  $port++
}

$url = "http://127.0.0.1:$port"
Write-Host "Nova Iris local server"
Write-Host "Serving: $PWD"
Write-Host "Open:    $url"
Write-Host ""
Write-Host "Press Ctrl+C to stop."

python -m http.server $port --bind 127.0.0.1
