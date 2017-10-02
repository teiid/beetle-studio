import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesCardsComponent } from './activities-cards.component';

describe('ActivitiesCardsComponent', () => {
  let component: ActivitiesCardsComponent;
  let fixture: ComponentFixture<ActivitiesCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
