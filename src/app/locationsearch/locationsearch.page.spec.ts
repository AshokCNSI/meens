import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationsearchPage } from './locationsearch.page';

describe('LocationsearchPage', () => {
  let component: LocationsearchPage;
  let fixture: ComponentFixture<LocationsearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationsearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
