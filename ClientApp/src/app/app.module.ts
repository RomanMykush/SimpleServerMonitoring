import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { InstanceListComponent } from './instance-browser/instance-list/instance-list.component';
import { InstanceBrowserComponent } from './instance-browser/instance-browser.component';
import { InstanceCardItemComponent } from './instance-browser/instance-list/instance-card-item/instance-card-item.component';
import { TemperatureIconComponent } from './shared/components/temperature-icon/temperature-icon.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InstanceListComponent,
    InstanceBrowserComponent,
    InstanceCardItemComponent,
    TemperatureIconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
