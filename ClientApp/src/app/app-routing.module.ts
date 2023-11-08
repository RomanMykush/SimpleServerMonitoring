import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstanceBrowserComponent } from './instance-browser/instance-browser.component';

const routes: Routes = [
  { path: '', redirectTo: "/instances", pathMatch: 'full' },
  { path: "instances", component: InstanceBrowserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
