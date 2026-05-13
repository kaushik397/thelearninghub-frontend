$ErrorActionPreference = "Stop"

# Define variables
$version = "v4"
$imageName = "sapien911/learninghub-frontend:$version"

Write-Host "Building image: $imageName"
docker build -t $imageName .
if ($LASTEXITCODE -ne 0) {
    throw "Docker build failed; skipping push."
}

Write-Host "Pushing image: $imageName"
docker push $imageName
if ($LASTEXITCODE -ne 0) {
    throw "Docker push failed."
}

Write-Host "Done: $imageName"
