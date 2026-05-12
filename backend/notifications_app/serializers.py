from rest_framework import serializers
from drivers.models import Driver
from .models import Notification, NotificationRead


class NotificationSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.user.username', read_only=True)
    is_read = serializers.SerializerMethodField()
    read_at = serializers.SerializerMethodField()

    targeted_driver_count = serializers.SerializerMethodField()
    read_count = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

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
            'is_read',
            'read_at',
            'targeted_driver_count',
            'read_count',
            'unread_count',
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

    def _get_driver_id(self):
        request = self.context.get('request')
        if not request:
            return None

        driver_id = request.query_params.get('driver_id')
        if not driver_id:
            return None

        try:
            return int(driver_id)
        except (TypeError, ValueError):
            return None

    def get_is_read(self, obj):
        driver_id = self._get_driver_id()
        if not driver_id:
            return False

        return NotificationRead.objects.filter(
            notification=obj,
            driver_id=driver_id
        ).exists()

    def get_read_at(self, obj):
        driver_id = self._get_driver_id()
        if not driver_id:
            return None

        read_record = NotificationRead.objects.filter(
            notification=obj,
            driver_id=driver_id
        ).first()

        return read_record.read_at if read_record else None

    def get_targeted_driver_count(self, obj):
        if obj.recipient_type == 'all':
            return Driver.objects.count()
        return 1 if obj.driver_id else 0

    def get_read_count(self, obj):
        if obj.recipient_type == 'all':
            return obj.read_records.count()

        if not obj.driver_id:
            return 0

        return 1 if obj.read_records.filter(driver_id=obj.driver_id).exists() else 0

    def get_unread_count(self, obj):
        total = self.get_targeted_driver_count(obj)
        read_count = self.get_read_count(obj)
        unread = total - read_count
        return unread if unread > 0 else 0