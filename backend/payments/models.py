from django.db import models

# Create your models here.
from django.db import models
from assignments.models import Assignment

class Payment(models.Model):
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('unpaid', 'Unpaid'),
    )

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"{self.assignment} - {self.amount}"