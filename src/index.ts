import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreService } from './store/store.service';

export { CookieService } from './cookie/cookie.service';
export { StoreService } from './store/store.service';

@NgModule({
  imports: [ CommonModule ],
  providers: [ StoreService ]
})
export class Le5leStoreModule {
}
