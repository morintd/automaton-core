import { ConfigType, ActionType, ILogger, BareConfig } from '../../common';
import { WriteAction, ConnectorCreator } from '../../connector';

export type AutomatonCoreOptions<T extends BareConfig> = {
  config: ConfigType<T>;
  logger?: ILogger;
  connectors: Record<string, ConnectorCreator>;
  behavior: (write: WriteAction, config: ConfigType<T>, logger: ILogger) => AutomatonBehavior;
};

export type AutomatonBehavior = {
  handle: (action: ActionType) => any;
  start: () => void;
  stop: () => Promise<void>;
};
