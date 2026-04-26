pipeline {
    agent any

    tools {
        nodejs 'NodeJS-18'  // ¿Tu local usa Node 18 o 20+?
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
                        echo "=== Node version ==="
                        node --version
                        
                        echo "=== npm version ==="
                        npm --version
                        
                        npm run test:cov
                        
                        echo "=== Verificando archivos de coverage ==="
                        ls -la coverage/
                        
                        echo "=== Contenido de lcov.info (primeras 30 líneas) ==="
                        head -30 coverage/lcov.info
                        
                        echo "=== Total de archivos en lcov.info ==="
                        grep -c "SF:" coverage/lcov.info
                        
                        echo "=== Rutas en lcov.info ==="
                        grep "SF:" coverage/lcov.info
                        
                        echo "=== Directorio actual ==="
                        pwd
                        
                        echo "=== Estructura de src/ ==="
                        ls -la src/
                    '''
                }
            }
        }

        stage('Sonar Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh '''
                            echo "=== Ejecutando sonar-scanner desde: ==="
                            pwd
                            
                            npx sonar-scanner -X  # El -X es para modo debug
                        '''
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