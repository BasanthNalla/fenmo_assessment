"""
API views for expenses.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from django.db.models import Q
from .models import Expense
from .serializers import ExpenseSerializer
import uuid
import hashlib


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Expense API.
    
    GET /expenses - List all expenses with optional filters
    POST /expenses - Create a new expense
    """
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    
    def get_queryset(self):
        """
        Filter expenses by category if provided.
        Sort by date (newest first) if sort parameter is provided.
        """
        queryset = Expense.objects.all()
        
        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__iexact=category)
        
        # Sort by date (newest first) - default behavior
        sort_param = self.request.query_params.get('sort', 'date_desc')
        if sort_param == 'date_desc':
            queryset = queryset.order_by('-date', '-created_at')
        elif sort_param == 'date_asc':
            queryset = queryset.order_by('date', 'created_at')
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """
        Create a new expense.
        Handles idempotency to prevent duplicate entries from retries.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Generate idempotency key from request data
        data_str = str(sorted(request.data.items()))
        idempotency_key = hashlib.sha256(data_str.encode()).hexdigest()
        
        # Check if this expense was already created
        existing_expense = Expense.objects.filter(idempotency_key=idempotency_key).first()
        if existing_expense:
            return Response(
                ExpenseSerializer(existing_expense).data,
                status=status.HTTP_201_CREATED
            )
        
        # Create new expense with idempotency key
        try:
            expense = Expense.objects.create(
                **serializer.validated_data,
                idempotency_key=idempotency_key
            )
            return Response(
                ExpenseSerializer(expense).data,
                status=status.HTTP_201_CREATED
            )
        except IntegrityError:
            # If there's an integrity error, try to fetch the existing record
            existing_expense = Expense.objects.filter(idempotency_key=idempotency_key).first()
            if existing_expense:
                return Response(
                    ExpenseSerializer(existing_expense).data,
                    status=status.HTTP_201_CREATED
                )
            raise
