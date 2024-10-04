from django.db import models
from django.contrib.auth.models import User
from .config_utils import ConfigCache
from django.utils import timezone
 
  

# Table: Niveau (Class Level & Evaluation Stage)
class Niveau(models.Model):
    niveau = models.CharField(max_length=10)  # Class level without predefined choices
    description = models.CharField(max_length=30, blank=True, null=True)  # Description

    def __str__(self):
        return f"{self.niveau} - {self.description}"

# Table: Etape (Evaluation Stage)
class Etape(models.Model):
    etape = models.CharField(max_length=10)  # Etape without predefined choices
    description = models.CharField(max_length=30, blank=True, null=True)  # Description

    def __str__(self):
        return f"{self.etape} - {self.description}"
 
 

# Table: Annee
class Annee(models.Model):
    is_active = models.BooleanField(default=False)  # Whether the year is active
    start_date = models.DateField(blank=True, null=True)  # Start date of the academic year
    stop_date = models.DateField(blank=True, null=True)  # Stop date of the academic year
    description = models.CharField(max_length=100, blank=True, null=True)  # Optional description

    def save(self, *args, **kwargs):
        # Set start_date to today's date if it's not provided
        if not self.start_date:
            self.start_date = timezone.now().date()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.start_date.year} - {self.description}"



# Table: Matiere
class Matiere(models.Model):
    matiere = models.CharField(max_length=1)  # F Francais, M Mathematique
    description = models.CharField(max_length=30, blank=True, null=True)  # Description

    def __str__(self):
        return f"{self.matiere} - {self.description}"

 

# Table: ScoreRule
class ScoreRule(models.Model):
    description = models.CharField(max_length=50, blank=True, null=True)  # Explanation

    def __str__(self):
        return f"Rule:{self.id} - {self.description}"

 

# Table: ScoreRulePoint
class ScoreRulePoint(models.Model):
    scorerule = models.ForeignKey('ScoreRule', related_name='points', on_delete=models.CASCADE, default=1)  # Assuming you want to use ScoreRule with ID 1 as default
    scorelabel = models.CharField(max_length=20)  # A/NA
    score = models.IntegerField()  # Score that is associated with a resultat
    description = models.CharField(max_length=50, blank=True, null=True)  # Explanation

    def __str__(self):
        return f"Rule:{self.scorerule.id} - {self.scorelabel} - {self.score} - {self.description}"



# Table: Eleve (Student)
class Eleve(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    niveau = models.CharField(max_length=10) 
    datenaissance = models.DateField(null=True, blank=True)  # Allows birthdate to be optional    
    professeurs = models.ManyToManyField(User, related_name='eleves', blank=True)

    def __str__(self): 
        return f"{self.nom} {self.prenom} - {self.niveau}"
    
     



# Table: Catalogue (Evaluation Catalog)
class Catalogue(models.Model):
    niveau = models.ForeignKey('Niveau', on_delete=models.CASCADE, default=1)
    etape = models.ForeignKey('Etape', on_delete=models.CASCADE, default=1)
    annee = models.ForeignKey('Annee', on_delete=models.CASCADE, default=1)
    matiere = models.ForeignKey('Matiere', on_delete=models.CASCADE, default=1)

 
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Catalogue for {self.description}"

# Table: GroupageData 
class GroupageData(models.Model):
    catalogue = models.ForeignKey('Catalogue', on_delete=models.CASCADE)  # Link to Catalogue
    position = models.IntegerField()  # Position in the evaluation
    desc_groupage = models.CharField(max_length=100)  # Grouping name (e.g., CATEGORISATION)
    label_groupage = models.CharField(max_length=100)  # Label for groupage in graph to be displayed
    link = models.CharField(max_length=500)  # Link to documentation about these test sets
    max_point = models.IntegerField()  # Maximum points available for the group
    seuil1 = models.IntegerField()  # Threshold 1 score
    seuil2 = models.IntegerField()  # Threshold 2 score
    max_item = models.IntegerField()  # Maximum items in the group

    def __str__(self):
        return f"Groupage {self.desc_groupage} - Position {self.position}"


 
# Table: Item (Details for each test in a GroupageData)
class Item(models.Model):
    groupagedata = models.ForeignKey('GroupageData', on_delete=models.CASCADE)  # Link to GroupageData
    temps = models.CharField(max_length=100)  # Time (e.g., Temps 1)
    description = models.CharField(max_length=255)  # Test description (e.g., identifying a color)
    observation = models.TextField(blank=True, null=True)  # Observations 
    scorerule = models.ForeignKey('ScoreRule', on_delete=models.CASCADE, default=1)  # Link to score rule
    max_score = models.FloatField()  # Max score possible 
    itempos = models.IntegerField()  # Identifier for the test within the item
    link = models.CharField(max_length=500)  # Link to documentation about this test

    def __str__(self):
        return f"Test {self.groupagedata} - {self.temps} - {self.description}"
 

# Table: PDFLayout (Defining the PDF structure)
class PDFLayout(models.Model):
    header_icon = models.CharField(max_length=500)  # Link to header icon
    footer_message = models.TextField(blank=True, null=True)  # Footer message

    def __str__(self):
        return f"PDF Layout: {self.id}"
  

# Table: Report 

class Report(models.Model):
    eleve = models.ForeignKey('Eleve', on_delete=models.CASCADE, related_name='reports')
    professeur = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    pdflayout = models.ForeignKey('PDFLayout', on_delete=models.CASCADE)

    def __str__(self):
        return f"Report for {self.eleve} - Created by {self.professeur}"



# Table: ReportCatalogue 

class ReportCatalogue(models.Model):
    report = models.ForeignKey('Report', on_delete=models.CASCADE, related_name='report_catalogues')
    catalogue = models.ForeignKey('Catalogue', on_delete=models.CASCADE)

    def __str__(self):
        return f"Report Catalogue for {self.catalogue}"


# Table: Resultat  

class Resultat(models.Model):
    report_catalogue = models.ForeignKey('ReportCatalogue', on_delete=models.CASCADE, related_name='resultats')
    groupage = models.ForeignKey('GroupageData', on_delete=models.CASCADE)
    score = models.FloatField()
    seuil1_percent = models.FloatField(default=0.0)  # Threshold 1 percentage
    seuil2_percent = models.FloatField(default=0.0)  # Threshold 2 percentage
    seuil3_percent = models.FloatField(default=0.0)  # Threshold 3 percentage

    def __str__(self):
        return f"Resultat for {self.report_catalogue}"
  

# Table: ResultatDetail 

class ResultatDetail(models.Model):
    resultat = models.ForeignKey('Resultat', on_delete=models.CASCADE, related_name='resultat_details')
    item = models.ForeignKey('Item', on_delete=models.CASCADE)
    score = models.FloatField()
    scorelabel = models.CharField(max_length=50, blank=True, null=True)  # Result (e.g., NA)
    observation = models.TextField(blank=True, null=True)  # Observations

    def __str__(self):
        return f"Resultat Detail for {self.resultat}"

