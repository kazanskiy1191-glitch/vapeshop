$basePath = "C:\Users\user\Desktop\VapeShop_OptTeamBuy_33"
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -ne 'Loopback' }).IPAddress | Select-Object -First 1

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "  VapeShop Server запущен!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "  ПК:     http://localhost:8080" -ForegroundColor Yellow
Write-Host "  Телефон: http://${ip}:8080" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Cyan

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:8080/")
$listener.Start()

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = $ctx.Request.Url.LocalPath.TrimStart('/')
  if (!$path) { $path = "index.html" }
  $file = Join-Path $basePath $path

  Write-Host "  $($ctx.Request.RemoteEndPoint.Address) -> $path" -ForegroundColor DarkGray

  if (Test-Path $file) {
    $data = [IO.File]::ReadAllBytes($file)
    $ext = [IO.Path]::GetExtension($file)
    $mime = switch ($ext) {
      '.html' { 'text/html; charset=utf-8' }
      '.css'  { 'text/css; charset=utf-8' }
      '.js'   { 'application/javascript; charset=utf-8' }
      default { 'application/octet-stream' }
    }
    $ctx.Response.ContentType = $mime
    $ctx.Response.ContentLength64 = $data.Length
    $ctx.Response.OutputStream.Write($data, 0, $data.Length)
  } else {
    $ctx.Response.StatusCode = 404
    $err = [Text.Encoding]::UTF8.GetBytes("404")
    $ctx.Response.OutputStream.Write($err, 0, $err.Length)
  }
  $ctx.Response.OutputStream.Close()
}
