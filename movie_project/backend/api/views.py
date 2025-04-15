import requests
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from .models import Movie, User
from .serializers import MovieSerializer, UserSerializer, UserRegisterSerializer


KP_API_KEY = '02CDVJX-YTN447S-G2JFKDJ-YZHHMYT'
KP_API_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top'


class MovieList(APIView):
    def get(self, request):
        movies = Movie.objects.all().order_by('-vote_average')
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)


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


class UserLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                         context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class FavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, movie_id):
        try:
            movie = Movie.objects.get(movie_id=movie_id)
            request.user.favorites.add(movie)
            return Response({'status': 'added to favorites'})
        except Movie.DoesNotExist:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, movie_id):
        try:
            movie = Movie.objects.get(movie_id=movie_id)
            request.user.favorites.remove(movie)
            return Response({'status': 'removed from favorites'})
        except Movie.DoesNotExist:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        favorites = request.user.favorites.all()
        serializer = MovieSerializer(favorites, many=True)
        return Response(serializer.data)