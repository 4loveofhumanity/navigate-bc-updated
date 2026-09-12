$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$mobileRoot = Join-Path $projectRoot 'mobile'
$appUrl = 'http://localhost:8080/'

function Test-AppReady {
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $appUrl -TimeoutSec 3
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

if (-not (Test-AppReady)) {
    $node = Get-Command node.exe -ErrorAction SilentlyContinue
    if (-not $node) {
        $runtimeRoot = Join-Path $env:LOCALAPPDATA 'OpenAI\Codex\runtimes\cua_node'
        $node = Get-ChildItem $runtimeRoot -Recurse -Filter node.exe -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1
    }

    if (-not $node) {
        throw 'Node.js could not be found.'
    }

    $nodeDirectory = Split-Path -Parent $node.Source
    if (-not $nodeDirectory) {
        $nodeDirectory = Split-Path -Parent $node.FullName
    }

    $env:PATH = "$nodeDirectory;$env:PATH"
    $env:CI = 'true'
    $env:BROWSER = 'none'
    $env:EXPO_NO_TELEMETRY = '1'
    $env:EXPO_NO_DEPENDENCY_VALIDATION = '1'
    $env:EXPO_NO_DEPENDENCY_CHECK = '1'

    $expo = Join-Path $mobileRoot 'node_modules\.bin\expo.cmd'
    Start-Process -FilePath $expo `
        -ArgumentList 'start', '--web', '--port', '8080', '--host', 'localhost' `
        -WorkingDirectory $mobileRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput (Join-Path $projectRoot 'expo-web-run.log') `
        -RedirectStandardError (Join-Path $projectRoot 'expo-web-err.log')

    $deadline = (Get-Date).AddMinutes(2)
    while ((Get-Date) -lt $deadline -and -not (Test-AppReady)) {
        Start-Sleep -Seconds 2
    }

    if (-not (Test-AppReady)) {
        throw 'The app did not become ready on port 8080.'
    }
}

Start-Process $appUrl
