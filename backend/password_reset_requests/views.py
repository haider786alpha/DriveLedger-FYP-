from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import PasswordResetRequest
from .serializers import (
    PasswordResetRequestSerializer,
    AdminPasswordResetRequestSerializer,
)


@extend_schema_view(
    list=extend_schema(
        tags=["password-reset"],
        summary="List password reset requests",
        description="Returns all password reset requests submitted by users for admin review."
    ),
    retrieve=extend_schema(
        tags=["password-reset"],
        summary="Retrieve password reset request",
        description="Returns details of a specific password reset request by ID."
    ),
    create=extend_schema(
        tags=["password-reset"],
        summary="Create password reset request",
        description="Allows a user to submit a password reset request. This endpoint is public."
    ),
    update=extend_schema(
        tags=["password-reset"],
        summary="Update password reset request",
        description="Allows admin to update the request status, such as pending or resolved."
    ),
    partial_update=extend_schema(
        tags=["password-reset"],
        summary="Partially update password reset request",
        description="Partially updates password reset request fields, usually status."
    ),
    destroy=extend_schema(
        tags=["password-reset"],
        summary="Delete password reset request",
        description="Deletes a password reset request from the system."
    ),
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