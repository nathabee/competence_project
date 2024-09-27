# run with command :
#
# python manage.py shell < competence/scripts/resultat_serializer_script.py


# 

from competence.serializers import ResultatSerializer, EleveSerializer
from competence.models import Resultat
from django.contrib.auth.models import User

eleve_id = 8  # Example eleve ID

print(f"TEST Resultat for eleve_id= {eleve_id}")
resultat = Resultat.objects.filter(eleve_id=eleve_id).first()

if resultat:
    serializer = ResultatSerializer(resultat)
    print(serializer.data)
else:
    print(f"No Resultat found for Eleve with ID {eleve_id}")

username = 'tea'
print(f"TEST Eleves associated with User username= {username}")

try:
    user = User.objects.get(username=username)
    eleves = user.eleves.all()  # Should return only students linked to the teacher

    # Print the eleves linked to the teacher
    for eleve in eleves:
        print(f"Eleve: {eleve.prenom} {eleve.nom}")

    # Serialize the list of Eleves
    serializer = EleveSerializer(eleves, many=True)  # Use many=True for a queryset
    print(serializer.data)

except User.DoesNotExist:
    print(f"User with username {username} does not exist.")


