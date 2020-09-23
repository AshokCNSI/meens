import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapselectionPage } from './mapselection.page';

describe('MapselectionPage', () => {
  let component: MapselectionPage;
  let fixture: ComponentFixture<MapselectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapselectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapselectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
