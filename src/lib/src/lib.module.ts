import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreService } from './store/store.service';

@NgModule({
  imports: [CommonModule],
  providers: [StoreService]
})
export class Le5leStoreModule {
  constructor( @Optional() @SkipSelf() parentModule: Le5leStoreModule) {
    if (parentModule) {
      throw new Error(
        'Le5leStoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Le5leStoreModule,
      providers: []
    };
  }
}
