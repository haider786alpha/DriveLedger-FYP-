from django.db import models
from drivers.models import Driver


class DriverLocation(models.Model):
    driver = models.OneToOneField(
        Driver,
        on_delete=models.CASCADE,
        related_name='location'
    )

    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)

    address_note = models.CharField(max_length=255, blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.driver.user.username} - {self.latitude}, {self.longitude}"