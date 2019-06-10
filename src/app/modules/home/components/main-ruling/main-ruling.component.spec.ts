import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRulingComponent } from './main-ruling.component';

describe('MainRulingComponent', () => {
  let component: MainRulingComponent;
  let fixture: ComponentFixture<MainRulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainRulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
