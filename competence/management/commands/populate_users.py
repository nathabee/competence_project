from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from competence.models import Profile  # Import your Profile model
import random

class Command(BaseCommand):
    help = 'Populate the User table with test data'

    # Define lists of French names and usernames
    first_names = ["Jean", "Pierre", "Louis", "Jacques", "Henri", "Paul", "Charles", "Philippe", "François", "Alain", "André", "Bernard", "Claude", "Daniel", "Éric", "Georges", "Gérard", "Robert", "Michel", "David", "Yves", "Luc"]
    last_names = ["Martin", "Bernard", "Dupont", "Durand", "Lemoine", "Lefebvre", "Leclerc", "Roux", "Moreau", "Gauthier", "Garcia", "Muller", "Schmitt", "Fournier", "Blanc", "Moulin", "Barbier", "Gillet", "Benoît", "Leroy", "Royer"]
    passwords = ["hallo"]
    school_names = ["School A", "School B", "School C"]  # Update with actual school names if needed

    def handle(self, *args, **kwargs):
        # Create 10 User entries
        for i in range(10):
            username = f"prof{i}" if i > 0 else "prof_default"
            first_name = random.choice(self.first_names)
            last_name = random.choice(self.last_names)
            password = random.choice(self.passwords)
            school_name = random.choice(self.school_names)  # Choose a random school name

            # Check if the user already exists
            if not User.objects.filter(username=username).exists():
                # Create the user
                user = User(
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                )
                user.set_password(password)  # Encrypt the password
                user.save()

                # Create the associated Profile
                Profile.objects.update_or_create(
                    user=user,
                    defaults={
                        'schoolName': school_name
                    }
                )

                self.stdout.write(self.style.SUCCESS(f'User {username} created with name {first_name} {last_name} and school {school_name}.'))
            else:
                self.stdout.write(self.style.WARNING(f'User {username} already exists.'))
