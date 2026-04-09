 
echo reset to value:
grep '^DEFAULT_USER_PASSWORD=' ./.env


source venv/bin/activate
python manage.py shell -c "from django.conf import settings; from competence.models import CustomUser; users=['jacques','jakob','jakez','james','nathaprof','nathachef']; [CustomUser.objects.filter(username=u).update() for u in []]; 
for username in users:
    u=CustomUser.objects.get(username=username)
    u.set_password(settings.DEFAULT_USER_PASSWORD)
    u.save()
    print('reset:', username)"