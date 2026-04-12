#!/usr/bin/env bash  
set -euo pipefail  
  
echo "==> Creando red devops-net..."  
docker network create devops-net 2>/dev/null || echo "Red ya existe, continuando."  
  
echo "==> Levantando Jenkins..."  
docker run -d \  
  --name jenkins \  
  --network devops-net \  
  --restart always \  
  -p 8080:8080 \  
  -v jenkins_home:/var/jenkins_home \  
  -v /var/run/docker.sock:/var/run/docker.sock \  
  jenkins/jenkins:lts-jdk21  
  
echo "==> Levantando SonarQube..."  
docker run -d \  
  --name sonarqube \  
  --network devops-net \  
  --restart always \  
  -p 9000:9000 \  
  -v sonarqube_data:/opt/sonarqube/data \  
  -v sonarqube_logs:/opt/sonarqube/logs \  
  -v sonarqube_extensions:/opt/sonarqube/extensions \  
  sonarqube:community  
  
echo ""  
echo "Jenkins  -> http://localhost:8080"  
echo "SonarQube -> http://localhost:9000"  
echo ""  
echo "Contraseña inicial de Jenkins:"  
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword