from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CityBookingRequestViewSet

router = DefaultRouter()
router.register(r"city-bookings", CityBookingRequestViewSet, basename="city-bookings")

urlpatterns = [
    path("", include(router.urls)),
]