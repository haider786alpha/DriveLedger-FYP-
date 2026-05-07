from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import PasswordResetRequest
from .serializers import (
    PasswordResetRequestSerializer,
    AdminPasswordResetRequestSerializer,
)


class PasswordResetRequestViewSet(viewsets.ModelViewSet):
    queryset = PasswordResetRequest.objects.all().order_by('-created_at')
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return PasswordResetRequestSerializer
        return AdminPasswordResetRequestSerializer

    def perform_update(self, serializer):
        status = self.request.data.get('status')

        if status == 'resolved':
            serializer.save(resolved_at=timezone.now())
        else:
            serializer.save()