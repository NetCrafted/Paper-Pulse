import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-research',
  standalone: false,
  templateUrl: './manage-research.component.html',
  styleUrl: './manage-research.component.scss',
})
export class ManageResearchComponent {
  pendingPapers: any[] = [];
  visiblePapers: any[] = [];
  toastVisible = false;
  toastMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPapers();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  loadPapers(): void {
    this.http
      .get<any>('http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:80/api/papers/admin/research-manager', {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (res: any) => {
          this.pendingPapers = res.pending || res;
          this.visiblePapers = res.visible || res;
        },
        error: () => this.showToast('Failed to load pending papers'),
      });
  }

  getCategoryNames(paper: any): string {
    return paper.categories.map((c: any) => c.name).join(', ');
  }

  acceptPaper(id: number): void {
    this.http
      .post(
        `http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:80/api/papers/admin/research-manager/${id}/accept/`,
        {},
        {
          headers: this.getAuthHeaders(),
        },
      )
      .subscribe({
        next: () => {
          this.showToast('Paper accepted');
          this.loadPapers();
        },
        error: () => this.showToast('Failed to accept paper'),
      });
  }

  rejectPaper(id: number): void {
    this.http
      .post(
        `http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:80/api/papers/admin/research-manager/${id}/reject/`,
        {},
        {
          headers: this.getAuthHeaders(),
        },
      )
      .subscribe({
        next: () => {
          this.showToast('Paper rejected');
          this.loadPapers();
        },
        error: () => this.showToast('Failed to reject paper'),
      });
  }

  deletePaper(id: number): void {
    if (!confirm('Are you sure you want to delete this paper?')) return;
    this.http
      .delete(`http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:80/api/papers/${id}/delete/`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: () => {
          this.showToast('Paper deleted');
          this.loadPapers();
        },
        error: () => this.showToast('Failed to delete paper'),
      });
  }

  showToast(message: string, duration: number = 3000): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, duration);
  }

  hideToast(): void {
    this.toastVisible = false;
  }
}
