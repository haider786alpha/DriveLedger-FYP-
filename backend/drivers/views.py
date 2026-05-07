# from django.shortcuts import render

# # Create your views here.
# from rest_framework import viewsets
# from .models import Driver
# from .serializers import DriverSerializer

# class DriverViewSet(viewsets.ModelViewSet):
#     queryset = Driver.objects.all()
#     serializer_class = DriverSerializer


from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Driver
from .serializers import DriverSerializer


class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]