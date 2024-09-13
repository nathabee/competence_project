
echo "Activating the virtual environment..."
source venv/bin/activate
python manage.py loaddata competence/fixtures/initial_data.json
deactivate