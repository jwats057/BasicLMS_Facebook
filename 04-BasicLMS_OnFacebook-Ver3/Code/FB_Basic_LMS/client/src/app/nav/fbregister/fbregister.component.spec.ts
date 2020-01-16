import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FBRegisterComponent } from './fbregister.component';

describe('RegisterComponent', () => {
  let component: FBRegisterComponent;
  let fixture: ComponentFixture<FBRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FBRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FBRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
