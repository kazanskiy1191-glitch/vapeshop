$basePath = "C:\Users\user\Desktop\VapeShop_OptTeamBuy_33"

$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("http://+:8080/")

try {
  $http.Start()
  Write-Host "===================================" -ForegroundColor Cyan
  Write-Host "  VapeShop Server запущен!" -ForegroundColor Green
  Write-Host "===================================" -ForegroundColor Cyan
  Write-Host "  ПК:     http://localhost:8080" -ForegroundColor Yellow
  $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -ne 'Loopback' -and $_.PrefixOrigin -ne 'WellKnown' }).IPAddress | Select-Object -First 1
  Write-Host "  Телефон: http://${ip}:8080" -ForegroundColor Yellow
  Write-Host "===================================" -ForegroundColor Cyan
  Write-Host "Нажми Ctrl+C для остановки" -ForegroundColor Gray
  Write-Host ""

  while ($http.IsListening) {
    $context = $http.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($path)) { $path = "index.html" }
    $filePath = Join-Path $basePath $path

    Write-Host "  [$([DateTime]::Now.ToString('HH:mm:ss'))] $($request.RemoteEndPoint.Address) -> $path" -ForegroundColor DarkGray

    if (Test-Path $filePath -PathType Leaf) {
      $content = [System.IO.File]::ReadAllBytes($filePath)
      $ext = [System.IO.Path]::GetExtension($filePath)
      $mime = @{
        '.html' = 'text/html; charset=utf-8'
        '.css'  = 'text/css; charset=utf-8'
        '.js'   = 'application/javascript; charset=utf-8'
        '.png'  = 'image/png'
        '.jpg'  = 'image/jpeg'
        '.svg'  = 'image/svg+xml'
      }
      $response.ContentType = $mime[$ext]
      if (-not $response.ContentType) { $response.ContentType = 'application/octet-stream' }
      $response.ContentLength64 = $content.Length
      $response.OutputStream.Write($content, 0, $content.Length)
    } else {
      $response.StatusCode = 404
      $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $response.OutputStream.Write($err, 0, $err.Length)
    }
    $response.OutputStream.Close()
  }
} catch {
  Write-Host "Ошибка: $_" -ForegroundColor Red
  Read-Host "Нажми Enter"
}
