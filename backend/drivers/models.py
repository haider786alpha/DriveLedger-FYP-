from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cnic = models.CharField(max_length=20)
    license_number = models.CharField(max_length=50)
    address = models.TextField()

    def __str__(self):
        return self.user.username