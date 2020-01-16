import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmbeddedVideoComponent } from './new-embedded-video.component';

describe('NewEmbeddedVideoComponent', () => {
  let component: NewEmbeddedVideoComponent;
  let fixture: ComponentFixture<NewEmbeddedVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEmbeddedVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEmbeddedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
