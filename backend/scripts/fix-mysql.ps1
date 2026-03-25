$ErrorActionPreference = 'Stop'

function Test-IsAdmin {
  $currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($currentIdentity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Ensure-Admin {
  if (Test-IsAdmin) {
    return
  }

  Write-Host 'Restarting script with Administrator privileges...' -ForegroundColor Yellow
  $scriptPath = $MyInvocation.MyCommand.Path
  Start-Process -FilePath 'powershell.exe' -Verb RunAs -ArgumentList @('-ExecutionPolicy', 'Bypass', '-File', ('"{0}"' -f $scriptPath))
  exit 0
}

Ensure-Admin

$serviceName = 'MySQL80'
$dataDir = 'C:\ProgramData\MySQL\MySQL Server 8.0\Data'
$backendEnv = Join-Path $PSScriptRoot '..\.env'

Write-Host 'Stopping MySQL service (if running)...' -ForegroundColor Cyan
cmd /c "sc.exe stop $serviceName" | Out-Null
Start-Sleep -Seconds 2

if (-not (Test-Path $dataDir)) {
  throw "MySQL data directory not found: $dataDir"
}

Write-Host 'Repairing MySQL data directory permissions...' -ForegroundColor Cyan
cmd /c "takeown /f \"$dataDir\" /r /d y" | Out-Null
cmd /c "icacls \"$dataDir\" /grant \"NT AUTHORITY\NETWORK SERVICE:(OI)(CI)F\" /t /c" | Out-Null
cmd /c "icacls \"$dataDir\" /grant \"NT AUTHORITY\SYSTEM:(OI)(CI)F\" /t /c" | Out-Null
cmd /c "icacls \"$dataDir\" /grant \"BUILTIN\Administrators:(OI)(CI)F\" /t /c" | Out-Null

Write-Host 'Starting MySQL service...' -ForegroundColor Cyan
cmd /c "sc.exe start $serviceName" | Out-Null
Start-Sleep -Seconds 3

$service = Get-Service -Name $serviceName -ErrorAction Stop
if ($service.Status -ne 'Running') {
  throw "MySQL service is not running. Current status: $($service.Status)"
}

$listener = netstat -ano | Select-String ':3306'
if (-not $listener) {
  throw 'MySQL service started but port 3306 is not listening.'
}

Write-Host 'MySQL is running and listening on 3306.' -ForegroundColor Green
Write-Host ''
Write-Host 'Next steps:' -ForegroundColor Green
Write-Host '1) cd backend'
Write-Host '2) npx sequelize-cli db:create'
Write-Host '3) npx sequelize-cli db:migrate'
Write-Host '4) npx sequelize-cli db:seed:all'
Write-Host '5) npm run dev'

if (Test-Path $backendEnv) {
  Write-Host ''
  Write-Host 'Reminder: verify DB_USER/DB_PASSWORD in backend\.env match your MySQL account.' -ForegroundColor Yellow
}
