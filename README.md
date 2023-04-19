# automaton-core

⚠️ This is a Work In Progress (WIP)

`automaton-core` is a TypeScript Wrapper for IOT/automaton/robot projects. It aims to provide an easy way to communicate with an external controller, so you can focus on what's important: behavior.

## Example

```typescript
// index.ts
import { BareConfig, AutomatonCore, SerialPortConnector, WebSocketConnector } from 'automaton-core';

import { Automaton } from './automaton';

const config: BareConfig = {
  id: 'main-automaton',
  connectors: [
    // {
    //   type: 'serial',
    //   options: {
    //     path: '/dev/ttyAMA0',
    //   },
    // },
    {
      type: 'websocket',
      options: {
        address: 'ws://localhost:3000',
      },
    },
  ],
};

function main() {
  const automaton = new AutomatonCore({
    config,
    connectors: {
      [SerialPortConnector.type]: SerialPortConnector.creator,
      [WebSocketConnector.type]: WebSocketConnector.creator,
    },
    behavior: (write, config, logger) => {
      return new Automaton(write, config, logger);
    },
  });

  automaton.start();
}

main();
```

```typescript
// automaton.ts
import { AutomatonBehavior, ActionType, BareConfig, ILogger, WriteAction } from 'automaton-core';

export class Automaton implements AutomatonBehavior {
  constructor(private write: WriteAction, private config: BareConfig, private logger: ILogger) {}

  handle(action: ActionType) {
    this.logger.log('received action', { action });
    this.write({
      type: 'hello',
    });
  }

  start() {
    this.logger.log('Started automaton!', this.config);
  }

  stop() {
    this.logger.log('Stopped automaton!');
    return Promise.resolve();
  }
}
```

## Todo

- Complete documentation + a dd examples
- Create controller lib (& move them to an org?)
