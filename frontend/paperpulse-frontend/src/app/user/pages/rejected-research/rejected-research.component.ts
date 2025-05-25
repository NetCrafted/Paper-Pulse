import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-rejected-research',
  standalone: false,
  templateUrl: './rejected-research.component.html',
  styleUrl: './rejected-research.component.scss',
})
export class RejectedResearchComponent {
  rejectedPapers: any[] = [];
  showModal = false;
  selectedPaperId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRejectedPapers();
  }

  fetchRejectedPapers(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<any>('http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:80/api/papers/rejected', { headers })
      .subscribe({
        next: (res) => {
          this.rejectedPapers = res.results || res;
        },
        error: () => {
          alert('Failed to fetch rejected papers.');
        },
      });
  }

  confirmDelete(paperId: number): void {
    this.selectedPaperId = paperId;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPaperId = null;
  }

  deletePaper(): void {
    if (!this.selectedPaperId) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .delete(
        `http://ec2-16-171-23-239.eu-north-1.compute.amazonaws.com:80/api/papers/${this.selectedPaperId}/delete/`,
        { headers },
      )
      .subscribe({
        next: () => {
          this.rejectedPapers = this.rejectedPapers.filter(
            (p) => p.id !== this.selectedPaperId,
          );
          this.closeModal();
        },
        error: () => {
          alert('Failed to delete paper.');
        },
      });
  }
}
