import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPanal } from './chat-panal';

describe('ChatPanal', () => {
  let component: ChatPanal;
  let fixture: ComponentFixture<ChatPanal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPanal],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatPanal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
