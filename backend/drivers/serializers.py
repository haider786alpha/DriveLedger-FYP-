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