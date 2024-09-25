from django.core.management.base import BaseCommand
from competence.models import Eleve
from django.contrib.auth.models import User
import random
from django.db.models import Q



class Command(BaseCommand):
    help = 'Populate the Eleve table with test data'

    # Define lists of French names and notes
    first_names = ["Jean", "Pierre", "Louis", "Jacques", "Henri", "Paul", "Charles", "Philippe", "François", "Alain", "André", "Bernard", "Claude", "Daniel", "Éric", "Georges", "Gérard", "Robert", "Michel", "David", "Yves", "Luc"]
    last_names = ["Martin", "Bernard", "Dupont", "Durand", "Lemoine", "Lefebvre", "Leclerc", "Roux", "Moreau", "Gauthier", "Garcia", "Muller", "Schmitt", "Fournier", "Blanc", "Moulin", "Barbier", "Gillet", "Benoît", "Leroy", "Royer"]
    notes = ["Excellent", "Très bien", "Bien", "Assez bien", "Passable", "Insuffisant", "Médiocre", "Très insuffisant", "Satisfaisant", "Admissible"]

    def handle(self, *args, **kwargs):
        # Retrieve professeur IDs with usernames like 'prof%'
        professeurs = User.objects.filter(
                        Q(username__startswith='tea') |
                        Q(username__in=['adm', 'all'])
                    )

        if not professeurs:
            self.stdout.write(self.style.ERROR('No professeurs found with usernames like tea-  or adm or sta'))
            return

        # Create 20 Eleve entries
        for i in range(20):
            classe = 'GS' if i < 18 else 'CP'  # 18 in GS, 2 in CP
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

        self.stdout.write(self.style.SUCCESS('Successfully populated the Eleve table with test data.'))
