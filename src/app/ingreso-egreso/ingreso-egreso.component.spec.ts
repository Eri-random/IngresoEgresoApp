import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoEgresoComponent } from './ingreso-egreso.component';

describe('IngresoEgresoComponent', () => {
  let component: IngresoEgresoComponent;
  let fixture: ComponentFixture<IngresoEgresoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresoEgresoComponent]
    });
    fixture = TestBed.createComponent(IngresoEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
