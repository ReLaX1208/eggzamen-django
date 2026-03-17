from django.contrib.auth.models import User
from django.db import models

class SMS(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class AdvUser(models.Model):
    is_activated = models.BooleanField(default=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Spare(models.Model):
    name = models.CharField(max_length=30)


class Machine(models.Model):
    name = models.CharField(max_length=30)
    spares = models.ManyToManyField(Spare)
