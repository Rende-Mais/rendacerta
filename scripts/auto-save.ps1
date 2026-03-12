param(
  [int]$IntervalSeconds = 60,
  [string]$RepoPath = "C:\Users\Patrick Luan\Downloads\Renda-Certa\Renda-Certa",
  [string]$GitPath = "C:\Program Files\Git\bin\git.exe"
)

function Invoke-Git {
  param([string[]]$Args)
  & $GitPath -C $RepoPath @Args
}

if (-not (Test-Path $GitPath)) {
  Write-Error "Git not found at $GitPath"
  exit 1
}

if (-not (Test-Path $RepoPath)) {
  Write-Error "Repo not found at $RepoPath"
  exit 1
}

Write-Host "Auto-save running. Interval: $IntervalSeconds s. Repo: $RepoPath"

while ($true) {
  $status = Invoke-Git -Args @("status", "--porcelain")
  if ($status) {
    Invoke-Git -Args @("add", "-A") | Out-Null
    $msg = "autosave " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    Invoke-Git -Args @("commit", "-m", $msg) | Out-Null
    Invoke-Git -Args @("push") | Out-Null
    Write-Host "Saved: $msg"
  }
  Start-Sleep -Seconds $IntervalSeconds
}
