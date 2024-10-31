pipeline {
    agent any
    environment {
        PROJECT_PATH = "/home/nathabee/competence_project"
        PROJECT_SAV = "/home/nathabee/sav"
        VENV_PATH = "/home/nathabee/competence_project/venv"
        STATIC_FILES_PATH = "/var/www/staticfiles"
        timestamp = new Date().format('yyyyMMdd')
        BACKUPDIR = "${PROJECT_SAV}/competence_project_$timestamp"
    }
    stages {

        // 1. Backup
        stage('BackUp') {
            steps {
                script {
                    // Backup project directory
                    sh "cp -r ${PROJECT_PATH} ${BACKUPDIR}"
                    echo "Backup of project directory created at ${BACKUPDIR}"

                    // Backup MySQL database using Jenkins credentials
                    sh "mysqldump --defaults-extra-file=/var/lib/jenkins/.my.cnf --databases competencedb > '${BACKUPDIR}/db_backup_${timestamp}.sql' || echo 'MySQL backup failed.'"
                    echo "MySQL database backup created."
                }
            }
        }
 
        // 2.1 Initial Checkout using Jenkins' built-in mechanism
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

        // 2.2 Update repository with sudo as the 'nathabee' user for further actions
        stage('Update Repository') {
            steps {
                script {
                    // Discard any local changes and pull the latest from GitHub
                    sh """
                        cd ${PROJECT_PATH}
                        sudo -u nathabee git reset --hard
                        sudo -u nathabee git pull origin main
                    """
                }
            }
        }


        // 3. Stop Services Stage
        stage('Stop Services') {
            steps {
                script {
                    sh 'sudo systemctl stop gunicorn || echo "Failed to stop gunicorn"'
                    sh 'sudo systemctl stop npm-app || echo "Failed to stop npm-app"'
                }
            }
        }
        // 4. Install Dependencies Stage
        stage('Install Dependencies') {
            steps {
                script { 
                    // Activate virtual environment and install Python dependencies
                    sh ". ${VENV_PATH}/bin/activate && pip install -r ${PROJECT_PATH}/requirements.txt"
            
                    sh "cd ${PROJECT_PATH}/competence-app && npm install"
                }
            }
        }

        // 5. Database Migrations Stage
        stage('Database Migrations') {
            steps {
                script {
                    sh ". ${VENV_PATH}/bin/activate && python ${PROJECT_PATH}/manage.py makemigrations"
                    sh ". ${VENV_PATH}/bin/activate && python ${PROJECT_PATH}/manage.py migrate"
                }
            }
        }

        // 6. Build Frontend Stage
        stage('Build Frontend') {
            steps {
                script {
                    sh "cd ${PROJECT_PATH}/competence-app && npm run build"
                }
            }
        }

        // 7. Start Services Stage
        stage('Start Services') {
            steps {
                script {
                    
                    sh 'sudo systemctl start gunicorn || echo "Failed to start gunicorn"'
                    sh 'sudo systemctl start npm-app || echo "Failed to start npm-app"'
                }
            }
        }

        // 8. Run Tests Stage
        stage('Run Tests') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'competence-app-teacher-id', usernameVariable: 'TEACHER_USER', passwordVariable: 'TEACHER_PASS')]) {

                        //export DJANGO_TEST_USER=$TEACHER_USER
                        //export DJANGO_TEST_PASS=$TEACHER_PASS

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

        // 9. Health Check Stage
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
