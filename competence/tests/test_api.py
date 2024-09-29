###############################################################################################################
## Here are the API Test
"""
test_api.py
This file can serve as an overview of all the key API functionalities and important test cases for integration. It should include:

General API Overview: A test to check the correct structure of the API overview.
Authentication & Permissions: Tests that validate access control based on user roles.
CRUD Operations: General tests for create, read, update, and delete operations across different resources.


1. General API Overview
GET /api/overview/
Check if the endpoint returns the correct links to all the resources.

2. User Management
GET /api/users/
List all users (admin access).
GET /api/users/me/
Retrieve the current user's details.
GET /api/user/roles/
Retrieve the current user's roles.

3. Eleves (Students)
GET /api/eleves/
List all students (admin/teacher).
GET /api/eleves/<id>/
Retrieve a specific student by ID.
POST /api/eleves/
Create a new student (admin).
PUT/PATCH /api/eleves/<id>/
Update a specific student's data (admin/teacher).
DELETE /api/eleves/<id>/
Delete a student (admin).
GET /api/eleves/anonymized/
Retrieve anonymized student data (analytics/admin).
GET /api/eleve/<int:eleve_id>/reports/
Retrieve all reports for a specific student (admin/teacher).

4. Niveaux (Levels)
GET /api/niveaux/
List all levels (authenticated users).
GET /api/niveaux/<id>/
Retrieve a specific level by ID.
POST /api/niveaux/
Create a new level (admin).
PUT/PATCH /api/niveaux/<id>/
Update a specific level.
DELETE /api/niveaux/<id>/
Delete a level.

5. Etapes (Steps)
Same as Niveaux, for CRUD operations:
GET, POST, PUT/PATCH, DELETE /api/etapes/ and /api/etapes/<id>/.

6. Annees (Years)
Same as Niveaux, for CRUD operations:
GET, POST, PUT/PATCH, DELETE /api/annees/ and /api/annees/<id>/.

7. Matieres (Subjects)
Same as Niveaux, for CRUD operations:
GET, POST, PUT/PATCH, DELETE /api/matieres/ and /api/matieres/<id>/.

8. Score Rules
GET, POST, PUT/PATCH, DELETE /api/scorerules/ and /api/scorerules/<id>/.

9. Score Rule Points
GET, POST, PUT/PATCH, DELETE /api/scorerulepoints/ and /api/scorerulepoints/<id>/.

10. Catalogues
GET, POST, PUT/PATCH, DELETE /api/catalogues/ and /api/catalogues/<id>/.

11. Groupage Data
GET, POST, PUT/PATCH, DELETE /api/groupages/ and /api/groupages/<id>/.

12. Items
GET, POST, PUT/PATCH, DELETE /api/items/ and /api/items/<id>/.

13. Resultats
GET, POST, PUT/PATCH, DELETE /api/resultats/ and /api/resultats/<id>/.
GET /api/resultats/?eleve_id=<id> (for filtering by student).

14. Resultat Details
GET, POST, PUT/PATCH, DELETE /api/resultatdetails/ and /api/resultatdetails/<id>/.
GET /api/resultatdetails/?resultat_id=<id> (for filtering by result).

15. PDF Layouts
GET, POST, PUT/PATCH, DELETE /api/pdf_layouts/ and /api/pdf_layouts/<id>/.

16. Reports
GET, POST, PUT/PATCH, DELETE /api/reports/ and /api/reports/<id>/.
GET /api/eleve/<id>/reports/ to list all reports for a specific student.

17. Report Catalogues
GET, POST, PUT/PATCH, DELETE /api/reportcatalogues/ and /api/reportcatalogues/<id>/.
Key API Test Cases for Integration Testing:

Authentication & Permissions:

Test access as an admin, teacher, and unauthenticated user for different endpoints.
Verify role-based access control (RBAC) for specific viewsets.
CRUD Operations:

Perform create, update, and delete operations on all endpoints, ensuring correct response statuses (201, 200, 204, etc.).
Check for validation errors when required fields are missing or invalid.
Filtering & Query Params:

Test query parameter filtering, such as eleve_id for resultats or resultat_id for resultatdetails.
Data Relationships:

Ensure that nested relationships are correctly handled, especially for models like Report and Resultat that depend on foreign key relationships.
"""
#################################################################################################################



from rest_framework import status
from django.test import TestCase
from django.contrib.auth.models import User, Group 
from rest_framework.test import APIClient
from rest_framework import status  
from competence.models import (
    Niveau, Etape, Annee, Matiere, ScoreRule, ScoreRulePoint,
    Eleve, Catalogue, GroupageData, Item, Resultat, ResultatDetail,
    PDFLayout, Report, ReportCatalogue
)
from rest_framework_simplejwt.tokens import AccessToken



class BaseTestSetup(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a test user and assign them to the 'teacher' group
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.group = Group.objects.create(name='teacher')
        self.user.groups.add(self.group)

        # Generate JWT token for authentication
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        # Sample Data Setup
        self.niveau = Niveau.objects.create(niveau='CP', description='Level CP')
        self.etape = Etape.objects.create(etape='DEBUT', description='Initial Stage')
        self.annee = Annee.objects.create(annee='2024-2025', description='Year 2024-2025')
        self.matiere = Matiere.objects.create(matiere='F', description='Français')

        # Create Eleve and associate with the teacher (professeur)
        self.eleve = Eleve.objects.create(nom='John', prenom='Doe', niveau='CP')
        self.eleve.professeurs.add(self.user)

        # Create catalogue entry
        self.catalogue = Catalogue.objects.create(
            niveau=self.niveau,
            etape=self.etape,
            annee=self.annee,
            matiere=self.matiere,
            description="Annee 2024 CP Test repere Francais"
        )

        # Create score rule and related points
        self.scorerule = ScoreRule.objects.create(description='Default scoring rule')
        ScoreRulePoint.objects.create(scorerule=self.scorerule, scorelabel="A", score=1)

        # Create groupage data
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

        # Create PDF layout
        self.pdflayout = PDFLayout.objects.create(
            header_icon='http://example.com/icon.png',
            footer_message='Generated on 2024-09-28'
        )

        # Create a report for the Eleve
        self.report = Report.objects.create(
            eleve=self.eleve,
            professeur=self.user,
            pdflayout=self.pdflayout
        )

        # Create a ReportCatalogue for the report
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

        # Create an Item for ResultatDetail
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


class OverviewTests(BaseTestSetup):
    def test_overview_report_retrieval(self):
        response = self.client.get(f'/api/reports/?eleve_id={self.eleve.id}')  # Replace with actual route
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['eleve']['nom'], 'John')
        self.assertEqual(response.data[0]['professeur']['username'], 'testuser')

    def test_overview_catalogue_listing(self):
        response = self.client.get('/api/catalogues/')  # Replace with actual route
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(item['description'] == 'Annee 2024 CP Test repere Francais' for item in response.data))

    def test_overview_result_summary(self):
        response = self.client.get(f'/api/results/?eleve_id={self.eleve.id}')  # Replace with actual route
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['score'], 75)
        self.assertEqual(response.data[0]['groupage']['desc_groupage'], 'Test Groupage Description')


class UserManagementTests(BaseTestSetup):
    def test_user_group_assignment(self):
        user = User.objects.get(username='testuser')
        self.assertTrue(user.groups.filter(name='teacher').exists())

    def test_user_retrieval(self):
        response = self.client.get(f'/api/users/{self.user.id}/')  # Replace with actual route
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_user_listing(self):
        response = self.client.get('/api/users/')  # Replace with actual route
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(user['username'] == 'testuser' for user in response.data))

    def test_create_new_user(self):
        response = self.client.post('/api/users/', {
            'username': 'newuser',
            'password': 'newpass',
            'groups': [self.group.id]  # Assign to 'teacher' group
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())
        new_user = User.objects.get(username='newuser')
        self.assertTrue(new_user.groups.filter(name='teacher').exists())

    def test_user_token_generation(self):
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login(self):

        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Ensure the client is logged in
        response = self.client.get('/api/catalogues/')  # Replace with actual route
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SavedTests(BaseTestSetup):

    def test_post_create_resultat_missing_fields(self):
        # Missing groupage_id and report_catalogue in the POST request
        response = self.client.post('/api/resultats/', {
            'eleve_id': self.eleve.id,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('groupage_id', response.data)
        self.assertIn('report_catalogue', response.data)

    def test_get_resultat_details_valid_id(self):
        # Test fetching the valid Resultat details
        response = self.client.get(f'/api/resultat-details/?resultat_id={self.resultat.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_resultat_details_invalid_id(self):
        # Test fetching details for an invalid Resultat ID
        response = self.client.get('/api/resultat-details/?resultat_id=9999')  # Non-existing ID
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_create_resultat_valid(self):
        # Valid post request to create a Resultat
        response = self.client.post('/api/resultats/', {
            'eleve_id': self.eleve.id,
            'groupage_id': self.groupage.id,
            'report_catalogue': self.reportcatalogue.id,
            'resultatdetail_set': [
                {'score': 90, 'observation': 'Good'},
                {'score': 85, 'observation': 'Very Good'},
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_eleve_reports(self):
        # Fetch reports for the specific Eleve
        response = self.client.get(f'/api/eleve/{self.eleve.id}/reports/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))

    def test_pdf_layouts(self):
        # Fetch available PDF layouts
        response = self.client.get('/api/pdf-layouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
