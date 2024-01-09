export type SubscriberCallback<T> = (old: T, value: T) => void;
export class Subscriber<T> {
  constructor(
    private observer: Observer<T>,
    private _callback: SubscriberCallback<T>
  ) {}
  notify(old: T, value: T) {
    this._callback(old, value);
  }
  unsubscribe() {
    this.observer.unsubscribe(this);
  }
}
export class Observer<T> {
  private _value: T;
  private _subscribers: Subscriber<T>[] = [];
  constructor(value: T) {
    this._value = value;
  }
  subscribe(subscriber: SubscriberCallback<T>) {
    const subscribe = new Subscriber(this, subscriber);
    this._subscribers.push(subscribe);
    subscribe.notify(this._value, this._value);
    return subscribe;
  }
  private _notify(old: T, value: T) {
    this._subscribers.forEach((subscriber) => subscriber.notify(old, value));
  }
  notify() {
    this._subscribers.forEach((subscriber) =>
      subscriber.notify(this._value, this._value)
    );
  }
  get value() {
    return this._value;
  }
  set value(value: T) {
    if (value === this._value) return;
    const old = this._value;
    this._value = value;
    this._notify(old, value);
  }
  unsubscribe(subscriber: Subscriber<T>) {
    this._subscribers = this._subscribers.filter((s) => s !== subscriber);
    console.log("unsubscribe", subscriber, "length", this._subscribers.length);
  }
}
class ArrayObserver<T> extends Observer<T[]> {
  constructor(value: T[]) {
    super(value);
  }
  push(value: T) {
    this.value.push(value);
    this.notify();
  }
  pop() {
    this.value.pop();
    this.notify();
  }
  shift() {
    this.value.shift();
    this.notify();
  }
  unshift(value: T) {
    this.value.unshift(value);
    this.notify();
  }
  splice(start: number, deleteCount: number, ...items: T[]) {
    this.value.splice(start, deleteCount, ...items);
    this.notify();
  }
}

// interface Properties<T> {
//   value: T;
//   type?: string;
//   name?: string;
//   options?: T[];
// }
// class Property<T> {
//   private _observer: Observer<T>;
//   constructor(value: T) {
//     this._observer = value;
//   }
//   get() {
//     return this._observer.get();
//   }
//   set(value: T) {
//     this._observer.set(value);
//   }
// }
class Point {
  constructor(public x: number, public y: number) {}
}
class Shape {
  position = new Observer(new Point(0, 0));
  constructor() {}
}

function observerTest() {
  const shape = new Shape();
  const subscriber = shape.position.subscribe((old, value) => {
    console.log("value", value, old);
  });
  shape.position.value = new Point(1, 1);
  shape.position.value = new Point(2, 2);
  shape.position.value = new Point(3, 3);

  shape.position.value.x = 4;
  shape.position.notify();

  subscriber.unsubscribe();
}
function arrayObserverTest() {
  const array = new ArrayObserver([1, 2, 3]);
  const subscriber = array.subscribe((old, value) => {
    console.log("value", value, old);
  });
  array.push(4);
  array.pop();
  array.shift();
  array.unshift(0);
  array.splice(0, 1, 1, 2, 3);
  // subscriber.unsubscribe();
  array.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}

function propertyTest() {}
export function annotationTest() {
  console.log("observerTest");
  // observerTest();
  console.log("arrayObserverTest");
  arrayObserverTest();
  console.log("annotationTest");
}

/**
 * TODO
 *  - get all the field  of class  with annotation @Property
 * @Property
 * - get name , type ,value
 */
