///<reference path="../node_modules/typescript/lib/lib.es6.d.ts"/>

type FunctionName = string | number | symbol;

class MockSetting<T> {

  readonly target: T;
  readonly overrides: Partial<T>;
  private mockFunctions: Map<FunctionName, Function>;

  constructor(target: T, overrides: Partial<T>) {
    this.target = target;
    this.overrides = overrides;
    this.mockFunctions = new Map();
  }

  mergeOverrides(anotherOverrides: Partial<T>) {
    Object.assign(this.overrides, anotherOverrides);
  }

  addMockFunction(name: FunctionName, func: Function) {
    this.mockFunctions.set(name, func);
  }

  getMockFunction(name: FunctionName): Function | undefined {
    return this.mockFunctions.get(name);
  }
}

class Invocation {

  args: any[];
  result: any;

  constructor(args: any[], result: any) {
    this.args = args;
    this.result = result;
  }
}

let mockSettings = new Map<any, MockSetting<any>>();
let mockFunctions = new Map<Function, Invocation[]>();

export function mock<T>(): T;
export function mock<T>(overrides: Partial<T>): T;
export function mock<T>(target: T, overrides: Partial<T>): T;

export function mock<T>(targetOrOverrides?: T | Partial<T>, overrides?: Partial<T>): T {
  const t = overrides && targetOrOverrides ? targetOrOverrides : {};
  const os = (overrides ? overrides : targetOrOverrides) || {};

  let setting = mockSettings.get(t);
  if (setting) {
    setting.mergeOverrides(overrides);
    return t as T;
  }

  let proxy = new Proxy(t, {
    get: handleProxyGet
  });

  mockSettings.set(proxy, new MockSetting(t, os));

  return proxy as T;
}

export function count(method: Function): number {
  const invocations = mockFunctions.get(method);
  if (!invocations) { throw new Error('the method is not mocked.'); }
  return invocations.length;
}

export function arg(method: Function, callIndex = 0, argIndex = 0): any {
  const invocations = mockFunctions.get(method);
  if (!invocations) { throw new Error('the method is not mocked.'); }
  return invocations[callIndex].args[argIndex];
}

export function result(method: Function, callIndex = 0): any {
  const invocations = mockFunctions.get(method);
  if (!invocations) { throw new Error('the method is not mocked.'); }
  return invocations[callIndex].result;
}

function isFunction(suspect: any): suspect is Function {
  return typeof suspect === 'function';
}

function handleProxyGet<T>(_target: T, p: PropertyKey, receiver: any): any {
  const setting = mockSettings.get(receiver);
  if (!setting) { throw new Error('no mock settings'); }

  const mockFunction = setting.getMockFunction(p);
  if (mockFunction) {
    return mockFunction;
  }

  const property = setting.overrides[p] || setting.target[p];
  const propertyIsFunction = isFunction(property);
  if (propertyIsFunction || property == null) {
    const mockFunction = function(...args: any[]): any {
      const result = propertyIsFunction ? property.apply(setting.target, arguments) : undefined;
      const invocation = new Invocation(args, result);
      let invocations = mockFunctions.get(mockFunction);
      if (invocations) {
        invocations.push(invocation);
      }
      return result;
    };
    setting.addMockFunction(p, mockFunction);
    mockFunctions.set(mockFunction, []);
    return mockFunction;
  } else {
    return property;
  }
}
