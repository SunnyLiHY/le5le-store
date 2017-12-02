# le5le-store  
le5le-store - A data store for angular。

le5le-store提供了一个前端数据存储服务中心，支持即时读写、Observable读写。
Observable读采用rxjs封装，方便订阅数据；Observable写可以解决网络请求等异步写。
我们提倡数据的模块化和局部性；仅当需要模块间通信时，使用数据中心服务。  

升级到angualr 5，使用方式有变化

在大家都喜欢用redux的环境下，我并不认为一定要使用redux。redux很方便的是前端开发者的调试。
但是，全局的集中存储，让我担心性能；同时，集中的声明和统一定义方式，破坏了angular的优化的模块独立性，对redux过于依赖。
因此，我更倾向用前端数据中心服务方式也是更亲近angular的方式去管理数据。

# 使用  
npm install le5le-store



【注意】如果想使用单例模式的service，需要在providers注册。

详细教程，参考:  
 <a href="https://le5le-com.github.io/le5le-store" target="_blank">le5le-store官网</a>  
<a href="https://github.com/le5le-com/le5le-ng-start" target="_blank">le5le-ng-start</a>

## 目录结构   

--src 组件源码  
--docs-src 帮助文档源码  
--docs github网页


# docs-src  
docs-src是使用帮助网站 - le5le-store官网，同时也是开发参考用法。


## 编译打包  
生产环境中，需要用npm run build编译github的docs网站文件。





