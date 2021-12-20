import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './@pages/components/home/home.component';
import { NotFoundComponent } from './@pages/components/not-found/not-found.component';
import { DefaultComponent } from './@pages/layout/default/default.component';
import { FullwidthComponent } from './@pages/layout/fullwidth/fullwidth.component';

const routes: Routes = [
  {
    path: '', component: DefaultComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'notfound', component: NotFoundComponent },
    ]
  },
  {
    path: 'p2', component: FullwidthComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'notfound', component: NotFoundComponent },
    ]
  },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
