cd ..
python manage.py dumpdata auth.group --indent 4 > script_db/groups.json
python manage.py dumpdata auth.permission --indent 4 > script_db/permissions.json
python manage.py dumpdata auth.user --indent 4 >  script_db/users.json
cd tools
