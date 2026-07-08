# from rest_framework import serializers
# from .models import Expense


# class ExpenseSerializer(serializers.ModelSerializer):
#     invoice_receipt_url = serializers.SerializerMethodField()
#     car_name = serializers.CharField(source="car.__str__", read_only=True)
#     registration_number = serializers.CharField(
#         source="car.registration_number",
#         read_only=True
#     )

#     class Meta:
#         model = Expense
#         fields = [
#             "id",
#             "car",
#             "car_name",
#             "registration_number",
#             "amount",
#             "expense_date",
#             "category",
#             "notes",
#             "invoice_receipt",
#             "invoice_receipt_url",
#         ]
#         extra_kwargs = {
#             "invoice_receipt": {"required": False, "allow_null": True},
#         }

#     def get_invoice_receipt_url(self, obj):
#         request = self.context.get("request")

#         if obj.invoice_receipt:
#             if request:
#                 return request.build_absolute_uri(obj.invoice_receipt.url)
#             return obj.invoice_receipt.url

#         return None

import os
from datetime import date
from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    invoice_receipt_url = serializers.SerializerMethodField()
    car_name = serializers.CharField(source="car.__str__", read_only=True)
    registration_number = serializers.CharField(
        source="car.registration_number",
        read_only=True
    )

    class Meta:
        model = Expense
        fields = [
            "id",
            "car",
            "car_name",
            "registration_number",
            "amount",
            "expense_date",
            "category",
            "notes",
            "invoice_receipt",
            "invoice_receipt_url",
        ]
        extra_kwargs = {
            "invoice_receipt": {"required": False, "allow_null": True},
        }

    def get_invoice_receipt_url(self, obj):
        request = self.context.get("request")

        if obj.invoice_receipt:
            if request:
                return request.build_absolute_uri(obj.invoice_receipt.url)
            return obj.invoice_receipt.url

        return None

    def validate_amount(self, value):
        if value is None:
            raise serializers.ValidationError("Amount is required.")

        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")

        return value

    def validate_expense_date(self, value):
        if not value:
            raise serializers.ValidationError("Expense date is required.")

        if value > date.today():
            raise serializers.ValidationError("Expense date cannot be in the future.")

        return value

    def validate_category(self, value):
        category = (value or "").strip()

        if not category:
            raise serializers.ValidationError("Expense category is required.")

        if len(category) < 2:
            raise serializers.ValidationError(
                "Expense category must be at least 2 characters long."
            )

        return category

    def validate_invoice_receipt(self, value):
        if not value:
            return value

        allowed_extensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf"]
        max_size_mb = 5

        ext = os.path.splitext(value.name)[1].lower()

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                "Invoice receipt must be JPG, JPEG, PNG, WEBP, or PDF."
            )

        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f"Invoice receipt size must not exceed {max_size_mb} MB."
            )

        return value

    def validate(self, attrs):
        car = attrs.get("car", getattr(self.instance, "car", None))
        amount = attrs.get("amount", getattr(self.instance, "amount", None))
        expense_date = attrs.get(
            "expense_date", getattr(self.instance, "expense_date", None)
        )
        category = attrs.get("category", getattr(self.instance, "category", None))

        if not car:
            raise serializers.ValidationError({
                "car": "Car is required."
            })

        if amount is None:
            raise serializers.ValidationError({
                "amount": "Amount is required."
            })

        if amount <= 0:
            raise serializers.ValidationError({
                "amount": "Amount must be greater than 0."
            })

        if not expense_date:
            raise serializers.ValidationError({
                "expense_date": "Expense date is required."
            })

        if expense_date > date.today():
            raise serializers.ValidationError({
                "expense_date": "Expense date cannot be in the future."
            })

        if not category:
            raise serializers.ValidationError({
                "category": "Expense category is required."
            })

        duplicate_expense = Expense.objects.filter(
            car=car,
            amount=amount,
            expense_date=expense_date,
            category=category,
        )

        if self.instance:
            duplicate_expense = duplicate_expense.exclude(pk=self.instance.pk)

        if duplicate_expense.exists():
            raise serializers.ValidationError({
                "non_field_errors": "This expense already exists for the selected car, date, amount, and category."
            })

        return attrs