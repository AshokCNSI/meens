import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MysellingproductsPage } from './mysellingproducts.page';

describe('MysellingproductsPage', () => {
  let component: MysellingproductsPage;
  let fixture: ComponentFixture<MysellingproductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MysellingproductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MysellingproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
