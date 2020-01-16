import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExternalLinkComponent } from './new-external-link.component';

describe('NewExternalLinkComponent', () => {
  let component: NewExternalLinkComponent;
  let fixture: ComponentFixture<NewExternalLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExternalLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExternalLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
