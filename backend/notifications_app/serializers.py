# from rest_framework import serializers
# from .models import Notification

# class NotificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Notification
#         fields = '__all__'

from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.user.username', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'title',
            'message',
            'notification_type',
            'recipient_type',
            'driver',
            'driver_name',
            'created_at',
        ]

    def validate(self, attrs):
        recipient_type = attrs.get('recipient_type')
        driver = attrs.get('driver')

        if recipient_type == 'driver' and not driver:
            raise serializers.ValidationError({
                'driver': 'Driver is required when recipient type is single driver.'
            })

        if recipient_type == 'all':
            attrs['driver'] = None

        return attrs