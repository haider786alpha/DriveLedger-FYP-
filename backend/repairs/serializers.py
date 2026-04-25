from rest_framework import serializers
from .models import Repair

class RepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repair
        fields = '__all__'