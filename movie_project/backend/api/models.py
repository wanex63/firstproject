from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        verbose_name='группы',
        blank=True,
        related_name="api_users",
        related_query_name="api_user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='права пользователя',
        blank=True,
        related_name="api_users_perms",
        related_query_name="api_user",
    )
    favorites = models.ManyToManyField('Movie', related_name='liked_by', blank=True)

class Movie(models.Model):
    movie_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    overview = models.TextField(blank=True, null=True)
    poster_path = models.CharField(max_length=500, blank=True, null=True)
    release_date = models.CharField(max_length=10, blank=True, null=True)
    vote_average = models.FloatField(blank=True, null=True)
    kp_data = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.title
