from rest_framework import serializers
from .models import Movie, Favorite
from django.contrib.auth import get_user_model

User = get_user_model()


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['movie_id', 'title', 'overview', 'poster_path',
                  'release_date', 'vote_average', 'genres', 'runtime']


class MovieDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_picture']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'profile_picture']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            profile_picture=validated_data.get('profile_picture')
        )
        return user


class FavoriteSerializer(serializers.ModelSerializer):
    movie = MovieSerializer()

    class Meta:
        model = Favorite
        fields = ['id', 'movie', 'created_at', 'note']