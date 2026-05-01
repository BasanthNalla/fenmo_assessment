"""
Serializers for Expense API.
"""
from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    """Serializer for Expense model."""
    
    class Meta:
        model = Expense
        fields = ['id', 'amount', 'category', 'description', 'date', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_amount(self, value):
        """Validate that amount is positive."""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value
    
    def validate_date(self, value):
        """Validate date field."""
        from django.utils import timezone
        if value > timezone.localdate():
            raise serializers.ValidationError("Date cannot be in the future.")
        return value
    
    def validate_category(self, value):
        """Validate category is not empty."""
        if not value.strip():
            raise serializers.ValidationError("Category cannot be empty.")
        return value.strip()
    
    def validate_description(self, value):
        """Validate description is not empty."""
        if not value.strip():
            raise serializers.ValidationError("Description cannot be empty.")
        return value.strip()
