export class Cookie {
  static get(name: string): string {
    let arr: RegExpMatchArray;
    const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if ((arr = document.cookie.match(reg))) {
      return decodeURIComponent(arr[2]);
    } else {
      return '';
    }
  }

  // options: {
  //   expires?:number,
  //   path?:string,
  //   domain?:string
  // }
  static set(name: string, value: string, options?: any) {
    const myWindow: any = window;
    let cookieStr = myWindow.escape(name) + '=' + myWindow.escape(value) + ';';

    if (!options) {
      options = {};
    }
    if (options.expires) {
      const dtExpires = new Date(new Date().getTime() + options.expires * 1000 * 60 * 60 * 24);
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
    if (Cookie.get(name)) {
      if (!options) {
        options = {};
      }
      options.expires = -1;
      Cookie.set(name, '', options);
    }
  }
}
