$ErrorActionPreference = "Stop"  
  
Write-Host "==> Creando red devops-net..."  
docker network create devops-net 2>$null  
if ($LASTEXITCODE -ne 0) { Write-Host "Red ya existe, continuando." }  
  
Write-Host "==> Levantando Jenkins..."  
docker run -d `  
  --name jenkins `  
  --network devops-net `  
  --restart always `  
  -p 8080:8080 `  
  -v jenkins_home:/var/jenkins_home `  
  -v //var/run/docker.sock:/var/run/docker.sock `  
  jenkins/jenkins:lts-jdk21  
  
Write-Host "==> Levantando SonarQube..."  
docker run -d `  
  --name sonarqube `  
  --network devops-net `  
  --restart always `  
  -p 9000:9000 `  
  -v sonarqube_data:/opt/sonarqube/data `  
  -v sonarqube_logs:/opt/sonarqube/logs `  
  -v sonarqube_extensions:/opt/sonarqube/extensions `  
  sonarqube:community  
  
Write-Host ""  
Write-Host "Jenkins   -> http://localhost:8080"  
Write-Host "SonarQube -> http://localhost:9000"  
Write-Host ""  
Write-Host "Contraseña inicial de Jenkins:"  
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword