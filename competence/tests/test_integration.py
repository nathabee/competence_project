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

class IntegrationTestSetup(TestCase): 
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        
        # Load data from fixtures
        call_command('loaddata', 'script_db/groups.json')
        call_command('loaddata', 'script_db/users.json')
        call_command('loaddata', 'script_db/permissions.json') 

        # Call the management command to load data and create JSON fixture
        call_command('populate_data_init')


    def setUp(self):
        # This method runs before each test, you can set up any specific client credentials or test user here.
        self.client = APIClient()

        # Ensure the teacher group exists
        self.assertTrue(Group.objects.filter(name='teacher').exists(), "Teacher group should exist.")

        # Ensure the teacher group exists
        self.assertTrue(Group.objects.filter(name='admin').exists(), "admin group should exist.")
        # Ensure the teacher group exists
        self.assertTrue(Group.objects.filter(name='analytics').exists(), "analytics group should exist.")


        # Create your admin user here...
        self.admin_user = User.objects.create_user(username='adminuser', password='adminpass', is_staff=True)        
        self.admin_group = Group.objects.get(name='admin')
        self.admin_user.groups.add(self.admin_group)
        self.admin_token = AccessToken.for_user(self.admin_user)

        self.teacher_group = Group.objects.get(name='teacher')


        # Debug output
        #print("Teacher group ID:", self.teacher_group.id)
        #print("admin_group group ID:", self.admin_group.id)

class AdminConfigurationTests(IntegrationTestSetup): 
    def setUp(self):
        super().setUp()  # Call the parent setUp to load data
        # Set the client credentials for admin user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')

        # Debug output
        #admin_user = User.objects.get(username='adminuser')
        #print("admin_user    :", admin_user) 
        #print("admin_user group    :", admin_user.groups.values_list('name', flat=True) ) 
        #print("admin_user group  id  :", admin_user.groups.values_list('id', flat=True) ) 


    def test_create_analytics(self):  #with   group analytics
        response = self.client.post('/api/users/', {
            'username': 'newuser',
            'password': 'newpass',  
            'first_name': 'New',
            'last_name': 'User',
            'roles': [ 'analytics']   
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

 

class TeacherConfigurationTests(IntegrationTestSetup):
    def setUp(self):
        super().setUp()  # Call the parent setUp to load data
        # Create the teacher user
        self.teacher_user = User.objects.create_user(username='teacheruser', password='teacherpass', is_staff=True)
        self.teacher_group = Group.objects.get(name='teacher')
        self.teacher_user.groups.add(self.teacher_group)
        self.teacher_token = AccessToken.for_user(self.teacher_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher_token}')  # Authenticate as teacher

    def test_teacher_login(self):
        response = self.client.post('/api/token/', {
            'username': 'teacheruser',
            'password': 'teacherpass',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Ensure the client is logged in
        response = self.client.get('/api/catalogues/')  # Replace with actual route
        self.assertEqual(response.status_code, status.HTTP_200_OK)
