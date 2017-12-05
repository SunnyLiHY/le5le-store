import { Injectable, NgModule, Optional, SkipSelf } from '@angular/core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { CommonModule } from '@angular/common';

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let CookieService = CookieService_1 = class CookieService {
    static get(name) {
        let arr;
        let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return '';
    }
    // options: {
    //   expires?:number,
    //   path?:string,
    //   domain?:string
    // }
    static set(name, value, options) {
        let myWindow = window;
        let cookieStr = myWindow.escape(name) + '=' + myWindow.escape(value) + ';';
        if (!options)
            options = {};
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
    static delete(name, options) {
        if (CookieService_1.get(name)) {
            if (!options)
                options = {};
            options.expires = -1;
            CookieService_1.set(name, '', options);
        }
    }
};
CookieService = CookieService_1 = __decorate([
    Injectable()
], CookieService);
var CookieService_1;

var __decorate$1 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let StoreService = class StoreService {
    constructor() {
        this.memStore = {};
        this.memStore$ = {};
    }
    find(key) {
        if (key === '')
            return null;
        let data;
        let keys = [];
        if (key === '.')
            data = this.memStore;
        else {
            keys = key.split('.');
            data = this.memStore[keys[0]];
        }
        if (!data)
            return null;
        // 遍历查找子属性data
        if (keys.length > 1) {
            keys.splice(0, 1);
            for (let k of keys) {
                data = data[k];
                if (!data)
                    return null;
            }
        }
        return data;
    }
    find$(key, autoAdd) {
        if (key === '')
            return null;
        let data = this.memStore$[key];
        if (!data) {
            if (!autoAdd)
                return null;
            this.memStore$[key] = new Subject$1();
            data = this.memStore$[key];
        }
        return data;
    }
    // key: 如果含.表示解析成对象进行条件搜索。注意：但第一个属性存在时，但是where的条件（非type）不匹配时，返回失败。
    //      如果key = '.'; 表示根存储对象
    // where: {
    //   'user.name': 'Alsmile', // 如果含.表示解析成对象进行条件搜索
    // }
    get(key, where) {
        let data = this.find(key);
        // where条件过滤
        if (where) {
            for (let whereKey in where) {
                if (this.find(whereKey) != where[whereKey])
                    return null;
            }
        }
        return data;
    }
    // 得到一个可观察对象
    // key: 如果含.表示解析成对象进行条件搜索。
    get$(key) {
        return this.find$(key, true);
    }
    // key: 如果含.表示解析成对象进行条件搜索。注意：但第一个属性存在时，但是where的条件不匹配时，返回失败。
    // value: 设置key=value; 如果 value为空，表示删除
    // where: {
    //   'user.name': 'Alsmile', // 如果含.表示解析成对象进行条件搜索
    // }
    set(strKey, value, where) {
        if (strKey === '' || strKey === '.')
            return false;
        let keys = strKey.split('.');
        let rootKey = keys[0];
        let observableKeys = [rootKey];
        let data = this.memStore[rootKey];
        if (!data) {
            this.memStore[rootKey] = {};
            data = this.memStore[rootKey];
        }
        // 遍历查找子属性data
        let parentData = this.memStore;
        let readKey = rootKey;
        let subData = data;
        if (keys.length > 1) {
            keys.splice(0, 1);
            for (let k of keys) {
                if (!subData[k])
                    subData[k] = {};
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
                    if (!whereData)
                        return false;
                }
                if (whereData != where[whereKeys])
                    return false;
            }
        }
        if (value)
            parentData[readKey] = value;
        else
            delete parentData[readKey];
        for (let k of observableKeys) {
            let observable = this.find$(k);
            if (observable) {
                observable.next(value);
            }
        }
        return true;
    }
    // 通过一个观察对象去设置数据
    // key: 如果含.表示解析成对象进行条件搜索。
    setByObservable(key, observable) {
        observable.subscribe(ret => {
            this.set(key, ret);
        });
    }
};
StoreService = __decorate$1([
    Injectable()
], StoreService);

var __decorate$2 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
let Le5leStoreModule = Le5leStoreModule_1 = class Le5leStoreModule {
    constructor(parentModule) {
        if (parentModule) {
            throw new Error('Le5leStoreModule is already loaded. Import it in the AppModule only');
        }
    }
    static forRoot() {
        return {
            ngModule: Le5leStoreModule_1,
            providers: []
        };
    }
};
Le5leStoreModule = Le5leStoreModule_1 = __decorate$2([
    NgModule({
        imports: [CommonModule],
        providers: [StoreService]
    }),
    __param(0, Optional()), __param(0, SkipSelf()),
    __metadata("design:paramtypes", [Le5leStoreModule])
], Le5leStoreModule);
var Le5leStoreModule_1;

/**
 * Generated bundle index. Do not edit.
 */

export { CookieService, StoreService, Le5leStoreModule };
//# sourceMappingURL=le5le-store.js.map
