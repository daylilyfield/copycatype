copycatype
==========

Overview
--------

Copycatype is super simple mock utility for TypeScript.

Features
--------

TBD.

Usage
-----

### Mock for Interface

```typescript
import * as assert from 'power-assert';
import { mock, count, arg, result } from 'copycatype';

interface Foo {

  bar(): number;
  baz(string): string;
}

let foo = mock<Foo>({
  baz: (x) => x + '!'
});

foo.bar();
foo.bar();
foo.baz('copycatype');

assert.equal(count(foo.bar), 2);
assert.equal(count(foo.baz), 1);

assert.equal(arg(foo.baz), 'copycatype');
assert.equal(result(foo.baz), 'copycatype!');
```

### Mock for Object

TBD.

Limitations
-----------

TBD.

License
-------

The MIT License (MIT)

Copyright (c) 2017 daylilyfield

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

