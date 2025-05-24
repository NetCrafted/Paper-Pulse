import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageResearchComponent } from './manage-research.component';

describe('ManageResearchComponent', () => {
  let component: ManageResearchComponent;
  let fixture: ComponentFixture<ManageResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageResearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
