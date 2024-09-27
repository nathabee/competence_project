from rest_framework.test import APIClient
from rest_framework import status
from django.test import TestCase
from competence.models import Resultat, ResultatDetail, Eleve, User, GroupageData

class ResultatAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.eleve = Eleve.objects.create(...)  # Create a test Eleve
        self.groupage = GroupageData.objects.create(...)  # Create a test Groupage
        self.professeur = User.objects.create(...)  # Create a test User
        self.resultat = Resultat.objects.create(eleve=self.eleve, groupage=self.groupage, professeur=self.professeur)

    def test_get_resultat_details_valid_id(self):
        # Create ResultatDetail associated with the Resultat
        detail = ResultatDetail.objects.create(resultat=self.resultat, ...)  
        response = self.client.get(f'/api/resultat-details/?resultat_id={self.resultat.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Ensure we got the right detail

    def test_get_resultat_details_invalid_id(self):
        response = self.client.get('/api/resultat-details/?resultat_id=9999')  # Non-existing ID
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_create_resultat_valid(self):
        response = self.client.post('/api/resultats/', {
            'eleve_id': self.eleve.id,
            'groupage_id': self.groupage.id,
            'professeur': self.professeur.id,
            'resultatdetail_set': [
                {'score': 90, 'observation': 'Good'},
                {'score': 85, 'observation': 'Very Good'},
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_put_update_resultat(self):
        detail = ResultatDetail.objects.create(resultat=self.resultat, ...)  # Create detail to update
        response = self.client.put(f'/api/resultats/{self.resultat.id}/', {
            'eleve_id': self.eleve.id,
            'groupage_id': self.groupage.id,
            'professeur': self.professeur.id,
            'resultatdetail_set': [
                {'id': detail.id, 'score': 95, 'observation': 'Excellent'},
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_resultat(self):
        response = self.client.delete(f'/api/resultats/{self.resultat.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Resultat.DoesNotExist, Resultat.objects.get, id=self.resultat.id)  # Ensure it no longer exists
