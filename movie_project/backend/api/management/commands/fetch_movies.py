import requests
import datetime
import logging
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import Movie
from time import sleep

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Загружает топ фильмов с Kinopoisk API и сохраняет в базу'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=20,
            help='Количество фильмов для загрузки (по умолчанию: 20, максимум 100)'
        )
        parser.add_argument(
            '--type',
            type=str,
            default='TOP_100_POPULAR_FILMS',
            choices=['TOP_100_POPULAR_FILMS', 'TOP_250_BEST_FILMS', 'TOP_AWAIT_FILMS'],
            help='Тип топа (TOP_100_POPULAR_FILMS, TOP_250_BEST_FILMS, TOP_AWAIT_FILMS)'
        )
        parser.add_argument(
            '--delay',
            type=float,
            default=0.5,
            help='Задержка между запросами в секундах (по умолчанию: 0.5)'
        )

    def handle(self, *args, **options):
        API_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top'
        API_KEY = getattr(settings, 'KINOPOISK_API_KEY', '')

        if not API_KEY:
            logger.error("API ключ не найден в настройках Django")
            self.stderr.write("Ошибка: Добавьте KINOPOISK_API_KEY в settings.py")
            return

        headers = {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        }

        count = min(options['count'], 100)
        if count != options['count']:
            self.stdout.write(self.style.WARNING(
                f'Скорректировано количество с {options["count"]} до {count} (максимум)'
            ))

        saved = 0
        page = 1
        retries = 3

        while saved < count:
            params = {
                'type': options['type'],
                'page': page
            }

            try:
                response = requests.get(API_URL, headers=headers, params=params)

                # Обработка Rate Limit
                if response.status_code == 429:
                    if retries > 0:
                        sleep(10)
                        retries -= 1
                        continue
                    else:
                        raise requests.RequestException("Превышен лимит запросов")

                response.raise_for_status()
                data = response.json()
                films = data.get('films', [])

                if not films:
                    break

                for film in films:
                    if saved >= count:
                        break

                    if not film.get('filmId'):
                        logger.warning(f"Пропущен фильм без ID: {film}")
                        continue

                    try:
                        movie_data = self.parse_film_data(film)

                        # Логирование данных фильма
                        logger.info(f"Обрабатываем фильм с ID {film.get('filmId')}: {film.get('nameRu')}")

                        # Сохранение в базу
                        Movie.objects.update_or_create(
                            movie_id=film.get('filmId'),
                            defaults=movie_data
                        )
                        saved += 1
                        logger.info(f"Сохранен фильм: {movie_data['title']}")
                        sleep(options['delay'])

                    except Exception as e:
                        logger.error(f"Ошибка сохранения фильма {film.get('filmId')}: {str(e)}")
                        continue

                page += 1
                retries = 3

            except requests.RequestException as e:
                logger.error(f"Ошибка запроса: {str(e)}")
                self.stderr.write(f"Ошибка: {str(e)}")
                break
            except ValueError as e:
                logger.error(f"Ошибка парсинга JSON: {str(e)}")
                self.stderr.write(f"Ошибка: Неверный формат ответа от API")
                break

        self.stdout.write(self.style.SUCCESS(f'Успешно сохранено {saved} фильмов из {count} запрошенных'))

    def parse_film_data(self, film):
        """Парсинг и подготовка данных фильма"""
        # Обработка даты релиза
        release_date = None
        if film.get('premiereRu'):
            try:
                release_date = datetime.datetime.strptime(
                    film['premiereRu'], '%Y-%m-%d'
                ).date()
            except ValueError:
                pass
        elif film.get('year'):
            try:
                release_date = datetime.date(int(film['year']), 1, 1)
            except ValueError:
                pass

        # Обработка жанров
        genres = [g['genre'] for g in film.get('genres', [])]

        # Основные данные
        return {
            'movie_id': film.get('filmId'),
            'title': film.get('nameRu') or film.get('nameEn') or 'Без названия',
            'overview': film.get('description') or '',
            'poster_path': film.get('posterUrl') or film.get('posterUrlPreview') or '',
            'release_date': release_date,
            'vote_average': float(film.get('rating') or film.get('ratingVoteCount') or 0),
            'runtime': film.get('filmLength') or None,
            'genres': genres,
            'kp_data': film  # Все исходные данные
        }
