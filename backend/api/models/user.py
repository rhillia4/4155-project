from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    portfolio_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    risk_level = models.CharField(max_length=50, default="moderate")

    def __str__(self):
        return f"{self.user.username} Profile"

# Automatically create or save Profile when User is created/updated
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()
