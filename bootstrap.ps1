$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$dependencies = Get-Content -LiteralPath (Join-Path $root 'dependencies.json') -Raw | ConvertFrom-Json
$dependency = $dependencies.agent
$destination = Join-Path $root $dependency.path
if (-not (Test-Path -LiteralPath $destination)) {
    git clone $dependency.repository $destination
    if ($LASTEXITCODE -ne 0) { throw 'Agent clone failed' }
    git -C $destination checkout --detach $dependency.revision
    if ($LASTEXITCODE -ne 0) { throw 'Agent revision checkout failed' }
} else {
    $revision = git -C $destination rev-parse HEAD
    if ($LASTEXITCODE -ne 0) { throw 'Existing agent directory is not a Git checkout' }
    if ($revision -ne $dependency.revision) {
        throw "Agent revision differs from dependencies.json; preserve local work and reconcile explicitly."
    }
    $changes = git -C $destination status --porcelain
    if ($changes) { Write-Warning 'Agent has local changes; bootstrap preserved them.' }
}
