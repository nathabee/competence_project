from django.db import models
from django.contrib.auth.models import User
from .config_utils import ConfigCache
 
 

#class Profile(models.Model):
#    user = models.OneToOneField(User, on_delete=models.CASCADE)
#    schoolName = models.CharField(max_length=255, blank=True, null=True)

#    def __str__(self):
#        return f"{self.user.username} - {self.schoolName}"
 
    

# Table: Niveau (Class Level & Evaluation Stage)
class Niveau(models.Model):
    NIVEAU_CHOICES = [
        ('CP', 'CP'),
        ('E1', 'E1'),
        ('E2', 'E2'),
        ('M1', 'M1'),
        ('M2', 'M2'),
        ('?', '?')
    ]
    niveau = models.CharField(max_length=10, choices=NIVEAU_CHOICES, default='?')  # Class level
    description = models.CharField(max_length=30, blank=True, null=True)  # Description

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
    etape = models.CharField(max_length=10, choices=ETAPE_CHOICES, default='?')  # Etape
    description = models.CharField(max_length=30, blank=True, null=True)  # Description

    def __str__(self):
        return f"{self.etape} - {self.description}"

# Table: Annee
class Annee(models.Model):
    annee = models.CharField(max_length=9)  # Year "2024-2025"
    description = models.CharField(max_length=30, blank=True, null=True)  # Description

    def __str__(self):
        return f"{self.annee} - {self.description}"



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
    score_rule = models.ForeignKey('ScoreRule', related_name='points', on_delete=models.CASCADE, default=1)  # Assuming you want to use ScoreRule with ID 1 as default
    resultat = models.CharField(max_length=20)  # A/NA
    score = models.IntegerField()  # Score that is associated with a resultat
    description = models.CharField(max_length=50, blank=True, null=True)  # Explanation

    def __str__(self):
        return f"Rule:{self.score_rule.id} - {self.resultat} - {self.score} - {self.description}"


# Table: Eleve (Student)
class Eleve(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    classe = models.CharField(max_length=10)
    textnote1 = models.TextField(blank=True, null=True)
    textnote2 = models.TextField(blank=True, null=True)
    textnote3 = models.TextField(blank=True, null=True)
    professeurs = models.ManyToManyField(User, related_name='eleves', blank=True)

    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.classe}"



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
    desc_groupage = models.CharField(max_length=100)  # Grouping name (e.g., CATEGORISATION)  in combo box 
    label_groupage = models.CharField(max_length=100)  # Label for groupage in graph to be displayed
    link = models.CharField(max_length=500)  # http adresse to open a doc about these test set
    max_point = models.IntegerField()  # Maximum points available for the group
    seuil1 = models.IntegerField()  # Threshold 1 score
    seuil2 = models.IntegerField()  # Threshold 2 score
    max_item = models.IntegerField()  # Maximum items in the group

    def __str__(self):
        return f"Groupage {self.desc_groupage} - Position {self.position}"

 
# Table: Item (Details for each test in a GroupageData)
class Item(models.Model):
    groupagedata = models.ForeignKey('GroupageData', on_delete=models.CASCADE )  # Link to GroupageData
    temps = models.CharField(max_length=100)  # Time (e.g., Temps 1)
    description = models.CharField(max_length=255)  # Test description (e.g., identifying a color)
    observation = models.TextField(blank=True, null=True)  # Observations 
    scorerule = models.ForeignKey('ScoreRule', on_delete=models.CASCADE, default=1)
    max_score = models.FloatField()  # Max score possible 
    itempos = models.IntegerField()  # Identifier for the test within the item
    link = models.CharField(max_length=500)  # http adresse to open a doc about these test set

    def __str__(self):
        return f"Test {self.groupagedata} -  {self.temps} - {self.description}"

# Table: Resultat (Evaluation Results)
class Resultat(models.Model):
    eleve = models.ForeignKey('Eleve', on_delete=models.CASCADE)
    groupage = models.ForeignKey('GroupageData', on_delete=models.CASCADE)
    score = models.IntegerField()
    resultat = models.CharField(max_length=20, blank=True, null=True)  # Result (e.g., NA)
    seuil1_percent = models.FloatField(default=0.0)
    seuil2_percent = models.FloatField(default=0.0)
    seuil3_percent = models.FloatField(default=0.0)
    professeur = models.ForeignKey(
        User,
        on_delete=models.SET_DEFAULT,
        default=ConfigCache.get('PROF_ID_DEFAULT', None)
    )

    def __str__(self):
        return f"Result for {self.eleve} - {self.groupage}"

# Table: ResultatDetail (Evaluation Results per TestDetail)
class ResultatDetail(models.Model):
    eleve = models.ForeignKey('Eleve', on_delete=models.CASCADE)
    testdetail = models.ForeignKey('Item', on_delete=models.CASCADE) 
    resultat = models.CharField(max_length=50, blank=True, null=True)  # Result (e.g., NA)
    observation = models.TextField(blank=True, null=True)  # Observations
    score = models.FloatField()  # Score for this test
    professeur = models.ForeignKey(
        User,
        on_delete=models.SET_DEFAULT,
        default=ConfigCache.get('PROF_ID_DEFAULT', None)
    )

    def __str__(self):
        return f"Result for {self.eleve} - {self.testdetail}"
