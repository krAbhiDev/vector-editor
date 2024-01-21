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
export class ArrayObserver<T> extends Observer<T[]> {
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
