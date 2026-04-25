from rest_framework.routers import DefaultRouter
from .views import RepairViewSet

router = DefaultRouter()
router.register(r'repairs', RepairViewSet)

urlpatterns = router.urls