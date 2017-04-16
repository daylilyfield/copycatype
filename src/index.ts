///<reference path="../node_modules/typescript/lib/lib.es6.d.ts"/>

type FunctionName = string | number | Symbol;

class MockSetting {

  mockFunctions = new Map<FunctionName, Function>()
}

class Invocation {

  args: any[];
  result: any;

  constructor(args: any[], result: any) {
    this.args = args;
    this.result = result;
  }
}

let mockSettings = new Map<any, MockSetting>();

export function mock<T>(): T;
export function mock<T>(overrides: Partial<T>): T;
export function mock<T>(target: T, overrides: Partial<T>): T;

export function mock<T>(targetOrOverrides?: T | Partial<T>, overrides?: Partial<T>): T {
  const t = overrides && targetOrOverrides ? targetOrOverrides : {};
  const os = (overrides ? overrides : targetOrOverrides) || {};

  let proxy = new Proxy(t, {

    get(_target: T, p: PropertyKey, _receiver: any): any {
      let settings = mockSettings.get(proxy);
      if (!settings) { throw new Error('no mock settings'); }
      const mockFunction = settings.mockFunctions.get(p)
      if (mockFunction) {
        return mockFunction;
      }

      const property = os[p] || t[p];
      if (typeof property === 'function' || property == null) {
        console.log('decorator on care');
        const decorator = function(...args) {
          let result = isFunction(property) ? property.apply(t, arguments) : undefined;
          let invocation = new Invocation(args, result);
          (decorator as any).invocations.push(invocation);
          return result;
        };
        (decorator as any).invocations = []
        settings.mockFunctions.set(p, mockFunction);
        return decorator;
      } else {
        return property;
      }
    }
  });

  mockSettings.set(proxy, new MockSetting());
  return proxy as T;
}

function isFunction(suspect: any): suspect is Function {
  return typeof suspect === 'function';
}

export function count(method: Function): number {
  return (method as any).invocations.count;
}


//export function count(method: Function): number {
//  return  0;
//}
//
//export function arg<T>(method: Function, index: number): T {
//}
//
//export function result<T>(method: Function): T {
//}

class Stub {

  static of<T>(t: Partial<T>): T {
    let proxy = new Proxy(t, {
      get: (target: T, p: PropertyKey, receiver: any): any => {
        let given = t[p];
        if (given) {
          if (typeof(given) === 'function') {
            return function() {
              if (!proxy.stub[p]) {
                proxy.stub[p] = []
              }
              console.log(proxy.stub[p])
              proxy.stub[p].push([arguments]);
              console.log(proxy.stub[p])
              let result = given.apply(target, arguments);
              proxy.stub[p][proxy.stub[p][0].length - 1].push(result);
              console.log(proxy.stub[p])
              return result
            };
          } else {
            return given;
          }
        }
      }
    });
    proxy.stub = new Stub()
    return proxy as T;
  }

  static unwrap(proxy: any) {
    return proxy.stub;
  }
}

