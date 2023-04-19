import { BareConfig, ConfigType, ILogger, LoggerService } from '../common';
import { LogLevel } from '../common/services/logger.service';
import { ConnectorFactory, WriteAction, ConnectorCreator, ConnectorService } from '../connector';
import { ActionManager, RestartCoreAction } from '../action';

import { AutomatonBehavior, AutomatonCoreOptions } from './types';

// eslint-disable-next-line @typescript-eslint/ban-types
export class AutomatonCore<T extends BareConfig> {
  private logger: ILogger;
  private config: ConfigType<T>;
  private connectors: Record<string, ConnectorCreator>;
  private behavior: (write: WriteAction, config: ConfigType<T>, logger: ILogger) => AutomatonBehavior;

  constructor(options: AutomatonCoreOptions<T>) {
    this.logger = options.logger ?? new LoggerService(LogLevel.log, true);
    this.config = options.config;
    this.connectors = options.connectors;
    this.behavior = options.behavior;
  }

  async start() {
    const connectorFactory = new ConnectorFactory(this.logger, this.connectors);
    const connector = await connectorFactory.createConnectorService(this.config);
    this.logger.setConnector(connector);

    const behavior = this.behavior(connector.write, this.config, this.logger);

    connector.bind(behavior.handle);
    behavior.start();

    this.configure(connector, behavior);
  }

  configure(connector: ConnectorService, behavior: AutomatonBehavior) {
    connector.bind((action) => {
      const actions = new ActionManager({
        [RestartCoreAction.type]: new RestartCoreAction(behavior),
      });

      actions.handle(action);
    });
  }
}
