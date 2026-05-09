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