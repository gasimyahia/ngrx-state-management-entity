import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { authLogin } from './auth/state/auth.actions';
import { getErrorMessage, getLoading } from './share/component/state/shared.selector';
import { AppState } from './store/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'state-management-app';
  showLoading:Observable<boolean>;
  errorMessage:Observable<string>;

  constructor(private store:Store<AppState>,private ref: ChangeDetectorRef){}

  ngOnInit(){
    this.showLoading=this.store.select(getLoading);
    this.errorMessage=this.store.select(getErrorMessage);
    this.store.dispatch(authLogin());
  }


}
