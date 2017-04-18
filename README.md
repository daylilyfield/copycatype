copycatype
==========

Copycatype is super simple mock utility for TypeScript.

Features
--------

- type-safe mocking
- both object and interface mocking
- method Call information (call counts, arguments, and result)
- assertion library free

How to Install
--------------

```bash
npm install --save-dev copycatype
```

Usage
-----

You may have an following interface:

```typescript
interface Mockable {

  doStuff(string): number
}
```

You can make the mock object like below:

```typescript
import { mock } from 'copycatype';

let mockable = mock<Mockable>();

let num = mockable.doStuff("mocking!");
```

The mocked function `mockable.doStuff('mocking!')` is type-safe, so your editor or IDE intelligently assists your coding.

And, of cource, you can retrieve method call information.

```typescript
import * as assert from 'power-assert';
import { mock, count, arg } from 'copycatype';

let mockable = mock<Mockable>();

let num = mockable.doStuff('mocking!');

assert.equal(count(mockable.doStuff), 1);
assert.equal(arg(mockable.doStuff), 'mocking!');
```

In this example, `mockable.doStuff('mocking!')` returns `undefined` because mocked interface has no implemented methods actually.  so, if you need mock behavior for testing, then you add them like this:

```typescript
import { mock, result } from 'copycatype';

let mockable = mock<Mockable>({
  doStuff: (xs) -> xs.length
});

let num = mockable.doStuff('mockable!');

assert.equal(result(mockable.doStuff), 9);
```

or if your prefer to lazy initialization, you can also write your code like below:

```typescript
import { mock, result } from 'copycatype';

let mockable = mock<Mockable>();

mock(mockable, { doStuff: (xs) -> xs.length });
```

Apis
------

### mock<T>(): T

Make an mock object for interface T.

- @return

    the mock object

### mock<T>(targetOrOverrides: Partial<T>): T

Make an mock object for interface T with (partial) implementations specified by `targetOrOverrides` argument.

- @param targetOrOverrides

    behavior for mock object
    
- @return

    mock object

### mock<T>(targetOrMock: T, overrides: Partial<T>): T

Make an mock object for object or mock `targetOrMock` T with partial implementations specified by `overrides` argument.  if you pass mock object in `targetOrMock` argument, this method overwrites current mock behavior with `overrides` argument.

### count(method: Function): number

Count how many times the `method` was called.

- @param method

    target method to get call count

- @return

    call count

### arg(method: Function, callIndex?: number = 0, argIndex?: number = 0): any

Get arguments when the `method` was called.

- @param method

    target method to get the argument

- @param callIndex

    index number for call count (zero origin)

- @param argIndex

    argument position in method signature (zero origin)

- @return

    the argument

### result(method: Function, callIndex? = 0): any

Get the result of the `method`.

- @param method

    target method to get the result

- @param callIndex

    index number for call count (zero origin)

- @return

    the result

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

