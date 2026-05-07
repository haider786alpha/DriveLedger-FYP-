# from rest_framework import serializers
# from .models import SupportMessage


# class SupportMessageSerializer(serializers.ModelSerializer):
#     driver_name = serializers.CharField(source='driver.user.username', read_only=True)

#     class Meta:
#         model = SupportMessage
#         fields = [
#             'id',
#             'driver',
#             'driver_name',
#             'subject',
#             'message',
#             'status',
#             'created_at',
#         ]

from rest_framework import serializers
from .models import SupportMessage


class SupportMessageSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.user.username', read_only=True)

    class Meta:
        model = SupportMessage
        fields = [
            'id',
            'driver',
            'driver_name',
            'subject',
            'message',
            'admin_reply',
            'replied_at',
            'status',
            'created_at',
        ]