from rest_framework import serializers
from .models import Category, Paper
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class PaperSerializer(serializers.ModelSerializer):
    uploader = UserSerializer(read_only=True)

    categories = CategorySerializer(many=True, read_only=True)

    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        many=True,
        write_only=True,
        source='categories'
    )

    class Meta:
        model = Paper
        fields = '__all__'
        read_only_fields = ['uploader', 'publicationDate', 'visibility']

