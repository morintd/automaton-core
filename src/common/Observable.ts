export type Observer<T> = (message: T) => void;

export class Observable<T> {
  observers: Array<Observer<T>> = [];

  register = (observer: Observer<T>) => {
    this.observers.push(observer);
  };

  remove = (observer: Observer<T>) => {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  };

  notify = (message: T) => {
    this.observers.forEach((observer) => {
      observer(message);
    });
  };
}
