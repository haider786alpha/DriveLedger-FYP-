from rest_framework import viewsets
from .models import SupportMessage
from .serializers import SupportMessageSerializer


class SupportMessageViewSet(viewsets.ModelViewSet):
    queryset = SupportMessage.objects.all().order_by('-created_at')
    serializer_class = SupportMessageSerializer