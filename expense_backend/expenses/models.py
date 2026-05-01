"""
Expense models for tracking personal expenses.
"""
from django.db import models
from django.db.models import F, Value
from django.db.models.functions import Coalesce
from decimal import Decimal
import uuid


class Expense(models.Model):
    """Model for tracking individual expenses."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Track idempotency key to handle duplicate requests
    idempotency_key = models.CharField(max_length=255, null=True, blank=True, unique=True, db_index=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['-date']),
            models.Index(fields=['idempotency_key']),
        ]
    
    def __str__(self):
        return f"{self.category}: {self.amount} - {self.description}"
