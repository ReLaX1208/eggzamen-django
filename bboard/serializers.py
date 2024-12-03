from rest_framework import serializers
from .models import Rubric, Bb


class RubricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rubric
        fields = ['name', 'photo']


class BbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bb
        fields = ['title', 'content', 'photo', 'price', 'rubric']
