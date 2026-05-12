from django.db import models
from cars.models import Car


class Repair(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    issue = models.CharField(max_length=255)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    reported_date = models.DateField()
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    actual_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)

    bill_receipt = models.FileField(
        upload_to="repairs/bills_receipts/",
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.car} - {self.issue}"