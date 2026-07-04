import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBase } from './chat-base';

describe('ChatBase', () => {
  let component: ChatBase;
  let fixture: ComponentFixture<ChatBase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBase],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
