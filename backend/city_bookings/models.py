from django.db import models


class CityBookingRequest(models.Model):
    class TripType(models.TextChoices):
        ONE_WAY = "one_way", "One Way"
        ROUND_TRIP = "round_trip", "Round Trip"

    class VehicleType(models.TextChoices):
        ECONOMY = "economy", "Economy"
        COMFORT = "comfort", "Comfort"
        FAMILY = "family", "Family / 7-Seater"
        PREMIUM = "premium", "Premium"

    class BookingStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        CONTACTED = "contacted", "Contacted"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    customer_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True, null=True)

    from_city = models.CharField(max_length=80)
    to_city = models.CharField(max_length=80)
    pickup_point = models.CharField(max_length=255)
    dropoff_point = models.CharField(max_length=255)

    travel_date = models.DateField()
    pickup_time = models.TimeField()

    trip_type = models.CharField(
        max_length=20,
        choices=TripType.choices,
        default=TripType.ONE_WAY,
    )
    return_date = models.DateField(blank=True, null=True)

    vehicle_type = models.CharField(
        max_length=20,
        choices=VehicleType.choices,
        default=VehicleType.ECONOMY,
    )

    passengers = models.PositiveIntegerField(default=1)
    luggage_bags = models.PositiveIntegerField(default=0)
    special_instructions = models.TextField(blank=True, null=True)

    estimated_fare = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING,
    )

    booking_reference = models.CharField(max_length=30, unique=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            last_id = CityBookingRequest.objects.count() + 1
            self.booking_reference = f"DE-{last_id:05d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_reference} - {self.customer_name} ({self.from_city} to {self.to_city})"

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "City Booking Request"
        verbose_name_plural = "City Booking Requests"