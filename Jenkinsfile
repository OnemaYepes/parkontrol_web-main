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
                    echo "Limpiando volúmenes previos para asegurar carga de backup..."
                    sh 'docker-compose down -v' // El -v borra el volumen de datos viejo
                    sh 'docker-compose up -d --build'
                    
                    echo "Esperando a Oracle (suele tardar un poco más)..."
                    // Oracle XE es pesado, dale tiempo para procesar el backup.sql
                    sh 'sleep 60' 
                }
            }
        }

        //stage('Run E2E Tests') {
            //steps {
                // Esto busca la instalación de Node llamada 'node20' (o como la hayas nombrado)
                //nodejs('NodeJS-24') { 
                    //dir('frontend-angular') {
                        //sh 'npm install' // Asegúrate de que las dependencias existan en el workspace
                        //sh 'npm run test:e2e'
                    //}
                //}
           // }
        //}
    }

    post {
        always {
            echo "Bajando servicios..."
            sh 'docker-compose down -v'
        }
    }
}