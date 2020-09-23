import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationfinderPage } from './locationfinder.page';

describe('LocationfinderPage', () => {
  let component: LocationfinderPage;
  let fixture: ComponentFixture<LocationfinderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationfinderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationfinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
