from django.urls import path
from .views import AcceptPaperView, AdminDashboardView, AdminResearchManagerView, BrowsePapersView, CategoryListView, DeletePaperView, DownloadPDFView, PaperDetailView, RejectPaperView, RejectedPapersView, UploadPaperView

urlpatterns = [
    path('upload/', UploadPaperView.as_view(), name='upload-paper'),
    path('', BrowsePapersView.as_view(), name='browse-papers'),
    path('<int:pk>/', PaperDetailView.as_view(), name='paper-detail'),
    path('<int:pk>/download/', DownloadPDFView.as_view(), name='download-pdf'),
    path('<int:pk>/delete/', DeletePaperView.as_view(), name='delete-paper'),
    path('admin/research-manager/', AdminResearchManagerView.as_view()),
    path('admin/research-manager/<int:pk>/accept/', AcceptPaperView.as_view()),
    path('admin/research-manager/<int:pk>/reject/', RejectPaperView.as_view()),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('rejected/', RejectedPapersView.as_view(), name='rejected-papers'),
]