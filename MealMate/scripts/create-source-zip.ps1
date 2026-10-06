$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$archivePath = Join-Path $projectRoot "MealMate-source.zip"
$excludedEntries = @("node_modules", "dist", ".git")

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path -LiteralPath $archivePath -PathType Leaf) {
  throw "The archive already exists. Move or rename it before creating another source archive."
}

function Get-SourceFiles([string]$directory) {
  Get-ChildItem -LiteralPath $directory -Force | ForEach-Object {
    if ($_.PSIsContainer) {
      if ($excludedEntries -notcontains $_.Name) {
        Get-SourceFiles $_.FullName
      }
    } elseif ($_.Name -ne ".env.local" -and $_.FullName -ne $archivePath) {
      $_
    }
  }
}

$archive = [System.IO.Compression.ZipFile]::Open(
  $archivePath,
  [System.IO.Compression.ZipArchiveMode]::Create
)

try {
  Get-SourceFiles $projectRoot | ForEach-Object {
    $relativePath = $_.FullName.Substring($projectRoot.Length + 1)
    $entryName = $relativePath.Replace("\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $archive,
      $_.FullName,
      $entryName,
      [System.IO.Compression.CompressionLevel]::Optimal
    ) | Out-Null
  }
} finally {
  $archive.Dispose()
}

Write-Output "Created $archivePath (excluding node_modules, dist, .git, and .env.local)."
