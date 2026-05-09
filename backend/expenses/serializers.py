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