import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreService } from './src/store/store.service';

export { CookieService } from './src/cookie/cookie.service';
export { StoreService } from './src/store/store.service';

@NgModule({
})
export class Le5leStoreRootModule {
}

@NgModule({
})
export class Le5leStoreModule {
  /** @deprecated */
  public static forRoot(): ModuleWithProviders {
    return {ngModule: Le5leStoreRootModule, providers: [StoreService]};
  }
}
