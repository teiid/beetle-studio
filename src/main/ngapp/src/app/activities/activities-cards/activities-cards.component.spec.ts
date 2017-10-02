import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesCardsComponent } from './activities-cards.component';
import {RouterModule} from "@angular/router";

describe('ActivitiesCardsComponent', () => {
  let component: ActivitiesCardsComponent;
  let fixture: ComponentFixture<ActivitiesCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
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
