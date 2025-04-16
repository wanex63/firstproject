from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):


    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user',
        related_query_name='api_user',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user',
        related_query_name='api_user',
        blank=True,
    )

    class Meta:
        db_table = 'api_user'  # Указываем явное имя таблицы

    def __str__(self):
        return self.username

class Movie(models.Model):
    movie_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    overview = models.TextField(blank=True)
    poster_path = models.URLField(blank=True)
    release_date = models.DateField(null=True, blank=True)
    vote_average = models.FloatField(default=0)
    genres = models.JSONField(default=list)
    runtime = models.CharField(max_length=20, blank=True, null=True)
    kp_data = models.JSONField(default=dict)

    class Meta:
        db_table = 'api_movie'  # Явное указание имени таблицы

    def __str__(self):
        return self.title


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True)

    class Meta:
        unique_together = ('user', 'movie')