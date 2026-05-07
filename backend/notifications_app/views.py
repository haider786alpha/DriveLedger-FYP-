# from django.shortcuts import render
# from rest_framework import viewsets
# from .models import Notification
# from .serializers import NotificationSerializer

# class NotificationViewSet(viewsets.ModelViewSet):
#     queryset = Notification.objects.all().order_by('-created_at')
#     serializer_class = NotificationSerializer


from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from drivers.models import Driver
from .models import Notification, NotificationRead
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        driver_id = request.data.get('driver')

        if not driver_id:
            return Response(
                {"driver": "Driver id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            driver = Driver.objects.get(id=driver_id)
        except Driver.DoesNotExist:
            return Response(
                {"driver": "Driver not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if notification.recipient_type == 'driver' and notification.driver_id != driver.id:
            return Response(
                {"detail": "This notification does not belong to this driver."},
                status=status.HTTP_400_BAD_REQUEST
            )

        NotificationRead.objects.get_or_create(
            notification=notification,
            driver=driver
        )

        return Response(
            {"detail": "Notification marked as read."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], url_path='mark-unread')
    def mark_unread(self, request, pk=None):
        notification = self.get_object()
        driver_id = request.data.get('driver')

        if not driver_id:
            return Response(
                {"driver": "Driver id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        deleted_count, _ = NotificationRead.objects.filter(
            notification=notification,
            driver_id=driver_id
        ).delete()

        if deleted_count == 0:
            return Response(
                {"detail": "Notification was already unread."},
                status=status.HTTP_200_OK
            )

        return Response(
            {"detail": "Notification marked as unread."},
            status=status.HTTP_200_OK
        )