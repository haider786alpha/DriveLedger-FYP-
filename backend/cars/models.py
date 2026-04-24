from django.db import models

# Create your models here.
from django.db import models

class Car(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    registration_number = models.CharField(max_length=20)
    mileage = models.IntegerField()
    condition = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.make} {self.model}"