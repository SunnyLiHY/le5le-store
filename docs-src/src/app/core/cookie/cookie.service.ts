import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {

  static get(name: string): string {
    let arr: RegExpMatchArray;
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return decodeURIComponent(arr[2]);
    else return '';
  }

  // options: {
  //   expires?:number,
  //   path?:string,
  //   domain?:string
  // }
  static set(name: string, value: string, options?: any) {
    let myWindow: any = window;
    let cookieStr = myWindow.escape(name) + '=' + myWindow.escape(value) + ';';

    if (!options) options = {};
    if (options.expires) {
      let dtExpires = new Date(new Date().getTime() + options.expires * 1000 * 60 * 60 * 24);
      cookieStr += 'expires=' + dtExpires.toUTCString() + ';';
    }
    if (options.path) {
      cookieStr += 'path=' + options.path + ';';
    }
    if (options.domain) {
      cookieStr += 'domain=' + options.domain + ';';
    }

    document.cookie = cookieStr;
  }

  // options: {
  //   path?:string,
  //   domain?:string
  // }
  static delete(name: string, options?: any) {
    if (CookieService.get(name)) {
      if (!options) options = {};
      options.expires = -1;
      CookieService.set(name, '', options);
    }
  }
}
