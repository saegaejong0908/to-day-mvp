# Ship: commit & push
# 변경사항이 없으면 종료, 있으면 add -> commit -> push

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "변경사항이 없습니다. 종료합니다."
    exit 0
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
git add .
git commit -m "update $timestamp"
git push
