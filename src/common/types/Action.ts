export type BaseActionPayload = {
  [key: string]: any;
};

export type ActionType<T extends BaseActionPayload = BaseActionPayload> = {
  type: string;
  payload?: T;
};

export type ActionHandlerType = (action: ActionType, write: (action: ActionType) => void) => void | Promise<void>;
