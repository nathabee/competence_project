
echo "Activating the virtual environment..."
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
deactivate