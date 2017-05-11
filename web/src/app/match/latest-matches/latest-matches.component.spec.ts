import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestMatchesComponent } from './latest-matches.component';

describe('LatestMatchesComponent', () => {
  let component: LatestMatchesComponent;
  let fixture: ComponentFixture<LatestMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
