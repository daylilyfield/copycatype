import * as assert from 'power-assert';
import { mock, count } from '../src/';

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

  xit('should make mock from interface with properties', () => {
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

  xit('should extend mock', () => {
    let x = mock<Mockable>();

    mock(x, { m2: (x) => x });

    assert.equal(x.m2("x2"), 'm2');
  });
});

describe('count', () => {

  xit('should count method calls', () => {
    let x = mock<Mockable>();

    x.m1();
    x.m1();
    let _ = x.m2('m2');

    assert.equal(count(x.m1), 2);
    assert.equal(count(x.m2), 1);
  });
});

