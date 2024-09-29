from django.core.management.base import BaseCommand
import csv
import json
import os
from competence.models import Annee, Etape, Item, Niveau, ScoreRulePoint, Catalogue, GroupageData, Matiere, ScoreRule

class Command(BaseCommand):
    help = 'Load data from multiple CSV files and generate a JSON fixture'

    def handle(self, *args, **options):
        csv_files = {
            'script_db/annee.csv': Annee,
            'script_db/etape.csv': Etape,
            'script_db/item.csv': Item,
            'script_db/niveau.csv': Niveau,
            'script_db/scorerulepoint.csv': ScoreRulePoint,
            'script_db/catalogue.csv': Catalogue,
            'script_db/groupagedata.csv': GroupageData,
            'script_db/matiere.csv': Matiere,
            'script_db/scorerule.csv': ScoreRule,
        }

        json_data = {}

        for csv_file_path, model in csv_files.items():
            self.load_csv_to_model(csv_file_path, model, json_data)

        # Write the JSON data to a file
        json_file_path = 'script_db/data_fixture.json'
        with open(json_file_path, 'w') as json_file:
            json.dump(json_data, json_file, indent=4)
        
        self.stdout.write(self.style.SUCCESS(f'Data loaded successfully and JSON fixture created at {json_file_path}'))

    def load_csv_to_model(self, csv_file_path, model, json_data):
        try:
            with open(csv_file_path) as csv_file:
                csv_reader = csv.DictReader(csv_file)
                model_data = []
                for row in csv_reader:
                    obj = model.objects.create(**row)  # Create model instance
                    model_data.append(obj)  # Append object for JSON export
                json_data[model.__name__] = [obj_to_dict(obj) for obj in model_data]
            self.stdout.write(self.style.SUCCESS(f'Data loaded successfully from {csv_file_path}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error loading data from {csv_file_path}: {e}'))

def obj_to_dict(obj):
    """Converts a model instance to a dictionary."""
    return {field.name: getattr(obj, field.name) for field in obj._meta.fields}
