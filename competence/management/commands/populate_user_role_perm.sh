cd  ../../../
python manage.py loaddata script_db/groups.json
python manage.py loaddata script_db/permissions.json
python manage.py loaddata users.json
cd competence/management/commands
