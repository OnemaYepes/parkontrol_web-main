pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'  // ¿Tu local usa Node 18 o 20+?
    }

    environment {
        SONARQUBE_ENV = 'SonarQube'
    }

    stages {

        stage('Install') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Test + Coverage + DEBUG') {
            steps {
                dir('backend') {
                    sh '''
                        echo "=== Comando de test:cov ==="
                        cat package.json | grep -A 5 "test:cov"
                        
                        echo "=== Configuración de Jest ==="
                        npx jest --showConfig 2>/dev/null | grep -A 20 "collectCoverageFrom"
                        
                        echo "=== Ejecutando tests ==="
                        npm run test:cov
                        
                        echo "=== Coverage generado ==="
                        echo "Archivos en lcov.info:"
                        grep -c "SF:" coverage/lcov.info
                        grep "SF:" coverage/lcov.info
                        
                        echo "=== Coverage total ==="
                        grep -A 2 "All files" coverage/lcov.info
                    '''
                }
            }
        }

        stage('Sonar Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh 'npx sonar-scanner'
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}