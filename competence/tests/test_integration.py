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
from django.core.management import call_command
import subprocess
from django.conf import settings
from django.db import connection


class IntegrationTestSetup(TestCase): 
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        # Load data from fixtures
        call_command('loaddata', 'script_db/groups.json')
        call_command('loaddata', 'script_db/users.json')
        call_command('loaddata', 'script_db/permissions.json') 
        call_command('populate_data_init')  # Call management command

        # Debug table data after loading
        # cls.debug_table_data()


        # Dump database after loading
        # cls.debug_table_data()



    # code in case we need a dump
    @classmethod
    def dump_test_database(cls):
        db_settings = settings.DATABASES['default']

        # Construct the test database name (it usually starts with 'test_')
        test_db_name = f"{db_settings['NAME']}"

        dump_command = [
            'mysqldump',
            '--user=' + db_settings['USER'],
            '--password=' + db_settings['PASSWORD'],
            '--host=' + db_settings['HOST'],
            '--port=' + str(db_settings['PORT']),  # Convert to string if necessary
            '--single-transaction',
            '--quick',
            test_db_name,  # Use the test database name
            'competence_scorerule',  # These are the actual table names in the test database
            'competence_scorerulepoint'
        ]

        dump_filename = 'test_db_dump.sql'
        try:
            with open(dump_filename, 'w') as dump_file:
                # Run the dump command
                subprocess.run(dump_command, stdout=dump_file, check=True)
            print(f"Test database dump created: {dump_filename}")
        except subprocess.CalledProcessError as e:
            print(f"Error during database dump: {str(e)}")


    @classmethod
    def debug_table_data(cls):
        with connection.cursor() as cursor:
            # Debug data in competence_scorerule
            cursor.execute("SELECT * FROM competence_scorerule;")
            scorerule_rows = cursor.fetchall()
            print("Data in competence_scorerule:")
            for row in scorerule_rows:
                print(row)
            
            # Debug data in competence_scorerulepoint
            cursor.execute("SELECT * FROM competence_scorerulepoint;")
            scorerulepoint_rows = cursor.fetchall()
            print("Data in competence_scorerulepoint:")
            for row in scorerulepoint_rows:
                print(row)

    def setUp(self):
        self.client = APIClient()
        # Create admin user
        self.admin_user = User.objects.create_user(username='adminuser', password='adminpass', is_staff=True)
        self.admin_group = Group.objects.get(name='admin')
        self.admin_user.groups.add(self.admin_group)
        self.admin_token = AccessToken.for_user(self.admin_user)

        # Set client credentials for admin user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')

class PopulateDataInitTests(IntegrationTestSetup): 
    NIVEAU_CHOICES = [
        ('GS', 'GS'),
        ('CP', 'CP'),
        ('E1', 'E1'),
        ('E2', 'E2'),
        ('M1', 'M1'),
        ('M2', 'M2'), 
    ]

    ETAPE_CHOICES = [
        ('DEBUT', 'DEBUT'),
        ('INTER', 'INTER'),
        ('FINAL', 'FINAL'),
    ]

    def test_groups_exist(self):
        groups = ['teacher', 'admin', 'analytics']
        for group_name in groups:
            self.assertTrue(Group.objects.filter(name=group_name).exists(), f"{group_name.capitalize()} group should exist.")

    def test_niveau_exists(self):
        for niveau_code, _ in self.NIVEAU_CHOICES:
            self.assertTrue(Niveau.objects.filter(niveau=niveau_code).exists(), f"Niveau {niveau_code} should exist.")

    def test_etape_exists(self):
        for etape_code, _ in self.ETAPE_CHOICES:
            self.assertTrue(Etape.objects.filter(etape=etape_code).exists(), f"Etape {etape_code} should exist.")

    def test_data_counts(self):
        self.assertEqual(Annee.objects.count(), 5, "Expected 5 Annee entries.")
        self.assertEqual(Matiere.objects.count(), 3, "Expected 3 Matiere entries.")
        self.assertEqual(Niveau.objects.count(), 7, "Expected 7 Niveau entries.")
        self.assertEqual(Etape.objects.count(), 4, "Expected 4 Etape entries.")
        self.assertEqual(ScoreRule.objects.count(), 6, "Expected 6 ScoreRule entries.")
        self.assertEqual(ScoreRulePoint.objects.count(), 13, "Expected 13 ScoreRulePoint entries.")
        self.assertEqual(Catalogue.objects.count(), 32, "Expected 32 Catalogue entries.")
        self.assertEqual(GroupageData.objects.count(), 67, "Expected 67 GroupageData entries.")
        self.assertEqual(Item.objects.count(), 146, "Expected 146 Item entries.")

    def test_relationship(self):
        for scorerule in ScoreRule.objects.all():
            related_points = scorerule.points.all()
            self.assertTrue(related_points.exists(), f"ScoreRule {scorerule.id} should have at least one ScoreRulePoint.")

        # Check that each GroupageData has a related Catalogue
        for groupage_data in GroupageData.objects.all():
            self.assertIsNotNone(groupage_data.catalogue, f"GroupageData {groupage_data.id} should have a related Catalogue.")

        # Check that each Item has a related GroupageData
        for item in Item.objects.all():
            self.assertIsNotNone(item.groupagedata, f"Item {item.id} should have a related GroupageData.")
 


class AdminConfigurationTests(IntegrationTestSetup): 
    def setUp(self):
        super().setUp()  # Call the parent setUp to load data
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')

    def test_create_analytics(self):
        response = self.client.post('/api/users/', {
            'username': 'newuser',
            'password': 'newpass',  
            'first_name': 'New',
            'last_name': 'User',
            'roles': ['analytics']   
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())
        new_user = User.objects.get(username='newuser')
        self.assertFalse(new_user.groups.filter(name='teacher').exists())
        self.assertTrue(new_user.groups.filter(name='analytics').exists())

    def test_create_teacher(self):
        response = self.client.post('/api/users/', {
            'username': 'new_teacher_user',
            'password': 'new_teacher_pass',
            'first_name': 'New',
            'last_name': 'User',
            'roles': ['teacher']   
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='new_teacher_user').exists())
        new_user = User.objects.get(username='new_teacher_user')
        self.assertIn('teacher', new_user.groups.values_list('name', flat=True))  # Check if the user has the 'teacher' role
        self.assertFalse(new_user.groups.filter(name='analytics').exists())

    def test_admin_user_token_generation(self):
        response = self.client.post('/api/token/', {
            'username': 'adminuser',
            'password': 'adminpass',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_admin_login(self):
        response = self.client.post('/api/token/', {
            'username': 'adminuser',
            'password': 'adminpass',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Ensure the client is logged in
        response = self.client.get('/api/catalogues/')  # Replace with actual route
        self.assertEqual(response.status_code, status.HTTP_200_OK)




        # Create another professor for testing using Django ORM (this doesn't need API call)
        # self.professor_user = User.objects.create_user(username='professor', password='password') 
        # self.professor_user.groups.add(Group.objects.get(name='teacher'))


#Create an Eleve: Sends a POST request to create a new Eleve and verifies the response.
#Verify Creation: Sends a GET request to confirm that the Eleve was created correctly.
#Update Eleve Data: Sends a PATCH request to update the Eleve's details and adds another professeur.
#Remove a Professeur: Sends another PATCH request to remove a professeur and verifies the list is updated.
#Delete Eleve: Optionally tests the deletion of the Eleve.

class TeacherIntegrationTests(IntegrationTestSetup):
    def setUp(self):
        super().setUp()  # Call the parent setUp to load data

        # Create the teacher user using the API
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post('/api/users/', {
            'username': 'teacheruser',
            'password': 'teacherpass',
            'first_name': 'tea1',
            'last_name': 'cher1',
            'roles': ['teacher']   
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.teacher_user = User.objects.get(username='teacheruser')

        response = self.client.post('/api/users/', {
            'username': 'professor',
            'password': 'password',
            'first_name': 'prof',
            'last_name': 'esseur',
            'roles': ['teacher']   
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.professor_user = User.objects.get(username='professor')  # Fix this line

        # Clear any credentials before logging in as teacher

        self.client.logout()
        self.client.credentials()

        # Fetch the token for the teacher by logging in through the API
        login_response = self.client.post('/api/token/', {
            'username': 'teacheruser',
            'password': 'teacherpass',
        })
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.teacher_token = login_response.data['access']  # Store the JWT token

    def test_teacher_login(self):
        # Make sure no token is set initially, so login happens correctly
        self.client.credentials()  # Clear any existing credentials

        # Authenticate professor using API
        response = self.client.post('/api/token/', {
            'username': 'professor',
            'password': 'password',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['access']  # Get the token from login response

        # Ensure the client is logged in
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/catalogues/')  # Replace with actual route
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_eleve_workflow(self):
        # Authenticate as teacher
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher_token}')

        # Step 1: Create an Eleve associated with the teacher
        eleve1_data = {
            'nom': 'Eleve1',
            'prenom': 'First',
            'niveau': '1',  # Update with valid Niveau ID,
            'datenaissance': '2010-09-15',  # Set the date in 'YYYY-MM-DD' format
            'professeurs': [self.teacher_user.id]
        }
        response = self.client.post('/api/eleves/', eleve1_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        eleve1_id = response.data['id']  # Get the ID of the created Eleve

        # Step 2: Verify Eleve1 creation
        response = self.client.get(f'/api/eleves/{eleve1_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nom'], 'Eleve1')
        self.assertEqual(response.data['prenom'], 'First')
        self.assertEqual(response.data['niveau'], '1')
        self.assertEqual(response.data['datenaissance'], '2010-09-15')

        # Use `professeurs_details` to check the professors
        professeurs_details = response.data.get('professeurs_details', [])
        self.assertEqual(len(professeurs_details), 1)
        self.assertEqual(professeurs_details[0]['id'], self.teacher_user.id)

        # Step 3: Update the Eleve's data and add another professor
        update_data = {
            'nom': 'Eleve1 Updated',
            'prenom': 'First Updated',
            'niveau': '2',
            'professeurs': [self.teacher_user.id, self.professor_user.id]  # Adding another professor
        }
        response = self.client.patch(f'/api/eleves/{eleve1_id}/', update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


        # Verify the update
        response = self.client.get(f'/api/eleves/{eleve1_id}/')
        self.assertEqual(response.data['nom'], 'Eleve1 Updated')
        self.assertEqual(response.data['prenom'], 'First Updated')
        self.assertEqual(response.data['niveau'], '2')

        # Check that both professors are now included
        professeurs_details = response.data.get('professeurs_details', [])
        self.assertEqual(len(professeurs_details), 2)
        self.assertIn(self.professor_user.id, [prof['id'] for prof in professeurs_details])
        self.assertIn(self.teacher_user.id, [prof['id'] for prof in professeurs_details])

        # Step 4: Remove a professor from the Eleve
        remove_professor_data = {
            'professeurs': [self.teacher_user.id]  # Keeping only the original professor
        }
        response = self.client.patch(f'/api/eleves/{eleve1_id}/', remove_professor_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that the professor was removed
        response = self.client.get(f'/api/eleves/{eleve1_id}/')
        professeurs_details = response.data.get('professeurs_details', [])
        self.assertEqual(len(professeurs_details), 1)
        self.assertEqual(professeurs_details[0]['id'], self.teacher_user.id)

        # Cleanup: Optionally delete the Eleve (only if needed)
        response = self.client.delete(f'/api/eleves/{eleve1_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


    def test_teacher_workflow(self):
        # Authenticate
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher_token}')

        # Step 1: Create two Eleve associated with the teacher
        eleve1_data = {
            'nom': 'Eleve1',
            'prenom': 'First',
            'niveau': 1,  # Update with valid Niveau ID
            'professeurs': [self.teacher_user.id]
        }
        response = self.client.post('/api/eleves/', eleve1_data) 
        # Check response for debugging
        # print(response.data)  # Print the response data
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Step 1.2: Verify Eleve1 creation
        eleve1_id = response.data['id']  # Get the ID of the created Eleve
        response = self.client.get(f'/api/eleves/{eleve1_id}/')  # Fetch the created Eleve by ID
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nom'], 'Eleve1')
        self.assertEqual(response.data['prenom'], 'First')


        # Step 1.2:   Eleve2 creation
        eleve2_data = {
            'nom': 'Eleve2',
            'prenom': 'Second',
            'niveau': 1,  # Update with valid Niveau ID
            'professeurs': [self.teacher_user.id]
        }
        response = self.client.post('/api/eleves/', eleve2_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


        # Step 1.3: Verify Eleve2 creation
        eleve2_id = response.data['id']  # Get the ID of the created Eleve
        response = self.client.get(f'/api/eleves/{eleve2_id}/')  # Fetch the created Eleve by ID
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nom'], 'Eleve2')
        self.assertEqual(response.data['prenom'], 'Second')

        # Step 2: Logout and login again
        self.client.logout()
  

        # Step 3: Login again
        response = self.client.post('/api/token/', {
            'username': 'teacheruser',
            'password': 'teacherpass',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Step 4: Retrieve all Eleve from the user
        response = self.client.get('/api/eleves/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2, "Expected 2 Eleve entries.")
        
        # Check for correct attributes
        eleve_ids = [eleve['id'] for eleve in response.data]
        self.assertIn(eleve1_data['nom'], [eleve['nom'] for eleve in response.data])
        self.assertIn(eleve2_data['nom'], [eleve['nom'] for eleve in response.data])

 
       

        # Step 5: Retrieve all reports from eleve2
        # Update with the correct index or value for eleve2
        #    path('eleve/<int:eleve_id>/reports/', EleveReportsView.as_view(), name='eleve-reports'), 
        response = self.client.get(f'/api/eleve/{eleve2_id}/reports/')  # Accessing by index
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0, "Expected no reports for Eleve2.")

        # Step 6: Show all Catalogues and verify the specific one
        response = self.client.get('/api/catalogues/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assuming the catalogue with ID 31 exists and checking its details
        catalogue_response = self.client.get('/api/catalogues/31/')
        self.assertEqual(catalogue_response.status_code, status.HTTP_200_OK)
        self.assertEqual(catalogue_response.data['niveau']['niveau'], 'GS')
        self.assertEqual(catalogue_response.data['etape']['etape'], 'DEBUT')
        self.assertEqual(catalogue_response.data['annee_id'], 3)
        self.assertEqual(catalogue_response.data['description'], 'GS Point Repere 24-25')


        # Fetch the Catalogue with ID 31
        catalogue31 = Catalogue.objects.get(id=31)

        # Fetch all GroupageData for this Catalogue
        groupage_data_list = GroupageData.objects.filter(catalogue=catalogue31)

        # Check that each GroupageData has more than one Item
        for groupage_data in groupage_data_list:
            items_count = Item.objects.filter(groupagedata=groupage_data).count()
            self.assertGreater(items_count, 1, f"GroupageData {groupage_data.id} should have more than one Item.")



        # Step 7: Select the catalogue and display all GroupageData including items
        groupage_response = self.client.get('/api/groupages/?catalogue=31')

        self.assertEqual(groupage_response.status_code, status.HTTP_200_OK)
        # Check that items are included in the response
        response = groupage_response.json()

        # Assert that the 'items' field is present in the response
        self.assertIn('items', response[0])  # Now it should include the 'items' key

        # Assert there are GroupageData entries associated with this Catalogue
        self.assertGreater(len(groupage_response.data), 0, "Expected at least one GroupageData.") 


        # Loop through the groupage data to validate
        for groupage in groupage_response.data:
            # Ensure they are linked to the correct catalogue by checking catalogue_id
            self.assertEqual(groupage['catalogue_id'], 31)  # Adjusted to check 'catalogue_id'

            # Optionally check if items are present
            items_response = self.client.get(f'/api/items/?groupagedata={groupage["id"]}/')
            self.assertEqual(items_response.status_code, status.HTTP_200_OK)

            # Check if items are included in the response
            self.assertGreater(len(items_response.data), 0, "Expected at least one Item for GroupageData.")
