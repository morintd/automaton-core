import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

import { ActionType } from '../../common';
import { WriteAction, IConnector } from '../types';

type Options = {
  path: string;
};

export class SerialPortConnector implements IConnector {
  private port: SerialPort;
  private parser: ReadlineParser;
  private handler: WriteAction | undefined;

  constructor(port: SerialPort) {
    this.port = port;
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    this.parser.on('data', this.receive);
  }

  public write = (action: ActionType) => {
    this.port.write(`${JSON.stringify(action)}\r\n`);
  };

  private receive = (data: string) => {
    const action = JSON.parse(data) as ActionType;
    if (this.handler) this.handler(action);
  };

  bind(handler: WriteAction) {
    this.handler = handler;
  }

  static get type() {
    return 'serial';
  }

  static async creator(options: Options) {
    const serialport = await new Promise<SerialPort>((resolve, reject) => {
      const serialPort = new SerialPort({ baudRate: 115200, path: options.path }, (err) => {
        if (err) reject(err);
        else {
          resolve(serialPort);
        }
      });
    });

    return new SerialPortConnector(serialport);
  }
}
