import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  categoryLabels: string[] = [];
  categoryData: number[] = [];
  yearLabels: string[] = [];
  yearData: number[] = [];

  categoryColors: string[] = [
    '#1e30f3',
    '#e21e80',
    '#6c757d',
    '#198754',
    '#0dcaf0',
    '#ffc107',
    '#dc3545',
    '#6610f2',
    '#fd7e14',
    '#343a40',
  ];

  yearColors = [
    {
      backgroundColor: 'rgba(30,48,243,0.6)',
      borderColor: 'rgba(30,48,243,1)',
      borderWidth: 1,
    },
  ];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  yearOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  categoryChartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  } = {
    labels: [],
    datasets: [],
  };

  yearChartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  } = {
    labels: [],
    datasets: [],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<any>('https://dxic7v135yope.cloudfront.net/api/papers/admin/dashboard', { headers })
      .subscribe((data) => {
        this.categoryLabels = data.cat_labels;
        this.categoryData = data.cat_counts;
        this.yearLabels = data.year_labels;
        this.yearData = data.year_counts;

        this.categoryChartData = {
          labels: this.categoryLabels,
          datasets: [
            {
              label: 'Papers per Category',
              data: this.categoryData,
              backgroundColor: this.categoryColors,
            },
          ],
        };

        this.yearChartData = {
          labels: this.yearLabels,
          datasets: [
            {
              label: 'Papers per Year',
              data: this.yearData,
              backgroundColor: this.yearColors[0].backgroundColor,
              borderColor: this.yearColors[0].borderColor,
              borderWidth: this.yearColors[0].borderWidth,
            },
          ],
        };
      });
  }
}
