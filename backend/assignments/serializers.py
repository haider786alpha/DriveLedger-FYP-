from rest_framework import serializers
from .models import Assignment
from datetime import date

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = "__all__"

    def validate(self, data):
        driver = data.get("driver")
        car = data.get("car")
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        status = data.get("status")

        # Handle open-ended assignments
        if not end_date:
            end_date = date.max

        # Date validation
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                "End date cannot be before start date."
            )

        # 🔒 Prevent changing driver/car if assignment is already active
        if self.instance:
            if self.instance.status == "active":
                if driver != self.instance.driver:
                    raise serializers.ValidationError(
                        "Cannot change driver of an active assignment."
                    )

                if car != self.instance.car:
                    raise serializers.ValidationError(
                        "Cannot change car of an active assignment."
                    )

        # 🚫 Overlap validation (only for active assignments)
        if status == "active":

            car_overlap = Assignment.objects.filter(
                car=car,
                status="active",
                start_date__lte=end_date,
            ).filter(
                end_date__gte=start_date
            ) | Assignment.objects.filter(
                car=car,
                status="active",
                start_date__lte=end_date,
                end_date__isnull=True,
            )

            driver_overlap = Assignment.objects.filter(
                driver=driver,
                status="active",
                start_date__lte=end_date,
            ).filter(
                end_date__gte=start_date
            ) | Assignment.objects.filter(
                driver=driver,
                status="active",
                start_date__lte=end_date,
                end_date__isnull=True,
            )

            # Exclude current instance when editing
            if self.instance:
                car_overlap = car_overlap.exclude(id=self.instance.id)
                driver_overlap = driver_overlap.exclude(id=self.instance.id)

            if car_overlap.exists():
                raise serializers.ValidationError(
                    "This car is already assigned during these dates."
                )

            if driver_overlap.exists():
                raise serializers.ValidationError(
                    "This driver already has a car assigned during these dates."
                )

        return data