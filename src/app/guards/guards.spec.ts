import { TestBed, inject } from '@angular/core/testing';
import { Guard } from './guards';

describe('Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Guard]
    });
  });

  it('should ...', inject([Guard], (guard: Guard) => {
    expect(guard).toBeTruthy();
  }));
});
