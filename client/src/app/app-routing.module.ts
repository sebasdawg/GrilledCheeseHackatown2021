import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SearchComponent } from './components/search/search.component';
import { ConnectWindowComponent } from './components/connect-window/connect-window.component';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: MainPageComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'search', component: SearchComponent },
  {path: 'connect-window', component :ConnectWindowComponent},
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
