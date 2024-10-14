from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import (
    Niveau, Etape, Annee, Matiere, Eleve, Catalogue, GroupageData,PDFLayout,
    Item, Resultat, ResultatDetail, ScoreRule, ScoreRulePoint, Report, ReportCatalogue
)

from rest_framework import serializers  
from django.utils import timezone
import base64
#from django.core.files.base import ContentFile
 

 
 

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
    # Automatically assign professeurs for non-admin users
    professeurs = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name='teacher'),
        many=True,
        write_only=True,
        required=False  # This field will not be required for teacher creation
    )

    professeurs_details = UserSerializer(many=True, read_only=True, source='professeurs')

    # For create/update, we use the niveau ID
    niveau = serializers.PrimaryKeyRelatedField(queryset=Niveau.objects.all())

    # For retrieve (GET), we show only the niveau.niveau as a string
    niveau_niveau = serializers.CharField(source='niveau.niveau', read_only=True)

    class Meta:
        model = Eleve
        fields = ['id', 'nom', 'prenom', 'niveau','niveau_niveau', 'datenaissance', 'professeurs', 'professeurs_details']

    def create(self, validated_data):
        # If professeurs are provided (Admin case), pop them out of the validated_data
        professeurs = validated_data.pop('professeurs', None)
        
        # Create the Eleve object
        eleve = Eleve.objects.create(**validated_data)

        # If professeurs are passed (Admin), set them
        if professeurs:
            eleve.professeurs.set(professeurs)
        else:
            # For teachers, automatically assign the current user (teacher)
            request = self.context.get('request', None)
            if request and request.user.groups.filter(name='teacher').exists():
                eleve.professeurs.set([request.user])

        return eleve


    def update(self, instance, validated_data):
        # Get professeurs if available for admins
        professeurs = validated_data.pop('professeurs', None)

        # Update instance fields
        instance.nom = validated_data.get('nom', instance.nom)
        instance.prenom = validated_data.get('prenom', instance.prenom)
        instance.niveau = validated_data.get('niveau', instance.niveau)  # Use ID for niveau
        instance.datenaissance = validated_data.get('datenaissance', instance.datenaissance)

        if professeurs:
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
        fields = ['id', 'catalogue', 'groupage_icon',  'catalogue_id', 
                  'position', 'desc_groupage', 'label_groupage', 'link', 'max_point', 
                  'seuil1', 'seuil2', 'max_item', 'items']
        extra_kwargs = {
            'groupage_icon': {'read_only': True},  # Make groupage_icon read-only
        }

 

    
class PDFLayoutSerializer(serializers.ModelSerializer):
    header_icon_base64 = serializers.SerializerMethodField()

    class Meta:
        model = PDFLayout
        fields = ['id', 'header_icon', 'header_icon_base64', 'schule_name', 'header_message', 'footer_message1', 'footer_message2']
        extra_kwargs = {
            'header_icon': {'read_only': True},  # Make header_icon read-only
        }

    def get_header_icon_base64(self, obj):
        if obj.header_icon:
            with open(obj.header_icon.path, 'rb') as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                return f'data:image/png;base64,{encoded_string}'
        return None
 

 


class ResultatDetailSerializer(serializers.ModelSerializer):
    item_id = serializers.IntegerField(write_only=True, required=False)  # Only for update (foreign key)

    class Meta:
        model = ResultatDetail
        fields = ['id', 'item','item_id', 'score', 'scorelabel', 'observation']  
        extra_kwargs = {
            'id': {'read_only': False},  # Allow ID to be included for updates
            'item': {'read_only': True},  # Prevent updating the full item once created
            'score': {'default': -1},
            'scorelabel': {'default': '?'},
            'observation': {'default': ''},
        }
        depth = 1  # Automatically include related Item details

    def create(self, validated_data):
        # 'item' is expected to be an object for creation
        if 'item' not in validated_data:
            raise serializers.ValidationError({"item": "This field is required."})
        return ResultatDetail.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Handle the `item_id` only if it's provided, for PATCH operations
        # Update other fields if provided
        instance.score = validated_data.get('score', instance.score)
        instance.scorelabel = validated_data.get('scorelabel', instance.scorelabel)
        instance.observation = validated_data.get('observation', instance.observation)
        instance.save()
        return instance



class ResultatSerializer(serializers.ModelSerializer):
    resultat_details = ResultatDetailSerializer(many=True)
    groupage = GroupageDataSerializer()  

    class Meta:
        model = Resultat
        fields = ['id', 'groupage', 'score', 'seuil1_percent', 'seuil2_percent', 'seuil3_percent', 'resultat_details']
        extra_kwargs = {
            'id': {'read_only': False},  # Allow ID to be included for updates
            'score': {'default': -1},  # Default score on creation
            'seuil1_percent': {'default': -1},  # Default value on creation, to be updated later
            'seuil2_percent': {'default': -1},  # Default value on creation, to be updated later
            'seuil3_percent': {'default': -1},  # Default value on creation, to be updated later
        }
        depth = 1  # To automatically include related Item details

    def create(self, validated_data):
        resultat_details_data = validated_data.pop('resultat_details', [])
        resultat = Resultat.objects.create(**validated_data)

        for detail_data in resultat_details_data:
            ResultatDetail.objects.create(resultat=resultat, **detail_data)

        return resultat


    def update(self, instance, validated_data):
        instance.groupage = validated_data.get('groupage', instance.groupage)
        instance.save()  # Save the updated instance

        # Update ResultatDetails without expecting them in the payload
        resultat_details_data = validated_data.pop('resultat_details', [])
        existing_details_ids = {detail.id for detail in instance.resultat_details.all()}

        for detail_data in resultat_details_data:
            detail_id = detail_data.get('id')
            if detail_id in existing_details_ids:
                # Update existing ResultatDetail
                resultat_detail = ResultatDetail.objects.get(id=detail_id)
                resultat_detail.score = detail_data.get('score', resultat_detail.score)
                resultat_detail.scorelabel = detail_data.get('scorelabel', resultat_detail.scorelabel)
                resultat_detail.observation = detail_data.get('observation', resultat_detail.observation)
                resultat_detail.save()
            else:
                # Create new ResultatDetail if no ID is provided
                ResultatDetail.objects.create(resultat=instance, **detail_data)

        # After updating all details, recalculate the score and thresholds
        self.update_score_and_thresholds(instance)

        return instance

    def update_score_and_thresholds(self, resultat):
        """Calculate and update the score and thresholds based on ResultatDetails and GroupageData."""

        # Check if any ResultatDetail has scorelabel = "?"
        if resultat.resultat_details.filter(scorelabel="?").exists():
            # Set default values when at least one test is not performed
            resultat.score = -1
            resultat.seuil1_percent = -1
            resultat.seuil2_percent = -1
            resultat.seuil3_percent = -1
            resultat.save()  # Save the updated Resultat instance
            return  # Exit the function early
        

        # Calculate total score from all associated ResultatDetails
        total_score = sum(detail.score for detail in resultat.resultat_details.all())
        
        # Update the score field
        resultat.score = total_score
        
        # Retrieve the associated GroupageData
        groupage_data = GroupageData.objects.get(id=resultat.groupage.id)

        # Get threshold values
        seuil1 = groupage_data.seuil1
        seuil2 = groupage_data.seuil2
        max_point = groupage_data.max_point

        # Calculate threshold percentages
        if total_score <= seuil1:
            resultat.seuil1_percent = (total_score / seuil1) * 100 if seuil1 > 0 else 0
            resultat.seuil2_percent = 0  # No score above seuil1, so set to 0
            resultat.seuil3_percent = 0  # No score above seuil2, so set to 0
        elif total_score <= seuil2:
            resultat.seuil1_percent = 100  # Achieved threshold 1
            resultat.seuil2_percent = ((total_score - seuil1) / (seuil2 - seuil1)) * 100 if seuil2 > seuil1 else 0
            resultat.seuil3_percent = 0  # No score above seuil2, so set to 0
        else:  # total_score > seuil2
            resultat.seuil1_percent = 100  # Achieved threshold 1
            resultat.seuil2_percent = 100  # Achieved threshold 2
            resultat.seuil3_percent = ((total_score - seuil2) / (max_point - seuil2)) * 100 if max_point > seuil2 else 0

        # Save the updated Resultat instance
        resultat.save()


class ReportCatalogueSerializer(serializers.ModelSerializer):
    resultats = ResultatSerializer(many=True)
    
    # Use CatalogueDescriptionSerializer for GET requests (nested read)
    catalogue = CatalogueDescriptionSerializer(read_only=True)

    class Meta:
        model = ReportCatalogue
        fields = ['id', 'catalogue', 'resultats']
        extra_kwargs = {
            'id': {'read_only': False},  # Allow ID to be included for updates
        }
        depth = 0  # No automatic depth, we handle it manually

    def create(self, validated_data):
        resultats_data = validated_data.pop('resultats', [])
        catalogue_id = validated_data.pop('catalogue_id')
        report_catalogue = ReportCatalogue.objects.create(catalogue_id=catalogue_id, **validated_data)

        for resultat_data in resultats_data:
            Resultat.objects.create(report_catalogue=report_catalogue, **resultat_data)

        return report_catalogue
 
    def update(self, instance, validated_data):
        # No need to save the `ReportCatalogue` instance as we are not updating it
        # Instead, focus on updating the nested `Resultats` and their `ResultatDetails`
        
        resultats_data = validated_data.pop('resultats', [])
        existing_resultats = {resultat.id: resultat for resultat in instance.resultats.all()}  # Preload existing Resultats

        for resultat_data in resultats_data:
            resultat_id = resultat_data.get('id')
            if resultat_id in existing_resultats:
                # Update existing Resultat
                resultat = existing_resultats[resultat_id]
                for attr, value in resultat_data.items():
                    if attr == "resultat_details":  # Handle reverse relation for ResultatDetails
                        # Use the ResultatSerializer to update the nested ResultatDetails
                        detail_serializer = ResultatSerializer(resultat, data=resultat_data, partial=True)
                        if detail_serializer.is_valid():
                            detail_serializer.save()
                        else:
                            raise serializers.ValidationError(detail_serializer.errors)
                    else:
                        setattr(resultat, attr, value)
                resultat.save()  # Save the updated Resultat
            else:
                # Create new Resultat if no ID is provided
                Resultat.objects.create(report_catalogue=instance, **resultat_data)

        return instance


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
        # Handle the case for updating the report, but avoid updating ReportCatalogue itself
        report_catalogues_data = validated_data.pop('report_catalogues_data', [])

        # Update standard fields for the Report
        instance.eleve = validated_data.get('eleve', instance.eleve)
        instance.professeur = validated_data.get('professeur', instance.professeur)
        instance.pdflayout = validated_data.get('pdflayout', instance.pdflayout)
        instance.save()

        # Iterate through provided ReportCatalogues data to update the nested Resultats, but avoid updating the ReportCatalogue
        for reportcatalogue_data in report_catalogues_data:
            reportcatalogue_id = reportcatalogue_data.get('id')  # Get the ReportCatalogue ID

            if reportcatalogue_id:  # Ensure we have a catalogue_id in the data
                try:
                    # Retrieve the existing ReportCatalogue instance related to the current report
                    report_catalogue = ReportCatalogue.objects.get(id=reportcatalogue_id, report=instance)

                    # Now handle nested Resultats for this ReportCatalogue
                    resultats_data = reportcatalogue_data.get('resultats', [])
                    for resultat_data in resultats_data:
                        resultat_id = resultat_data.get('id')  # Get the Resultat ID

                        if resultat_id:  # Ensure we have a Resultat ID
                            try:
                                # Retrieve the existing Resultat instance related to this ReportCatalogue
                                resultat = Resultat.objects.get(id=resultat_id, report_catalogue=report_catalogue)

                                # Update the Resultat instance
                                resultat_serializer = ResultatSerializer(resultat, data=resultat_data, partial=True)
                                if resultat_serializer.is_valid(raise_exception=True):
                                    resultat_serializer.save()

                            except Resultat.DoesNotExist:
                                raise serializers.ValidationError(f"Resultat with id {resultat_id} does not exist.")
                
                except ReportCatalogue.DoesNotExist:
                    raise serializers.ValidationError(f"ReportCatalogue with id {reportcatalogue_id} does not exist.")
        
        return instance

    def validate(self, attrs):
        # Custom validation to ensure required fields for updates
        if 'report_catalogues_data' in attrs and not attrs['report_catalogues_data']:
            raise serializers.ValidationError({"report_catalogues_data": "This field is required for updates."})

        # Ensure each catalogue_data has an id
        report_catalogues_data = attrs.get('report_catalogues_data', [])
        for report_catalogue_data in report_catalogues_data:
            if 'id' not in report_catalogue_data:
                raise serializers.ValidationError({"id": "This field is required for each report_catalogue_data."})

        return super().validate(attrs)

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