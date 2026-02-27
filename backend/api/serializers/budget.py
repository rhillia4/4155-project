from rest_framework import serializers
from .models import Transaction
from .models import BudgetEntry

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'date', 'amount', 'transaction_type', 'note']
        read_only_fields = ['user']


class BudgetEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetEntry
        fields = ['id', 'date', 'amount', 'transaction_type', 'note']
        
    def create(self, validated_data):
        # Automatically associate the entry with the logged-in user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)