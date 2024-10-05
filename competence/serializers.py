from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,PDFLayout,
    Item, Resultat, ResultatDetail, ScoreRule, ScoreRulePoint, Report, ReportCatalogue
)

from rest_framework import serializers  
from django.utils import timezone

 

 
 

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
    professeurs = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name='teacher'),  
        many=True,  
        write_only=True  
    )

    professeurs_details = UserSerializer(many=True, read_only=True, source='professeurs')

    # Update niveau to be a ForeignKey
    niveau = serializers.PrimaryKeyRelatedField(
        queryset=Niveau.objects.all(),  # Make sure you have access to all Niveau instances
    )

    class Meta:
        model = Eleve
        fields = ['id', 'nom', 'prenom', 'niveau', 'datenaissance', 'professeurs', 'professeurs_details'] 

    def create(self, validated_data):
        professeurs = validated_data.pop('professeurs', [])  
        eleve = Eleve.objects.create(**validated_data)
        eleve.professeurs.set(professeurs)  
        return eleve

    def update(self, instance, validated_data):
        professeurs = validated_data.pop('professeurs', None)  
        instance.nom = validated_data.get('nom', instance.nom)
        instance.prenom = validated_data.get('prenom', instance.prenom)
        instance.niveau = validated_data.get('niveau', instance.niveau)
        instance.datenaissance = validated_data.get('datenaissance', instance.datenaissance)

        if professeurs is not None:
            instance.professeurs.set(professeurs)  

        instance.save()  
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
    start_date = serializers.DateField(input_formats=['%Y-%m-%d' ], required=False)
    stop_date = serializers.DateField(input_formats=['%Y-%m-%d'], required=False)

    class Meta:
        model = Annee
        fields = ['id', 'is_active', 'start_date', 'stop_date', 'description']
        
    def perform_create(self, serializer):
        # If start_date is None, set it to today
        if not serializer.validated_data.get('start_date'):
            serializer.validated_data['start_date'] = timezone.now().date()
        serializer.save()

    def validate(self, attrs):
        is_active = attrs.get('is_active')
        start_date = attrs.get('start_date')
        stop_date = attrs.get('stop_date')

        if is_active and stop_date is not None:
            raise serializers.ValidationError("stop_date must be None if is_active is True.")

        if start_date and stop_date:
            if stop_date < start_date:
                raise serializers.ValidationError("stop_date must be after start_date.")

        return attrs

 

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
        fields = ['id', 'scorerule', 'scorelabel', 'score', 'description']

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
        fields = ['id','description']

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

 


class GroupageDataDescriptionSerializer(serializers.ModelSerializer): 
    class Meta:
        model = GroupageData
        fields = ['id', 'catalogue_id', 'position', 'desc_groupage', 'label_groupage', 'link', 'max_point', 'seuil1', 'seuil2', 'max_item']



class PDFLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFLayout
        fields = ['id', 'header_icon', 'footer_message']  # Include necessary fields


class ResultatDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultatDetail
        fields = ['id', 'item', 'score', 'scorelabel', 'observation']
        extra_kwargs = {
            'id': {'read_only': True},
            'score': {'default': -1},
            'scorelabel': {'default': '?'},
            'observation': {'default': ''},
        }
        depth = 1  # To automatically include related Item details




class ResultatSerializer(serializers.ModelSerializer):
    resultat_details = ResultatDetailSerializer(many=True)

    class Meta:
        model = Resultat
        fields = ['id', 'groupage', 'score', 'seuil1_percent', 'seuil2_percent', 'seuil3_percent', 'resultat_details']
        extra_kwargs = {
            'id': {'read_only': True},
            'score': {'default': -1},
            'seuil1_percent': {'default': -1},
            'seuil2_percent': {'default': -1},
            'seuil3_percent': {'default': -1},
        }
        depth = 1  # To automatically include related Item details

    def create(self, validated_data):
        resultat_details_data = validated_data.pop('resultat_details')
        resultat = Resultat.objects.create(**validated_data)

        for detail_data in resultat_details_data:
            ResultatDetail.objects.create(resultat=resultat, **detail_data)

        return resultat



 

class ReportCatalogueSerializer(serializers.ModelSerializer):
    resultats = ResultatSerializer(many=True)
    
    # Use CatalogueDescriptionSerializer for GET requests (nested read)
    catalogue = CatalogueDescriptionSerializer(read_only=True)

    class Meta:
        model = ReportCatalogue
        fields = ['id', 'catalogue', 'resultats']
        extra_kwargs = {
            'id': {'read_only': True},
        }
        depth = 0  # No automatic depth, we handle it manually

    def create(self, validated_data):
        resultats_data = validated_data.pop('resultats')
        # Ensure that the catalogue is handled via the foreign key ID on creation
        catalogue_id = validated_data.pop('catalogue_id')
        report_catalogue = ReportCatalogue.objects.create(
            catalogue_id=catalogue_id, **validated_data)

        for resultat_data in resultats_data:
            Resultat.objects.create(report_catalogue=report_catalogue, **resultat_data)

        return report_catalogue


### must see if i use this....

class ReportSerializer(serializers.ModelSerializer):
    eleve = serializers.PrimaryKeyRelatedField(queryset=Eleve.objects.all())
    professeur = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    report_catalogues = ReportCatalogueSerializer(many=True)  # Allow nested creation of ReportCatalogues
    created_at = serializers.DateTimeField(read_only=True)  # Automatically set by the database
    updated_at = serializers.DateTimeField(read_only=True)  # Automatically set by the database

    class Meta:
        model = Report
        fields = ['id', 'eleve', 'professeur', 'pdflayout', 'report_catalogues', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Remove report_catalogues from validated_data if it's not provided
        report_catalogues_data = validated_data.pop('report_catalogues', [])

        # Create the Report first
        report = Report.objects.create(**validated_data)

        # Now create each ReportCatalogue with the newly created report
        for catalogue_data in report_catalogues_data:
            # Ensure each catalogue_data has the report reference
            catalogue_data['report'] = report
            ReportCatalogue.objects.create(**catalogue_data)

        return report

 

class FullReportSerializer(serializers.ModelSerializer):
    catalogue_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)  # For creation
    report_catalogues = ReportCatalogueSerializer(many=True, read_only=True)  # For retrieving data
    report_catalogues_data = ReportCatalogueSerializer(many=True, write_only=True, required=False)  # For updates
    eleve = serializers.PrimaryKeyRelatedField(queryset=Eleve.objects.all())
    professeur = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    pdflayout = serializers.PrimaryKeyRelatedField(queryset=PDFLayout.objects.all())

    class Meta:
        model = Report
        fields = ['id', 'eleve', 'professeur', 'pdflayout', 'created_at', 'updated_at', 'catalogue_ids', 'report_catalogues', 'report_catalogues_data']
        read_only_fields = ['created_at', 'updated_at', 'report_catalogues']
        depth = 1  # To automatically include related Item details

    def create(self, validated_data):
        catalogue_ids = validated_data.pop('catalogue_ids', [])
        report = Report.objects.create(**validated_data)

        for catalogue_id in catalogue_ids:
            try:
                catalogue = Catalogue.objects.get(id=catalogue_id)
                report_catalogue = ReportCatalogue.objects.create(report=report, catalogue=catalogue)
                
                # Create Resultats for each ReportCatalogue
                groupages = GroupageData.objects.filter(catalogue=catalogue).order_by('position')
                for groupage in groupages:
                    resultat = Resultat.objects.create(
                        report_catalogue=report_catalogue,
                        groupage=groupage,
                        score=-1,
                        seuil1_percent=-1,
                        seuil2_percent=-1,
                        seuil3_percent=-1
                    )

                    # Create ResultatDetails for each Resultat
                    items = Item.objects.filter(groupagedata=groupage).order_by('itempos')
                    for item in items:
                        ResultatDetail.objects.create(
                            resultat=resultat,
                            item=item,
                            score=-1,
                            scorelabel='?',
                            observation=''
                        )

            except Catalogue.DoesNotExist:
                raise serializers.ValidationError(f"Catalogue with id {catalogue_id} does not exist.")

        return report

    def update(self, instance, validated_data):
        # Handle the case for updating the report
        report_catalogues_data = validated_data.pop('report_catalogues_data', [])
        # Update standard fields
        instance.eleve = validated_data.get('eleve', instance.eleve)
        instance.professeur = validated_data.get('professeur', instance.professeur)
        instance.pdflayout = validated_data.get('pdflayout', instance.pdflayout)
        instance.save()

        # Update or create ReportCatalogues
        for catalogue_data in report_catalogues_data:
            # Assuming each catalogue_data contains a 'catalogue_id' to identify the catalogue
            catalogue_id = catalogue_data.get('catalogue_id')

            if catalogue_id:  # Check if we have a catalogue_id in the data
                try:
                    catalogue = Catalogue.objects.get(id=catalogue_id)
                    # Update or create the ReportCatalogue
                    report_catalogue, created = ReportCatalogue.objects.update_or_create(
                        report=instance,
                        catalogue=catalogue,
                        defaults=catalogue_data
                    )
                    # If it's a new ReportCatalogue, you might want to handle Resultats creation here
                except Catalogue.DoesNotExist:
                    raise serializers.ValidationError(f"Catalogue with id {catalogue_id} does not exist.")

        return instance

    def validate(self, attrs):
        # Custom validation to ensure required fields for updates
        if 'report_catalogues_data' in attrs and not attrs['report_catalogues_data']:
            raise serializers.ValidationError({"report_catalogues_data": "This field is required for updates."})

        # Ensure each catalogue_data has a catalogue_id
        report_catalogues_data = attrs.get('report_catalogues_data', [])
        for catalogue_data in report_catalogues_data:
            if 'catalogue_id' not in catalogue_data:
                raise serializers.ValidationError({"catalogue_id": "This field is required for each report_catalogue_data."})

        return super().validate(attrs)
