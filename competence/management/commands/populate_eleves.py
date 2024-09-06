from django.core.management.base import BaseCommand
from competence.models import Eleve
from django.contrib.auth.models import User
import random

class Command(BaseCommand):
    help = 'Populate the Eleve table with test data'

    # Define lists of French names and notes
    first_names = ["Jean", "Pierre", "Louis", "Jacques", "Henri", "Paul", "Charles", "Philippe", "François", "Alain", "André", "Bernard", "Claude", "Daniel", "Éric", "Georges", "Gérard", "Robert", "Michel", "David", "Yves", "Luc"]
    last_names = ["Martin", "Bernard", "Dupont", "Durand", "Lemoine", "Lefebvre", "Leclerc", "Roux", "Moreau", "Gauthier", "Garcia", "Muller", "Schmitt", "Fournier", "Blanc", "Moulin", "Barbier", "Gillet", "Benoît", "Leroy", "Royer"]
    notes = ["Excellent", "Très bien", "Bien", "Assez bien", "Passable", "Insuffisant", "Médiocre", "Très insuffisant", "Satisfaisant", "Admissible"]

    def handle(self, *args, **kwargs):
        # Retrieve professeur IDs
        professeurs = User.objects.filter(id__range=(14,22))

        if not professeurs:
            self.stdout.write(self.style.ERROR('No professeurs found in the specified range.'))
            return

        # Create 20 Eleve entries
        for i in range(20):
            classe = 'CP' if i < 18 else 'E1'  # 18 in CP, 2 in C1
            eleve = Eleve.objects.create(
                nom=random.choice(self.last_names),
                prenom=random.choice(self.first_names),
                classe=classe,
                textnote1=random.choice(self.notes),
                textnote2=random.choice(self.notes),
                textnote3="Test",
            )

            # Assign a random subset of professeurs (1 to 3 professeurs per eleve)
            num_professeurs = min(len(professeurs), 3)  # Ensure we do not sample more than available
            assigned_professeurs = random.sample(list(professeurs), random.randint(1, num_professeurs))
            eleve.professeurs.add(*assigned_professeurs)

        self.stdout.write(self.style.SUCCESS('Successfully populated the Eleve table with test data'))
