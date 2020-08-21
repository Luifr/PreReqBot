import { Command } from '../models/command';

interface ICommandQeueEntry {
  command: Command | '';
  timeoutId?: NodeJS.Timeout;
}

interface ICommandQueue {
  [userId: number]: ICommandQeueEntry | undefined;
}


class CommandQueue {
  private queue: ICommandQueue = {};
  private commandQueueExpiryTime = 100000;

  clearUser = (userId: number) => {
    clearTimeout(this.queue[userId]?.timeoutId!);
    this.queue[userId] = { command: '' };
  }

  getEntry = (userId: number) => {
    return this.queue[userId];
  }

  setEntry = (userId: number, command: Command) => {
    const timeoutId = setTimeout(() => {
      commandQueue.clearUser(userId);
    }, this.commandQueueExpiryTime);
    this.queue[userId] = { command, timeoutId };
  }

}

export const commandQueue = new CommandQueue();