import * as assert from 'power-assert';
import { mock, count, arg, result } from '../src/';

interface Mockable {
  p1: number;
  p2: string;
  m1(): void;
  m2(string): string;
}

describe('mock', () => {

  it('should make mock from interface', () => {
    let x = mock<Mockable>();

    assert.ok(x != null);
    assert.equal(x.m1(), undefined);
  });

  it('should make mock from object and overrides', () => {
    let x = mock<Mockable>({
      p1: 1,
      p2: 'p2',
      m1: () => {},
      m2: (x) => x
    }, {
      m2: (x) => x + 'm2'
    });

    assert.ok(x != null);
    assert.equal(x.m2('m2'), 'm2m2');
  });

  it('should make mock from interface with overrides', () => {
    let x = mock<Mockable>({
      p1: 1,
      p2: 'p2',
      m1: () => {},
      m2: (x) => x
    });

    assert.ok(x != null);
    assert.equal(x.p1, 1);
    assert.equal(x.p2, 'p2');
    assert.equal(x.m1(), undefined);
    assert.equal(x.m2('m2'), 'm2');
  });

  it('should extend mock', () => {
    let x = mock<Mockable>();

    mock(x, { m2: (x) => x });

    assert.equal(x.m2("m2"), 'm2');
  });

  it('should override mock', () => {
    let x = mock<Mockable>({
      m2: (x) => x
    });

    mock(x, { m2: (x) => x + 'm2' });

    assert.equal(x.m2("m2"), 'm2m2');
  });
});

describe('count', () => {

  it('should count method calls', () => {
    let x = mock<Mockable>();

    x.m1();
    x.m1();
    let _ = x.m2('m2');

    assert.equal(count(x.m1), 2);
    assert.equal(count(x.m2), 1);
  });
});

describe('arg', () => {

  it('should get argument', () => {
    let x = mock<Mockable>();

    let _ = x.m2('m2-1');
    _ = x.m2('m2-2');

    assert.equal(arg(x.m2), 'm2-1');
    assert.equal(arg(x.m2, 1), 'm2-2');
  });
});

describe('result', () => {

  it('should get result', () => {
    let x = mock<Mockable>({ m2: (x) => x });

    let _ = x.m2('m2-1');
    _ = x.m2('m2-2');

    assert.equal(result(x.m2), 'm2-1');
    assert.equal(result(x.m2, 1), 'm2-2');
  });
});
