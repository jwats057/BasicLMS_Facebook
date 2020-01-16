import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollcallComponent } from './rollcall.component';

describe('RollcallComponent', () => {
  let component: RollcallComponent;
  let fixture: ComponentFixture<RollcallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollcallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
