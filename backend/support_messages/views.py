# from rest_framework import viewsets
# from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
# from django.utils import timezone

# from .models import SupportMessage
# from .serializers import SupportMessageSerializer


# class SupportMessageViewSet(viewsets.ModelViewSet):
#     queryset = SupportMessage.objects.all().order_by('-created_at')
#     serializer_class = SupportMessageSerializer
#     parser_classes = [MultiPartParser, FormParser, JSONParser]

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
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import SupportMessage
from .serializers import SupportMessageSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["support"],
        summary="List support messages",
        description="Returns all support messages submitted by drivers, including admin replies and issue attachments."
    ),
    retrieve=extend_schema(
        tags=["support"],
        summary="Retrieve a support message",
        description="Returns details of a specific support message by ID."
    ),
    create=extend_schema(
        tags=["support"],
        summary="Create support message",
        description="Creates a support message or issue report from a driver. Supports optional file attachment."
    ),
    update=extend_schema(
        tags=["support"],
        summary="Update support message",
        description="Updates a support message. Admin can add a reply and change the status."
    ),
    partial_update=extend_schema(
        tags=["support"],
        summary="Partially update support message",
        description="Partially updates support fields such as admin_reply or status."
    ),
    destroy=extend_schema(
        tags=["support"],
        summary="Delete support message",
        description="Deletes a support message from the system."
    ),
)
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