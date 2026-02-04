param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$keywordPattern = 'KVKK|6698|6502|6563|Mesafeli Sözleşmeler|Resmî Gazete|resmigazete\.gov\.tr|mevzuat\.gov\.tr|gib\.gov\.tr|ebelge\.gib\.gov\.tr|turkpatent|tcmb\.gov\.tr|ticaret\.gov\.tr|Gümrük|4458|5846|6769|6475|5651|5237|\bödeme\b|\bÖdeme\b|\bodeme\b'
$markerPattern = 'Resm.\s*kaynaklar\s*\(TR\)'

$paths = Get-ChildItem -Path $Root -Recurse -Filter *.html -File |
  Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
  Select-Object -ExpandProperty FullName

$keywordHits = Select-String -Path $paths -Pattern $keywordPattern -Encoding UTF8 -List |
  Select-Object -ExpandProperty Path -Unique

$missing = $keywordHits |
  Where-Object { -not (Select-String -Path $_ -Pattern $markerPattern -Encoding UTF8 -Quiet) } |
  Sort-Object

if ($missing.Count -gt 0) {
  Write-Host ('FAIL: {0} file(s) match legal/policy keywords but lack "Resmi kaynaklar (TR)" marker' -f $missing.Count)
  $missing | ForEach-Object { Write-Host ('- ' + $_.Substring($Root.Length + 1)) }
  exit 1
}

Write-Host ('OK: {0} HTML file(s) match keywords; all contain the marker.' -f $keywordHits.Count)
exit 0
