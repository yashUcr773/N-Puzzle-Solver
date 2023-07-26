import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolverComponent } from './solver.component';

describe('SolverComponent', () => {
  let component: SolverComponent;
  let fixture: ComponentFixture<SolverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolverComponent]
    });
    fixture = TestBed.createComponent(SolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
