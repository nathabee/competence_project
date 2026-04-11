def cfg = [:]

pipeline {
    agent any

    environment {
        PROJECT_PATH = "/home/nathabee/competence_project"
        PROJECT_OWNER = "nathabee"
        PROJECT_SAV = "/home/nathabee/sav"
        VENV_PATH = "/home/nathabee/competence_project/venv"
        STATIC_FILES_PATH = "/var/www/competence_project/staticfiles"
        NODE_BIN = "/home/nathabee/.nvm/versions/node/v20.20.2/bin"
        PROJECT_ENV_FILE = "/home/nathabee/competence_project/.env"

        PATH = "${NODE_BIN}:${env.PATH}"
        timestamp = new Date().format('yyyyMMdd_HHmmss')
        BACKUPDIR = "${PROJECT_SAV}/competence_project_${timestamp}"
    }

    stages {

        stage('Load Project .env') {
            steps {
                script {
                    def envText = sh(
                        script: """
                            set -e
                            test -f "${env.PROJECT_ENV_FILE}" || {
                                echo "ERROR: Missing ${env.PROJECT_ENV_FILE}" >&2
                                exit 1
                            }

                            set -a
                            . "${env.PROJECT_ENV_FILE}"
                            set +a

                            for key in DBNAME CI_DEPLOY_ENV CI_UPDATE_DEPLOY_TREE CI_FRONTEND_ENV_FILE CI_FRONTEND_BUILD_CMD CI_RUN_EXTERNAL_SMOKE; do
                                value=\$(eval "printf '%s' \\"\\\${\$key:-}\\"")
                                if [ -z "\$value" ]; then
                                    echo "ERROR: Missing \$key in ${env.PROJECT_ENV_FILE}" >&2
                                    exit 1
                                fi
                                printf '%s=%s\\n' "\$key" "\$value"
                            done

                            for key in CI_INSTALL_FRONTEND_DEPS; do
                                value=\$(eval "printf '%s' \\"\\\${\$key:-}\\"")
                                printf '%s=%s\\n' "\$key" "\$value"
                            done
                        """,
                        returnStdout: true
                    ).trim()

                    cfg.clear()

                    envText.split("\\r?\\n").each { line ->
                        def idx = line.indexOf("=")
                        if (idx > 0) {
                            def key = line.substring(0, idx)
                            def value = line.substring(idx + 1)
                            cfg[key] = value
                        }
                    }

                    def requiredKeys = [
                        'DBNAME',
                        'CI_DEPLOY_ENV',
                        'CI_UPDATE_DEPLOY_TREE',
                        'CI_FRONTEND_ENV_FILE',
                        'CI_FRONTEND_BUILD_CMD',
                        'CI_RUN_EXTERNAL_SMOKE'
                    ]

                    requiredKeys.each { key ->
                        if (!cfg.containsKey(key) || cfg[key] == null || cfg[key].trim() == '') {
                            error("Missing ${key} in ${env.PROJECT_ENV_FILE}")
                        }
                    }

                    if (!cfg.CI_INSTALL_FRONTEND_DEPS?.trim()) {
                        cfg.CI_INSTALL_FRONTEND_DEPS = 'false'
                    }

                    echo "Project .env loaded successfully."
                }
            }
        }

        stage('BackUp') {
            steps {
                script {
                    sh """
                        set -e
                        mkdir -p '${env.PROJECT_SAV}'
                        cp -r '${env.PROJECT_PATH}' '${env.BACKUPDIR}'
                        mysqldump --defaults-extra-file=/var/lib/jenkins/.my.cnf --no-tablespaces --databases '${cfg.DBNAME}' > '${env.BACKUPDIR}/db_backup_${env.timestamp}.sql'
                    """
                    echo "Backup of project directory created at ${env.BACKUPDIR}"
                    echo "MySQL database backup created."
                }
            }
        }

 

        stage('Update Repository') {
            when {
                expression { return cfg.CI_UPDATE_DEPLOY_TREE == 'true' && cfg.CI_DEPLOY_ENV != 'development' }
            }
            steps {
                script {
                    sh """
                        set -e
                        cd '${env.PROJECT_PATH}'
                        sudo -u '${env.PROJECT_OWNER}' git fetch origin
                        sudo -u '${env.PROJECT_OWNER}' git reset --hard origin/main
                    """
                }
            }
        }

        stage('Stop Services') {
            steps {
                script {
                    sh """
                        set +e
                        sudo systemctl stop gunicorn
                        sudo systemctl stop npm-app
                        exit 0
                    """
                }
            }
        }

        stage('Check Tool Versions') {
            steps {
                script {
                    sh """
                        set -e
                        echo "DBNAME=${cfg.DBNAME}"
                        echo "CI_DEPLOY_ENV=${cfg.CI_DEPLOY_ENV}"
                        echo "PATH=\$PATH"
                        which node
                        node -v
                        which npm
                        npm -v
                    """
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh """
                        set -e
                        cd '${env.PROJECT_PATH}'
                        ./tools/setup_django.sh --setup --ci --project-path '${env.PROJECT_PATH}' --venv-path '${env.VENV_PATH}' --install-requirements
                    """
                    sh """
                        set -e
                        cd '${env.PROJECT_PATH}/competence-app'
                        npm install
                    """
                }
            }
        }

        stage('Database Migrations') {
            steps {
                script {
                    sh """
                        set -e
                        cd '${env.PROJECT_PATH}'
                        ./tools/setup_django.sh --setup --ci --project-path '${env.PROJECT_PATH}' --venv-path '${env.VENV_PATH}' --migrate
                    """
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    sh """
                        set -e
                        cd '${env.PROJECT_PATH}/competence-app'
                        test -f '${cfg.CI_FRONTEND_ENV_FILE}' || {
                            echo "ERROR: Missing frontend env file ${cfg.CI_FRONTEND_ENV_FILE} in ${env.PROJECT_PATH}/competence-app" >&2
                            exit 1
                        }
                        ${cfg.CI_FRONTEND_BUILD_CMD}
                    """
                }
            }
        }

        stage('Collect Static Files') {
            steps {
                script {
                    sh """
                        set -e
                        cd '${env.PROJECT_PATH}'
                        ./tools/setup_django.sh --setup --ci --project-path '${env.PROJECT_PATH}' --venv-path '${env.VENV_PATH}' --collectstatic
                    """
                }
            }
        }

        stage('Start Services') {
            steps {
                script {
                    sh """
                        set -e
                        sudo systemctl start gunicorn
                        sudo systemctl start npm-app
                    """
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh """
                        set -e
                        . '${env.VENV_PATH}/bin/activate'
                        cd '${env.PROJECT_PATH}'
                        python manage.py test competence.tests.test_integration_workflow
                    """
                    sh """
                        set -e
                        cd '${env.PROJECT_PATH}/competence-app'
                        export NODE_ENV=test
                        npm run test
                    """
                }
            }
        }

        stage('Health Check (internal)') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'competence-app-teacher-id', usernameVariable: 'TEACHER_USER', passwordVariable: 'TEACHER_PASS')]) {
                        def accessToken = sh(
                            script: '''
                                set +x
                                curl -fsS -X POST \
                                  -H "Content-Type: application/json" \
                                  -H "X-Forwarded-Proto: https" \
                                  -d "{\"username\":\"$TEACHER_USER\",\"password\":\"$TEACHER_PASS\"}" \
                                  http://127.0.0.1:8080/api/token/ | jq -r .access
                            ''',
                            returnStdout: true
                        ).trim()

                        sh """
                            set -e
                            test -n '${accessToken}'
                            test '${accessToken}' != 'null'
                            curl -fsS \
                              -H 'Authorization: Bearer ${accessToken}' \
                              -H 'X-Forwarded-Proto: https' \
                              http://127.0.0.1:8080/api/
                            curl -fsSI http://127.0.0.1:3000/
                        """
                    }
                }
            }
        }

        stage('Smoke Check (external HTTPS)') {
            when {
                expression { return cfg.CI_RUN_EXTERNAL_SMOKE == 'true' }
            }
            steps {
                sh """
                    set -e
                    curl -fsSI https://competence.nathabee.de/api/
                    curl -fsSI https://competence.nathabee.de/admin/
                    curl -fsSI https://competence.nathabee.de/
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment successful.'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}