# from rest_framework import serializers
# from .models import Car

# class CarSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Car
#         fields = '__all__'


from datetime import date
from rest_framework import serializers
from .models import Car


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = "__all__"

    def validate_make(self, value):
        make = (value or "").strip()

        if not make:
            raise serializers.ValidationError("Make is required.")

        if len(make) < 2:
            raise serializers.ValidationError("Make must be at least 2 characters long.")

        return make

    def validate_model(self, value):
        model = (value or "").strip()

        if not model:
            raise serializers.ValidationError("Model is required.")

        if len(model) < 1:
            raise serializers.ValidationError("Model is required.")

        return model

    def validate_registration_number(self, value):
        registration_number = (value or "").strip().upper()

        if not registration_number:
            raise serializers.ValidationError("Registration number is required.")

        qs = Car.objects.filter(registration_number__iexact=registration_number)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "This registration number is already registered. Please enter a different registration number."
            )

        return registration_number

    def validate_year(self, value):
        current_year = date.today().year

        if not value:
            raise serializers.ValidationError("Year is required.")

        if value < 1980:
            raise serializers.ValidationError("Year cannot be less than 1980.")

        if value > current_year + 1:
            raise serializers.ValidationError("Year cannot be in the far future.")

        return value

    def validate_mileage(self, value):
        if value is None:
            raise serializers.ValidationError("Mileage is required.")

        if value < 0:
            raise serializers.ValidationError("Mileage cannot be negative.")

        return value

    def validate_current_mileage(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Current mileage cannot be negative.")

        return value

    def validate_condition(self, value):
        condition = (value or "").strip()

        allowed_conditions = ["Excellent", "Good", "Average", "Needs Repair"]

        if not condition:
            raise serializers.ValidationError("Condition is required.")

        if condition not in allowed_conditions:
            raise serializers.ValidationError(
                "Condition must be Excellent, Good, Average, or Needs Repair."
            )

        return condition

    def validate(self, attrs):
        mileage = attrs.get("mileage", getattr(self.instance, "mileage", None))
        current_mileage = attrs.get(
            "current_mileage", getattr(self.instance, "current_mileage", None)
        )

        last_service_date = attrs.get(
            "last_service_date", getattr(self.instance, "last_service_date", None)
        )
        next_maintenance_date = attrs.get(
            "next_maintenance_date", getattr(self.instance, "next_maintenance_date", None)
        )
        insurance_expiry = attrs.get(
            "insurance_expiry", getattr(self.instance, "insurance_expiry", None)
        )
        registration_expiry = attrs.get(
            "registration_expiry", getattr(self.instance, "registration_expiry", None)
        )

        today = date.today()

        if current_mileage is not None and mileage is not None:
            if current_mileage < mileage:
                raise serializers.ValidationError({
                    "current_mileage": "Current mileage cannot be less than mileage."
                })

        if last_service_date and next_maintenance_date:
            if next_maintenance_date < last_service_date:
                raise serializers.ValidationError({
                    "next_maintenance_date": "Next maintenance date cannot be before last service date."
                })

        if insurance_expiry and insurance_expiry < today:
            raise serializers.ValidationError({
                "insurance_expiry": "Insurance expiry date cannot be in the past."
            })

        if registration_expiry and registration_expiry < today:
            raise serializers.ValidationError({
                "registration_expiry": "Registration expiry date cannot be in the past."
            })

        return attrs