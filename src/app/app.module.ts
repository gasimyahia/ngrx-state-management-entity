import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './share/component/header/header.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingSpinnerComponent } from './share/component/loading-spinner/loading-spinner.component';
import { appReducer } from './store/app.state';
import { AuthEffects } from './auth/state/auth.effects';
import { AuthTokenInterceptor } from './service/authToken.interceptor';
import { ErrorComponent } from './share/component/error/error.component';
import { ServerErrorComponent } from './share/component/server-error/server-error.component';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from './router/custom-serializer';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoadingSpinnerComponent,
    ErrorComponent,
    ServerErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot(appReducer),
    StoreRouterConnectingModule.forRoot({
      serializer:CustomSerializer
    }),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:AuthTokenInterceptor,multi:true},],
  bootstrap: [AppComponent]
})
export class AppModule { }
