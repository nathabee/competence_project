import csv
from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.utils.timezone import make_aware

from competence.models import (
    Annee,
    Catalogue,
    Etape,
    GroupageData,
    Item,
    Matiere,
    MyImage,
    Niveau,
    PDFLayout,
    ScoreRule,
    ScoreRulePoint,
)


class Command(BaseCommand):
    help = "Import data from CSV files into Django models"

    def handle(self, *args, **kwargs):
        errors = []

        try:
            self.import_annee(errors)
            self.import_niveau(errors)
            self.import_etape(errors)
            self.import_matiere(errors)
            self.import_catalogue(errors)
            self.import_myimage(errors)
            self.import_groupagedata(errors)
            self.import_scorerule(errors)
            self.import_scorerulepoint(errors)
            self.import_item(errors)
            self.import_pdflayout(errors)
        except FileNotFoundError as exc:
            raise CommandError(f"Required CSV file not found: {exc}") from exc
        except Exception as exc:
            raise CommandError(f"Unexpected error during populate_data_init: {exc}") from exc

        if errors:
            raise CommandError(
                f"populate_data_init failed with {len(errors)} error(s). "
                "See log output above for details."
            )

        self.stdout.write(self.style.SUCCESS("populate_data_init completed successfully."))

    def csv_path(self, filename: str) -> Path:
        return Path(settings.BASE_DIR) / "script_db" / filename

    def read_csv(self, filename: str):
        path = self.csv_path(filename)
        with path.open(mode="r", encoding="utf-8", newline="") as file:
            yield from csv.DictReader(file)

    def add_error(self, errors, section: str, row_id, exc: Exception):
        msg = f"[{section}] Error processing row {row_id}: {exc}"
        self.stderr.write(self.style.ERROR(msg))
        errors.append(msg)

    def parse_optional_date(self, value: str):
        if not value:
            return None
        return make_aware(datetime.strptime(value, "%Y-%m-%d"))

    def import_annee(self, errors):
        for row in self.read_csv("annee.csv"):
            row_id = row.get("id", "?")
            try:
                start_date = self.parse_optional_date(row.get("start_date", ""))
                stop_date = self.parse_optional_date(row.get("stop_date", ""))

                Annee.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "is_active": row["is_active"].lower() == "true",
                        "start_date": start_date,
                        "stop_date": stop_date,
                        "description": row["description"],
                    },
                )
            except Exception as exc:
                self.add_error(errors, "Annee", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported Annee data"))

    def import_niveau(self, errors):
        for row in self.read_csv("niveau.csv"):
            row_id = row.get("id", "?")
            try:
                Niveau.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "niveau": row["niveau"],
                        "description": row["description"],
                    },
                )
            except Exception as exc:
                self.add_error(errors, "Niveau", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported Niveau data"))

    def import_etape(self, errors):
        for row in self.read_csv("etape.csv"):
            row_id = row.get("id", "?")
            try:
                Etape.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "etape": row["etape"],
                        "description": row["description"],
                    },
                )
            except Exception as exc:
                self.add_error(errors, "Etape", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported Etape data"))

    def import_matiere(self, errors):
        for row in self.read_csv("matiere.csv"):
            row_id = row.get("id", "?")
            try:
                Matiere.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "matiere": row["matiere"],
                        "description": row["description"],
                    },
                )
            except Exception as exc:
                self.add_error(errors, "Matiere", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported Matiere data"))

    def import_catalogue(self, errors):
        for row in self.read_csv("catalogue.csv"):
            row_id = row.get("id", "?")
            try:
                niveau = Niveau.objects.get(id=row["niveau"])
                etape = Etape.objects.get(id=row["etape"])
                annee = Annee.objects.get(id=row["annee"])
                matiere = Matiere.objects.get(id=row["matiere"])

                Catalogue.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "niveau": niveau,
                        "etape": etape,
                        "annee": annee,
                        "matiere": matiere,
                        "description": row["description"],
                    },
                )
            except Exception as exc:
                self.add_error(errors, "Catalogue", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported Catalogue data"))

    def import_myimage(self, errors):
        for row in self.read_csv("myimage.csv"):
            row_id = row.get("id", "?")
            try:
                self.stdout.write(f"Processing icon: {row['icon']}")
                icon_path = (Path("origin") / row["icon"]).as_posix()
                self.stdout.write(f"Processing image at path: {icon_path}")

                MyImage.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "icon": icon_path,
                    },
                )
            except Exception as exc:
                self.add_error(errors, "MyImage", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported MyImage data"))

    def import_groupagedata(self, errors):
        for row in self.read_csv("groupagedata.csv"):
            row_id = row.get("id", "?")
            try:
                catalogue = Catalogue.objects.get(id=row["catalogue"])

                defaults = {
                    "position": row["position"],
                    "desc_groupage": row["desc_groupage"],
                    "label_groupage": row["label_groupage"],
                    "link": row["link"],
                    "max_point": row["max_point"],
                    "seuil1": row["seuil1"],
                    "seuil2": row["seuil2"],
                    "catalogue": catalogue,
                    "max_item": row["max_item"],
                }

                if row.get("groupage_icon"):
                    defaults["groupage_icon"] = MyImage.objects.get(id=row["groupage_icon"])

                GroupageData.objects.update_or_create(
                    id=row["id"],
                    defaults=defaults,
                )
            except Exception as exc:
                self.add_error(errors, "GroupageData", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported GroupageData data"))

    def import_scorerule(self, errors):
        for row in self.read_csv("scorerule.csv"):
            row_id = row.get("id", "?")
            try:
                ScoreRule.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "description": row["description"],
                    },
                )
            except Exception as exc:
                self.add_error(errors, "ScoreRule", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported ScoreRule data"))

    def import_scorerulepoint(self, errors):
        for row in self.read_csv("scorerulepoint.csv"):
            row_id = row.get("id", "?")
            try:
                scorerule = ScoreRule.objects.get(id=row["scorerule"])

                ScoreRulePoint.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "scorerule": scorerule,
                        "scorelabel": row["scorelabel"],
                        "score": row["score"],
                        "description": row["description"],
                    },
                )
            except Exception as exc:
                self.add_error(errors, "ScoreRulePoint", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported ScoreRulePoint data"))

    def import_item(self, errors):
        for row in self.read_csv("item.csv"):
            row_id = row.get("id", "?")
            try:
                groupagedata = GroupageData.objects.get(id=row["groupagedata"])
                scorerule = ScoreRule.objects.get(id=row["scorerule"])

                Item.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "groupagedata": groupagedata,
                        "temps": row["temps"],
                        "description": row["description"],
                        "observation": row["observation"],
                        "scorerule": scorerule,
                        "max_score": row["max_score"],
                        "link": row["link"],
                        "itempos": row["itempos"],
                    },
                )
            except Exception as exc:
                self.add_error(errors, "Item", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported Item data"))

    def import_pdflayout(self, errors):
        for row in self.read_csv("pdflayout.csv"):
            row_id = row.get("id", "?")
            try:
                self.stdout.write(f"Processing header_icon: {row['header_icon']}")
                header_icon_path = (Path("origin") / row["header_icon"]).as_posix()
                self.stdout.write(f"Processing image at path: {header_icon_path}")

                PDFLayout.objects.update_or_create(
                    id=row["id"],
                    defaults={
                        "header_icon": header_icon_path,
                        "schule_name": row["schule_name"],
                        "header_message": row["header_message"],
                        "footer_message1": row["footer_message1"],
                        "footer_message2": row["footer_message2"],
                    },
                )
            except Exception as exc:
                self.add_error(errors, "PDFLayout", row_id, exc)

        self.stdout.write(self.style.SUCCESS("Successfully imported PDFLayout data"))