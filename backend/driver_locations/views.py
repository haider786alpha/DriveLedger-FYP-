from rest_framework import viewsets
from .models import DriverLocation
from .serializers import DriverLocationSerializer


class DriverLocationViewSet(viewsets.ModelViewSet):
    queryset = DriverLocation.objects.all().order_by('-updated_at')
    serializer_class = DriverLocationSerializer