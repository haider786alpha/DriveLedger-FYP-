# from rest_framework import serializers
# from .models import Driver

# class DriverSerializer(serializers.ModelSerializer):
#     user_name = serializers.CharField(source="user.username", read_only=True)

#     class Meta:
#         model = Driver
#         fields = ["id", "user", "user_name", "cnic", "license_number", "address"]

from rest_framework import serializers
from .models import Driver

class DriverSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", required=False)

    class Meta:
        model = Driver
        fields = ["id", "user", "user_name", "email", "cnic", "license_number", "address"]
        extra_kwargs = {
            "user": {"read_only": True},
        }

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