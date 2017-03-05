import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './environment';
import { bootloader } from '@angularclass/hmr';

import { AppModule } from './app/app.module';

export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
}

// needed for hmr
// in prod this is replace for document ready
bootloader(main);

require('./assets/css/app.pcss');
