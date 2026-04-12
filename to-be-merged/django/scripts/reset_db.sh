
 
# --- load Competence fixtures --------------------------------------- 
 
  
python manage.py copy_data_init
python manage.py populate_data_init
python manage.py create_groups_and_permissions
python manage.py populate_teacher
python manage.py populate_translation
# python manage.py populate_demo || true
 