import { ActionHandlerType, ActionType } from '../common';

import { IConnector } from './types';

export class ConnectorService implements IConnector {
  private connectors: Array<IConnector>;
  private handler: ActionHandlerType | undefined;

  constructor(connectors: Array<IConnector>) {
    this.connectors = connectors;
    this.connectors.forEach((connector) => connector.bind(this.receive));
  }

  private receive = (action: ActionType) => {
    if (this.handler) {
      this.handler(action, this.write);
    }
  };

  public write = (action: ActionType) => {
    this.connectors.forEach((connector) => connector.write(action));
  };

  public bind = (handler: ActionHandlerType) => {
    this.handler = handler;
  };
}
