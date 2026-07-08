# from rest_framework import serializers
# from .models import Driver


# class DriverSerializer(serializers.ModelSerializer):
#     user_name = serializers.CharField(source="user.username", read_only=True)
#     email = serializers.EmailField(source="user.email", required=False)

#     profile_photo_url = serializers.SerializerMethodField()
#     license_copy_url = serializers.SerializerMethodField()

#     class Meta:
#         model = Driver
#         fields = [
#             "id",
#             "user",
#             "user_name",
#             "email",
#             "cnic",
#             "license_number",
#             "address",
#             "profile_photo",
#             "license_copy",
#             "profile_photo_url",
#             "license_copy_url",
#         ]
#         extra_kwargs = {
#     "profile_photo": {"required": False, "allow_null": True},
#     "license_copy": {"required": False, "allow_null": True},
# }

#     def get_profile_photo_url(self, obj):
#         request = self.context.get("request")
#         if obj.profile_photo:
#             if request:
#                 return request.build_absolute_uri(obj.profile_photo.url)
#             return obj.profile_photo.url
#         return None

#     def get_license_copy_url(self, obj):
#         request = self.context.get("request")
#         if obj.license_copy:
#             if request:
#                 return request.build_absolute_uri(obj.license_copy.url)
#             return obj.license_copy.url
#         return None

#     def update(self, instance, validated_data):
#         user_data = validated_data.pop("user", {})

#         email = user_data.get("email")
#         if email is not None:
#             instance.user.email = email
#             instance.user.save(update_fields=["email"])

#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)

#         instance.save()
#         return instance

import os
import re
from rest_framework import serializers
from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", required=False)

    profile_photo_url = serializers.SerializerMethodField()
    license_copy_url = serializers.SerializerMethodField()

    class Meta:
        model = Driver
        fields = [
            "id",
            "user",
            "user_name",
            "email",
            "cnic",
            "license_number",
            "address",
            "profile_photo",
            "license_copy",
            "profile_photo_url",
            "license_copy_url",
        ]
        extra_kwargs = {
            "profile_photo": {"required": False, "allow_null": True},
            "license_copy": {"required": False, "allow_null": True},
        }

    def get_profile_photo_url(self, obj):
        request = self.context.get("request")
        if obj.profile_photo:
            if request:
                return request.build_absolute_uri(obj.profile_photo.url)
            return obj.profile_photo.url
        return None

    def get_license_copy_url(self, obj):
        request = self.context.get("request")
        if obj.license_copy:
            if request:
                return request.build_absolute_uri(obj.license_copy.url)
            return obj.license_copy.url
        return None

    def validate_user(self, value):
        if value.is_staff:
            raise serializers.ValidationError(
                "Admin users cannot be used as driver profiles. Please select a driver user."
            )

        qs = Driver.objects.filter(user=value)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "This user already has a driver profile."
            )

        return value

    def validate_cnic(self, value):
        cnic = (value or "").strip()

        if not cnic:
            raise serializers.ValidationError("CNIC is required.")

        if not re.match(r"^\d{5}-\d{7}-\d$", cnic):
            raise serializers.ValidationError(
                "CNIC must be in this format: 12345-1234567-1."
            )

        qs = Driver.objects.filter(cnic__iexact=cnic)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "This CNIC is already registered. Please enter a different CNIC."
            )

        return cnic

    def validate_license_number(self, value):
        license_number = (value or "").strip()

        if not license_number:
            raise serializers.ValidationError("License number is required.")

        if len(license_number) < 4:
            raise serializers.ValidationError(
                "License number must be at least 4 characters long."
            )

        qs = Driver.objects.filter(license_number__iexact=license_number)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "This license number is already registered. Please enter a different license number."
            )

        return license_number

    def validate_address(self, value):
        address = (value or "").strip()

        if not address:
            raise serializers.ValidationError("Address is required.")

        if len(address) < 5:
            raise serializers.ValidationError(
                "Address must be at least 5 characters long."
            )

        return address

    def validate_profile_photo(self, value):
        if not value:
            return value

        allowed_extensions = [".jpg", ".jpeg", ".png", ".webp"]
        max_size_mb = 2

        ext = os.path.splitext(value.name)[1].lower()

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                "Profile photo must be JPG, JPEG, PNG, or WEBP."
            )

        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f"Profile photo size must not exceed {max_size_mb} MB."
            )

        return value

    def validate_license_copy(self, value):
        if not value:
            return value

        allowed_extensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf"]
        max_size_mb = 5

        ext = os.path.splitext(value.name)[1].lower()

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                "License copy must be an image or PDF file."
            )

        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f"License copy size must not exceed {max_size_mb} MB."
            )

        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        email = user_data.get("email")
        if email is not None:
            instance.user.email = email
            instance.user.save(update_fields=["email"])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance