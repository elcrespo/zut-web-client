import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitNameComponent } from './submit-name.component';

describe('SubmitNameComponent', () => {
  let component: SubmitNameComponent;
  let fixture: ComponentFixture<SubmitNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
