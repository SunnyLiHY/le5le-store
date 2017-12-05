import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { StartService } from './start.service';
import { CookieService } from '../core/cookie/cookie.service';
import { StoreService } from '../core/store/store.service';

@Component({
  selector: 'start',
  templateUrl: 'start.component.html',
  providers: [StartService]
})
export class StartComponent {
  memStore: any;
  key: string = 'test';
  val: string = 'This is a test text.';
  where: string = '';
  result: string = '';
  resultByStorm: string = '';
  private writeStore$ = new Subject<string>();
  private readStore$: Subject<any>;
  rand: string = '';
  constructor(private _StartService: StartService, private _storeService: StoreService) {
    this.memStore = this._storeService.get('.');
  }

  ngOnInit() {
    this._storeService.setByObservable('test', this.writeStore$);

    this.readStore$ = <Subject<any>>this._storeService.get$('test');
    this.readStore$.subscribe(
      ret => {
        console.log('Get a test from subject:', ret);
        this.resultByStorm = ret;
      }
    );

    this._storeService.get$('a.b').subscribe(
      ret => {
        console.log('Get a a.b from subject:', ret);
      }
    );
  }

  onReadStore() {
    let where: any = {};
    if (this.where) {
      try {
        where = JSON.parse(this.where);
      } catch (e) { }
    }
    this.result = this._storeService.get(this.key, where);
  }

  onWriteStore() {
    let where: any = {};
    if (this.where) {
      try {
        where = JSON.parse(this.where);
      } catch (e) { }
    }
    this.result = this._storeService.set(this.key, this.val, where) ? 'true' : 'false';
  }

  onDeleteStore() {
    let where: any = {};
    if (this.where) {
      try {
        where = JSON.parse(this.where);
      } catch (e) { }
    }
    this.result = this._storeService.set(this.key, '', where) ? 'true' : 'false';
  }

  onSetWhere(where) {
    this.where = JSON.stringify(where);
  }

  onWriteStoreByObservable() {
    this.writeStore$.next(this.val);
  }

  onSetCookie() {
    CookieService.set('rand', new Date().getTime() + '');
  }

  onGetCookie() {
    this.rand = CookieService.get('rand');
  }
}
