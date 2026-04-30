pipeline {
    agent any

    stages {
        stage('Análisis y Pruebas Unitarias') {
            parallel {
                stage('Backend CI') {
                    steps {
                        build job: 'backend-pipeline', wait: true
                    }
                }
                stage('Frontend CI') {
                    steps {
                        build job: 'frontend-pipeline', wait: true
                    }
                }
            }
        }

        stage('Diagnóstico') {
            steps {
                sh 'docker --version'
                sh 'docker compose version || docker-compose --version'
            }
        }

        stage('Levantar Entorno E2E') {
            steps {
                script {
                    // Limpieza y subida
                    sh 'docker-compose down -v'
                    sh 'docker-compose up -d --build'
                    
                    echo "Esperando a que el frontend (Nginx) esté listo en el puerto 4200..."
                    // Esto reintenta cada 2 segundos hasta que el puerto 4200 responda algo
                    sh 'timeout 40s bash -c "until curl -s http://localhost:4200 > /dev/null; do sleep 2; done"'
                    
                    echo "Dando 10 segundos extra para estabilidad del Backend..."
                    sleep 10
                }
            }
        }

        stage('Run E2E Tests') {
            steps {
                // Esto busca la instalación de Node llamada 'node20' (o como la hayas nombrado)
                nodejs('NodeJS-24') { 
                    dir('frontend-angular') {
                        sh 'npm install' // Asegúrate de que las dependencias existan en el workspace
                        sh 'npm run test:e2e'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Bajando servicios..."
            sh 'docker-compose down -v'
        }
    }
}