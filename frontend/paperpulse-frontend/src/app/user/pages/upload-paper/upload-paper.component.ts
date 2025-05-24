import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-paper',
  standalone: false,
  templateUrl: './upload-paper.component.html',
  styleUrl: './upload-paper.component.scss',
})
export class UploadPaperComponent {
  uploadForm!: FormGroup;
  pdfFile!: File;
  cover_imageFile!: File | null;
  pdfError = '';
  coverImageError = '';
  categoriesList: any[] = [];
  selectedCategories: number[] = [];
  toastVisible = false;
  toastMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      abstract: ['', Validators.required],
      coauthor_name: [''],
      coauthor_email: [''],
      categories: [[], Validators.required],
    });

    this.fetchCategories();
  }

  fetchCategories(): void {
    this.http
      .get<any[]>('http://localhost:8000/api/papers/categories/')
      .subscribe({
        next: (res: any) => (this.categoriesList = res.results),
        error: () => this.showToast('Failed to load categories'),
      });
  }

  onFileChange(event: any, type: 'pdf' | 'coverImage') {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'pdf') {
      if (file.type !== 'application/pdf') {
        this.pdfError = 'Only PDF files are allowed.';
        return;
      }
      this.pdfError = '';
      this.pdfFile = file;
    }

    if (type === 'coverImage') {
      this.coverImageError = '';
      this.cover_imageFile = file;
    }
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selected = Array.from(select.selectedOptions).map((opt) =>
      Number(opt.value),
    );
    this.uploadForm.get('categories')?.setValue(selected);
  }

  onSubmit(): void {
    if (!this.uploadForm.valid || !this.pdfFile) {
      if (!this.pdfFile) this.pdfError = 'PDF is required.';
      return;
    }

    const formData = new FormData();
    const values = this.uploadForm.value;

    formData.append('title', values.title);
    formData.append('abstract', values.abstract);
    formData.append('coauthor_name', values.coauthor_name || '');
    formData.append('coauthor_email', values.coauthor_email || '');
    formData.append('pdf', this.pdfFile);
    if (this.cover_imageFile) {
      formData.append('coverImage', this.cover_imageFile);
    }
    values.categories.forEach((id: number) => {
      formData.append('category_ids', id.toString());
    });

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('Token used for upload:', token);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    this.http
      .post('http://localhost:8000/api/papers/upload/', formData, { headers })
      .subscribe({
        next: () => {
          this.showToast('Research uploaded successfully!');
          this.uploadForm.reset();
          this.pdfFile = null!;
          this.cover_imageFile = null;
        },
        error: (error) => {
          const apiErrors = error?.error;
          const firstKey = Object.keys(apiErrors || {})[0];
          const message = Array.isArray(apiErrors[firstKey])
            ? apiErrors[firstKey][0]
            : apiErrors[firstKey];
          this.showToast(
            'Upload failed: ' + message || 'Something went wrong.',
          );
        },
      });
  }

  showToast(message: string, duration: number = 3000): void {
    this.toastMessage = message;
    this.toastVisible = true;
    this.cdRef.detectChanges(); // ✅ force UI update

    setTimeout(() => {
      this.toastVisible = false;
      this.cdRef.detectChanges(); // ✅ update again after hiding
    }, duration);
  }
}
