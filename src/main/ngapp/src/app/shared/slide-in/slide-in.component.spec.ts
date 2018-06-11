/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SlideInComponent } from "./slide-in.component";

describe("SlideInComponent", () => {
  let component: SlideInComponent;
  let fixture: ComponentFixture<SlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideInComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
