import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { InstanceListComponent } from './instance-browser/instance-list/instance-list.component';
import { InstanceBrowserComponent } from './instance-browser/instance-browser.component';
import { InstanceCardItemComponent } from './instance-browser/instance-list/instance-card-item/instance-card-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InstanceListComponent,
    InstanceBrowserComponent,
    InstanceCardItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
