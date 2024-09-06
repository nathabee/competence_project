from rest_framework import serializers
from .models import Eleve, Resultat, Niveau, Etape, Annee, Catalogue, Item
from django.contrib.auth.models import User

# Serializer for User (Professeur)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

# Serializer for Eleve (Student)
class EleveSerializer(serializers.ModelSerializer):
    professeurs = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Eleve
        fields = ['id', 'nom', 'prenom', 'classe', 'textnote1', 'textnote2', 'textnote3', 'professeurs']

# Serializer for Resultat
class ResultatSerializer(serializers.ModelSerializer):
    eleve = EleveSerializer(read_only=True)
    catalogue = serializers.StringRelatedField(read_only=True)
    item = serializers.StringRelatedField(read_only=True)
    professeur = UserSerializer(read_only=True)

    class Meta:
        model = Resultat
        fields = ['id', 'eleve', 'catalogue', 'item', 'score', 'seuil1_percent', 'seuil2_percent', 'seuil3_percent', 'professeur']

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

# Serializer for Catalogue
class CatalogueSerializer(serializers.ModelSerializer):
    niveau = NiveauSerializer(read_only=True)
    etape = EtapeSerializer(read_only=True)
    annee = AnneeSerializer(read_only=True)

    class Meta:
        model = Catalogue
        fields = ['id', 'niveau', 'etape', 'annee', 'matiere', 'description']

# Serializer for Item
class ItemSerializer(serializers.ModelSerializer):
    catalogue = CatalogueSerializer(read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'catalogue', 'position', 'description', 'link', 'total', 'seuil1', 'seuil2']
