from django.contrib import admin
from .models import CityBookingRequest


@admin.register(CityBookingRequest)
class CityBookingRequestAdmin(admin.ModelAdmin):
    list_display = (
        "booking_reference",
        "customer_name",
        "phone",
        "from_city",
        "to_city",
        "travel_date",
        "pickup_time",
        "vehicle_type",
        "estimated_fare",
        "status",
        "created_at",
    )
    list_filter = (
        "status",
        "trip_type",
        "vehicle_type",
        "from_city",
        "to_city",
        "travel_date",
        "created_at",
    )
    search_fields = (
        "booking_reference",
        "customer_name",
        "phone",
        "email",
        "from_city",
        "to_city",
    )
    readonly_fields = (
        "booking_reference",
        "created_at",
        "updated_at",
    )
    ordering = ("-created_at",)

    fieldsets = (
        ("Customer Information", {
            "fields": (
                "booking_reference",
                "customer_name",
                "phone",
                "email",
            )
        }),
        ("Trip Details", {
            "fields": (
                "from_city",
                "to_city",
                "pickup_point",
                "dropoff_point",
                "travel_date",
                "pickup_time",
                "trip_type",
                "return_date",
            )
        }),
        ("Vehicle & Fare", {
            "fields": (
                "vehicle_type",
                "passengers",
                "luggage_bags",
                "estimated_fare",
            )
        }),
        ("Status & Notes", {
            "fields": (
                "status",
                "special_instructions",
            )
        }),
        ("Timestamps", {
            "fields": (
                "created_at",
                "updated_at",
            )
        }),
    )