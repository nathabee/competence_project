pipeline {
    agent any
    environment {
        PROJECT_PATH = "/home/nathabee/competence_project"
        PROJECT_SAV = "/home/nathabee/sav"
        VENV_PATH = "/home/nathabee/competence_project/venv"
        STATIC_FILES_PATH = "/var/www/staticfiles"
        timestamp = new Date().format('yyyyMMdd_HHmmss')
        BACKUPDIR = "${PROJECT_SAV}/competence_project_$timestamp"
    }
    stages {

        // 1. Backup
        stage('BackUp') {
            steps {
                script {
                    sh "cp -r ${PROJECT_PATH} ${BACKUPDIR}" 
                    echo "Backup of project directory created at ${BACKUPDIR}"
                    sh "mysqldump --defaults-extra-file=/var/lib/jenkins/.my.cnf --databases competencedb > '${BACKUPDIR}/db_backup_${timestamp}.sql' || echo 'MySQL backup failed.'"
                    echo "MySQL database backup created."
                }
            }
        }

        // 2. Checkout Stage
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [[$class: 'WipeWorkspace']],
                    userRemoteConfigs: [[url: 'https://github.com/nathabee/competence_project.git']]
                ])
            }
        }

        // 3. Stop Services
        stage('Stop Services') {
            steps {
                script {
                    sh 'sudo systemctl stop gunicorn || echo "Failed to stop gunicorn"'
                    sh 'sudo systemctl stop npm-app || echo "Failed to stop npm-app"'
                }
            }
        }

        // 4. Install Dependencies
        stage('Install Dependencies') {
            steps {
                script {
                    sh ". ${VENV_PATH}/bin/activate && pip install -r ${PROJECT_PATH}/requirements.txt"
                    sh "cd ${PROJECT_PATH}/competence-app && npm install"
                }
            }
        }

        // 5. Database Migrations
        stage('Database Migrations') {
            steps {
                script {
                    sh ". ${VENV_PATH}/bin/activate && python ${PROJECT_PATH}/manage.py makemigrations"
                    sh ". ${VENV_PATH}/bin/activate && python ${PROJECT_PATH}/manage.py migrate"
                }
            }
        }

        // 6. Build Frontend
        stage('Build Frontend') {
            steps {
                script {
                    sh "cd ${PROJECT_PATH}/competence-app && npm run build"
                }
            }
        }

        // 7. Collect Static Files and Update Permissions
        stage('Collect Static Files') {
            steps {
                script {
                    // Run Django collectstatic to gather static files
                    sh ". ${VENV_PATH}/bin/activate && python ${PROJECT_PATH}/manage.py collectstatic --noinput"

                    // Copy collected static files to the deployment directory and set permissions
                    sh """
                        sudo cp -r ${PROJECT_PATH}/staticfiles/* ${STATIC_FILES_PATH}/
                        sudo chown -R www-data:webusers ${STATIC_FILES_PATH}/
                        sudo chmod -R 775 ${STATIC_FILES_PATH}/
                    """
                }
            }
        }


        // 8. Start Services
        stage('Start Services') {
            steps {
                script {
                    sh 'sudo systemctl start gunicorn || echo "Failed to start gunicorn"'
                    sh 'sudo systemctl start npm-app || echo "Failed to start npm-app"'
                }
            }
        }

        // 9. Run Tests
        stage('Run Tests') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'competence-app-teacher-id', usernameVariable: 'TEACHER_USER', passwordVariable: 'TEACHER_PASS')]) {
                        sh """
                            . ${VENV_PATH}/bin/activate
                            cd ${PROJECT_PATH}
                            python manage.py test competence.tests.test_integration_workflow
                        """
                        sh "cd ${PROJECT_PATH}/competence-app && npm run test"
                    }
                }
            }
        }

        // 10. Health Check
        stage('Health Check') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'competence-app-teacher-id', usernameVariable: 'TEACHER_USER', passwordVariable: 'TEACHER_PASS')]) {
                        def accessToken = sh(script: "curl -X POST -H 'Content-Type: application/json' -d '{\"username\":\"$TEACHER_USER\", \"password\":\"$TEACHER_PASS\"}' http://localhost:8080/api/token/ | jq -r .access", returnStdout: true).trim()
                        
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
