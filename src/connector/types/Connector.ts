import { ConfigConnector, ActionType } from '../../common';

export interface IConnector {
  write(action: ActionType): void;
  bind(handler: (action: ActionType) => void): void;
}

export type ConnectorCreator<T = any> = (options: ConfigConnector<T>['options']) => Promise<IConnector>;

export type WriteAction = (action: ActionType) => void;
