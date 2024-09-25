from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,
    Item, Resultat, ResultatDetail, ScoreRule, ScoreRulePoint
)


 
class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'roles']

    def get_roles(self, obj):
        roles = [group.name for group in obj.groups.all()]  # Get all group names for the user
        return roles


# Serializer for Eleve (Student)
class EleveSerializer(serializers.ModelSerializer):
    professeurs = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Eleve
        fields = ['id', 'nom', 'prenom', 'classe', 'textnote1', 'textnote2', 'textnote3', 'professeurs']


class EleveAnonymizedSerializer(serializers.ModelSerializer):
    professeurs = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Eleve
        fields = ['id', 'classe', 'textnote1', 'textnote2', 'textnote3', 'professeurs']
        
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


# Serializer for ScoreRule
class ScoreRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreRule
        fields = ['id', 'description']


# Serializer for ScoreRulePoint
class ScoreRulePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreRulePoint
        fields = ['id', 'resultat', 'score', 'description']


# Serializer for Catalogue
class CatalogueSerializer(serializers.ModelSerializer):
    niveau = NiveauSerializer(read_only=True)
    etape = EtapeSerializer(read_only=True)
    annee = AnneeSerializer(read_only=True)
    matiere = MatiereSerializer(read_only=True)

    class Meta:
        model = Catalogue
        fields = ['id', 'niveau', 'etape', 'annee', 'matiere', 'description']


# Serializer for GroupageData
class GroupageDataSerializer(serializers.ModelSerializer):
    catalogue = CatalogueSerializer(read_only=True)  # Include detailed Catalogue info

    class Meta:
        model = GroupageData 
        fields = ['id', 'catalogue', 'position', 'desc_groupage', 'label_groupage', 'max_point', 'seuil1', 'seuil2', 'max_item', 'link']


# Serializer for Item
class ItemSerializer(serializers.ModelSerializer):
    groupagedata = GroupageDataSerializer(read_only=True)  # Include detailed GroupageData info
    scorerule = ScoreRuleSerializer(read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'groupagedata', 'temps', 'description', 'observation', 'scorerule', 'max_score', 'itempos', 'link']


# Serializer for Resultat
 
 

class ResultatSerializer(serializers.ModelSerializer):
    eleve_nom = serializers.CharField(write_only=True)  # Input by name
    groupage_label = serializers.CharField(write_only=True)  # Input by label
    eleve = EleveSerializer(read_only=True)  # Read-only
    groupage = GroupageDataSerializer(read_only=True)  # Read-only
    professeur = UserSerializer(read_only=True)


    class Meta:
        model = Resultat
        fields = ['id', 'eleve', 'eleve_nom', 'groupage', 'groupage_label', 'score', 'resultat', 'seuil1_percent', 'seuil2_percent', 'seuil3_percent', 'professeur']

    def create(self, validated_data):
        eleve_name = validated_data.pop('eleve_nom')
        groupage_label = validated_data.pop('groupage_label')
        
        # Retrieve related objects based on provided names
        eleve = Eleve.objects.get(nom=eleve_name)
        groupage = GroupageData.objects.get(label_groupage=groupage_label)
        
        # Create the Resultat object
        return Resultat.objects.create(
            eleve=eleve,
            groupage=groupage,
            **validated_data
        )


# Serializer for ResultatDetail
class ResultatDetailSerializer(serializers.ModelSerializer):
    eleve = EleveSerializer(read_only=True)
    testdetail = ItemSerializer(read_only=True)  # Include detailed TestDetail info
    professeur = UserSerializer(read_only=True)

    class Meta:
        model = ResultatDetail
        fields = ['id', 'eleve', 'testdetail', 'resultat', 'observation', 'score', 'professeur']
