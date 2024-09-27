from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User, Group

class AuthPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.group = Group.objects.create(name='teacher')
        self.user.groups.add(self.group)

        # Login as the user and create a JWT token
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_login(self):
        login_response = self.client.login(username='testuser', password='testpass')
        self.assertTrue(login_response)

    def test_get_protected_resource(self):
        url = reverse('protected-endpoint')  # Adjust with your protected endpoint URL
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
