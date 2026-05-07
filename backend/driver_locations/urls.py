from rest_framework.routers import DefaultRouter
from .views import DriverLocationViewSet

router = DefaultRouter()
router.register(r'driver-locations', DriverLocationViewSet)

urlpatterns = router.urls