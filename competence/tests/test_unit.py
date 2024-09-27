
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User, Group  # Import Group here
from competence.models import Niveau, Etape, Annee, Matiere, ScoreRule, ScoreRulePoint, Eleve, Catalogue, GroupageData, Item, Resultat, ResultatDetail
from rest_framework_simplejwt.tokens import AccessToken  # Adjust based on your JWT package

class CompetenceAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a sample user and assign it to the 'teacher' group
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.group = Group.objects.create(name='teacher')
        self.user.groups.add(self.group)

        # Login as the user
        self.client.login(username='testuser', password='testpass')

        # Create a JWT token for the user
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        # Sample Data Setup
        self.niveau = Niveau.objects.create(niveau='CP', description='Level CP')
        self.niveau0 = Niveau.objects.create(niveau='GS', description='Level GS')
        self.etape = Etape.objects.create(etape='DEBUT', description='Initial Stage')
        self.annee = Annee.objects.create(annee='2024-2025', description='Year 2024-2025')
        self.matiere = Matiere.objects.create(matiere='F', description='Français')

        # Create Eleve and associate with professeur
        self.eleve = Eleve.objects.create(
            nom='John', prenom='Doe', niveau='CP', 
            textnote1='textnote1', textnote2='textnote2', textnote3='textnote3'
        )
        self.eleve.professeurs.add(self.user)

        # Create catalogue entry
        self.catalogue = Catalogue.objects.create(
            niveau_id=self.niveau.id, etape_id=self.etape.id, annee_id=self.annee.id, 
            matiere_id=self.matiere.id, description="Annee 2024 CP Test repere Francais"
        )

        # Create score rules
        self.scorerule = ScoreRule.objects.create(description='Default scoring rule')
        ScoreRulePoint.objects.create(scorerule=self.scorerule, scorelabel="A", score=1, description="A=1")
        ScoreRulePoint.objects.create(scorerule=self.scorerule, scorelabel="NA", score=0, description="NA=0")

        # Create groupage and assert it was created successfully 
        self.groupage = GroupageData.objects.create(
            catalogue=self.catalogue,  # Make sure to associate it with a Catalogue instance
            position=1,  # Provide a valid position
            desc_groupage='Test Groupage Description',  # Provide a description
            label_groupage='Test Groupage Label',  # Provide a label
            link='http://example.com',  # Provide a link
            max_point=100,  # Provide a maximum point value
            seuil1=50,  # Provide threshold 1 value
            seuil2=75,  # Provide threshold 2 value
            max_item=10  # Provide maximum items in the group
        )


        # Create a Resultat for the Eleve
        self.resultat = Resultat.objects.create(
            eleve=self.eleve,
            groupage=self.groupage,
            score=75, 
            professeur_id=self.user.id 
        )

        # Create a sample Item for ResultatDetail
        self.item = Item.objects.create(
            groupagedata=self.groupage,
            itemdesc="Sample item description",
            itemlabel="Sample label",
            itempos=1,
            link='http://example.com'
        )

        # Create a ResultatDetail for the Resultat
        self.resultat_detail = ResultatDetail.objects.create(
            resultat=self.resultat,
            eleve=self.eleve,
            testdetail=self.item,
            score=90,
            scorelabel="A",
            observation="Great performance",
            professeur=self.user
        )


    def test_user_creation(self):
        self.assertIsNotNone(self.user.id)
        self.assertTrue(self.user.groups.filter(name='teacher').exists())

    def test_login(self):
        login_response = self.client.login(username='testuser', password='testpass')
        self.assertTrue(login_response)  # Assert that login was successful

    def test_niveau_creation(self):
        self.assertIsNotNone(self.niveau.id)

    def test_etape_creation(self):
        self.assertIsNotNone(self.etape.id)

    def test_annee_creation(self):
        self.assertIsNotNone(self.annee.id)

    def test_matiere_creation(self):
        self.assertIsNotNone(self.matiere.id)

    def test_eleve_creation(self):
        self.assertIsNotNone(self.eleve.id)
        self.assertEqual(str(self.eleve), "John Doe - CP")

    def test_catalogue_creation(self):
        self.assertIsNotNone(self.catalogue.id)

    def test_groupage_creation(self):
        self.assertIsNotNone(self.groupage.id)   

    def test_resultat_creation(self):
        self.assertIsNotNone(self.resultat.id)

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

    def test_get_create_annee(self):
        url = reverse('annee-list')
        data = {'annee': '2025-2026', 'description': 'Year 2025-2026'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_eleve(self):
        url = reverse('eleve-list')
        data = {
            'nom': 'Jane',
            'prenom': 'Doe',
            'niveau': 'CP',
            'professeurs': [self.user.id]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_eleve_list(self):
        url = reverse('eleve-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_catalogue_list(self):
        url = reverse('catalogue-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_catalogue(self):
        url = reverse('catalogue-list')
        data = {
            'niveau_id': self.niveau0.id,  # Ensure this ID is valid
            'etape_id': self.etape.id,
            'annee_id': self.annee.id,
            'matiere_id': self.matiere.id,
            'description': 'Sample catalogue description'
        }
        
        # Ensure the user is authenticated
        self.client.force_authenticate(user=self.user)

        response = self.client.post(url, data, format='json')
        
        # Log the response data for debugging
        #print(response.data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Optionally, verify the catalogue was created
        self.assertEqual(Catalogue.objects.count(), 2)  # Expecting the initial one and the new one
        new_catalogue = Catalogue.objects.get(description='Sample catalogue description')
        self.assertEqual(new_catalogue.niveau, self.niveau0)
        self.assertEqual(new_catalogue.etape, self.etape)
        self.assertEqual(new_catalogue.annee, self.annee)
        self.assertEqual(new_catalogue.matiere, self.matiere)

    def test_get_resultat_list(self):
        url = reverse('resultat-list')
        response = self.client.get(url)
        print("Response Data:", response.data)  # Check the response data for errors
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_resultat(self):
        url = reverse('resultat-list')
        
        data = {
            'eleve_id': self.eleve.id,  # Use the ID directly
            'groupage_id': self.groupage.id,  # Use ID directly
            'score': 8, 
            'seuil1_percent': 50.0,
            'seuil2_percent': 80.0,
            'seuil3_percent': 100.0,
            'professeur_id': self.user.id
        }

        response = self.client.post(url, data, format='json')
        #print("Response Data:", response.data)  # Check the response data for errors
        #print("Response Status Code:", response.status_code)  # Check the status code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Resultat.objects.filter(
            eleve=self.eleve,
            groupage=self.groupage,
            score=8,
            seuil1_percent=50.0,
            seuil2_percent=80.0,
            seuil3_percent=100.0,
            professeur=self.user
        ).exists())

 
    def test_get_resultats_for_eleve(self):
        response = self.client.get(
            '/api/resultats/',  # Adjust this URL according to your routing
            {'eleve_id': self.eleve.id}
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Check if one result is returned
        self.assertEqual(response.data[0]['eleve']['id'], self.eleve.id)  # Ensure the right eleve ID is returned

    def test_create_resultat2(self):
        # Test creation of a Resultat through the API
        response = self.client.post('/api/resultats/', {
            'eleve_id': self.eleve.id,
            'groupage_id': self.groupage.id,  # Use the ID of the groupage
            'score': 85,
            'resultat': 'Excellent',
            'professeur_id': self.user.id  # Use the ID of the user
        })
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # Check if created successfully
        self.assertEqual(Resultat.objects.count(), 2)  # Check that one more Resultat is created
        self.assertEqual(response.data['eleve']['id'], self.eleve.id)  # Ensure the right eleve ID is returned


 


    def test_create_resultat_detail(self):
        url = reverse('resultat-detail-list')  # Ensure this matches your URL configuration
        data = {
            'resultat_id': self.resultat.id,  # Reference the Resultat by ID
            'eleve': self.eleve.id,  # Reference the Eleve by ID
            'testdetail': self.item.id,  # Reference the Item (testdetail) by ID
            'score': 80,
            'scorelabel': "B",
            'observation': "Good job",
            'professeur': self.user.id  # Reference the Professor (User) by ID
        }
        response = self.client.post(url, data, format='json')

        # Verify the response and that the object is created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(ResultatDetail.objects.filter(
            resultat=self.resultat,
            eleve=self.eleve,
            testdetail=self.item,
            score=80,
            scorelabel="B"
        ).exists())


    def test_get_resultat_detail_list(self):
        url = reverse('resultat-detail-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), ResultatDetail.objects.count())  # Check if all details are returned

    def test_get_resultat_detail_by_id(self):
        url = reverse('resultat-detail-detail', args=[self.resultat_detail.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.resultat_detail.id)

    def test_update_resultat_detail(self):
        url = reverse('resultat-detail-detail', args=[self.resultat_detail.id])
        data = {
            'score': 95,  # Update score
            'scorelabel': "A+",
            'observation': "Outstanding performance",
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.resultat_detail.refresh_from_db()
        self.assertEqual(self.resultat_detail.score, 95)
        self.assertEqual(self.resultat_detail.scorelabel, "A+")
        self.assertEqual(self.resultat_detail.observation, "Outstanding performance")

    def test_delete_resultat_detail(self):
        url = reverse('resultat-detail-detail', args=[self.resultat_detail.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ResultatDetail.objects.filter(id=self.resultat_detail.id).exists())

    def test_filter_resultat_details_by_resultat(self):
        url = reverse('resultat-detail-list')
        response = self.client.get(url, {'resultat_id': self.resultat.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Since only one detail exists for this Resultat
        self.assertEqual(response.data[0]['resultat_id'], self.resultat.id)

    def test_filter_resultat_details_invalid_resultat(self):
        url = reverse('resultat-detail-list')
        response = self.client.get(url, {'resultat_id': 9999})  # Invalid resultat_id
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Expect no result