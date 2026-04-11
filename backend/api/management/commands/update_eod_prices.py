from django.core.management.base import BaseCommand
from .util import daily
import asyncio

class Command(BaseCommand):
    help = "Run end-of-day load job"

    def handle(self, *args, **kwargs):
        asyncio.run(daily())
        self.stdout.write(self.style.SUCCESS("EOD load completed"))

    # def main():
    #     asyncio.run(daily())

    # if __name__ == "__main__":
    #     main()