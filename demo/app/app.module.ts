import { NgModule }       from '@angular/core';

import { BrowserModule }  from '@angular/platform-browser';
import {HttpModule} from "@angular/http";

import {SharedModule} from "../shared/shared.module";
import {AppComponent} from "./app.component";
import {routing, appRoutingProviders} from "./app.routing";

import {HomeComponent} from "./home/home.component";
import {StartComponent} from "./start/start.component";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,
    routing
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    StartComponent,
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
