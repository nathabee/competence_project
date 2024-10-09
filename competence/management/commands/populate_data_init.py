import os
import csv
from django.conf import settings
from django.core.management.base import BaseCommand
from competence.models import Annee, Catalogue, Etape, GroupageData, Niveau, Matiere, Item, ScoreRule,ScoreRulePoint,PDFLayout
from django.utils.timezone import make_aware
from datetime import datetime
#from django.core.files import File
from PIL import Image


class Command(BaseCommand):


    def resize_image(self, image_path):
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"The image {image_path} does not exist.")
            
        img = Image.open(image_path)
        
        # Resize while maintaining aspect ratio
        img.thumbnail((100, 100), Image.LANCZOS)  # Use Image.LANCZOS instead of Image.ANTIALIAS

        # Save the image back to the same path or a new path
        img.save(image_path)  # This will overwrite the original image. Use a new path if you want to keep the original.

        return image_path


    help = 'Import data from CSV files into Django models'


    def handle(self, *args, **kwargs):

 # Load Catalogue data

        # Import Annee
        with open('script_db/annee.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Parse date fields and handle empty dates
                start_date = row['start_date'] if row['start_date'] else None
                stop_date = row['stop_date'] if row['stop_date'] else None
                
                # Make dates timezone-aware if provided
                if start_date:
                    start_date = make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
                if stop_date:
                    stop_date = make_aware(datetime.strptime(stop_date, '%Y-%m-%d'))
                
                # Create or update the Annee instance
                Annee.objects.update_or_create(
                    id=row['id'],  # Force the creation with specific ID
                    defaults={
                        'is_active': row['is_active'].lower() == 'true',  # Convert string 'true/false' to boolean
                        'start_date': start_date,
                        'stop_date': stop_date,
                        'description': row['description']
                    }
                )

         
        self.stdout.write(self.style.SUCCESS('Successfully imported Annee data'))

        # Import Niveau
        with open('script_db/niveau.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Niveau.objects.update_or_create(
                    id=row['id'],  # Force the creation with specific ID
                    defaults={
                        'niveau': row['niveau'],
                        'description': row['description']
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported Niveau data'))

        # Import Etape
        with open('script_db/etape.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Etape.objects.update_or_create(
                    id=row['id'],  # Force the creation with specific ID
                    defaults={
                        'etape': row['etape'],
                        'description': row['description']
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported Etape data'))



        # Import Matiere
        with open('script_db/matiere.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Matiere.objects.update_or_create(
                    id=row['id'],  # Force the creation with specific ID
                    defaults={
                        'matiere': row['matiere'],
                        'description': row['description']
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported Matiere data'))


    
        with open('script_db/catalogue.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Ensure that 'niveau', 'etape', and 'annee' exist in the database
                niveau = Niveau.objects.get(id=row['niveau'])
                etape = Etape.objects.get(id=row['etape'])
                annee = Annee.objects.get(id=row['annee'])
                matiere = Matiere.objects.get(id=row['matiere'])
                
                
                Catalogue.objects.update_or_create(
                    id=row['id'],  # Use 'id' to update or create
                    defaults={
                        'niveau': niveau,
                        'etape': etape,
                        'annee': annee,
                        'matiere': matiere,
                        'description': row['description']
                    }
                )

        self.stdout.write(self.style.SUCCESS('Successfully imported Catalogue data'))
 

        # Load groupagedata data
        with open('script_db/groupagedata.csv', mode='r') as file:
            reader = csv.DictReader(file) 

            for row in reader:
                # Ensure that 'catalogue' exists in the database
                catalogue = Catalogue.objects.get(id=row['catalogue']) 

                GroupageData.objects.update_or_create(
                    id=row['id'],  # Use 'id' to update or create
                    defaults={ 
                        'position': row['position'],
                        'desc_groupage': row['desc_groupage'],
                        'label_groupage': row['label_groupage'],
                        'link': row['link'],
                        'max_point': row['max_point'],
                        'seuil1': row['seuil1'],
                        'seuil2': row['seuil2'],
                        'catalogue': catalogue,
                        'max_item': row['max_item'] 
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported groupagedata data'))

  
        # Load scorerule data
        with open('script_db/scorerule.csv', mode='r') as file:
            reader = csv.DictReader(file) 

            for row in reader:
             
                ScoreRule.objects.update_or_create( 
                    id=row['id'],  # Use 'id' to update or create
                    defaults={  
                        'description': row['description'],
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported scorerule data'))

          # Load Scorerulepoint data
        with open('script_db/scorerulepoint.csv', mode='r') as file:
            reader = csv.DictReader(file) 

            for row in reader:

                try: 
                    scorerule = ScoreRule.objects.get(id=row['scorerule']) 
                except ScoreRule.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"ScoreRule ID {row['scorerule']} does not exist."))
                    continue


                ScoreRulePoint.objects.update_or_create( 
                    id=row['id'],  # Use 'id' to update or create
                    defaults={ 
                        'scorerule':   scorerule ,
                        'scorelabel':  row['scorelabel'],
                        'score': row['score'],
                        'description': row['description'],
                    }
                )
        self.stdout.write(self.style.SUCCESS('Successfully imported scorerulepoint data'))

 

        # Load Item data
        with open('script_db/item.csv', mode='r') as file: 
            reader = csv.DictReader(file) 
            for row in reader:
                try:
                    groupagedata = GroupageData.objects.get(id=row['groupagedata'])
                    scorerule = ScoreRule.objects.get(id=row['scorerule'])
                except GroupageData.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"GroupageData ID {row['groupagedata']} does not exist."))
                    continue
                except ScoreRule.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"ScoreRule ID {row['scorerule']} does not exist."))
                    continue

                Item.objects.update_or_create(
                    id=row['id'],
                    defaults={
                        'groupagedata': groupagedata,
                        'temps': row['temps'],
                        'description': row['description'],
                        'observation': row['observation'],
                        'scorerule': scorerule,
                        'max_score': row['max_score'],
                        'link': row['link'],
                        'itempos': row['itempos'],
                    }
                )



        self.stdout.write(self.style.SUCCESS('Successfully imported Item data'))

        # Make sure to set the MEDIA_ROOT correctly
        media_root = settings.MEDIA_ROOT
 
  

        with open('script_db/pdflayout.csv', mode='r') as file: 
            reader = csv.DictReader(file) 
            for row in reader:
                header_icon_path = os.path.join(settings.MEDIA_ROOT, row['header_icon'])
                
                try:
                    # Resize the image and save
                    resized_image_path = self.resize_image(header_icon_path)

                    PDFLayout.objects.update_or_create(
                        id=row['id'],
                        defaults={
                            'header_icon': resized_image_path,  # Save the path of the resized image
                            'schule_name': row['schule_name'],
                            'header_message': row['header_message'],
                            'footer_message1': row['footer_message1'],
                            'footer_message2': row['footer_message2'],
                        }
                    )

                except Exception as e:
                    self.stderr.write(self.style.ERROR(f"Error processing row {row['id']}: {str(e)}"))


        self.stdout.write(self.style.SUCCESS('Successfully imported PDFLayout data'))