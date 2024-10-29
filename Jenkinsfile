pipeline {
    agent any
    environment {
        PROJECT_PATH = "/home/nathabee/competence_project"
        VENV_PATH = "/home/nathabee/competence_project/venv"
        STATIC_FILES_PATH = "/var/www/staticfiles"
        timestamp = new Date().format('yyyyMMdd')
        backupDir = "/home/nathabee/competence_project_$timestamp"
    }
    stages {

        // 1. Backup
        stage('BackUp') {
            steps {
                script {
                    // Backup project directory
                    sh "cp -r ${PROJECT_PATH} ${backupDir}"
                    echo "Backup of project directory created at ${backupDir}"

                    // Backup MySQL database using Jenkins credentials
                    withCredentials([usernamePassword(credentialsId: 'competence-db-credential-id', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS')]) {
                        sh "mysqldump -u $DB_USER -p'$DB_PASS' your_db_name > '${PROJECT_PATH}/db_backup_${timestamp}.sql'"
                        echo "MySQL database backup created."
                    }
                }
            }
        }

        // 2. extract from git

        stage('Checkout') {
            steps {
                script {
                    // Check out the latest code from the repository
                    git branch: 'main', url: 'https://github.com/nathabee/competence_project.git'
                }
            }
        }




        // 3. Stop Services Stage
        stage('Stop Services') {
            steps {
                script {
                    // Stop application services before deployment 
                    sh 'sudo systemctl stop gunicorn || error("Failed to stop gunicorn")'
                    sh 'sudo systemctl stop npm-app || error("Failed to stop npm-app")'
                }
            }
        }

        // 4. Install Dependencies Stage
        stage('Install Dependencies') {
            steps {
                script {
                    // Install Python and Node.js dependencies
                    sh "source ${VENV_PATH}/bin/activate && pip install -r ${PROJECT_PATH}/requirements.txt"
                    sh "cd ${PROJECT_PATH}/competence-app && npm install"
                }
            }
        }

        // 5. Build Frontend Stage
        stage('Build Frontend') {
            steps {
                script {
                    // Build the frontend application
                    sh "cd ${PROJECT_PATH}/competence-app && npm run build"
                }
            }
        }

        // 6. Start Services Stage
        stage('Start Services') {
            steps {
                script {
                    // Restart application services
                    sh 'sudo systemctl start gunicorn'
                    sh 'sudo systemctl start npm-app'
                }
            }
        }

        // 7. Run Tests Stage
        stage('Run Tests') {
            steps {
                script {
                    // Run application tests using teacher credentials
                    withCredentials([usernamePassword(credentialsId: 'competence-app-teacher-id', usernameVariable: 'TEACHER_USER', passwordVariable: 'TEACHER_PASS')]) {
                        // Run backend tests
                        sh "source ${VENV_PATH}/bin/activate && python ${PROJECT_PATH}/manage.py test --username $TEACHER_USER --password $TEACHER_PASS"
                        
                        // Run frontend tests
                        sh "cd ${PROJECT_PATH}/competence-app && npm test -- --username=$TEACHER_USER --password=$TEACHER_PASS"
                    }
                }
            }
        }

        // 8. Health Check Stage
        stage('Health Check') {
            steps {
                script {
                    // Verify the health of the application
                    
                    // Run application tests using teacher credentials
                    withCredentials([usernamePassword(credentialsId: 'competence-app-teacher-id', usernameVariable: 'TEACHER_USER', passwordVariable: 'TEACHER_PASS')]) {
                        // Get the access token
                        def accessToken = sh(script: "curl -X POST -H 'Content-Type: application/json' -d '{\"username\":\"$TEACHER_USER\", \"password\":\"$TEACHER_PASS\"}' http://localhost:8080/api/token/ | jq -r .access", returnStdout: true).trim()
                        
                        // Check API status
                        sh """
                        curl -H "Authorization: Bearer ${accessToken}" http://localhost:8080/api/
                        curl -I http://localhost:3000/evaluation
                        """
                    }
                }
            }
        }

    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
