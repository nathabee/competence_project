from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.test import TestCase
from django.contrib.auth.models import User, Group
from competence.models import Niveau, Etape, Annee, Matiere, Eleve, GroupageData, \
            Resultat,ResultatDetail,Catalogue,Item,ScoreRule

class APIEndpointTests(TestCase):
    def setUp(self): 
  
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.professeur = self.user
        self.client.login(username='testuser', password='testpass')

        # Create necessary related objects
        self.niveau = Niveau.objects.create(niveau='CP', description='Level CP')
        self.etape = Etape.objects.create(etape='DEBUT', description='Initial Stage')
        self.annee = Annee.objects.create(annee='2024-2025', description='Year 2024-2025')
        self.matiere = Matiere.objects.create(matiere='F', description='Français')
        
        self.scorerule = ScoreRule.objects.create(description='Default scoring rule')
        
        self.eleve = Eleve.objects.create(nom='John', prenom='Doe', classe='CP')
        self.catalogue = Catalogue.objects.create(description="Test Catalogue", niveau=self.niveau, etape=self.etape, annee=self.annee, matiere=self.matiere)
        self.groupage = GroupageData.objects.create(catalogue=self.catalogue, position=1, desc_groupage='Test Groupage', max_point=100, seuil1=50, seuil2=75, max_item=10)

        # Create Resultat
        self.resultat = Resultat.objects.create(eleve=self.eleve, groupage=self.groupage, score=75, professeur=self.professeur)

        # Create Item and ResultatDetail
        self.item = Item.objects.create(groupagedata=self.groupage, temps='30 min', description='Math Test', observation='Test observation', scorerule=self.scorerule, max_score=100.0, itempos=1, link='http://example.com/test')
        
        self.resultat_detail = ResultatDetail.objects.create(resultat=self.resultat, eleve=self.eleve, testdetail=self.item, scorelabel='A', observation='Good job', score=90.0, professeur=self.professeur)



    def test_get_niveau_list(self):
        url = reverse('niveau-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_niveau(self):
        url = reverse('niveau-list')
        data = {'niveau': 'E1', 'description': 'Level E1'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_etape_list(self):
        url = reverse('etape-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_etape(self):
        url = reverse('etape-list')
        data = {'etape': 'INTER', 'description': 'Intermediate Stage'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_resultat_detail(self):
        url = '/api/resultatdetails/'  # Adjust the URL based on your setup
        data = {
            'resultat': self.resultat.id,
            'eleve': self.eleve.id,
            'testdetail': self.item.id,
            'scorelabel': 'A',
            'observation': 'Well done',
            'score': 85.0,
            'professeur': self.professeur.id,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ResultatDetail.objects.count(), 2)  # Assuming one was created in setUp


    def test_get_resultat_details_valid_id(self): 
        # Create ResultatDetail associated with the Resultat
        detail = ResultatDetail.objects.create(
            resultat=self.resultat,
            eleve=self.eleve,  # Link to the Eleve
            testdetail=self.item,  # Assuming you have created an Item instance
            scorelabel='A',
            observation='Well done!',
            score=85.0,
            professeur=self.professeur  # Link to the Professeur
        )
        
        response = self.client.get(f'/api/resultat-details/?resultat_id={self.resultat.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Ensure we got the right detail
 

    def test_get_resultat_details_invalid_id(self):
        response = self.client.get('/api/resultat-details/?resultat_id=9999')  # Non-existing ID
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
 

    def test_post_create_resultat_valid(self):
        # Create necessary Item if not already created
        item = Item.objects.create(
            groupagedata=self.groupage,
            temps='10 min',
            description='Test Description',
            observation='Test Observation',
            scorerule=self.score_rule,  # Assuming you have created a ScoreRule instance
            max_score=100.0,
            itempos=1,
            link='http://example.com/test'
        )

        response = self.client.post('/api/resultats/', {
            'eleve_id': self.eleve.id,
            'groupage_id': self.groupage.id,
            'professeur': self.professeur.id,
            'resultatdetail_set': [
                {'testdetail': item.id, 'score': 90, 'observation': 'Good'},  # Link to the created Item
                {'testdetail': item.id, 'score': 85, 'observation': 'Very Good'},  # Same item for multiple details
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_put_update_resultat(self):
        # Create an Item to be used
        item = Item.objects.create(
            groupagedata=self.groupage,
            temps='10 min',
            description='Test Description',
            observation='Test Observation',
            scorerule=self.score_rule,  # Assuming you have created a ScoreRule instance
            max_score=100.0,
            itempos=1,
            link='http://example.com/test'
        )
        
        detail = ResultatDetail.objects.create(
            resultat=self.resultat,
            eleve=self.eleve,
            testdetail=item,  # Link to the created Item
            scorelabel='A',
            observation='Well done!',
            score=85.0,
            professeur=self.professeur
        )
        
        response = self.client.put(f'/api/resultats/{self.resultat.id}/', {
            'eleve_id': self.eleve.id,
            'groupage_id': self.groupage.id,
            'professeur': self.professeur.id,
            'resultatdetail_set': [
                {'id': detail.id, 'score': 95, 'observation': 'Excellent', 'testdetail': item.id},  # Include test detail
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_delete_resultat(self):
        response = self.client.delete(f'/api/resultats/{self.resultat.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Resultat.DoesNotExist, Resultat.objects.get, id=self.resultat.id)  # Ensure it no longer exists
