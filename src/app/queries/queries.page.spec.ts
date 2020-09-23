import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QueriesPage } from './queries.page';

describe('QueriesPage', () => {
  let component: QueriesPage;
  let fixture: ComponentFixture<QueriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueriesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QueriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
