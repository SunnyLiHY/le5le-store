import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from "./home/home.component";
import {StartComponent} from "./start/start.component";

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'start', component: StartComponent}
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
