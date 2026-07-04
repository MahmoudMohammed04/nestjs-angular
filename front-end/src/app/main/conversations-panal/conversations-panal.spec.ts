import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationsPanal } from './conversations-panal';

describe('ConversationsPanal', () => {
  let component: ConversationsPanal;
  let fixture: ComponentFixture<ConversationsPanal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationsPanal],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationsPanal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
