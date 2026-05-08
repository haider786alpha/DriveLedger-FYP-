from rest_framework import serializers
from .models import DriverLocation


class DriverLocationSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.user.username', read_only=True)
    driver_cnic = serializers.CharField(source='driver.cnic', read_only=True)
    license_number = serializers.CharField(source='driver.license_number', read_only=True)

    class Meta:
        model = DriverLocation
        fields = [
            'id',
            'driver',
            'driver_name',
            'driver_cnic',
            'license_number',
            'latitude',
            'longitude',
            'address_note',
            'updated_at',
            'created_at',
        ]