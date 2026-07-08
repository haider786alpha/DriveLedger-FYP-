# from rest_framework import serializers
# from .models import Payment

# class PaymentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Payment
#         fields = '__all__'

from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"

    def validate_amount(self, value):
        if value is None:
            raise serializers.ValidationError("Amount is required.")

        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")

        return value

    def validate_payment_date(self, value):
        if not value:
            raise serializers.ValidationError("Payment date is required.")

        return value

    def validate_status(self, value):
        status_value = (value or "").strip().lower()

        if not status_value:
            raise serializers.ValidationError("Payment status is required.")

        allowed_statuses = ["paid", "unpaid"]

        if status_value not in allowed_statuses:
            raise serializers.ValidationError(
                "Payment status must be paid or unpaid."
            )

        return status_value

    def validate(self, attrs):
        assignment = attrs.get("assignment", getattr(self.instance, "assignment", None))
        amount = attrs.get("amount", getattr(self.instance, "amount", None))
        payment_date = attrs.get(
            "payment_date", getattr(self.instance, "payment_date", None)
        )
        status = attrs.get("status", getattr(self.instance, "status", None))

        if not assignment:
            raise serializers.ValidationError({
                "assignment": "Assignment is required."
            })

        if not payment_date:
            raise serializers.ValidationError({
                "payment_date": "Payment date is required."
            })

        assignment_start_date = getattr(assignment, "start_date", None)
        assignment_end_date = getattr(assignment, "end_date", None)
        assignment_status = getattr(assignment, "status", "")

        if assignment_start_date and payment_date < assignment_start_date:
            raise serializers.ValidationError({
                "payment_date": "Payment date cannot be before assignment start date."
            })

        if assignment_end_date and payment_date > assignment_end_date:
            raise serializers.ValidationError({
                "payment_date": "Payment date cannot be after assignment end date."
            })

        if str(assignment_status).lower() == "completed" and not assignment_end_date:
            raise serializers.ValidationError({
                "assignment": "Completed assignment must have an end date before payment can be recorded."
            })

        duplicate_payment = Payment.objects.filter(
            assignment=assignment,
            payment_date=payment_date,
            amount=amount,
        )

        if self.instance:
            duplicate_payment = duplicate_payment.exclude(pk=self.instance.pk)

        if duplicate_payment.exists():
            raise serializers.ValidationError({
                "non_field_errors": "This payment already exists for the selected assignment, date, and amount."
            })

        if status and str(status).lower() not in ["paid", "unpaid"]:
            raise serializers.ValidationError({
                "status": "Payment status must be paid or unpaid."
            })

        return attrs