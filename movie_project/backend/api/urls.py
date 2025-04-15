from django.urls import path
from .views import (
    MovieList,
    UserRegisterView,
    UserLoginView,
    UserProfileView,
    FavoriteView
)

urlpatterns = [
    path('movies/', MovieList.as_view(), name='movie-list'),
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('favorites/', FavoriteView.as_view(), name='favorites-list'),
    path('favorites/<int:movie_id>/', FavoriteView.as_view(), name='favorites-detail'),
]