import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoversationItem } from './coversation-item';

describe('CoversationItem', () => {
  let component: CoversationItem;
  let fixture: ComponentFixture<CoversationItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoversationItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CoversationItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
