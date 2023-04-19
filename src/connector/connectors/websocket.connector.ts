import { WebSocket } from 'ws';

import { ActionType } from '../../common';
import { WriteAction, IConnector } from '../types';

type Options = {
  address: string;
};

export class WebSocketConnector implements IConnector {
  private handler: WriteAction | undefined;

  constructor(private socket: WebSocket) {
    this.socket.addEventListener('message', ({ data }) => {
      this.receive(data as string);
    });
  }

  public write = (action: ActionType) => {
    this.socket.send(`${JSON.stringify(action)}`);
  };

  private receive = (data: string) => {
    const action = JSON.parse(data) as ActionType;
    if (this.handler) this.handler(action);
  };

  bind(handler: WriteAction) {
    this.handler = handler;
  }

  static get type() {
    return 'websocket';
  }

  static async creator(options: Options) {
    const websocket = new WebSocket(options.address);

    await Promise.race([
      new Promise<void>((resolve) => {
        websocket.addEventListener('open', () => {
          resolve();
        });
      }),
      new Promise<void>((_resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 5000);
      }),
    ]);

    return new WebSocketConnector(websocket);
  }
}
