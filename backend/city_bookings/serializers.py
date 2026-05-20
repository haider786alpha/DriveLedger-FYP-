from rest_framework import serializers
from .models import CityBookingRequest


class CityBookingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityBookingRequest
        fields = [
            "id",
            "booking_reference",
            "customer_name",
            "phone",
            "email",
            "from_city",
            "to_city",
            "pickup_point",
            "dropoff_point",
            "travel_date",
            "pickup_time",
            "trip_type",
            "return_date",
            "vehicle_type",
            "passengers",
            "luggage_bags",
            "special_instructions",
            "estimated_fare",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "booking_reference",
            "status",
            "created_at",
            "updated_at",
        ]