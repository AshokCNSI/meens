import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockdetailPage } from './stockdetail.page';

describe('StockdetailPage', () => {
  let component: StockdetailPage;
  let fixture: ComponentFixture<StockdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockdetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
