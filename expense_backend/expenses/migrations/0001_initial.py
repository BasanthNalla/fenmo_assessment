# Generated migration for initial Expense model

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('category', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=255)),
                ('date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('idempotency_key', models.CharField(blank=True, db_index=True, max_length=255, null=True, unique=True)),
            ],
            options={
                'ordering': ['-date', '-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='expense',
            index=models.Index(fields=['category'], name='expenses_ex_categor_idx'),
        ),
        migrations.AddIndex(
            model_name='expense',
            index=models.Index(fields=['-date'], name='expenses_ex_date_idx'),
        ),
        migrations.AddIndex(
            model_name='expense',
            index=models.Index(fields=['idempotency_key'], name='expenses_ex_idempot_idx'),
        ),
    ]
