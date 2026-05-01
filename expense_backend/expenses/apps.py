"""
App configuration for expenses app.
"""
from django.apps import AppConfig


class ExpensesConfig(AppConfig):
    """Configuration class for expenses app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'expenses'
