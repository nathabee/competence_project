from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,
    Item, Resultat, ResultatDetail, Matiere, ScoreRule, ScoreRulePoint
)

# Serializer for User (Professeur) 
class UserSerializer(serializers.ModelSerializer):
    schoolName = serializers.CharField(source='profile.schoolName', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'schoolName']


# Serializer for Eleve (Student)
class EleveSerializer(serializers.ModelSerializer):
    professeurs = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Eleve
        fields = ['id', 'nom', 'prenom', 'classe', 'textnote1', 'textnote2', 'textnote3', 'professeurs']

# Serializer for Niveau
class NiveauSerializer(serializers.ModelSerializer):
    class Meta:
        model = Niveau
        fields = ['id', 'niveau', 'description']

# Serializer for Etape
class EtapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etape
        fields = ['id', 'etape', 'description']

# Serializer for Annee
class AnneeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annee
        fields = ['id', 'annee', 'description']


# Serializer for Matiere
class MatiereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matiere
        fields = ['id', 'matiere', 'description']


# Serializer for Matiere
class ScoreRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreRule
        fields = ['id', 'description']

# Serializer for Matiere
class ScoreRulePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreRulePoint
        fields = ['id', 'resultat', 'score',  'description']


# Serializer for Catalogue
class CatalogueSerializer(serializers.ModelSerializer):
    niveau = NiveauSerializer(read_only=True)
    etape = EtapeSerializer(read_only=True)
    annee = AnneeSerializer(read_only=True)

    class Meta:
        model = Catalogue
        fields = ['id', 'niveau', 'etape', 'annee', 'matiere', 'description']

# Serializer for GroupageData
class GroupageDataSerializer(serializers.ModelSerializer):
    catalogue = CatalogueSerializer(read_only=True)  # Include detailed Catalogue info

    class Meta:
        model = GroupageData
        fields = ['id', 'catalogue', 'position', 'desc_groupage', 'label_groupage', 'max_point', 'seuil1', 'seuil2', 'max_item', 'matiere','link']

# Serializer for Item
class ItemSerializer(serializers.ModelSerializer):
    item = GroupageDataSerializer(read_only=True)  # Include detailed GroupageData info

    class Meta:
        model = Item
        fields = ['id', 'groupage', 'temps', 'description', 'observation', 'scorerule', 'max_score',  'itempos', 'link']
 
 
  
 
class ResultatSerializer(serializers.ModelSerializer):
    eleve = EleveSerializer(read_only=True)
    catalogue = CatalogueSerializer(read_only=True)
    groupage = GroupageDataSerializer(read_only=True)
    professeur = UserSerializer(read_only=True)

    class Meta:
        model = Resultat
        fields = ['id', 'eleve', 'groupage', 'score', 'seuil1_percent', 'seuil2_percent', 'seuil3_percent', 'professeur']



# Serializer for ResultatDetail
class ResultatDetailSerializer(serializers.ModelSerializer):
    eleve = EleveSerializer(read_only=True)
    item = ItemSerializer(read_only=True)  # Include detailed TestDetail info
    professeur = UserSerializer(read_only=True)

    class Meta:
        model = ResultatDetail
        fields = ['id', 'eleve', 'testdetail', 'resultat', 'observation', 'score', 'professeur']
