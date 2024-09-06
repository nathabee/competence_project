from django.db import models
from django.contrib.auth.models import User
from .config_utils import ConfigCache

# Table: Eleve (Student)
class Eleve(models.Model):
    nom = models.CharField(max_length=100)  # Last name
    prenom = models.CharField(max_length=100)  # First name
    classe = models.CharField(max_length=10)  # Class level (CP, CE1, etc.)
    textnote1 = models.TextField(blank=True, null=True)  # Optional note 1
    textnote2 = models.TextField(blank=True, null=True)  # Optional note 2
    textnote3 = models.TextField(blank=True, null=True)  # Optional note 3
    professeurs = models.ManyToManyField(
        User, related_name='eleves', blank=True
    )  # Many-to-Many relation with Professeurs

    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.classe}"

# Table: Resultat (Evaluation Results)
class Resultat(models.Model):
    eleve = models.ForeignKey(Eleve, on_delete=models.CASCADE)  # Link to Eleve
    catalogue = models.ForeignKey('Catalogue', on_delete=models.CASCADE)  # Link to Catalogue
    item = models.ForeignKey('Item', on_delete=models.CASCADE)  # Link to Item
    score = models.IntegerField()  # Actual score obtained
    seuil1_percent = models.FloatField(default=0.0)  # Percent of Seuil 1 achieved
    seuil2_percent = models.FloatField(default=0.0)  # Percent of Seuil 2 achieved
    seuil3_percent = models.FloatField(default=0.0)  #   threshold 3 percent
    professeur = models.ForeignKey(
        User,
        on_delete=models.SET_DEFAULT,
        default=ConfigCache.get('PROF_ID_DEFAULT', None)  # Use cached default value
    )

    def __str__(self):
        return f"Result for {self.eleve} - {self.item}"

# Table: Niveau (Class Level & Evaluation Stage)
class Niveau(models.Model):
    NIVEAU_CHOICES = [
        ('CP', 'CP'),
        ('E1', 'E1'),
        ('E2', 'E2'),
        ('M1', 'M1'),
        ('M2', 'M2'),
        ('?','?')
    ]

    niveau = models.CharField(max_length=10, choices=NIVEAU_CHOICES,default='?')  # Class level
    description = models.CharField(max_length=30,blank=True, null=True)  # Description

    def __str__(self):
        return f"{self.niveau} - {self.description}"

# Table: Etape (Evaluation Stage)
class Etape(models.Model):
    ETAPE_CHOICES = [
        ('DEBUT', 'DEBUT'),
        ('INTER', 'INTER'),
        ('FINAL', 'FINAL'),
        ('?', '?'),
    ]
    etape = models.CharField(max_length=10, choices=ETAPE_CHOICES,default='?')  # Etape
    description = models.CharField(max_length=30,blank=True, null=True)  # Description

    def __str__(self):
        return f"{self.etape} - {self.description}"

# Table: Annee
class Annee(models.Model):
    annee = models.CharField(max_length=9)  # Year "2024-2025"
    description = models.CharField(max_length=30, blank=True, null=True)  # Description

    def __str__(self):
        return f"{self.annee} - {self.description}"

# Table: Catalogue (Evaluation Catalog)
class Catalogue(models.Model):
    niveau = models.ForeignKey(Niveau, on_delete=models.CASCADE,default=1)  # Link to Niveau
    etape = models.ForeignKey(Etape, on_delete=models.CASCADE,default=1)  # Link to Etape
    annee = models.ForeignKey(Annee, on_delete=models.CASCADE,default=1)  # Link to Annee

    MATIERE_CHOICES = [
        ('MATH', 'MATH'),
        ('FRAN', 'FRAN'),
    ]
    matiere = models.CharField(max_length=4, choices=MATIERE_CHOICES,default='FRAN')  # Subject
    description = models.TextField(blank=True, null=True)  # Description of the catalog

    def __str__(self):
        return f"Catalogue for {self.description}"

# Table: Item (Evaluation Item)
class Item(models.Model):
    catalogue = models.ForeignKey(Catalogue, on_delete=models.CASCADE)  # Link to Catalogue
    position = models.IntegerField( )  # Position in the evaluation
    description = models.TextField(blank=True, null=True)  # Description of the item
    link = models.TextField(blank=True, null=True)  # HTTP link (now nullable)
    total = models.IntegerField()  # Total score for this item
    seuil1 = models.IntegerField()  # Threshold 1 score
    seuil2 = models.IntegerField()  # Threshold 2 score

    def __str__(self):
        return f"Item {self.position} - {self.description}"
