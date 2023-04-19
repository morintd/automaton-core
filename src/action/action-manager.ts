import { ActionType } from '../common';

import { IManagedAction } from './types/Action';

export class ActionManager {
  constructor(private actions: Record<string, IManagedAction<unknown, unknown>>) {}

  handle(action: ActionType) {
    const handler = this.actions[action.type];
    handler?.receive(action.payload);
  }
}
