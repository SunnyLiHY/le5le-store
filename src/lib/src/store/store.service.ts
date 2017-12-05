import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class StoreService {
  private memStore: any = {};
  private memStore$: any = {};

  private find(key: string): any {
    if (key === '') return null;

    let data: any;
    let keys = [];
    if (key === '.') data = this.memStore;
    else {
      keys = key.split('.');
      data = this.memStore[keys[0]];
    }
    if (!data) return null;

    // 遍历查找子属性data
    if (keys.length > 1) {
      keys.splice(0, 1);
      for (let k of keys) {
        data = data[k];
        if (!data) return null;
      }
    }

    return data;
  }

  private find$(key: string, autoAdd?: boolean): Subject<any> {
    if (key === '') return null;

    let data: Subject<any> = this.memStore$[key];
    if (!data) {
      if (!autoAdd) return null;
      this.memStore$[key] = new Subject<any>();
      data = this.memStore$[key];
    }

    return data;
  }

  // key: 如果含.表示解析成对象进行条件搜索。注意：但第一个属性存在时，但是where的条件（非type）不匹配时，返回失败。
  //      如果key = '.'; 表示根存储对象
  // where: {
  //   'user.name': 'Alsmile', // 如果含.表示解析成对象进行条件搜索
  // }
  public get(key: string, where?: any): any {
    let data: any = this.find(key);

    // where条件过滤
    if (where) {
      for (let whereKey in where) {
        if (this.find(whereKey) != where[whereKey]) return null;
      }
    }

    return data;
  }

  // 得到一个可观察对象
  // key: 如果含.表示解析成对象进行条件搜索。
  public get$(key: string): any {
    return this.find$(key, true);
  }

  // key: 如果含.表示解析成对象进行条件搜索。注意：但第一个属性存在时，但是where的条件不匹配时，返回失败。
  // value: 设置key=value; 如果 value为空，表示删除
  // where: {
  //   'user.name': 'Alsmile', // 如果含.表示解析成对象进行条件搜索
  // }
  public set(strKey: string, value: any, where?: any): boolean {
    if (strKey === '' || strKey === '.') return false;

    let keys = strKey.split('.');
    let rootKey = keys[0];
    let observableKeys = [rootKey];

    let data: any = this.memStore[rootKey];
    if (!data) {
      this.memStore[rootKey] = {};
      data = this.memStore[rootKey];
    }

    // 遍历查找子属性data
    let parentData: any = this.memStore;
    let readKey = rootKey;
    let subData: any = data;
    if (keys.length > 1) {
      keys.splice(0, 1);
      for (let k of keys) {
        if (!subData[k]) subData[k] = {};

        // 添加到observable通知数组，通知订阅数据改变
        observableKeys.push(observableKeys[observableKeys.length - 1] + '.' + k);

        parentData = subData;
        readKey = k;
        subData = subData[k];
      }
    }

    // where条件遍历
    if (where) {
      for (let whereKeys in where) {
        let whereData = this.memStore;
        // 查找where中的子属性
        let whereKey = whereKeys.split('.');
        for (let k of whereKey) {
          whereData = whereData[k];
          if (!whereData) return false;
        }
        if (whereData != where[whereKeys]) return false;
      }
    }

    if (value) parentData[readKey] = value;
    else delete parentData[readKey];

    for (let k of observableKeys) {
      let observable: Subject<any> = this.find$(k);
      if (observable) {
        observable.next(value);
      }
    }

    return true;
  }

  // 通过一个观察对象去设置数据
  // key: 如果含.表示解析成对象进行条件搜索。
  public setByObservable(key: string, observable: any) {
    (<Observable<any>>observable).subscribe(
      ret => {
        this.set(key, ret);
      }
    );
  }
}
