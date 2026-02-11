from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from ..models import (
    Portfolio,
    Game,
    GameParticipant,
)
from ..serializers import (
    GameSerializer,
    GameParticipantSerializer,
)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_game(request):
    code = request.data.get("code")

    if not code:
        return Response({"error": "Game code is required"}, status=400)

    try:
        game = Game.objects.get(code=code, status=Game.PENDING)
    except Game.DoesNotExist:
        return Response({"error": "Invalid or inactive game code"}, status=404)

    
    GameParticipant.objects.get_or_create(
        game=game,
        user=request.user,
        portfolio = Portfolio.objects.get_or_create(
            user=request.user,
            game=game,
            name=f"{request.user.username} Portfolio",
            portfolio_type=Portfolio.PROP,
            cash_balance=game.starting_cash
        )
    )


    return Response({
        "message": "Joined game successfully",
        "game_id": game.id,
        "game_name": game.name
    })
# TODO: add leave game endpoint and logic to delete portfolio and participant record, also handle case where host leaves game (maybe assign new host or end game)


class GameListCreateView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]


class GameParticipantCreateView(generics.CreateAPIView):
    serializer_class = GameParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        portfolio = serializer.validated_data["portfolio"]

        if portfolio.user != self.request.user:
            raise PermissionError("Not your portfolio")

        serializer.save()
