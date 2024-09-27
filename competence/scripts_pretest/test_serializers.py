from django.test import TestCase
from competence.serializers import ResultatSerializer
from competence.models import Eleve, Resultat, GroupageData

class ResultatSerializerTest(TestCase):
    def test_resultat_serializer(self):
        eleve = Eleve.objects.create(nom="Doe", prenom="John", classe="5A")
        groupage = GroupageData.objects.create(desc_groupage="Test Groupage")
        resultat = Resultat.objects.create(eleve=eleve, groupage=groupage, score=85)
        
        serializer = ResultatSerializer(resultat)
        data = serializer.data
        
        self.assertEqual(data['eleve']['nom'], "Doe")
        self.assertEqual(data['groupage']['desc_groupage'], "Test Groupage")
