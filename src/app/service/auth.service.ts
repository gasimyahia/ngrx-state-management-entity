import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { autoLogout } from "../auth/state/auth.actions";
import { AuthResponseData } from "../models/AuthResponse.model";
import { User } from "../models/user.model";
import { AppState } from "../store/app.state";

@Injectable({
  providedIn:'root'
})
export  class AuthService {

  timeoutInterval:any;

  constructor(private http:HttpClient,private store:Store<AppState>){}

  login(email:string,password:string): Observable<AuthResponseData>{
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.FIREBASE_API_KEY}`,
                          {email,password,returnSecureToken: true });
  }

  signup(email:string,password:string): Observable<AuthResponseData>{
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.FIREBASE_API_KEY}`,
                          {email,password,returnSecureToken: true });
  }

  formatUser(data:AuthResponseData){
    const expirationDate=new Date(new Date().getTime()+ +data.expiresIn*1000);
    const user=new User(data.email,data.idToken,data.localId,expirationDate);
    return user;
  }

  getErrorMessage(message:string){
    switch(message){
      case 'EMAIL_NOT_FOUND':
        return 'Email Not Found';
      case 'INVALID_PASSWORD':
        return 'Invalid Password';
      case 'EMAIL_EXISTS':
        return 'Email is already exists';
      default:
        return 'Unknown error Occorred. Please try again';
    }
  }

  setUserInLocalstorage(user:User){
    localStorage.setItem("userData",JSON.stringify(user));
    this.runTimeOutInterval(user);

  }

  runTimeOutInterval(user:User){
    const todaysDate=new Date().getTime();
    const expirationDate=user.getExpirationDate().getTime();
    const timeInterval=expirationDate - todaysDate;

    this.timeoutInterval= setTimeout(()=>{
      // logout functionality or get the  refresh to token
      this.store.dispatch(autoLogout());
    },timeInterval);
  }

  getUserFromLocalStorage(){
    const userDataString=localStorage.getItem('userData') ;
    if(userDataString){
      const userData=JSON.parse(userDataString);
      const expirationDate=new Date(userData.expirationdate);
      const user=new User(userData.email,userData.token,userData.localid,expirationDate);
      this.runTimeOutInterval(user);

      return user;
    }
    return null;
  }

  logout(){
    localStorage.removeItem('userData');
    if(this.timeoutInterval){
      clearTimeout(this.timeoutInterval);
      this.timeoutInterval=null;
    }
  }
}
