# from rest_framework import serializers
# from .models import PasswordResetRequest


# class PasswordResetRequestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PasswordResetRequest
#         fields = [
#             'id',
#             'username',
#             'email',
#             'message',
#             'status',
#             'admin_note',
#             'created_at',
#             'resolved_at',
#         ]
#         read_only_fields = ['status', 'admin_note', 'created_at', 'resolved_at']


# class AdminPasswordResetRequestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PasswordResetRequest
#         fields = [
#             'id',
#             'username',
#             'email',
#             'message',
#             'status',
#             'admin_note',
#             'created_at',
#             'resolved_at',
#         ]

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers
from .models import PasswordResetRequest


User = get_user_model()


class PasswordResetRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetRequest
        fields = [
            'id',
            'username',
            'email',
            'message',
            'status',
            'admin_note',
            'created_at',
            'resolved_at',
        ]
        read_only_fields = ['status', 'admin_note', 'created_at', 'resolved_at']

    def validate_username(self, value):
        username = (value or "").strip()

        if not username:
            raise serializers.ValidationError("Username is required.")

        if len(username) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters long."
            )

        return username

    def validate_email(self, value):
        email = (value or "").strip().lower()

        if not email:
            raise serializers.ValidationError("Email is required.")

        return email

    def validate_message(self, value):
        if value is None:
            return value

        message = value.strip()

        if message and len(message) < 5:
            raise serializers.ValidationError(
                "Message must be at least 5 characters long."
            )

        if len(message) > 500:
            raise serializers.ValidationError(
                "Message must not exceed 500 characters."
            )

        return message

    def validate(self, attrs):
        username = attrs.get("username", "")
        email = attrs.get("email", "")

        user = User.objects.filter(username__iexact=username).first()

        if not user:
            raise serializers.ValidationError({
                "username": "No user account exists with this username."
            })

        if (user.email or "").strip().lower() != email:
            raise serializers.ValidationError({
                "email": "Email does not match this username."
            })

        duplicate_request = PasswordResetRequest.objects.filter(
            username__iexact=username,
            email__iexact=email,
            status__iexact="pending"
        )

        if duplicate_request.exists():
            raise serializers.ValidationError({
                "non_field_errors": "A pending password reset request already exists for this user."
            })

        attrs["username"] = user.username
        attrs["email"] = (user.email or "").strip().lower()

        return attrs


class AdminPasswordResetRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetRequest
        fields = [
            'id',
            'username',
            'email',
            'message',
            'status',
            'admin_note',
            'created_at',
            'resolved_at',
        ]
        read_only_fields = ['username', 'email', 'message', 'created_at', 'resolved_at']

    def _get_choice_values(self, field_name):
        field = PasswordResetRequest._meta.get_field(field_name)
        return [choice[0] for choice in field.choices] if field.choices else []

    def validate_status(self, value):
        status = (value or "").strip().lower()

        if not status:
            raise serializers.ValidationError("Status is required.")

        allowed_statuses = self._get_choice_values("status")

        if allowed_statuses and status not in allowed_statuses:
            raise serializers.ValidationError(
                "Status is invalid. Please select pending or resolved."
            )

        if not allowed_statuses and status not in ["pending", "resolved"]:
            raise serializers.ValidationError(
                "Status must be pending or resolved."
            )

        return status

    def validate_admin_note(self, value):
        if value is None:
            return value

        admin_note = value.strip()

        if len(admin_note) > 500:
            raise serializers.ValidationError(
                "Admin note must not exceed 500 characters."
            )

        return admin_note

    def update(self, instance, validated_data):
        new_status = validated_data.get("status", instance.status)

        if new_status == "resolved" and instance.status != "resolved":
            instance.resolved_at = timezone.now()

        if new_status == "pending":
            instance.resolved_at = None

        instance.status = new_status
        instance.admin_note = validated_data.get("admin_note", instance.admin_note)

        instance.save()
        return instance