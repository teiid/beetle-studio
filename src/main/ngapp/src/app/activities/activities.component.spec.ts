import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivitiesComponent} from './activities.component';
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivitiesListComponent} from "@activities/activities-list/activities-list.component";
import {ActivitiesCardsComponent} from "@activities/activities-cards/activities-cards.component";
import {ModalModule} from "ngx-bootstrap";
import {HttpModule} from "@angular/http";
import {CoreModule} from "@core/core.module";
import {SharedModule} from "@shared/shared.module";

describe('ActivitiesComponent', () => {
  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, HttpModule, ModalModule.forRoot(), RouterTestingModule, SharedModule ],
      declarations: [ ActivitiesComponent, ActivitiesListComponent, ActivitiesCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
