from django.urls import path
from .views import (
    MovieListView,
    MovieDetailView,
    UserRegisterView,
    UserLoginView,
    UserProfileView,
    FavoriteListView
)

urlpatterns = [
    # Movies endpoints
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path('movies/<int:movie_id>/', MovieDetailView.as_view(), name='movie-detail'),

    # Auth endpoints
    path('auth/register/', UserRegisterView.as_view(), name='user-register'),
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),

    # Favorites endpoint
    path('favorites/', FavoriteListView.as_view(), name='favorite-list'),
]