from django.urls import reverse
from rest_framework.test import APITestCase
from competence.models import Eleve, User
from rest_framework import status

class EleveViewTest(APITestCase):
    def test_get_eleve_list_as_teacher(self):
        # Simulate login as a teacher
        teacher = User.objects.create_user(username='tea', password='test123')
        eleve = Eleve.objects.create(nom="Doe", prenom="John", classe="5A")
        eleve.professeurs.add(teacher)

        self.client.login(username='tea', password='test123')
        response = self.client.get(reverse('eleve-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['nom'], "Doe")
