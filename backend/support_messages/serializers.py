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
#             'admin_reply',
#             'replied_at',
#             'status',
#             'created_at',
#         ]


from rest_framework import serializers
from .models import SupportMessage


class SupportMessageSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.user.username', read_only=True)
    issue_attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = SupportMessage
        fields = [
            'id',
            'driver',
            'driver_name',
            'subject',
            'message',
            'issue_attachment',
            'issue_attachment_url',
            'admin_reply',
            'replied_at',
            'status',
            'created_at',
        ]
        extra_kwargs = {
            'issue_attachment': {'required': False, 'allow_null': True},
        }

    def get_issue_attachment_url(self, obj):
        request = self.context.get("request")

        if obj.issue_attachment:
            if request:
                return request.build_absolute_uri(obj.issue_attachment.url)
            return obj.issue_attachment.url

        return None