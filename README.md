# le5le-store

le5le-store - A data store for angular。

le5le-store 提供了一个前端数据存储服务中心，支持即时读写、Observable 读写。  
Observable 读采用 rxjs 封装，方便订阅数据；Observable 写可以解决网络请求等异步写。  
仅当需要模块间通信时，使用数据中心服务；不要过度使用破坏数据的模块化和局部性。

升级到 angualr 6，使用方式有变化

在大家都喜欢用 redux 的环境下，我并不认为一定要使用 redux。redux 很方便的是前端开发者的调试。但是，全局的集中存储，让我担心性能；同时，集中的声明和统一定义方式，破坏了 angular 的优化的模块独立性，对 redux 过于依赖。因此，我更倾向用前端数据中心服务方式也是更亲近 angular 的方式去管理数据。

# 使用

npm install le5le-store

```
@NgModule({
  declarations: [AppComponent, HomeComponent, CreateComponent, TemplatesComponent, AboutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    SharedModule,
    Le5leStoreModule.forRoot(),
    CoreModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

详细教程，参考:  
 <a href="https://le5le-com.github.io/le5le-store" target="_blank">le5le-store 官网</a>  
<a href="https://github.com/le5le-com/le5le-ng-start" target="_blank">le5le-ng-start</a>

## 目录结构

--projects/lib 组件源码  
--src 帮助文档源码  
--docs github 网页
