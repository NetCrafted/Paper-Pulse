from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import CustomTokenObtainPairSerializer, UserSerializer
from papers.models import Paper  
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import authenticate
import os
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]    
    
    def post(self, request):
            user = request.user
            old_password = request.data.get("old_password")
            new_password = request.data.get("new_password")
    
            if not user.check_password(old_password):
                return Response({"detail": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
    
            if not new_password:
                return Response({"detail": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            if len(new_password) < 6:
                return Response({"detail": "New password must be at least 6 characters."}, status=status.HTTP_400_BAD_REQUEST)
    
            user.set_password(new_password)
            user.save()
    
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
    
class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        papers = Paper.objects.filter(uploader=user)

        for paper in papers:
            if paper.pdf and os.path.isfile(paper.pdf.path):
                os.remove(paper.pdf.path)
            if paper.coverImage and os.path.isfile(paper.coverImage.path):
                os.remove(paper.coverImage.path)
            
        papers.delete()
        user.delete()

        return Response({"detail": "Account and all associated papers deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer    