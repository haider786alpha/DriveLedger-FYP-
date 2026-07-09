from decimal import Decimal

from django.db.models import Count, Sum
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import CityBookingRequest
from .serializers import CityBookingRequestSerializer


class CityBookingRequestViewSet(viewsets.ModelViewSet):
    queryset = CityBookingRequest.objects.all()
    serializer_class = CityBookingRequestSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def _sum_by_status(self, status):
        total = CityBookingRequest.objects.filter(status=status).aggregate(
            total=Sum("estimated_fare")
        )["total"]

        return total or Decimal("0.00")

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        total_booking_value = CityBookingRequest.objects.exclude(
            status="cancelled"
        ).aggregate(total=Sum("estimated_fare"))["total"] or Decimal("0.00")

        pending_value = self._sum_by_status("pending")
        contacted_value = self._sum_by_status("contacted")
        confirmed_value = self._sum_by_status("confirmed")
        completed_earnings = self._sum_by_status("completed")
        cancelled_value = self._sum_by_status("cancelled")

        status_counts = CityBookingRequest.objects.values("status").annotate(
            count=Count("id")
        )

        counts_map = {item["status"]: item["count"] for item in status_counts}

        total_requests = CityBookingRequest.objects.count()
        pending_requests = counts_map.get("pending", 0)
        contacted_requests = counts_map.get("contacted", 0)
        confirmed_requests = counts_map.get("confirmed", 0)
        completed_requests = counts_map.get("completed", 0)
        cancelled_requests = counts_map.get("cancelled", 0)

        return Response(
            {
                "total_requests": total_requests,
                "pending_requests": pending_requests,
                "contacted_requests": contacted_requests,
                "confirmed_requests": confirmed_requests,
                "completed_requests": completed_requests,
                "cancelled_requests": cancelled_requests,
                "total_booking_value": total_booking_value,
                "pending_value": pending_value,
                "contacted_value": contacted_value,
                "confirmed_value": confirmed_value,
                "completed_earnings": completed_earnings,
                "cancelled_value": cancelled_value,
            }
        )