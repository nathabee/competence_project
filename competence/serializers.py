from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,PDFLayout,
    Item, Resultat, ResultatDetail, ScoreRule, ScoreRulePoint, Report, ReportCatalogue
)

from rest_framework import serializers  

 

 
 

class UserSerializer(serializers.ModelSerializer):
    roles = serializers.ListField(child=serializers.CharField(), write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'roles', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        roles = validated_data.pop('roles', [])
        password = validated_data.pop('password')  # Extract the password
        user = User(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()

        # Assign the user to the specified roles (groups)
        for role in roles:
            group, created = Group.objects.get_or_create(name=role)
            user.groups.add(group)

        return user

    def to_representation(self, instance):
        """Modify the output to include the user's groups as roles."""
        rep = super().to_representation(instance)
        rep['roles'] = [group.name for group in instance.groups.all()]
        return rep
    

class EleveSerializer(serializers.ModelSerializer):
    # Only used for creation and updating
    professeurs = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name='teacher'),  # Only teachers can be professeurs
        many=True,  # Allow multiple professors
        write_only=True  # This field is only writable for creation and updating
    )

    # To serialize the professors back to the response
    professeurs_details = UserSerializer(many=True, read_only=True, source='professeurs')

    class Meta:
        model = Eleve
        fields = ['id', 'nom', 'prenom', 'niveau', 'datenaissance', 'professeurs', 'professeurs_details']  # Include all fields

    def create(self, validated_data):
        professeurs = validated_data.pop('professeurs', [])  # Get the professors list or empty list
        eleve = Eleve.objects.create(**validated_data)
        eleve.professeurs.set(professeurs)  # Assign professors
        return eleve
    

    def update(self, instance, validated_data):
        # (set(professeurs)) replaces the entire professor list with whatever is provided in the request.
        professeurs = validated_data.pop('professeurs', None)  # Get the professeurs if provided
        instance.nom = validated_data.get('nom', instance.nom)
        instance.prenom = validated_data.get('prenom', instance.prenom)
        instance.niveau = validated_data.get('niveau', instance.niveau)
        instance.datenaissance = validated_data.get('datenaissance', instance.datenaissance)

        if professeurs is not None:
            # Replace the current professors with the provided list
            instance.professeurs.set(professeurs)  # Replace the professors list with the new list

        instance.save()  # Save the instance after making changes
        return instance



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

# Serializer for Item
class ItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Item
        fields = ['id', 'temps', 'description', 'observation', 'scorerule', 'max_score', 'itempos', 'link']

# Serializer for GroupageData, including the nested items
class GroupageDataSerializer(serializers.ModelSerializer): 
    items = ItemSerializer(many=True, read_only=True, source='item_set')  

    class Meta:
        model = GroupageData
        fields = ['id', 'catalogue', 'catalogue_id', 'position', 'desc_groupage', 'label_groupage', 'link', 'max_point', 'seuil1', 'seuil2', 'max_item', 'items']




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

