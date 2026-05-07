from rest_framework.routers import DefaultRouter
from .views import PasswordResetRequestViewSet

router = DefaultRouter()
router.register(r'password-reset-requests', PasswordResetRequestViewSet)

urlpatterns = router.urls