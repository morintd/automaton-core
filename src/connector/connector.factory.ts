import { ConfigType, ConfigConnector, ILogger, BareConfig } from '../common';

import { ConnectorService } from './connector.service';
import { IConnector, ConnectorCreator } from './types';

export class ConnectorFactory {
  constructor(private logger: ILogger, private creators: Record<string, ConnectorCreator>) {}

  private async getConnection(connector: ConfigConnector): Promise<IConnector> {
    const creator = this.creators[connector.type];

    if (creator) {
      this.logger.log(`Adding connection ${connector.type}`, connector.options);
      const created = await creator(connector.options);
      this.logger.log(`Connected with ${connector.type}`, connector.options);

      return created;
    } else throw new Error(`Connection ${connector.type} not implemented`);
  }

  async createConnectorService<T extends BareConfig>(config: ConfigType<T>) {
    try {
      const connectors = await Promise.all(config.connectors.map((connector) => this.getConnection(connector)));
      return new ConnectorService(connectors);
    } catch (e) {
      this.logger.error('Error while creating connection to serial ports', { e });
      throw e;
    }
  }
}
