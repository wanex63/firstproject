
from django.urls import path
from .views import MovieListView, MovieList, UserRegisterView, UserLoginView, UserProfileView, FavoriteView

urlpatterns = [
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path('movies/top/', MovieList.as_view(), name='top-movies'),
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('favorites/', FavoriteView.as_view(), name='favorites'),
    path('favorites/<int:movie_id>/', FavoriteView.as_view(), name='favorite-movie'),
]
