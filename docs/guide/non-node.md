# Usage in non-Node.js Environments

The default build of `kdu-server-renderer` assumes a Node.js environment, which makes it unusable in alternative JavaScript environments such as [PHP V8Js](https://github.com/phpv8/v8js) or [Oracle Nashorn](https://docs.oracle.com/javase/8/docs/technotes/guides/scripting/nashorn/). In 2.5+ we have shipped a build in `kdu-server-renderer/basic.js` that is largely environment-agnostic, which makes it usable in the environments mentioned above.

For both environments, it is necessary to first prepare the environment by mocking the `global` and `process` objects, with `process.env.KDU_ENV` set to `"server"`, and `process.env.NODE_ENV` set to `"development"` or `"production"`.

In Nashorn, it may also be necessary to provide a polyfill for `Promise` or `setTimeout` using Java's native timers.

Example usage in php-v8js:

```php
<?php
$kdu_source = file_get_contents('/path/to/kdu.js');
$renderer_source = file_get_contents('/path/to/kdu-server-renderer/basic.js');
$app_source = file_get_contents('/path/to/app.js');

$v8 = new V8Js();

$v8->executeString('var process = { env: { KDU_ENV: "server", NODE_ENV: "production" }}; this.global = { process: process };');
$v8->executeString($kdu_source);
$v8->executeString($renderer_source);
$v8->executeString($app_source);
?>
```

---

```js
// app.js
var vm = new Kdu({
  template: `<div>{{ msg }}</div>`,
  data: {
    msg: "hello",
  },
});

// exposed by `kdu-server-renderer/basic.js`
renderKduComponentToString(vm, (err, res) => {
  print(res);
});
```
