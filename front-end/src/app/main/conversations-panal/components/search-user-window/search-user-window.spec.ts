import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserWindow } from './search-user-window';

describe('SreachUserWindow', () => {
  let component: SearchUserWindow;
  let fixture: ComponentFixture<SearchUserWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUserWindow],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchUserWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
