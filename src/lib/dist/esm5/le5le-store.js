import { Injectable, NgModule, Optional, SkipSelf } from '@angular/core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { CommonModule } from '@angular/common';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CookieService = CookieService_1 = (function () {
    function CookieService() {
    }
    CookieService.get = function (name) {
        var arr;
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return '';
    };
    // options: {
    //   expires?:number,
    //   path?:string,
    //   domain?:string
    // }
    CookieService.set = function (name, value, options) {
        var myWindow = window;
        var cookieStr = myWindow.escape(name) + '=' + myWindow.escape(value) + ';';
        if (!options)
            options = {};
        if (options.expires) {
            var dtExpires = new Date(new Date().getTime() + options.expires * 1000 * 60 * 60 * 24);
            cookieStr += 'expires=' + dtExpires.toUTCString() + ';';
        }
        if (options.path) {
            cookieStr += 'path=' + options.path + ';';
        }
        if (options.domain) {
            cookieStr += 'domain=' + options.domain + ';';
        }
        document.cookie = cookieStr;
    };
    // options: {
    //   path?:string,
    //   domain?:string
    // }
    CookieService.delete = function (name, options) {
        if (CookieService_1.get(name)) {
            if (!options)
                options = {};
            options.expires = -1;
            CookieService_1.set(name, '', options);
        }
    };
    return CookieService;
}());
CookieService = CookieService_1 = __decorate([
    Injectable()
], CookieService);
var CookieService_1;
var __decorate$1 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StoreService = (function () {
    function StoreService() {
        this.memStore = {};
        this.memStore$ = {};
    }
    StoreService.prototype.find = function (key) {
        if (key === '')
            return null;
        var data;
        var keys = [];
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
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var k = keys_1[_i];
                data = data[k];
                if (!data)
                    return null;
            }
        }
        return data;
    };
    StoreService.prototype.find$ = function (key, autoAdd) {
        if (key === '')
            return null;
        var data = this.memStore$[key];
        if (!data) {
            if (!autoAdd)
                return null;
            this.memStore$[key] = new Subject$1();
            data = this.memStore$[key];
        }
        return data;
    };
    // key: 如果含.表示解析成对象进行条件搜索。注意：但第一个属性存在时，但是where的条件（非type）不匹配时，返回失败。
    //      如果key = '.'; 表示根存储对象
    // where: {
    //   'user.name': 'Alsmile', // 如果含.表示解析成对象进行条件搜索
    // }
    StoreService.prototype.get = function (key, where) {
        var data = this.find(key);
        // where条件过滤
        if (where) {
            for (var whereKey in where) {
                if (this.find(whereKey) != where[whereKey])
                    return null;
            }
        }
        return data;
    };
    // 得到一个可观察对象
    // key: 如果含.表示解析成对象进行条件搜索。
    StoreService.prototype.get$ = function (key) {
        return this.find$(key, true);
    };
    // key: 如果含.表示解析成对象进行条件搜索。注意：但第一个属性存在时，但是where的条件不匹配时，返回失败。
    // value: 设置key=value; 如果 value为空，表示删除
    // where: {
    //   'user.name': 'Alsmile', // 如果含.表示解析成对象进行条件搜索
    // }
    StoreService.prototype.set = function (strKey, value, where) {
        if (strKey === '' || strKey === '.')
            return false;
        var keys = strKey.split('.');
        var rootKey = keys[0];
        var observableKeys = [rootKey];
        var data = this.memStore[rootKey];
        if (!data) {
            this.memStore[rootKey] = {};
            data = this.memStore[rootKey];
        }
        // 遍历查找子属性data
        var parentData = this.memStore;
        var readKey = rootKey;
        var subData = data;
        if (keys.length > 1) {
            keys.splice(0, 1);
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var k = keys_2[_i];
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
            for (var whereKeys in where) {
                var whereData = this.memStore;
                // 查找where中的子属性
                var whereKey = whereKeys.split('.');
                for (var _a = 0, whereKey_1 = whereKey; _a < whereKey_1.length; _a++) {
                    var k = whereKey_1[_a];
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
        for (var _b = 0, observableKeys_1 = observableKeys; _b < observableKeys_1.length; _b++) {
            var k = observableKeys_1[_b];
            var observable = this.find$(k);
            if (observable) {
                observable.next(value);
            }
        }
        return true;
    };
    // 通过一个观察对象去设置数据
    // key: 如果含.表示解析成对象进行条件搜索。
    StoreService.prototype.setByObservable = function (key, observable) {
        var _this = this;
        observable.subscribe(function (ret) {
            _this.set(key, ret);
        });
    };
    return StoreService;
}());
StoreService = __decorate$1([
    Injectable()
], StoreService);
var __decorate$2 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); };
};
var Le5leStoreModule = Le5leStoreModule_1 = (function () {
    function Le5leStoreModule(parentModule) {
        if (parentModule) {
            throw new Error('Le5leStoreModule is already loaded. Import it in the AppModule only');
        }
    }
    Le5leStoreModule.forRoot = function () {
        return {
            ngModule: Le5leStoreModule_1,
            providers: []
        };
    };
    return Le5leStoreModule;
}());
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
