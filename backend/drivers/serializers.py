from rest_framework import serializers
from .models import Driver

class DriverSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Driver
        fields = ["id", "user", "user_name", "cnic", "license_number", "address"]