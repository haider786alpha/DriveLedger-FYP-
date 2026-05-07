from rest_framework import serializers
from .models import PasswordResetRequest


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