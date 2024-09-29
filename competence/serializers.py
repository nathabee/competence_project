from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,PDFLayout,
    Item, Resultat, ResultatDetail, ScoreRule, ScoreRulePoint, Report, ReportCatalogue
)

from rest_framework import serializers
from django.contrib.auth.models import User, Group

class UserSerializer(serializers.ModelSerializer):
    roles = serializers.ListField(child=serializers.CharField(), write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'roles', 'password']

    def get_roles(self, obj):
        return [group.name for group in obj.groups.all()]

    def create(self, validated_data):
        roles = validated_data.pop('roles', [])
        password = validated_data.pop('password')  # Ensure password is popped
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Assign groups based on roles
        for role in roles:
            group, created = Group.objects.get_or_create(name=role)
            user.groups.add(group)  # Add user to the group

        return user



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
    
 

class CatalogueDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catalogue
        fields = ['description']


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




class PDFLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFLayout
        fields = ['id', 'header_icon', 'footer_message']  # Include necessary fields



class ReportCatalogueSerializer(serializers.ModelSerializer):
    report = serializers.PrimaryKeyRelatedField(queryset=Report.objects.all())
    catalogue_desc = CatalogueDescriptionSerializer(read_only=True)  # Use the lightweight serializer

    class Meta:
        model = ReportCatalogue
        fields = ['id', 'report', 'catalogue_desc']

 
class ReportSerializer(serializers.ModelSerializer):
    eleve = serializers.StringRelatedField()  
    professeur = serializers.StringRelatedField()  
    report_catalogues = ReportCatalogueSerializer(many=True, read_only=True)  # Read-only for now.

    class Meta:
        model = Report
        fields = ['id', 'eleve', 'professeur', 'report_catalogues']

    def create(self, validated_data):
        report_catalogues_data = validated_data.pop('report_catalogues')
        report = Report.objects.create(**validated_data)

        for catalogue_data in report_catalogues_data:
            ReportCatalogue.objects.create(report=report, **catalogue_data)

        return report




 
# Serializer for Resultat 

class ResultatSerializer(serializers.ModelSerializer):
    groupage_label = serializers.CharField(write_only=True)
    groupage = GroupageDataSerializer(read_only=True)
    report_catalogue = serializers.PrimaryKeyRelatedField(queryset=ReportCatalogue.objects.all())

    class Meta:
        model = Resultat
        fields = ['id', 'report_catalogue', 'groupage', 'groupage_label', 'score', 'seuil1_percent', 'seuil2_percent', 'seuil3_percent']

    def create(self, validated_data):
        groupage_label = validated_data.pop('groupage_label')
        groupage = GroupageData.objects.get(label_groupage=groupage_label)
        return Resultat.objects.create(groupage=groupage, **validated_data)


# Serializer for ResultatDetail 


class ResultatDetailSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    resultat = serializers.PrimaryKeyRelatedField(queryset=Resultat.objects.all())

    class Meta:
        model = ResultatDetail
        fields = ['id', 'observation', 'score', 'scorelabel', 'item', 'resultat']

