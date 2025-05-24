from mimetypes import guess_type
import os
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Category, Paper
from .serializers import CategorySerializer, PaperSerializer
from rest_framework.generics import ListAPIView
from django.db.models import Q
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count
from django.db.models.functions import ExtractYear

class UploadPaperView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaperSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploader=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BrowsePapersView(ListAPIView):
    serializer_class = PaperSerializer
    permission_classes = [IsAuthenticated]  # public? make it AllowAny

    def get_queryset(self):
        queryset = Paper.objects.filter(visibility='visible')

        query = self.request.query_params.get('q')
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) | Q(abstract__icontains=query)
            )

        categories = self.request.query_params.getlist('categories')
        if categories:
            queryset = queryset.filter(categories__id__in=categories).distinct()

        order = self.request.query_params.get('order', 'asc')
        if order == 'desc':
            queryset = queryset.order_by('-publicationDate')
        else:
            queryset = queryset.order_by('publicationDate')

        return queryset
    
class PaperDetailView(RetrieveAPIView):
    queryset = Paper.objects.all()
    serializer_class = PaperSerializer
    permission_classes = [IsAuthenticated]
        
class DownloadPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        paper = get_object_or_404(Paper, pk=pk)
        
        if not paper.pdf:
            raise Http404("PDF not found")
        
        file_path = paper.pdf.path
        base_name = os.path.basename(file_path)
        name, ext = os.path.splitext(base_name)
        new_filename = f"{name}-paperpulse{ext}"

        try:
            response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=new_filename)

            content_type, _ = guess_type(file_path)
            if content_type:
                response['Content-Type'] = content_type
            
            return response
        except FileNotFoundError:
            raise Http404("PDF file is missing.")

class DeletePaperView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        paper = get_object_or_404(Paper, pk=pk)
        if paper.uploader != request.user and not (request.user.is_superuser or request.user.is_staff):
            return Response({"detail": "You do not have permission to delete this paper."}, status=status.HTTP_403_FORBIDDEN)

        paper.delete()
        return Response({'detail': 'Paper deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

class AdminResearchManagerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pending_qs = Paper.objects.filter(visibility='pending').order_by('publicationDate')
        visible_qs = Paper.objects.filter(visibility='visible').order_by('publicationDate')

        paginator = PageNumberPagination()
        paginator.page_size = 5

        pending_page = paginator.paginate_queryset(pending_qs, request)
        visible_page = paginator.paginate_queryset(visible_qs, request)
        
        pending_data = PaperSerializer(pending_page, many=True).data
        visible_data = PaperSerializer(visible_page, many=True).data

        return Response({
            'pending': pending_data,
            'visible': visible_data,
        }, status=status.HTTP_200_OK)

class AcceptPaperView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        paper = get_object_or_404(Paper, pk=pk)
        paper.visibility = 'visible'
        paper.save()
        return Response({"detail": "Paper accepted."}, status=status.HTTP_200_OK)
    

class RejectPaperView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        paper = get_object_or_404(Paper, pk=pk)
        paper.visibility = 'hidden'
        paper.save()
        return Response({"detail": "Paper rejected."}, status=status.HTTP_200_OK)
    

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        visible_papers = Paper.objects.filter(visibility='visible')

        categories = Category.objects.all()
        cat_labels = []
        cat_counts = []
        for cat in categories:
            count = visible_papers.filter(categories=cat).count()
            cat_labels.append(cat.name)
            cat_counts.append(count)

        papers_by_year = (
            visible_papers
            .annotate(year=ExtractYear('publicationDate'))
            .values('year')
            .annotate(count=Count('id'))
            .order_by('year')
        )
        year_labels = [paper['year'] for paper in papers_by_year]
        year_counts = [paper['count'] for paper in papers_by_year]

        return Response({
            "cat_labels": cat_labels,
            "cat_counts": cat_counts,
            "year_labels": year_labels,
            "year_counts": year_counts,
        }, status=status.HTTP_200_OK)
        
class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class RejectedPapersView(ListAPIView):
    serializer_class = PaperSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Paper.objects.filter(visibility='hidden').order_by('-publicationDate')