export type ConfigConnector<T = unknown> = {
  type: string;
  options: T;
};

export type BareConfig = { connectors: ConfigConnector[]; id: string };
// eslint-disable-next-line @typescript-eslint/ban-types
export type ConfigType<T extends BareConfig> = T;
