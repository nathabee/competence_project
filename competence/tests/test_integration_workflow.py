from django.test import TestCase
from django.contrib.auth.models import User, Group
from rest_framework import status  
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from django.core.management import call_command
from .api_util import ApiUtil  # Import the ApiUtil class
from django.conf import settings  # Import the settings module

# Conditional print based on DEBUG setting
def debug_print(message):
    #if settings.DEBUG:
        print(message)


class IntegrationTestSetup(TestCase): 
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        # Load data from fixtures
        call_command('loaddata', 'script_db/groups.json')
        call_command('loaddata', 'script_db/users.json')
        call_command('loaddata', 'script_db/permissions.json') 
        call_command('populate_data_init')  # Call management command

    def setUp(self):


        self.client = APIClient()
        # Initialize the API utility class
        self.api_util = ApiUtil(self.client)
        # Create admin user
        self.admin_user = User.objects.create_user(username='adminuser', password='adminpass', is_staff=True)
        self.admin_group = Group.objects.get(name='admin')
        self.admin_user.groups.add(self.admin_group)
        self.admin_token = AccessToken.for_user(self.admin_user) 

        # Set client credentials for admin user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')

        response = self.api_util._create_user('alluser', 'allpass', 'All', 'User', ['admin','teacher','analytics'])        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='alluser').exists())
        self.alluser_user = response.data
        debug_print("test_create_user_all")
        debug_print(response.data)
        

class AdminConfigurationTests(IntegrationTestSetup): 
    def setUp(self):
        super().setUp()  # Call the parent setUp to load data

    def test_create_user_analytics(self):
        response = self.api_util._create_user('newuser', 'newpass', 'New', 'User', ['analytics'])
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())
        
    def test_create_user_admin(self):
        response = self.api_util._create_user('admuser', 'admpass', 'Adm', 'User', ['admin' ])
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='admuser').exists())
        debug_print("test_create_user_admin")
        debug_print(response.data)
        
    def test_get_user_list(self):
        response = self.api_util._get_user_list( )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_user_list")
        debug_print(response.data)

        # Assuming response.data contains the list of users
        users = response.data

        # Find the user with the username 'alluser'
        alluser = next((user for user in users if user['username'] == 'alluser'), None)

        if alluser:
            alluser_id = alluser['id']
            debug_print(f"User 'alluser' has the ID: {alluser_id}")
        else:
            debug_print("User 'alluser' not found")
 

    def test_delete_user(self):
 
        alluser_id = self.alluser_user['id']
        response = self.api_util._get_user( alluser_id)  #retrieve user with id alluser_id
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_user_id")
        debug_print(response.data)
    
 
        response = self.api_util._delete_user( alluser_id )
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username='alluser').exists())


class Workflow_Dashboard(IntegrationTestSetup): 
    def setUp(self):
        super().setUp()  # Call the parent setUp to load data

 
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.api_util._create_user('teacher1', 'newpass', 'New', 'Teacher', ['teacher'])
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='teacher1').exists())
        
 
        self.client.credentials()
        response = self.api_util._login_user('teacher1', 'newpass')
        self.teacher1_token = response.data['access']
        self.client.credentials()
        

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
         

    def test_get_me_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')  # Assuming you have a teacher token
        response = self.api_util._get_user_me( )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_me_authenticated")
        debug_print(response.data)
        # Assert the response data matches the current user
 

    def test_get_user_roles_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')  # Assuming you have a teacher token
        response = self.api_util._get_user_roles( )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_user_roles_authenticated")
        debug_print(response.data) 

        # print all the list 
 
    def test_get_eleve_list(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')  # Assuming you have a teacher token
        response = self.api_util._get_eleve_list( )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_eleves_list")
        debug_print(response.data) 
 
 
    def test_get_niveau(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')  # Assuming you have a teacher token

        response = self.api_util._get_niveau_list( )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_niveau_list")
        debug_print(response.data) 
        value = response.data


        response = self.api_util._get_niveau( value[0]['id'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_niveau")
        debug_print(response.data) 
 
 
 
    def test_get_etape(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')  # Assuming you have a teacher token
        response = self.api_util._get_etape_list( )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_etape_list")
        debug_print(response.data) 
        value = response.data

 
    def test_get_annee(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')  # Assuming you have a teacher token
        response = self.api_util._get_annee_list( )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_annee_list")
        debug_print(response.data) 
        value = response.data


 
    def test_get_matiere(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')  # Assuming you have a teacher token
        response = self.api_util._get_matiere_list( )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_matiere_list")
        debug_print(response.data) 
        value = response.data




    ###################################################################################
    # last methode to see statistiques
    def test_print_test_statistique(self):
        # Output the call counts
        print("Call count of all tested API")
        print(self.api_util.get_call_counts())  # Display the counts for debugging
