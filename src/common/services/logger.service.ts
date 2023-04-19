/* eslint-disable no-console */

import { ConnectorService } from '../../connector';
import { ILogger } from '../types';

export enum LogLevel {
  info = 0,
  log = 1,
  warning = 2,
  error = 3,
}

export class LoggerService implements ILogger {
  constructor(private mode: LogLevel, private useConnector: boolean) {}

  private connector?: ConnectorService;

  info(message: string) {
    if (this.mode > LogLevel.info) return;

    console.info(message);
    this.send('info', message);
  }

  log(message: string, payload?: unknown) {
    if (this.mode > LogLevel.log) return;

    if (payload) console.log(message, JSON.stringify(payload));
    else console.log(message);

    this.send('log', message, payload);
  }

  warning(message: string) {
    if (this.mode > LogLevel.warning) return;

    console.warn(message);
    this.send('warning', message);
  }

  error(message: string, payload: unknown) {
    console.error(message, JSON.stringify(payload));
    this.send('error', message, payload);
  }

  setConnector(connector: ConnectorService) {
    this.connector = connector;
  }

  send(level: string, message: string, payload?: unknown) {
    if (this.useConnector) {
      this.connector?.write({
        type: `core:logger:${level}`,
        payload: {
          message,
          payload,
        },
      });
    }
  }
}
