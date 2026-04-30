from django.db import models
from drivers.models import Driver


class SupportMessage(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('resolved', 'Resolved'),
    )

    driver = models.ForeignKey(
        Driver,
        on_delete=models.CASCADE,
        related_name='support_messages'
    )
    subject = models.CharField(max_length=150)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.driver.user.username}"