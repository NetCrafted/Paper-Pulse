import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paper-detail',
  standalone: false,
  templateUrl: './paper-detail.component.html',
  styleUrl: './paper-detail.component.scss',
})
export class PaperDetailComponent {
  paper: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get(`https://dxic7v135yope.cloudfront.net/api/papers/${id}/`, { headers })
      .subscribe({
        next: (res) => {
          this.paper = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load paper:', err);
          this.isLoading = false;
        },
      });
  }

  downloadPDF(paperId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get(`https://dxic7v135yope.cloudfront.net/api/papers/${paperId}/download/`, {
        headers,
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = this.paper.title + '-paperpulse.pdf';
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
        },
        error: (err) => {
          console.error('Download failed', err);
        },
      });
  }

  previewPDF(): void {
    window.open(this.paper.pdf, '_blank'); // Replace with preview URL if applicable
  }
}
