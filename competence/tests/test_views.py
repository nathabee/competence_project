###############################################################################################################
## Here are the VIEW Test
"""
test_views.py
This file should primarily focus on the viewset tests. It can include:

User Management Tests:

Test if users can access their own details and lists (like in your test_user_roles_view and test_authenticated_user_can_access_own_info).
Test for admin user permissions (like in test_admin_can_list_users and test_non_admin_cannot_list_users).
Eleves (Students) Tests:

CRUD operations and access control tests for students (like test_eleve_viewset_list).
Resource Tests:

Tests for other resources such as Niveau, Etape, Annee, etc., ensuring that the endpoints return the expected status codes and data.



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





class CompetenceAPITestCase(TestCase):
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




    def test_api_overview(self):
        response = self.client.get(reverse('api-overview'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('niveaux', response.data)

    def test_user_roles_view(self):
        response = self.client.get(reverse('user-roles'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('roles', response.data)


    def test_eleve_viewset_list(self):
        response = self.client.get(reverse('eleve-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Assuming there's one Eleve

    def test_niveau_viewset(self):
        response = self.client.get(reverse('niveau-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_etape_viewset(self):
        response = self.client.get(reverse('etape-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_annee_viewset(self):
        response = self.client.get(reverse('annee-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_matiere_viewset(self):
        response = self.client.get(reverse('matiere-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_catalogue_viewset(self):
        response = self.client.get(reverse('catalogue-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_groupage_data_viewset(self):
        response = self.client.get(reverse('groupagedata-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_item_viewset(self):
        response = self.client.get(reverse('item-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_resultat_viewset(self):
        response = self.client.get(reverse('resultat-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_resultat_detail_viewset(self):
        response = self.client.get(reverse('resultatdetail-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_pdf_layout_list_view(self):
        response = self.client.get(reverse('pdf_layouts-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_eleve_reports_view(self):
        response = self.client.get(reverse('eleve-reports', args=[self.eleve.id]))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_report_catalogue_viewset(self):
        response = self.client.get(reverse('reportcatalogue-list'))  # Update with actual URL
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_eleve_viewset_list(self):
        response = self.client.get(reverse('eleve-list'))  
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Assuming there's one Eleve

        # Check specific fields of the first Eleve in the response
        self.assertEqual(response.data[0]['nom'], 'John')
        self.assertEqual(response.data[0]['prenom'], 'Doe')
