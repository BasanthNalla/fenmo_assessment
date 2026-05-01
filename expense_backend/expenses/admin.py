"""
Admin configuration for expenses app.
"""
from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    """Admin interface for Expense model."""
    list_display = ['id', 'amount', 'category', 'description', 'date', 'created_at']
    list_filter = ['category', 'date', 'created_at']
    search_fields = ['description', 'category']
    readonly_fields = ['id', 'created_at', 'idempotency_key']
    ordering = ['-date', '-created_at']
