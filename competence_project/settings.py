from pathlib import Path
from decouple import config
from datetime import timedelta
#import os

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = False

APPEND_SLASH = True
#CORS_ALLOW_CREDENTIALS = True  # If sending cookies


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Define a function to get environment variables
def get_env_variable(var_name, default=None):
    """
    Get the value of an environment variable. If not found, return the default value or raise an exception.
    """
    return config(var_name, default=default)

# Application settings
SECRET_KEY = get_env_variable('DJANGO_SECRET_KEY', default='your_default_secret_key')
DEBUG = get_env_variable('DEBUG', default='False') == 'True' 
JWT_SECRET_KEY = get_env_variable('JWT_SECRET_KEY', default='your_default_secret_key')
  
# Fetch CORS_ALLOWED_ORIGINS from the environment, split by comma
CORS_ALLOWED_ORIGINS = get_env_variable('CORS_ALLOWED_ORIGINS', default='http://localhost:3000').split(',')
CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'accept',
    'x-requested-with',
    'x-csrftoken',
    'origin',
    'accept-encoding',
    'authorization',
]

 
ALLOWED_HOSTS = get_env_variable('ALLOWED_HOSTS', default="192.168.178.71,localhost,127.0.0.1,nathabee.de,159.69.0.127").split(',')
 

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': get_env_variable('DBNAME', default='databasename'),
        'USER': get_env_variable('DBUSER', default='username'),
        'PASSWORD': get_env_variable('DBPASSWORD', default='dbpassword'),
        'HOST': get_env_variable('DBHOST', default='127.0.0.1'),
        'PORT': get_env_variable('DBPORT', default='3306'),
    }
}

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'corsheaders',
    'rest_framework',       # Django Rest Framework for API
    'drf_yasg',             # Swagger for API documentation
    'competence',           # The competence app
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",  # Add this line
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

 


ROOT_URLCONF = "competence_project.urls"

# Templates configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Adjusted for Competence project
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = "competence_project.wsgi.application"

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Add on for autorisation and authentification
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
 

SIMPLE_JWT = {
    'SIGNING_KEY': JWT_SECRET_KEY,
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

CSRF_TRUSTED_ORIGINS = [
    'https://nathabee.de',
    'https://localhost:8080',  # Add this if you're testing locally
    'http://nathabee.de:3000',  # Add this if you're testing locally
]

 