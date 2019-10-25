# le5le-store

le5le-store - A global store and subcribe data for JavaScript apps.

# Getting started

## Store

```
import { Store } from 'le5le-store';

Store.set('name', 'topology');
Store.get('name');

// 实时监听变化
const subcribe = Store.subcribe('name', value => {
  console.log('name:', value);
});
// 取消订阅（监听）
subcribe.unsubcribe();


Store.set('obj', { str: 'abc', num: 1, arr: ['aaa', 111], children: { key: 123 } });
Store.get('obj.num'); // == 1

Store.get('obj').num = 100;
// 通知obj.num发生变化，触发订阅回调函数
Store.updated('obj.num');
```

## Cookie

```
Cookie.set('token', 'secret', {path: '/'});
Cookie.get('token');
Cookie.delete('token');
```

# Docs

[→ docs](https://www.yuque.com/alsmile/le5le-store)

# License

MIT © le5le.com
