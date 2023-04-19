import { AutomatonBehavior } from '../../automaton';
import { IManagedAction } from '../types/Action';

export class RestartCoreAction implements IManagedAction<void, void> {
  constructor(private behavior: AutomatonBehavior) {}

  async receive() {
    await this.behavior.stop();
    this.behavior.start();
  }

  send() {}

  static get type() {
    return 'core:restart';
  }
}
