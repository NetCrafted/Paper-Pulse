import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedResearchComponent } from './rejected-research.component';

describe('RejectedResearchComponent', () => {
  let component: RejectedResearchComponent;
  let fixture: ComponentFixture<RejectedResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectedResearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectedResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
