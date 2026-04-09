import os
import shutil
from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Copy file data from script_db/competence into media/origin"

    def handle(self, *args, **kwargs):
        base_dir = settings.BASE_DIR

        src_dir = os.path.join(base_dir, "script_db", "competence")
        media_root = settings.MEDIA_ROOT

        if not media_root:
            self.stderr.write(
                self.style.ERROR("MEDIA_ROOT is not configured in Django settings.")
            )
            return

        dest_dir = os.path.join(media_root, "origin")
        dest_competence_dir = os.path.join(dest_dir, "competence")

        if not os.path.isdir(src_dir):
            self.stderr.write(
                self.style.ERROR(f"Source directory does not exist: {src_dir}")
            )
            return

        try:
            os.makedirs(dest_competence_dir, exist_ok=True)
        except OSError as exc:
            self.stderr.write(
                self.style.ERROR(
                    f"Unable to create destination directory {dest_competence_dir}: {exc}"
                )
            )
            return

        copied_any = False

        for name in os.listdir(src_dir):
            src_path = os.path.join(src_dir, name)
            dest_path = os.path.join(dest_competence_dir, name)

            if os.path.isdir(src_path):
                try:
                    shutil.copytree(src_path, dest_path, dirs_exist_ok=True)
                    self.stdout.write(
                        self.style.SUCCESS(f"Copied directory: {src_path} -> {dest_path}")
                    )
                    copied_any = True
                except Exception as exc:
                    self.stderr.write(
                        self.style.ERROR(
                            f"Error copying directory {src_path} -> {dest_path}: {exc}"
                        )
                    )
            elif os.path.isfile(src_path):
                try:
                    shutil.copy2(src_path, dest_path)
                    self.stdout.write(
                        self.style.SUCCESS(f"Copied file: {src_path} -> {dest_path}")
                    )
                    copied_any = True
                except Exception as exc:
                    self.stderr.write(
                        self.style.ERROR(
                            f"Error copying file {src_path} -> {dest_path}: {exc}"
                        )
                    )

        if not copied_any:
            self.stdout.write(
                self.style.WARNING(
                    f"No files or directories were copied from {src_dir}."
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully copied data from {src_dir} to {dest_competence_dir}"
            )
        )