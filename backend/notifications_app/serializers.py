# from rest_framework import serializers
# from drivers.models import Driver
# from .models import Notification, NotificationRead


# class NotificationSerializer(serializers.ModelSerializer):
#     driver_name = serializers.CharField(source='driver.user.username', read_only=True)
#     is_read = serializers.SerializerMethodField()
#     read_at = serializers.SerializerMethodField()

#     targeted_driver_count = serializers.SerializerMethodField()
#     read_count = serializers.SerializerMethodField()
#     unread_count = serializers.SerializerMethodField()

#     class Meta:
#         model = Notification
#         fields = [
#             'id',
#             'title',
#             'message',
#             'notification_type',
#             'recipient_type',
#             'driver',
#             'driver_name',
#             'is_read',
#             'read_at',
#             'targeted_driver_count',
#             'read_count',
#             'unread_count',
#             'created_at',
#         ]

#     def validate(self, attrs):
#         recipient_type = attrs.get('recipient_type')
#         driver = attrs.get('driver')

#         if recipient_type == 'driver' and not driver:
#             raise serializers.ValidationError({
#                 'driver': 'Driver is required when recipient type is single driver.'
#             })

#         if recipient_type == 'all':
#             attrs['driver'] = None

#         return attrs

#     def _get_driver_id(self):
#         request = self.context.get('request')
#         if not request:
#             return None

#         driver_id = request.query_params.get('driver_id')
#         if not driver_id:
#             return None

#         try:
#             return int(driver_id)
#         except (TypeError, ValueError):
#             return None

#     def get_is_read(self, obj):
#         driver_id = self._get_driver_id()
#         if not driver_id:
#             return False

#         return NotificationRead.objects.filter(
#             notification=obj,
#             driver_id=driver_id
#         ).exists()

#     def get_read_at(self, obj):
#         driver_id = self._get_driver_id()
#         if not driver_id:
#             return None

#         read_record = NotificationRead.objects.filter(
#             notification=obj,
#             driver_id=driver_id
#         ).first()

#         return read_record.read_at if read_record else None

#     def get_targeted_driver_count(self, obj):
#         if obj.recipient_type == 'all':
#             return Driver.objects.count()
#         return 1 if obj.driver_id else 0

#     def get_read_count(self, obj):
#         if obj.recipient_type == 'all':
#             return obj.read_records.count()

#         if not obj.driver_id:
#             return 0

#         return 1 if obj.read_records.filter(driver_id=obj.driver_id).exists() else 0

#     def get_unread_count(self, obj):
#         total = self.get_targeted_driver_count(obj)
#         read_count = self.get_read_count(obj)
#         unread = total - read_count
#         return unread if unread > 0 else 0


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

    def _get_choice_values(self, field_name):
        field = Notification._meta.get_field(field_name)
        return [choice[0] for choice in field.choices] if field.choices else []

    def validate_title(self, value):
        title = (value or "").strip()

        if not title:
            raise serializers.ValidationError("Notification title is required.")

        if len(title) < 3:
            raise serializers.ValidationError(
                "Notification title must be at least 3 characters long."
            )

        if len(title) > 150:
            raise serializers.ValidationError(
                "Notification title must not exceed 150 characters."
            )

        return title

    def validate_message(self, value):
        message = (value or "").strip()

        if not message:
            raise serializers.ValidationError("Notification message is required.")

        if len(message) < 5:
            raise serializers.ValidationError(
                "Notification message must be at least 5 characters long."
            )

        if len(message) > 1000:
            raise serializers.ValidationError(
                "Notification message must not exceed 1000 characters."
            )

        return message

    def validate_notification_type(self, value):
        notification_type = (value or "").strip()

        if not notification_type:
            raise serializers.ValidationError("Notification type is required.")

        allowed_types = self._get_choice_values("notification_type")

        if allowed_types and notification_type not in allowed_types:
            raise serializers.ValidationError(
                "Notification type is invalid. Please select a valid notification type."
            )

        return notification_type

    def validate_recipient_type(self, value):
        recipient_type = (value or "").strip()

        if not recipient_type:
            raise serializers.ValidationError("Recipient type is required.")

        allowed_types = self._get_choice_values("recipient_type")

        if allowed_types and recipient_type not in allowed_types:
            raise serializers.ValidationError(
                "Recipient type is invalid. Please select all drivers or single driver."
            )

        return recipient_type

    def validate(self, attrs):
        recipient_type = attrs.get(
            'recipient_type',
            getattr(self.instance, 'recipient_type', None)
        )

        driver = attrs.get(
            'driver',
            getattr(self.instance, 'driver', None)
        )

        title = attrs.get(
            'title',
            getattr(self.instance, 'title', "")
        )

        message = attrs.get(
            'message',
            getattr(self.instance, 'message', "")
        )

        notification_type = attrs.get(
            'notification_type',
            getattr(self.instance, 'notification_type', None)
        )

        if not title:
            raise serializers.ValidationError({
                'title': 'Notification title is required.'
            })

        if not message:
            raise serializers.ValidationError({
                'message': 'Notification message is required.'
            })

        if not notification_type:
            raise serializers.ValidationError({
                'notification_type': 'Notification type is required.'
            })

        if not recipient_type:
            raise serializers.ValidationError({
                'recipient_type': 'Recipient type is required.'
            })

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