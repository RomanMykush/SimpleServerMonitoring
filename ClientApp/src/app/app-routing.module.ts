import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstanceBrowserComponent } from './instance-browser/instance-browser.component';
import { DummyComponent } from './shared/components/dummy/dummy.component';
import { InstanceEditComponent } from './instance-browser/instance-edit/instance-edit.component';
import { InstanceDetailComponent } from './instance-browser/instance-detail/instance-detail.component';

const routes: Routes = [
  { path: '', redirectTo: "/instances", pathMatch: 'full' },
  {
    path: "instances", component: InstanceBrowserComponent, children: [
      { path: '', component: DummyComponent },
      { path: 'new', component: InstanceEditComponent },
      { path: ':id', component: InstanceDetailComponent },
      { path: ':id/edit', component: InstanceEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
