
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType , } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, exhaustMap, map, mergeMap, tap} from 'rxjs/operators'
import { AuthService } from "src/app/service/auth.service";
import { setErrorMessage, setLoadingSpinner } from "src/app/share/component/state/shared.actions";
import { AppState } from "src/app/store/app.state";
import { authLogin, autoLogout, loginStart, loginSuccess, signupStart, signupSuccess } from "./auth.actions";
@Injectable()
export class AuthEffects {
  constructor(private actions$:Actions,
              private authService:AuthService,
              private store:Store<AppState>,
              private router:Router
            ){}

  login$=createEffect(()=>{
    return this.actions$.pipe(
      ofType(loginStart),
      exhaustMap((action)=>{
        return this.authService.login(action.email,action.password).pipe(
          map((data)=>{
            this.store.dispatch(setLoadingSpinner({status:false}));
            this.store.dispatch(setErrorMessage({message:''}));
            const user=this.authService.formatUser(data);
            this.authService.setUserInLocalstorage(user);
            return loginSuccess({user,redirect:true});
          }),
          catchError((errResponse)=>{
            this.store.dispatch(setLoadingSpinner({status:false}));
            const errorMessage=this.authService.getErrorMessage(errResponse.error.error.message);
            return of(setErrorMessage({message:errorMessage}));
          })
        );
      })
    );
  });

  loginRedirect$=createEffect(()=>{
    return this.actions$.pipe(ofType(...[loginSuccess,signupSuccess]),tap((action)=>{
      if(action.redirect){
        this.router.navigateByUrl('/');
      }
    }));
  },
  {
    dispatch:false
  });

  signup$=createEffect(()=>{
    return this.actions$.pipe(
      ofType(signupStart),
      exhaustMap((action)=>{
        return this.authService.signup(action.email,action.password).pipe(
          map((data)=>{
            this.store.dispatch(setLoadingSpinner({status:false}));
            this.store.dispatch(setErrorMessage({message:''}));
            const user=this.authService.formatUser(data);
            this.authService.setUserInLocalstorage(user);
            return signupSuccess({user,redirect:true});
          }),
          catchError((errResponse)=>{
            this.store.dispatch(setLoadingSpinner({status:false}));
            const errorMessage=this.authService.getErrorMessage(errResponse.error.error.message);
            return of(setErrorMessage({message:errorMessage}));
          })
        );
      })
    );
  });


  autoLogin$ = createEffect(()=>{
    return this.actions$.pipe(
      ofType(authLogin),
      mergeMap((action)=>{
        const user=this.authService.getUserFromLocalStorage();
        return of(loginSuccess({user,redirect:false}));
      })
    );
  }
  );


  logout$=createEffect(()=>{
      return this.actions$.pipe(
        ofType(autoLogout),
        map((action)=>{
          this.authService.logout();
          this.router.navigateByUrl('/auth');
        })
        )
    },
    {dispatch:false}
  );

}
