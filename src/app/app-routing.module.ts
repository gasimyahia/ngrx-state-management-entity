import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostDetialsComponent } from './posts/post-detials/post-detials.component';
import { AuthGuard } from './service/auth.guard';
import { ErrorComponent } from './share/component/error/error.component';
import { ServerErrorComponent } from './share/component/server-error/server-error.component';

const routes: Routes = [
  {path:'' , component:HomeComponent},
  {path:'counter',loadChildren:()=> import('./counter/counter.module').then((m)=> m.CounterModule)},
  {path:'posts',loadChildren:()=> import('./posts/post.module').then((m)=> m.PostModule) ,canActivate:[AuthGuard]},
  {path:'auth',loadChildren:()=> import('./auth/auth.module').then(m=> m.AuthModule)},
  {path:'**',component:ErrorComponent},
  {path: 'error',component:ServerErrorComponent},
  {path:'posts/detials/:id',component:PostDetialsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
