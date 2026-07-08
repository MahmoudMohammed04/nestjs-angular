import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserItem } from './search-user-item';

describe('SeachUserItem', () => {
  let component: SearchUserItem;
  let fixture: ComponentFixture<SearchUserItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUserItem],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchUserItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
