import requests
from django.core.management.base import BaseCommand
from api.models import Movie

API_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top'
API_KEY = '723d5c65-b483-4705-9e0d-c5903d3696b5'

class Command(BaseCommand):
    help = 'Загружает популярные фильмы с API Кинопоиска'

    def handle(self, *args, **kwargs):
        headers = {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        }
        params = {
            'type': 'TOP_100_POPULAR_FILMS',
            'page': 1
        }

        try:
            response = requests.get(API_URL, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as e:
            self.stderr.write(f"Ошибка запроса к Kinopoisk API: {e}")
            return

        saved = 0
        for film in data.get('films', []):
            movie, created = Movie.objects.update_or_create(
                movie_id=film.get('filmId'),
                defaults={
                    'title': film.get('nameRu') or film.get('nameEn'),
                    'overview': film.get('description'),
                    'poster_path': film.get('posterUrl'),
                    'release_date': film.get('year'),
                    'vote_average': float(film.get('rating') or 0),
                    'kp_data': film
                }
            )
            saved += 1

        self.stdout.write(f'Сохранено фильмов: {saved}')
