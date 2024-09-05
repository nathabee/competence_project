from django.db import models

# Table: Eleve (Student)
class Eleve(models.Model):
    nom = models.CharField(max_length=100)  # Last name
    prenom = models.CharField(max_length=100)  # First name
    classe = models.CharField(max_length=10)  # Class level (CP, CE1, etc.)
    textnote1 = models.TextField(blank=True, null=True)  # Optional note 1
    textnote2 = models.TextField(blank=True, null=True)  # Optional note 2
    textnote3 = models.TextField(blank=True, null=True)  # Optional note 3

    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.classe}"


# Table: Niveau (Class Level & Evaluation Stage)
class Niveau(models.Model):
    CLASSE_CHOICES = [
        ('CP', 'CP'),
        ('CE1', 'CE1'),
        ('CE2', 'CE2'),
        ('CM1', 'CM1'),
        ('CM2', 'CM2'),
    ]
    ETAPE_CHOICES = [
        ('rentree', 'Rentree'),
        ('milieu', 'Milieu'),
        ('fin', 'Fin'),
    ]
    classe = models.CharField(max_length=10, choices=CLASSE_CHOICES)  # Class level
    etapeEvaluation = models.CharField(max_length=10, choices=ETAPE_CHOICES)  # Evaluation stage

    def __str__(self):
        return f"{self.classe} - {self.etapeEvaluation}"


# Table: Catalogue (Evaluation Catalog)
class Catalogue(models.Model):
    niveau = models.ForeignKey(Niveau, on_delete=models.CASCADE)  # Link to Niveau
    description = models.TextField()  # Description of the evaluation catalog

    def __str__(self):
        return f"Catalogue for {self.niveau}"


# Table: Item (Evaluation Item)
class Item(models.Model):
    catalogue = models.ForeignKey(Catalogue, on_delete=models.CASCADE)  # Link to Catalogue
    position = models.IntegerField()  # Position in the evaluation
    description = models.TextField()  # Description of the item
    nbtotal = models.IntegerField()  # Total score for this item
    seuil1 = models.IntegerField()  # Threshold 1 score
    seuil2 = models.IntegerField()  # Threshold 2 score

    def __str__(self):
        return f"Item {self.position} - {self.description}"


# Table: Resultat (Evaluation Results)
class Resultat(models.Model):
    eleve = models.ForeignKey(Eleve, on_delete=models.CASCADE)  # Link to Eleve
    catalogue = models.ForeignKey(Catalogue, on_delete=models.CASCADE)  # Link to Catalogue
    item = models.ForeignKey(Item, on_delete=models.CASCADE)  # Link to Item
    resultat = models.IntegerField()  # Actual score obtained
    seuil1_percent = models.FloatField()  # Percent of Seuil 1 achieved
    seuil2_percent = models.FloatField()  # Percent of Seuil 2 achieved
    seuil3_percent = models.FloatField(blank=True, null=True)  # Optional threshold 3 percent

    def __str__(self):
        return f"Result for {self.eleve} - {self.item}"
