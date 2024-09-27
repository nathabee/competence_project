from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User, Group
from competence.models import Resultat, ResultatDetail, Eleve
from rest_framework_simplejwt.tokens import AccessToken

class ResultatDetailAPITests(APITestCase):
    def setUp(self):
        # Create the user and group
        self.user = User.objects.create_user(username='tea', password='testpass')
        self.group = Group.objects.create(name='teacher')
        self.user.groups.add(self.group)

        # Create an Eleve instance
        self.eleve = Eleve.objects.create(prenom='John', nom='Doe')
        # Create a Resultat instance
        self.resultat = Resultat.objects.create(eleve=self.eleve, professeur=self.user)

        # Create ResultatDetail instances
        self.resultat_detail = ResultatDetail.objects.create(
            resultat=self.resultat,
            observation='Good performance',
            score=85,
            testdetail=item_instance  # Assuming item_instance is a valid Item instance
        )

        # Login the user and create a JWT token
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_get_resultat_detail(self):
        response = self.client.get(f'/api/resultat-details/?resultatId={self.resultat.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('eleve', response.data)
        self.assertEqual(response.data['eleve']['prenom'], self.eleve.prenom)
        self.assertEqual(response.data['score'], self.resultat_detail.score)

    def test_get_resultat_detail_not_found(self):
        response = self.client.get('/api/resultat-details/?resultatId=999')  # Non-existent ID
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
