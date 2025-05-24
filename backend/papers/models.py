from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Paper(models.Model):
    title = models.CharField(max_length=255)
    abstract = models.TextField()
    publicationDate = models.DateField(auto_now_add=True)  # date of submission
    pdf = models.FileField(upload_to='papers/')
    coverImage = models.ImageField(
    upload_to='cover_images/',
    blank=True,
    null=True,
    default='fallback_cover.png'
)
    
    coauthor_name = models.CharField(max_length=100, blank=True, null=True)
    coauthor_email = models.EmailField(blank=True, null=True)
    
    uploader = models.ForeignKey(User, on_delete=models.CASCADE)
    visibility = models.CharField(max_length=20, default='pending')

    categories = models.ManyToManyField(Category, blank=True)

    def __str__(self):
        return self.title
