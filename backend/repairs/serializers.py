# from rest_framework import serializers
# from .models import Repair


# class RepairSerializer(serializers.ModelSerializer):
#     bill_receipt_url = serializers.SerializerMethodField()
#     car_name = serializers.CharField(source="car.__str__", read_only=True)
#     registration_number = serializers.CharField(
#         source="car.registration_number",
#         read_only=True
#     )

#     class Meta:
#         model = Repair
#         fields = [
#             "id",
#             "car",
#             "car_name",
#             "registration_number",
#             "issue",
#             "priority",
#             "status",
#             "reported_date",
#             "estimated_cost",
#             "actual_cost",
#             "notes",
#             "bill_receipt",
#             "bill_receipt_url",
#         ]
#         extra_kwargs = {
#             "bill_receipt": {"required": False, "allow_null": True},
#         }

#     def get_bill_receipt_url(self, obj):
#         request = self.context.get("request")

#         if obj.bill_receipt:
#             if request:
#                 return request.build_absolute_uri(obj.bill_receipt.url)
#             return obj.bill_receipt.url

#         return None

import os
from datetime import date
from rest_framework import serializers
from .models import Repair


class RepairSerializer(serializers.ModelSerializer):
    bill_receipt_url = serializers.SerializerMethodField()
    car_name = serializers.CharField(source="car.__str__", read_only=True)
    registration_number = serializers.CharField(
        source="car.registration_number",
        read_only=True
    )

    class Meta:
        model = Repair
        fields = [
            "id",
            "car",
            "car_name",
            "registration_number",
            "issue",
            "priority",
            "status",
            "reported_date",
            "estimated_cost",
            "actual_cost",
            "notes",
            "bill_receipt",
            "bill_receipt_url",
        ]
        extra_kwargs = {
            "bill_receipt": {"required": False, "allow_null": True},
        }

    def get_bill_receipt_url(self, obj):
        request = self.context.get("request")

        if obj.bill_receipt:
            if request:
                return request.build_absolute_uri(obj.bill_receipt.url)
            return obj.bill_receipt.url

        return None

    def validate_issue(self, value):
        issue = (value or "").strip()

        if not issue:
            raise serializers.ValidationError("Repair issue is required.")

        if len(issue) < 5:
            raise serializers.ValidationError(
                "Repair issue must be at least 5 characters long."
            )

        return issue

    def validate_reported_date(self, value):
        if not value:
            raise serializers.ValidationError("Reported date is required.")

        if value > date.today():
            raise serializers.ValidationError(
                "Reported date cannot be in the future."
            )

        return value

    def validate_estimated_cost(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError(
                "Estimated cost cannot be negative."
            )

        return value

    def validate_actual_cost(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError(
                "Actual cost cannot be negative."
            )

        return value

    def validate_bill_receipt(self, value):
        if not value:
            return value

        allowed_extensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf"]
        max_size_mb = 5

        ext = os.path.splitext(value.name)[1].lower()

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                "Bill receipt must be JPG, JPEG, PNG, WEBP, or PDF."
            )

        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f"Bill receipt size must not exceed {max_size_mb} MB."
            )

        return value

    def validate(self, attrs):
        car = attrs.get("car", getattr(self.instance, "car", None))
        issue = attrs.get("issue", getattr(self.instance, "issue", None))
        priority = attrs.get("priority", getattr(self.instance, "priority", None))
        status = attrs.get("status", getattr(self.instance, "status", None))
        reported_date = attrs.get(
            "reported_date", getattr(self.instance, "reported_date", None)
        )
        estimated_cost = attrs.get(
            "estimated_cost", getattr(self.instance, "estimated_cost", None)
        )
        actual_cost = attrs.get(
            "actual_cost", getattr(self.instance, "actual_cost", None)
        )

        if not car:
            raise serializers.ValidationError({
                "car": "Car is required."
            })

        if not issue:
            raise serializers.ValidationError({
                "issue": "Repair issue is required."
            })

        if len(str(issue).strip()) < 5:
            raise serializers.ValidationError({
                "issue": "Repair issue must be at least 5 characters long."
            })

        if not priority:
            raise serializers.ValidationError({
                "priority": "Priority is required."
            })

        if not status:
            raise serializers.ValidationError({
                "status": "Repair status is required."
            })

        if not reported_date:
            raise serializers.ValidationError({
                "reported_date": "Reported date is required."
            })

        if reported_date > date.today():
            raise serializers.ValidationError({
                "reported_date": "Reported date cannot be in the future."
            })

        if estimated_cost is not None and estimated_cost < 0:
            raise serializers.ValidationError({
                "estimated_cost": "Estimated cost cannot be negative."
            })

        if actual_cost is not None and actual_cost < 0:
            raise serializers.ValidationError({
                "actual_cost": "Actual cost cannot be negative."
            })

        status_text = str(status).strip().lower()

        if status_text in ["completed", "done", "closed"] and actual_cost is None:
            raise serializers.ValidationError({
                "actual_cost": "Actual cost is required when repair is completed."
            })

        duplicate_repair = Repair.objects.filter(
            car=car,
            issue__iexact=str(issue).strip(),
        ).exclude(status__iexact="completed")

        if self.instance:
            duplicate_repair = duplicate_repair.exclude(pk=self.instance.pk)

        if status_text != "completed" and duplicate_repair.exists():
            raise serializers.ValidationError({
                "non_field_errors": "This car already has an open repair with the same issue."
            })

        return attrs