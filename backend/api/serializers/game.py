from rest_framework import serializers
from ..models import (
    Game,
    GameParticipant,
)

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"


class GameParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameParticipant
        fields = "__all__"

from rest_framework import serializers
from ..models import (
    Asset,
    Portfolio,
    Holding,
    Transaction,
    Game,
    GameParticipant,
    PortfolioSnapshot,
)