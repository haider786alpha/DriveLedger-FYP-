from django.db import models


class Car(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    registration_number = models.CharField(max_length=20)
    mileage = models.IntegerField()
    condition = models.CharField(max_length=50)

    notes = models.TextField(blank=True, null=True)
    last_service_date = models.DateField(blank=True, null=True)
    next_maintenance_date = models.DateField(blank=True, null=True)
    current_mileage = models.IntegerField(blank=True, null=True)
    insurance_expiry = models.DateField(blank=True, null=True)
    registration_expiry = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.make} {self.model}"