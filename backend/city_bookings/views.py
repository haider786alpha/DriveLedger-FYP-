from rest_framework import viewsets, permissions
from .models import CityBookingRequest
from .serializers import CityBookingRequestSerializer


class CityBookingRequestViewSet(viewsets.ModelViewSet):
    queryset = CityBookingRequest.objects.all()
    serializer_class = CityBookingRequestSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]