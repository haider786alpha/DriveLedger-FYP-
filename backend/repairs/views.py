# from django.shortcuts import render

# from rest_framework import viewsets
# from .models import Repair
# from .serializers import RepairSerializer

# class RepairViewSet(viewsets.ModelViewSet):
#     queryset = Repair.objects.all()
#     serializer_class = RepairSerializer


from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Repair
from .serializers import RepairSerializer


class RepairViewSet(viewsets.ModelViewSet):
    queryset = Repair.objects.all()
    serializer_class = RepairSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]