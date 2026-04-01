from django.core.management.base import BaseCommand
from api.services import create_sod_snapshots


class Command(BaseCommand):
    help = "Run start-of-day portfolio snapshot job"

    def handle(self, *args, **kwargs):
        create_sod_snapshots()
        self.stdout.write(self.style.SUCCESS("SOD snapshots created"))