import { ConnectorService } from '../../connector';

export interface ILogger {
  setConnector: (connector: ConnectorService) => void;
  info: (message: string) => void;
  log: (message: string, payload?: unknown) => void;
  warning: (message: string) => void;
  error: (message: string, payload: unknown) => void;
}
