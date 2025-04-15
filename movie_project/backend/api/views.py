from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Movie, User
from .serializers import MovieSerializer, UserRegisterSerializer, UserSerializer

# Вьюха для вывода списка фильмов
class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

# Вьюха для получения фильмов с сортировкой по рейтингу
class MovieList(APIView):
    def get(self, request):
        movies = Movie.objects.all().order_by('-vote_average')
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

# Вьюха для регистрации пользователей
class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)

# Вьюха для авторизации пользователей
class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(serializer.errors, status=400)

# Вьюха для получения профиля текущего пользователя
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# Вьюха для работы с избранными фильмами
class FavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, movie_id):
        try:
            movie = Movie.objects.get(movie_id=movie_id)
            request.user.favorites.add(movie)
            return Response({'status': 'added to favorites'})
        except Movie.DoesNotExist:
            return Response({'error': 'Movie not found'}, status=404)

    def delete(self, request, movie_id):
        try:
            movie = Movie.objects.get(movie_id=movie_id)
            request.user.favorites.remove(movie)
            return Response({'status': 'removed from favorites'})
        except Movie.DoesNotExist:
            return Response({'error': 'Movie not found'}, status=404)

    def get(self, request):
        favorites = request.user.favorites.all()
        serializer = MovieSerializer(favorites, many=True)
        return Response(serializer.data)