import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import {StoreService} from "../../src/store/store.service";

import {routing} from "./shared.routing";


@NgModule({
  imports:       [CommonModule,  FormsModule, routing],
  declarations: [
  ],
  exports:       [
    CommonModule,
    FormsModule,
  ],
  providers:     [
    StoreService
  ]
})
export class SharedModule {
  constructor(private _storeService: StoreService) {
    this._storeService.set('author', 'alsmile');
  }
}
