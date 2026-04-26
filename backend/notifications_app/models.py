from django.db import models

# Create your models here.
from django.db import models

class Notification(models.Model):
    TYPE_CHOICES = (
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('success', 'Success'),
    )

    title = models.CharField(max_length=100)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title