from django.test import TestCase
from django.contrib.auth.models import User, Group
from competence.models import Eleve, Catalogue, GroupageData, Resultat

class IntegrationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.eleve = Eleve.objects.create(nom='John', prenom='Doe', classe='CP')
        self.catalogue = Catalogue.objects.create(description="Test Catalogue")
        self.groupage = GroupageData.objects.create(
            catalogue=self.catalogue, position=1, desc_groupage='Test Groupage'
        )
        self.resultat = Resultat.objects.create(eleve=self.eleve, groupage=self.groupage, score=75)

    def test_resultat_creation(self):
        self.assertIsNotNone(self.resultat.id)

    def test_groupage_creation(self):
        self.assertIsNotNone(self.groupage.id)
