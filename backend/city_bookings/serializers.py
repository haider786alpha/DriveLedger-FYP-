# from rest_framework import serializers
# from .models import CityBookingRequest


# class CityBookingRequestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CityBookingRequest
#         fields = [
#             "id",
#             "booking_reference",
#             "customer_name",
#             "phone",
#             "email",
#             "from_city",
#             "to_city",
#             "pickup_point",
#             "dropoff_point",
#             "travel_date",
#             "pickup_time",
#             "trip_type",
#             "return_date",
#             "vehicle_type",
#             "passengers",
#             "luggage_bags",
#             "special_instructions",
#             "estimated_fare",
#             "status",
#             "created_at",
#             "updated_at",
#         ]
#         read_only_fields = [
#             "id",
#             "booking_reference",
#             "created_at",
#             "updated_at",
#         ]

import re
from datetime import date
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
            "created_at",
            "updated_at",
        ]

    def validate_customer_name(self, value):
        customer_name = (value or "").strip()

        if not customer_name:
            raise serializers.ValidationError("Customer name is required.")

        if len(customer_name) < 2:
            raise serializers.ValidationError(
                "Customer name must be at least 2 characters long."
            )

        return customer_name

    def validate_phone(self, value):
        phone = (value or "").strip()

        if not phone:
            raise serializers.ValidationError("Phone number is required.")

        phone_pattern = r"^\+?\d{10,15}$"

        clean_phone = phone.replace(" ", "").replace("-", "")

        if not re.match(phone_pattern, clean_phone):
            raise serializers.ValidationError(
                "Phone number must contain 10 to 15 digits."
            )

        return phone

    def validate_from_city(self, value):
        from_city = (value or "").strip()

        if not from_city:
            raise serializers.ValidationError("From city is required.")

        if len(from_city) < 2:
            raise serializers.ValidationError(
                "From city must be at least 2 characters long."
            )

        return from_city

    def validate_to_city(self, value):
        to_city = (value or "").strip()

        if not to_city:
            raise serializers.ValidationError("To city is required.")

        if len(to_city) < 2:
            raise serializers.ValidationError(
                "To city must be at least 2 characters long."
            )

        return to_city

    def validate_pickup_point(self, value):
        pickup_point = (value or "").strip()

        if not pickup_point:
            raise serializers.ValidationError("Pickup point is required.")

        if len(pickup_point) < 3:
            raise serializers.ValidationError(
                "Pickup point must be at least 3 characters long."
            )

        return pickup_point

    def validate_dropoff_point(self, value):
        dropoff_point = (value or "").strip()

        if not dropoff_point:
            raise serializers.ValidationError("Drop-off point is required.")

        if len(dropoff_point) < 3:
            raise serializers.ValidationError(
                "Drop-off point must be at least 3 characters long."
            )

        return dropoff_point

    def validate_travel_date(self, value):
        if not value:
            raise serializers.ValidationError("Travel date is required.")

        if value < date.today():
            raise serializers.ValidationError(
                "Travel date cannot be in the past."
            )

        return value

    def validate_pickup_time(self, value):
        if not value:
            raise serializers.ValidationError("Pickup time is required.")

        return value

    def validate_passengers(self, value):
        if value is None:
            raise serializers.ValidationError("Number of passengers is required.")

        if value < 1:
            raise serializers.ValidationError(
                "At least 1 passenger is required."
            )

        if value > 50:
            raise serializers.ValidationError(
                "Passengers cannot be more than 50."
            )

        return value

    def validate_luggage_bags(self, value):
        if value is None:
            return value

        if value < 0:
            raise serializers.ValidationError(
                "Luggage bags cannot be negative."
            )

        if value > 50:
            raise serializers.ValidationError(
                "Luggage bags cannot be more than 50."
            )

        return value

    def validate_estimated_fare(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError(
                "Estimated fare cannot be negative."
            )

        return value

    def validate(self, attrs):
        from_city = attrs.get("from_city", getattr(self.instance, "from_city", ""))
        to_city = attrs.get("to_city", getattr(self.instance, "to_city", ""))
        travel_date = attrs.get(
            "travel_date", getattr(self.instance, "travel_date", None)
        )
        return_date = attrs.get(
            "return_date", getattr(self.instance, "return_date", None)
        )
        trip_type = attrs.get("trip_type", getattr(self.instance, "trip_type", ""))
        vehicle_type = attrs.get(
            "vehicle_type", getattr(self.instance, "vehicle_type", "")
        )
        passengers = attrs.get(
            "passengers", getattr(self.instance, "passengers", None)
        )
        phone = attrs.get("phone", getattr(self.instance, "phone", ""))
        pickup_time = attrs.get(
            "pickup_time", getattr(self.instance, "pickup_time", None)
        )

        if from_city and to_city:
            if str(from_city).strip().lower() == str(to_city).strip().lower():
                raise serializers.ValidationError({
                    "to_city": "From city and to city cannot be the same."
                })

        if trip_type:
            trip_type_text = str(trip_type).strip().lower()

            if trip_type_text in ["round_trip", "round trip", "return"]:
                if not return_date:
                    raise serializers.ValidationError({
                        "return_date": "Return date is required for round trip booking."
                    })

            if return_date and travel_date:
                if return_date < travel_date:
                    raise serializers.ValidationError({
                        "return_date": "Return date cannot be before travel date."
                    })

        if vehicle_type and passengers:
            vehicle_text = str(vehicle_type).strip().lower()

            if vehicle_text in ["car", "sedan"] and passengers > 4:
                raise serializers.ValidationError({
                    "passengers": "Sedan/Car cannot have more than 4 passengers."
                })

            if vehicle_text in ["suv", "jeep"] and passengers > 7:
                raise serializers.ValidationError({
                    "passengers": "SUV/Jeep cannot have more than 7 passengers."
                })

            if vehicle_text in ["van", "hiace"] and passengers > 15:
                raise serializers.ValidationError({
                    "passengers": "Van/Hiace cannot have more than 15 passengers."
                })

        duplicate_booking = CityBookingRequest.objects.filter(
            phone=phone,
            from_city__iexact=str(from_city).strip(),
            to_city__iexact=str(to_city).strip(),
            travel_date=travel_date,
            pickup_time=pickup_time,
        ).exclude(status__iexact="cancelled")

        if self.instance:
            duplicate_booking = duplicate_booking.exclude(pk=self.instance.pk)

        if duplicate_booking.exists():
            raise serializers.ValidationError({
                "non_field_errors": "This booking request already exists for the same phone, cities, date, and pickup time."
            })

        return attrs