from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Repair
from expenses.models import Expense


@receiver(post_save, sender=Repair)
def create_expense_when_repair_completed(sender, instance, created, **kwargs):
    if instance.status == "completed":
        already_exists = Expense.objects.filter(
            notes__icontains=f"Repair ID {instance.id}"
        ).exists()

        if not already_exists:
            Expense.objects.create(
                car=instance.car,
                amount=instance.estimated_cost or 0,
                category="Repair",
                notes=f"Repair ID {instance.id}: {instance.issue}"
            )