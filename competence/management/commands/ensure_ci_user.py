from django.conf import settings
from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand, CommandError

from competence.models import CustomUser


class Command(BaseCommand):
    help = "Ensure the operational CI user exists and is attached to the teacher group."

    def handle(self, *args, **kwargs):
        username = getattr(settings, "CI_HEALTHCHECK_USERNAME", "compet_ci")
        email = getattr(settings, "CI_HEALTHCHECK_EMAIL", "admin@nathabee.de")
        password = getattr(settings, "DEFAULT_USER_PASSWORD", "")

        if not password:
            raise CommandError("DEFAULT_USER_PASSWORD is missing or empty in Django settings.")

        teacher_group, _ = Group.objects.get_or_create(name="teacher")

        user, created = CustomUser.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "first_name": "Compet",
                "last_name": "CI",
                "is_active": True,
                "is_staff": False,
            },
        )

        user.email = email
        user.first_name = user.first_name or "Compet"
        user.last_name = user.last_name or "CI"
        user.is_active = True
        user.is_staff = False
        user.is_superuser = False

        if hasattr(user, "lang") and not user.lang:
            user.lang = "en"

        user.set_password(password)
        user.save()

        user.groups.add(teacher_group)

        self.stdout.write(
            self.style.SUCCESS(f"Ensured CI user '{username}' (created={created}).")
        )