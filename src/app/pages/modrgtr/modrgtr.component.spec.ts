import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModrgtrComponent } from './modrgtr.component';

describe('ModrgtrComponent', () => {
  let component: ModrgtrComponent;
  let fixture: ComponentFixture<ModrgtrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModrgtrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModrgtrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
