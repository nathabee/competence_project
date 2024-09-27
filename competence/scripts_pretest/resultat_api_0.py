
# python manage.py shell < competence/scripts/resultat_api.py

import requests
from competence.models import Resultat, User
from competence.serializers import ResultatSerializer, EleveSerializer
from rest_framework_simplejwt.tokens import AccessToken

# Function to debug ResultatDetail via API
def debug_resultat_detail(resultat_id, token):
    url = f"http://localhost:8080/api/resultat-details/?resultatId={resultat_id}"  # Adjust the port if necessary
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print("Success:", response.json())
    else:
        print("Error:", response.status_code)
        print("Response Body:", response.text)

# Example eleve ID
eleve_id = 8

print(f"TEST Resultat for eleve_id= {eleve_id}")
resultat = Resultat.objects.filter(eleve_id=eleve_id).first()

if resultat:
    serializer = ResultatSerializer(resultat)
    print(serializer.data)
    
    # Retrieve token for the user "tea"
    username = 'tea'
    try:
        user = User.objects.get(username=username)
        
        # Generate JWT token for the user
        token = AccessToken.for_user(user)

        # Debug the ResultatDetail API for this resultat
        debug_resultat_detail(resultat.id, token)  # Fetch ResultatDetail for the found Resultat
    except User.DoesNotExist:
        print(f"User with username {username} does not exist.")
else:
    print(f"No Resultat found for Eleve with ID {eleve_id}")

# Retrieve the eleves linked to the teacher "tea"
try:
    user = User.objects.get(username='tea')
    eleves = user.eleves.all()  # Should return only students linked to the teacher

    # Print the eleves linked to the teacher
    for eleve in eleves:
        print(f"Eleve: {eleve.prenom} {eleve.nom}")

    # Serialize the list of Eleves
    serializer = EleveSerializer(eleves, many=True)  # Use many=True for a queryset
    print(serializer.data)

except User.DoesNotExist:
    print(f"User with username {username} does not exist.")
