import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { InstanceListComponent } from './instance-browser/instance-list/instance-list.component';
import { InstanceBrowserComponent } from './instance-browser/instance-browser.component';
import { InstanceCardItemComponent } from './instance-browser/instance-list/instance-card-item/instance-card-item.component';
import { TemperatureIconComponent } from './shared/components/temperature-icon/temperature-icon.component';
import { InstanceDetailComponent } from './instance-browser/instance-detail/instance-detail.component';
import { InstanceEditComponent } from './instance-browser/instance-edit/instance-edit.component';
import { DummyComponent } from './shared/components/dummy/dummy.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { LoadingFailComponent } from './shared/components/loading-fail/loading-fail.component';
import { ConnectionDetailComponent } from './instance-browser/instance-detail/connection-detail/connection-detail.component';
import { ConnectionEditComponent } from './instance-browser/instance-edit/connection-edit/connection-edit.component';
import { OsImageComponent } from './shared/components/os-image/os-image.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InstanceListComponent,
    InstanceBrowserComponent,
    InstanceCardItemComponent,
    TemperatureIconComponent,
    InstanceDetailComponent,
    InstanceEditComponent,
    DummyComponent,
    LoadingSpinnerComponent,
    LoadingFailComponent,
    ConnectionDetailComponent,
    ConnectionEditComponent,
    OsImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
