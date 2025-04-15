from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass


class Movie(models.Model):
    movie_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    overview = models.TextField()
    poster_path = models.URLField()
    release_date = models.DateField()
    vote_average = models.FloatField()

    def __str__(self):
        return self.title