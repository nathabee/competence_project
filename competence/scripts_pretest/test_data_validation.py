from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User, Group
from competence.models import Eleve

class DataValidationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.login(username='testuser', password='testpass')

    def test_create_eleve(self):
        url = reverse('eleve-list')
        data = {
            'nom': 'Jane',
            'prenom': 'Doe',
            'classe': 'CP',
            'professeurs': [self.user.id]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Eleve.objects.filter(nom='Jane', prenom='Doe').exists())
