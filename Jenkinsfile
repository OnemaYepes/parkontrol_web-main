pipeline {
    agent any

    tools {
        nodejs 'NodeJS-18'
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

        stage('Test + Coverage') {
            steps {
                dir('backend') {
                    sh 'npm run test:cov'
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