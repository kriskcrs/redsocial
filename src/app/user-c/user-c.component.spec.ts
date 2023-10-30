import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCComponent } from './user-c.component';

describe('UserCComponent', () => {
  let component: UserCComponent;
  let fixture: ComponentFixture<UserCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
