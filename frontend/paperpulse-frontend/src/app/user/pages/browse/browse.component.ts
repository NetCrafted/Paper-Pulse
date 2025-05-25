import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-browse',
  standalone: false,
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent {
  papers: any[] = [];
  categoryList: any[] = [];

  filters = {
    q: '',
    order: 'asc',
    categories: [] as number[],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.applyFilters();
  }

  fetchCategories(): void {
    this.http
      .get<any>('https://dxic7v135yope.cloudfront.net/api/papers/categories/')
      .subscribe((res) => {
        this.categoryList = res.results || res;
      });
  }

  applyFilters(): void {
    let params = new HttpParams()
      .set('order', this.filters.order)
      .set('q', this.filters.q || '');

    this.filters.categories.forEach((catId) => {
      params = params.append('categories', catId.toString());
    });
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<any>('https://dxic7v135yope.cloudfront.net/api/papers/', { params, headers })
      .subscribe((res) => {
        if (Array.isArray(res.results)) {
          this.papers = res.results;
        } else {
          this.papers = res; // fallback in case pagination is off
        }
        console.log('Loaded papers:', this.papers);
      });
  }

  onCategorySelect(event: Event): void {
    const selected = Array.from(
      (event.target as HTMLSelectElement).selectedOptions,
    ).map((opt) => Number(opt.value));
    this.filters.categories = selected;
  }
}
