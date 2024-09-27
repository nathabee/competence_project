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
        fields = ['id', 'nom', 'prenom', 'niveau', 'textnote1', 'textnote2', 'textnote3', 'professeurs']


class EleveAnonymizedSerializer(serializers.ModelSerializer):
    professeurs = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Eleve
        fields = ['id', 'niveau', 'textnote1', 'textnote2', 'textnote3', 'professeurs']
        
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
        fields = ['id', 'scorelabel', 'score', 'description']



# Serializer for Catalogue
class CatalogueSerializer(serializers.ModelSerializer):
    niveau_id = serializers.PrimaryKeyRelatedField(
        queryset=Niveau.objects.all(),
        source='niveau'  # Allows the use of niveau_id while creating
    )
    etape_id = serializers.PrimaryKeyRelatedField(
        queryset=Etape.objects.all(),
        source='etape'  # Allows the use of etape_id while creating
    )
    annee_id = serializers.PrimaryKeyRelatedField(
        queryset=Annee.objects.all(),
        source='annee'  # Allows the use of annee_id while creating
    )
    matiere_id = serializers.PrimaryKeyRelatedField(
        queryset=Matiere.objects.all(),
        source='matiere'  # Allows the use of matiere_id while creating
    )

    # Include the nested serializers for read operations
    niveau = NiveauSerializer(read_only=True)
    etape = EtapeSerializer(read_only=True)
    annee = AnneeSerializer(read_only=True)
    matiere = MatiereSerializer(read_only=True)

    class Meta:
        model = Catalogue
        fields = ['id', 'niveau_id', 'etape_id', 'annee_id', 'matiere_id', 'description', 'niveau', 'etape', 'annee', 'matiere']

    def create(self, validated_data):
        return super().create(validated_data)
    

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

 
 
 
 
################################################################################

    # Use the updated ResultatDetailSerializer
class ResultatDetailSerializer(serializers.ModelSerializer):
    eleve = EleveSerializer(read_only=True)
    testdetail = ItemSerializer(read_only=True)  # Include detailed TestDetail info
    professeur = UserSerializer(read_only=True)

    # Include resultat_id instead of the full resultat object to avoid a loop
    resultat_id = serializers.PrimaryKeyRelatedField(read_only=True, source='resultat.id')

    class Meta:
        model = ResultatDetail
        fields = ['id', 'resultat_id', 'eleve', 'testdetail', 'scorelabel', 'observation', 'score', 'professeur']

################################################################################
class ResultatSerializer(serializers.ModelSerializer):
    eleve = EleveSerializer(read_only=True)
    eleve_id = serializers.PrimaryKeyRelatedField(
        queryset=Eleve.objects.all(),
        source='eleve',
    )
    groupage_id = serializers.PrimaryKeyRelatedField(
        queryset=GroupageData.objects.all(),
        source='groupage',
    )
    groupage = GroupageDataSerializer(read_only=True)
    professeur = UserSerializer(read_only=True)
    professeur_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),  
        source='professeur',
    )

    # Use the updated ResultatDetailSerializer
    resultat_details = ResultatDetailSerializer(many=True, read_only=True, source='resultatdetail_set')

    class Meta:
        model = Resultat
        fields = ['id', 'eleve', 'eleve_id', 'groupage_id', 'groupage', 'score', 'seuil1_percent', 'seuil2_percent', 'seuil3_percent', 'professeur', 'professeur_id', 'resultat_details']

    def create(self, validated_data):
        resultat_details_data = validated_data.pop('resultatdetail_set', [])
        resultat = Resultat.objects.create(**validated_data)
        for detail_data in resultat_details_data:
            ResultatDetail.objects.create(resultat=resultat, **detail_data)  # Link detail to the newly created resultat
        return resultat
