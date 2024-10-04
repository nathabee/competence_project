from django.test import TestCase
from django.contrib.auth.models import User, Group
from rest_framework import status  
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from django.core.management import call_command
from .api_util import ApiUtil  # Import the ApiUtil class
# from django.conf import settings  # Import the settings module
from competence.models import ( 
    Eleve,  
)

DEBUG = True  # Global DEBUG variable

# Conditional print based on DEBUG setting
def debug_print(param1, param2=None):
    #DEBUG = settings.DEBUG
    if DEBUG:
        if param2 is not None:
            print(f"{param1}: {param2}")
        else:
            print(param1)


class IntegrationTestSetup(TestCase): 
    global DEBUG  # Use the global DEBUG variable
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        # Load data from fixtures 
        call_command('populate_data_init')  # Call management command
        call_command('create_groups_and_permissions')

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



class AdminConfigurationTests(IntegrationTestSetup): 
    #global DEBUG
    #DEBUG = False
    def setUp(self):
        super().setUp()  # Call the parent setUp to load data

        

    def test_user(self):
        response = self.api_util._create_user('alluser', 'allpass', 'All', 'User', ['admin','teacher','analytics'])        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='alluser').exists())
        self.alluser_user = response.data
        debug_print("test_create_user_all")
        debug_print(response.data)
        
 
        response = self.api_util._create_user('newuser', 'newpass', 'New', 'User', ['analytics'])
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())
         
        response = self.api_util._create_user('admuser', 'admpass', 'Adm', 'User', ['admin' ])
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='admuser').exists())
        debug_print("test_create_user_admin")
        debug_print(response.data)
         
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
  
 
        alluser_id = self.alluser_user['id']
        response = self.api_util._get_user( alluser_id)  #retrieve user with id alluser_id
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_user_id")
        debug_print(response.data)
    
 
        response = self.api_util._delete_user( alluser_id )
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username='alluser').exists())


class Workflow_Dashboard(IntegrationTestSetup): 
    #global DEBUG
    #DEBUG = False
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
 
    def test_create_niveau(self):
        # Use the admin token to create a Niveau
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        
        response = self.api_util._create_niveau(description="New level",niveau="NL") 

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        debug_print("test_create_niveau")
        debug_print(response.data)

        # Validate the created object
        self.assertIn("description", response.data)
        self.assertEqual(response.data['description'], "New level")

 
    def test_get_etape(self):
        # Use teacher token to get the list of Etapes
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')

        # Get list of Etapes
        response = self.api_util._get_etape_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_etape_list")
        debug_print(response.data)

        value = response.data

        # Test fetching a specific Etape by its ID
        response = self.api_util._get_etape(value[0]['id'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_etape")
        debug_print(response.data)

    def test_create_etape(self):
        # Use the admin token to create an Etape
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        
        response = self.api_util._create_etape(description="New step in the curriculum",etape="DEBUT")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        debug_print("test_create_etape")
        debug_print(response.data)

        # Validate the created object
        self.assertIn("description", response.data)
        self.assertEqual(response.data['description'], "New step in the curriculum")

 
    def test_get_annee(self):
        # Use teacher token to get the list of Annees
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')

        # Get list of Annees
        response = self.api_util._get_annee_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_annee_list")
        debug_print(response.data)
        
        value = response.data

        # Test fetching a specific Annee by its ID
        response = self.api_util._get_annee(value[0]['id'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_annee")
        debug_print(response.data)

 
    def test_create_annee(self):
        # Use the admin token to create an Annee
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}') 

        response = self.api_util._create_annee(is_active=True,start_date="2023-01-01",stop_date=None, description="New school year 2023 no stopdate")
        
        debug_print("test_create_annee")
        debug_print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


        # Validate the created object
        self.assertIn("is_active", response.data)
        self.assertEqual(response.data['is_active'], True)
        self.assertEqual(response.data['description'], "New school year 2023 no stopdate")
        ######
 
        response = self.api_util._create_annee(is_active=False,start_date="2023-01-01",stop_date="2024-01-01", description="New school year 2023-2024")
        debug_print("test_create_annee")
        debug_print(response.data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 

        # Validate the created object
        self.assertIn("is_active", response.data)
        self.assertEqual(response.data['is_active'], False)
        self.assertEqual(response.data['description'], "New school year 2023-2024")
        self.assertEqual(response.data['start_date'],"2023-01-01")
        self.assertEqual(response.data['stop_date'], "2024-01-01")
         ######
 
        response = self.api_util._create_annee(is_active=True, start_date=None,stop_date=None,description="New school year no date" )
        debug_print("test_create_annee")
        debug_print(response.data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 

        # Validate the created object
        self.assertIn("is_active", response.data)
        self.assertEqual(response.data['is_active'], True)
        self.assertEqual(response.data['description'], "New school year no date")
        #self.assertEqual(response.data['start_date'],"2023-01-01")
        self.assertEqual(response.data['stop_date'],None)


    def test_get_matiere(self):
        # Use teacher token to get the list of Matieres
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')

        # Get list of Matieres
        response = self.api_util._get_matiere_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_matiere_list")
        debug_print(response.data)

        value = response.data

        # Test fetching a specific Matiere by its ID
        response = self.api_util._get_matiere(value[0]['id'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_matiere")
        debug_print(response.data)


    def test_create_matiere(self):
        # Use the admin token to create a Matiere
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        
        response = self.api_util._create_matiere(description="New subject",matiere="N")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        debug_print("test_create_matiere")
        debug_print(response.data)

        # Validate the created object
        self.assertIn("description", response.data)
        self.assertEqual(response.data['description'], "New subject")

 

    def test_create_get_delete_eleve(self):
        # Step 1: Authenticate as admin
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        
        # Step 2: Create teacher users
        teacher1 = self.api_util._create_user('teachertest1', 'teachertestnewpass', 'New1', 'Teacher', ['teacher']).data
        teacher2 = self.api_util._create_user('teachertest2', 'teachertestnewpass', 'New2', 'Teacher', ['teacher']).data
        
        self.client.credentials( )
        response = self.api_util._login_user('teachertest1', 'teachertestnewpass')
        teachertest1_token = response.data['access']
        self.client.credentials( )
        response = self.api_util._login_user('teachertest2', 'teachertestnewpass')
        teachertest2_token = response.data['access']

        self.client.credentials( )
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        # Step 3: Get lists of niveaux and teachers
        niveau_list = self.api_util._get_niveau_list().data         
        niveau_id1 = niveau_list[0]['id']
        niveau_id2 = niveau_list[1]['id']


        teacher_list = self.api_util._get_teacher_list().data
        debug_print("Teacher List Response:") 
        debug_print( teacher_list)
        
        # Step 4: Create first eleve
        response = self.api_util._create_eleve(nom="Jean", prenom="Valjean", niveau=niveau_id1, datenaissance="2015-01-02", professeurs=[teacher1['id']])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        debug_print(  response.data)
        #{'id': 11, 'username': 'teachertest1', 'first_name': 'New1', 'last_name': 'Teacher', 'roles': ['teacher']}

        eleve1 = response.data

        # Validate first eleve data 
        self._validate_eleve_data(response.data, "Jean", "Valjean", "2015-01-02", [teacher1])   

        # Step 5: Create second eleve
        response = self.api_util._create_eleve(nom="Jeanne", prenom="Eyre", niveau=niveau_id2, datenaissance="2016-01-02", professeurs=[teacher1['id'],teacher2['id']])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        debug_print(  response.data)
        
        # Step 6: Authenticate as teacher1 and check eleves assigned to teacher1
        self.client.credentials( ) 
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {teachertest1_token}')
        response = self.api_util._get_eleve_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print( "teachertest1 _get_eleve_list")
        debug_print( response.data)
        self.assertEqual(len(response.data), 2)  # Check teacher1 has 2 eleves
        
        # Step 7: Authenticate as teacher2 and check eleves assigned to teacher2
        self.client.credentials( )
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {teachertest2_token}')
        debug_print( "teachertest2 _get_eleve_list")
        response = self.api_util._get_eleve_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print( response.data)
        self.assertEqual(len(response.data), 1)  # Check teacher2 has 1 eleve

        self.client.credentials( )
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')

        

        response = self.api_util._delete_eleve( eleve1['id'] )
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Eleve.objects.filter(id=eleve1['id'] ).exists())


    def _validate_eleve_data(self, data, expected_nom, expected_prenom, expected_datenaissance, expected_professeurs_details):

        debug_print( expected_professeurs_details)
        self.assertEqual(len(expected_professeurs_details), 1)  # Check teacher2 has 1 eleve


        self.assertIn("datenaissance", data)
        self.assertEqual(data['datenaissance'], expected_datenaissance)
        self.assertEqual(data['nom'], expected_nom)
        self.assertEqual(data['prenom'], expected_prenom)
        
        # Validate the 'professeurs_details' field instead of 'professeurs'
        self.assertIn("professeurs_details", data)
        
        # Extract IDs from the expected professeurs for comparison
        expected_professeur_ids = [professeur['id'] for professeur in expected_professeurs_details]
        
        # Validate that the details match
        self.assertEqual([professeur['id'] for professeur in data['professeurs_details']], expected_professeur_ids)

  


    def test_create_pdf_layout(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.api_util._create_pdf_layout(header_icon="icon.png", footer_message="Footer text")
        
        # Debugging prints
        debug_print("Create PDFLayout response status:", response.status_code)
        if response.status_code != 201:
            debug_print("Create PDFLayout response content:", response.content)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_get_pdf_layout(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')
        response = self.api_util._get_pdf_layout_list()
        
        # Debugging prints
        debug_print("Get PDFLayout response status:", response.status_code)
        if response.status_code != 200:
            debug_print("Get PDFLayout response content:", response.content)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_create_score_rule_point(self):
        # Use the admin token to create a ScoreRulePoint
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')

        response = self.api_util._create_score_rule_point(scorelabel="Test Label", score=10, description="Test Description")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        debug_print("test_create_score_rule_point")
        debug_print(response.data)

        # Validate the created object
        self.assertIn("scorelabel", response.data)
        self.assertEqual(response.data['scorelabel'], "Test Label")

    def test_get_score_rule_point_list(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.teacher1_token}')  # Assuming you have a teacher token

        response = self.api_util._get_score_rule_point_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debug_print("test_get_score_rule_point_list")
        debug_print(response.data) 
        value = response.data

        # Optional: Assert that there is at least one score rule point if you have created any
        if value:
            response = self.api_util._get_score_rule_point(value[0]['id'])
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            debug_print("test_get_score_rule_point")
            debug_print(response.data) 



    def test_report_modular_workflow(self):

        
        #global DEBUG
        #DEBUG = True
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}') 

        # Step 1: Create a teacher
        teacher1 = self.api_util._create_user('teachertest1', 'teachertestnewpass', 'New1', 'Teacher', ['teacher']).data 
        response = self.api_util._login_user('teachertest1', 'teachertestnewpass')
        teachertest1_token = response.data['access']
        debug_print("Created teacher:", teacher1['id'])

        # Step 2: Create Eleve using predefined niveau_id
        niveau_id = 2  # Predefined niveau_id
        response = self.api_util._create_eleve(
            nom="Jean", 
            prenom="Valjean", 
            niveau=niveau_id, 
            datenaissance="2015-01-02", 
            professeurs=[teacher1['id']]
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, f"Create Eleve failed: {response.status_code} - {response.content}")
        eleve1 = response.data
        debug_print("Created Eleve ID:", eleve1['id'])

        # Step 3: Set PDF layout and catalogue IDs
        pdflayout_id = 1  # Predefined layout_id
        catalogue_ids = [31]  # Array of catalogue IDs
        debug_print("Using pdflayout_id = 1 and catalogue_ids =", catalogue_ids)

        # Step 4: Teacher login to list reports
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {teachertest1_token}')
        response = self.api_util._get_eleve_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK, f"Get Eleve list failed: {response.status_code} - {response.content}")
        eleve_list = response.data

        # Step 5: Select the created Eleve and retrieve reports
        eleve_id = next((e['id'] for e in eleve_list if e['nom'] == "Jean" and e['prenom'] == "Valjean"), None)
        self.assertIsNotNone(eleve_id, "Eleve was not found in the list.")

        response = self.api_util._get_eleve_report(eleve_id)
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Expected a 200 OK status when no reports exist.")
        self.assertEqual(response.data, [], "Expected an empty list when no reports exist.")

        # Step 6: Create an empty report
        debug_print("Creating report with eleve_id:", eleve1['id'])
        response = self.api_util._create_report(
            eleve_id=eleve1['id'], 
            professeur_id=teacher1['id'], 
            pdflayout_id=pdflayout_id,
            report_catalogues=[]
        )
        debug_print("report", response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, f"Create Report failed: {response.status_code} - {response.content}")
        report_data = response.data
        self.assertIn("eleve", report_data)
        self.assertEqual(report_data['eleve'], eleve1['id'])
        report_id = report_data['id']  # Get the newly created report ID

        # Step 7: Create multiple report catalogues and store their IDs
        report_catalogue_ids = []  # To store created report catalogue IDs
        for catalogue_id in catalogue_ids:
            catalogue_response = self.api_util._create_report_catalogue(report_id=report_id, catalogue_id=catalogue_id)
            debug_print("report_catalogue", catalogue_response.data)
            self.assertEqual(catalogue_response.status_code, status.HTTP_201_CREATED, f"Create Report Catalogue failed: {catalogue_response.status_code} - {catalogue_response.content}")
            report_catalogue_ids.append(catalogue_response.data['id'])  # Store the created report catalogue ID

            # Step 8: Retrieve groupagedata for the current catalogue
            response = self.api_util._get_groupagedata_catalogue(catalogue_id=catalogue_id)
            self.assertEqual(response.status_code, status.HTTP_200_OK, f"_get_groupagedata_catalogue failed: {response.status_code} - {response.content}")
            
            groupage_data_list = response.data
            self.assertGreater(len(groupage_data_list), 0, "Expected to find groupagedata linked to the catalogue.")

            # Step 9: Create Resultat for each GroupageData using the current report_catalogue_id
            for groupage in groupage_data_list:
                item_list = self.api_util._get_item_groupagedata(groupagedata_id=groupage['id']).data
                debug_print("groupagedata_id:", groupage['id'])
                debug_print("_get_item_groupagedata", item_list )
                # Count the number of items
                item_count = len(item_list )  # or use item_list.data['count'] if paginated
                debug_print("Number of items retrieved:", item_count)

                response = self.api_util._create_resultat(
                    report_catalogue_id=report_catalogue_ids[-1],  # Use the last created report_catalogue ID
                    groupage_id=groupage['id'],  # Pass the groupage ID directly
                    score=0,
                    seuil1_percent=100,
                    seuil2_percent=50,
                    seuil3_percent=0
                )
                debug_print("create_resultat", response.data)
                self.assertEqual(response.status_code, status.HTTP_201_CREATED, f"Create Resultat failed: {response.status_code} - {response.content}")
                resultat = response.data

                # Step 10: Create ResultatDetail for each item linked to the groupage
                for item in item_list:
                    response = self.api_util._create_resultat_detail(
                        resultat_id=resultat['id'],
                        item_id=item['id'],
                        score=item['max_score'] / 2,  # Example score calculation
                        scorelabel='A',
                        observation='test observation'
                    )
                    debug_print("create_resultat_detail", response.data)
                    self.assertEqual(response.status_code, status.HTTP_201_CREATED, f"Create ResultatDetail failed: {response.status_code} - {response.content}")
                    
        # Step 11: Validate the Report
        response = self.api_util._get_eleve_report(eleve1['id'])
        self.assertEqual(response.status_code, status.HTTP_200_OK, f"Get Eleve report failed: {response.status_code} - {response.content}")
        report_list = response.data
        self.assertGreater(len(report_list), 0, "Expected at least one report for the Eleve after creation.")
 
 


    def test_full_report_create(self):


        global DEBUG
        DEBUG = False
        ### init test set ################
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}') 

        # Step 1: Create a teacher
        professeur = self.api_util._create_user('teachertest1', 'teachertestnewpass', 'New1', 'Teacher', ['teacher']).data 
        professeur_id = professeur['id']
        response = self.api_util._login_user('teachertest1', 'teachertestnewpass')
        professeur_token = response.data['access']
        pdflayout_id = 1
        debug_print("Created teacher:", professeur_id)

        # Step 2: Create Eleve using predefined niveau_id
        niveau_id = 2  # Predefined niveau_id
        catalogue_ids = [1, 2]  # Example catalogue IDs
        response = self.api_util._create_eleve(
            nom="Jean", 
            prenom="Valjean", 
            niveau=niveau_id, 
            datenaissance="2015-01-02", 
            professeurs=[professeur_id]
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, f"Create Eleve failed: {response.status_code} - {response.content}")
        eleve_id = response.data['id']
        
        # Initialize scorerulepoint_list with all score rules
        response = self.api_util._get_score_rule_point_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        score_rule_point_list = response.data
        debug_print("score_rule_point_list =", score_rule_point_list)

        # Initialize the report data structure
        report_data = {
            "eleve": eleve_id,
            "professeur": professeur_id,
            "pdflayout": pdflayout_id,
            "report_catalogues": []
        }

        ### Step 4: Prepare full report ################
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {professeur_token}')

        for catalogue_id in catalogue_ids: 
            # Assuming _get_groupagedata_catalogue returns already parsed data
            groupagedata_list = self.api_util._get_groupagedata_catalogue(catalogue_id).data
            
            for groupagedata in groupagedata_list:
                # Prepare the resultat details for this groupagedata
                resultat_details = []
                total_score = 0

                debug_print("groupagedata", groupagedata)

                for item in groupagedata['items']:
                    # Get the associated score rule point from the preloaded scorerule_point_list
                    scorerule_points = [srp for srp in score_rule_point_list if srp['scorerule'] == item['scorerule']]
                    
                    if scorerule_points:
                        # Assuming you want the last entry for each scorerule
                        scorerule_point = scorerule_points[-1]  # Fetch the last entry
                        scorelabel = scorerule_point['scorelabel']
                        score = scorerule_point['score']
                    else:
                        # Default score and label in case no match is found (handle as needed)
                        scorelabel = "N/A"
                        score = 0

                    # Create ResultatDetail
                    resultat_detail = {
                        "item": item['id'],
                        "score": score,
                        "scorelabel": scorelabel,
                        "observation": "observation ecrit de la main gauche"
                    }

                    # Append to the resultat details and accumulate total score
                    resultat_details.append(resultat_detail)
                    total_score += score

                # Create Resultat
                resultat_data = {
                    "groupage": groupagedata['id'],
                    "score": total_score,
                    "seuil1_percent": 100,
                    "seuil2_percent": 50,
                    "seuil3_percent": 0,
                    "resultat_details": resultat_details
                }

                # Append Resultat to the report catalogue
                report_catalogue = {
                    "catalogue": catalogue_id,
                    "resultats": [resultat_data]
                }
                report_data['report_catalogues'].append(report_catalogue)

        # Finally, create the report by making an API call
        debug_print("CREATE FULL REPORT", report_data)
        response = self.api_util._create_fullreport(report_data)

        fullreport = response.data
        debug_print("response to CREATE FULL REPORT:", fullreport)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, f"Create Fullreport failed: {response.status_code} - {response.content}")



 
 
    # last methode to see statistiques
    def test_zzz_print_test_statistique(self):
        # Output the call counts
        print("Call count of all tested API ZZ")
        print(self.api_util.get_call_counts())  # Display the counts for debugging


  