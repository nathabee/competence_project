import csv
from django.core.management.base import BaseCommand
from competence.models import Annee, Catalogue, Etape, Item, Niveau

class Command(BaseCommand):
    help = 'Import data from CSV files into Django models'

    def handle(self, *args, **kwargs):
        # Import Annee
        with open('script_db/annee.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Annee.objects.update_or_create(
                    annee=row['annee'],
                    defaults={'description': row['description']}
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported Annee data'))
 
        # Import Niveau
        with open('script_db/niveau.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Niveau.objects.update_or_create(
                    niveau=row['niveau'],
                    defaults={'description': row['description']}
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported Niveau data'))

        # Import etape
        with open('script_db/etape.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Etape.objects.update_or_create(
                    etape=row['etape'], 
                    defaults={'description': row['description']}
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported Etape data'))

 # Load Catalogue data
        with open('script_db/catalogue.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Ensure that 'niveau', 'etape', and 'annee' exist in the database
                niveau = Niveau.objects.get(id=row['niveau'])
                etape = Etape.objects.get(id=row['etape'])
                annee = Annee.objects.get(id=row['annee'])
                
                Catalogue.objects.update_or_create(
                    id=row['id'],  # Use 'id' to update or create
                    defaults={
                        'description': row['description'],
                        'etape': etape,
                        'niveau': niveau,
                        'matiere': row['matiere'],
                        'annee': annee
                    }
                )

        self.stdout.write(self.style.SUCCESS('Successfully imported Catalogue data'))

        # Load Item data
        with open('script_db/item.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Ensure that 'catalogue' exists in the database
                catalogue = Catalogue.objects.get(id=row['catalogue'])

                Item.objects.update_or_create(
                    id=row['id'],  # Use 'id' to update or create
                    defaults={
                        'position': row['position'],
                        'description': row['description'],
                        'link': row['link'],
                        'total': row['total'],
                        'seuil1': row['seuil1'],
                        'seuil2': row['seuil2'],
                        'catalogue': catalogue
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported Item data'))
