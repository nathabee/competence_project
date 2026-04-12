from django.apps import AppConfig

 

class YourAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "competence"


    def ready(self):
        import competence.signals  # Ensure the signals module is imported

