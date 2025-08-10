# Pre-commit hook to update VERSION file
# This hook appends branch name, short commit hash, and timestamp to the version

# Get the current branch name
$BRANCH_NAME = git rev-parse --abbrev-ref HEAD

# Get the short commit hash (7 characters)
$SHORT_COMMIT_HASH = git rev-parse --short HEAD

# Get timestamp in format YYYYMMDDTHHMMSS (GMT/UTC)
$TIMESTAMP = Get-Date -Format "yyyyMMddTHHmmss" -AsUTC

# Read the current version from VERSION file
if (Test-Path "VERSION") {
    $CURRENT_VERSION = Get-Content "VERSION" -Raw | ForEach-Object { $_.Trim() }
    
    # Apply the regex transformation: s/(?<=\d+\.\d+\.\d+).*/-$BRANCH_NAME-$SHORT_COMMIT_HASH-$TIMESTAMP/
    # This matches the pattern: keep the first three numbers (x.y.z) and replace everything after with the new suffix
    $NEW_VERSION = $CURRENT_VERSION -replace '(\d+\.\d+\.\d+).*', "`$1-$BRANCH_NAME-$SHORT_COMMIT_HASH-$TIMESTAMP"
    
    # Write the new version back to the VERSION file
    $NEW_VERSION | Out-File "VERSION" -Encoding UTF8 -NoNewline
    
    # Add the VERSION file to the commit
    git add VERSION
    
    Write-Host "Updated VERSION to: $NEW_VERSION"
} else {
    Write-Host "Warning: VERSION file not found"
    exit 1
}
