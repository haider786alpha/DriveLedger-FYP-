from django.db import models
from drivers.models import Driver


class Notification(models.Model):
    TYPE_CHOICES = (
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('success', 'Success'),
    )

    RECIPIENT_CHOICES = (
        ('all', 'All Drivers'),
        ('driver', 'Single Driver'),
    )

    title = models.CharField(max_length=100)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='info'
    )

    recipient_type = models.CharField(
        max_length=10,
        choices=RECIPIENT_CHOICES,
        default='all'
    )

    driver = models.ForeignKey(
        Driver,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.recipient_type == 'all':
            return f"{self.title} - All Drivers"
        return f"{self.title} - {self.driver.user.username if self.driver else 'No Driver'}"


class NotificationRead(models.Model):
    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name='read_records'
    )
    driver = models.ForeignKey(
        Driver,
        on_delete=models.CASCADE,
        related_name='notification_reads'
    )
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('notification', 'driver')

    def __str__(self):
        return f"{self.notification.title} read by {self.driver.user.username}"