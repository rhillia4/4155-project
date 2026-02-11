from django.db import models
from django.contrib.auth.models import User
from .game import Game
from .brokerage import Portfolio

class GameParticipant(models.Model):
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name="participants"
    )
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("game", "portfolio")

    def __str__(self):
        return f"{self.portfolio.name} in {self.game.name}"
