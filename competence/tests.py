from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from .models import Niveau, Etape, Annee, Matiere, ScoreRule, ScoreRulePoint, Eleve, Catalogue, GroupageData, Item, Resultat, ResultatDetail
from django.contrib.auth.models import User

class CompetenceAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a sample user and profile
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)

        # Sample Data Setup
        self.niveau = Niveau.objects.create(niveau='CP', description='Level CP')
        self.etape = Etape.objects.create(etape='DEBUT', description='Initial Stage')
        self.annee = Annee.objects.create(annee='2024-2025', description='Year 2024-2025')
        self.matiere = Matiere.objects.create(matiere='F', description='Français')
        self.eleve = Eleve.objects.create(nom='John', prenom='Doe', classe='CP')
    
    # Test Niveau List API
    def test_get_niveau_list(self):
        url = reverse('niveau-list')  # Assuming your router has 'niveau-list' as a viewset name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    # Test Create Niveau API
    def test_create_niveau(self):
        url = reverse('niveau-list')
        data = {'niveau': 'E1', 'description': 'Level E1'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Test Etape List API
    def test_get_etape_list(self):
        url = reverse('etape-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Test Create Etape API
    def test_create_etape(self):
        url = reverse('etape-list')
        data = {'etape': 'INTER', 'description': 'Intermediate Stage'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Test Create and Get Annee
    def test_get_create_annee(self):
        url = reverse('annee-list')
        data = {'annee': '2025-2026', 'description': 'Year 2025-2026'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Test Eleve Creation and List API
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
    
    def test_get_eleve_list(self):
        url = reverse('eleve-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Add more tests for other models following this pattern

    def test_get_catalogue_list(self):
        url = reverse('catalogue-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_catalogue(self):
        url = reverse('catalogue-list')
        data = {
            'niveau': self.niveau.id,
            'etape': self.etape.id,
            'annee': self.annee.id,
            'matiere': self.matiere.id,
            'description': 'Sample catalogue description'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Test Resultat List API
    def test_get_resultat_list(self):
        url = reverse('resultat-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Test Create Resultat API
    def test_create_resultat(self):
        url = reverse('resultat-list')
        groupage = GroupageData.objects.create(
            catalogue=self.niveau,
            position=1,
            desc_groupage='Groupage Description',
            label_groupage='Label Groupage',
            link='http://example.com',
            max_point=10,
            seuil1=5,
            seuil2=8,
            max_item=5
        )
        data = {
            'eleve': self.eleve.id,
            'groupage': groupage.id,
            'score': 8,
            'resultat': 'A',
            'seuil1_percent': 50.0,
            'seuil2_percent': 80.0,
            'seuil3_percent': 100.0,
            'professeur': self.user.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

