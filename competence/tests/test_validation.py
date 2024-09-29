###############################################################################################################
## Here are the VALIDATION Test
"""
test_validation.py
This file can be dedicated to testing input validations, ensuring that your API responds correctly when receiving invalid data. It should include:

Validation Tests:
Tests for creating or updating resources with invalid or missing fields, ensuring appropriate error responses are returned.
Tests that check the behavior of the API when receiving incorrect data formats or types.


User Role and Permissions Validation

test_user_viewset_list: Checks if non-admin users are forbidden from accessing user lists.
test_admin_can_list_users: Confirms that admin users can list users.
test_non_admin_cannot_list_users: Ensures non-admins cannot list users, validating access control.
test_authenticated_user_can_access_own_info: Validates that authenticated users can access their own information.
test_anonymous_user_cannot_access_own_info: Ensures that anonymous users cannot access their own information.
General Access Validation

test_custom_404: Confirms that a non-existing endpoint returns a 404 status code, which is a form of validation for routing.



#######
validation logic for data integrity or business rules :  TO BE DEFINED 


THESE VALIDATION TESTS ARE NOT WRITTEN YET
 


"""

###############################################################################################################

from django.urls import reverse
from rest_framework.test import APITestCase
from competence.models import Eleve, User
from rest_framework import status

from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User, Group
from competence.models import (
    Niveau, Etape, Annee, Matiere, ScoreRule, ScoreRulePoint,
    Eleve, Catalogue, GroupageData, Item, Resultat, ResultatDetail,
    PDFLayout, Report, ReportCatalogue
)
from rest_framework_simplejwt.tokens import AccessToken





class ValidationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        #self.admin_client = APIClient()
        #self.regularuser_client = APIClient()

        # Create a sample user and assign it to the 'teacher' group
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.group_teacher = Group.objects.create(name='teacher')
        self.user.groups.add(self.group_teacher)

        # Create JWT token for the user
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')



        self.admin_user = User.objects.create_user(username='adminuser', password='adminpass', is_staff=True)
        self.admin_group = Group.objects.create(name='admin')
        self.admin_user.groups.add(self.admin_group)
        self.admin_token = AccessToken.for_user(self.admin_user)
 


        self.anonymous_user = User.objects.create_user(username='anonymuser', password='anonympass' )
        self.anonymous_group = Group.objects.create(name='unknown')
        self.anonymous_user.groups.add(self.anonymous_group)
        self.anonymous_token = AccessToken.for_user(self.anonymous_user)
 


        # Sample Data Setup
        self.niveau = Niveau.objects.create(niveau='CP', description='Level CP')
        self.etape = Etape.objects.create(etape='DEBUT', description='Initial Stage')
        self.annee = Annee.objects.create(annee='2024-2025', description='Year 2024-2025')
        self.matiere = Matiere.objects.create(matiere='F', description='Français')

        # Create Eleve and associate with professeur
        self.eleve = Eleve.objects.create(
            nom='John', prenom='Doe', niveau='CP'
        )
        self.eleve.professeurs.add(self.user)

        # Create catalogue entry
        self.catalogue = Catalogue.objects.create(
            niveau=self.niveau,
            etape=self.etape,
            annee=self.annee,
            matiere=self.matiere,
            description="Annee 2024 CP Test repere Francais"
        )

        # Create score rules
        self.scorerule = ScoreRule.objects.create(description='Default scoring rule')
        ScoreRulePoint.objects.create(scorerule=self.scorerule, scorelabel="A", score=1)
        
        # Create groupage
        self.groupage = GroupageData.objects.create(
            catalogue=self.catalogue,
            position=1,
            desc_groupage='Test Groupage Description',
            label_groupage='Test Groupage Label',
            link='http://example.com',
            max_point=100,
            seuil1=50,
            seuil2=75,
            max_item=10
        )

        # Create a PDF layout
        self.pdflayout = PDFLayout.objects.create(
            header_icon='http://example.com/icon.png',
            footer_message='Generated on 2024-09-28'
        )

        # Create a Report for the Eleve
        self.report = Report.objects.create(
            eleve=self.eleve,
            professeur=self.user,
            pdflayout=self.pdflayout
        )    

        # Create a ReportCatalogue for the Report
        self.reportcatalogue = ReportCatalogue.objects.create(
            report=self.report,
            catalogue=self.catalogue
        )

        # Create a Resultat for the Eleve
        self.resultat = Resultat.objects.create(
            report_catalogue=self.reportcatalogue,
            groupage=self.groupage,
            score=75
        )

        # Create a sample Item for ResultatDetail
        self.item = Item.objects.create(
            groupagedata=self.groupage,
            temps="Temps 1",
            description="Sample item description",
            observation="Sample observation",
            scorerule=self.scorerule,
            max_score=100,
            itempos=1,
            link='http://example.com'
        )

        # Create a ResultatDetail for the Resultat
        self.resultat_detail = ResultatDetail.objects.create(
            resultat=self.resultat,
            item=self.item,
            score=90,
            scorelabel="A",
            observation="Great performance"
        )



  

    def test_user_viewset_list(self):
        # This part tests access for non-admin users
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  # Should be forbidden for non-admins

        # Create an admin user for testing access

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        
        # This part tests access for an admin user
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)




    def test_admin_can_list_users(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_admin_cannot_list_users(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')  # Authenticate as admin first
        self.client.logout()  # Log out admin
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')  # Authenticate as user
        self.client.login(username='regularuser', password='userpass')  # Log in as non-admin

        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_user_can_access_own_info(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_anonymous_user_cannot_access_own_info(self): 
        self.client.logout()  # Log out admin 
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_custom_404(self):
        # Add authentication if required for this test
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        response = self.client.get('/api/non-existing-endpoint/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


