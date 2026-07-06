import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesArea } from './messages-area';

describe('MessagesArea', () => {
  let component: MessagesArea;
  let fixture: ComponentFixture<MessagesArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesArea],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
