from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Movie, Favorite
from .serializers import (
    MovieSerializer,
    MovieDetailSerializer,
    UserSerializer,
    UserRegisterSerializer,
    FavoriteSerializer
)
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.viewsets import ModelViewSet


class MovieViewSet(ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


class MovieListView(APIView):
    def get(self, request):
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)


class MovieDetailView(APIView):
    def get(self, request, movie_id):
        try:
            movie = Movie.objects.get(movie_id=movie_id)
            serializer = MovieDetailSerializer(movie)
            return Response(serializer.data)
        except Movie.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            })
        return Response(
            {'error': 'Invalid Credentials'},
            status=status.HTTP_400_BAD_REQUEST
        )


class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class FavoriteListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request):
        movie_id = request.data.get('movie_id')
        note = request.data.get('note', '')

        try:
            movie = Movie.objects.get(movie_id=movie_id)
            fav, created = Favorite.objects.get_or_create(
                user=request.user,
                movie=movie,
                defaults={'note': note}
            )
            status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
            return Response(FavoriteSerializer(fav).data, status=status_code)
        except Movie.DoesNotExist:
            return Response(
                {'error': 'Movie not found'},
                status=status.HTTP_404_NOT_FOUND
            )