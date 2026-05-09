from django.db import models
from cars.models import Car


class Expense(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    expense_date = models.DateField(auto_now_add=True)
    category = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)

    invoice_receipt = models.FileField(
        upload_to="expenses/invoices_receipts/",
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.car} - {self.amount}"