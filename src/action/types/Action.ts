export interface IManagedAction<T, U> {
  receive: (payload: T) => Promise<void> | void;
  send: (payload: U) => Promise<void> | void;
}
