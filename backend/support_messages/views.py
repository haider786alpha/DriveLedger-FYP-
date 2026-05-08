# from rest_framework import viewsets
# from django.utils import timezone
# from .models import SupportMessage
# from .serializers import SupportMessageSerializer


# class SupportMessageViewSet(viewsets.ModelViewSet):
#     queryset = SupportMessage.objects.all().order_by('-created_at')
#     serializer_class = SupportMessageSerializer

#     def perform_update(self, serializer):
#         instance = self.get_object()
#         old_reply = instance.admin_reply

#         updated_instance = serializer.save()

#         if updated_instance.admin_reply and updated_instance.admin_reply != old_reply:
#             if not updated_instance.replied_at:
#                 updated_instance.replied_at = timezone.now()
#                 updated_instance.save(update_fields=['replied_at'])


from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone

from .models import SupportMessage
from .serializers import SupportMessageSerializer


class SupportMessageViewSet(viewsets.ModelViewSet):
    queryset = SupportMessage.objects.all().order_by('-created_at')
    serializer_class = SupportMessageSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_update(self, serializer):
        instance = self.get_object()
        old_reply = instance.admin_reply

        updated_instance = serializer.save()

        if updated_instance.admin_reply and updated_instance.admin_reply != old_reply:
            if not updated_instance.replied_at:
                updated_instance.replied_at = timezone.now()
                updated_instance.save(update_fields=['replied_at'])