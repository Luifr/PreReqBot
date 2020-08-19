
interface ICommandQeueEntry {
  command: ICommand,
  timeoutId?: NodeJS.Timeout
}

interface ICommandQueue {
  [userId: number]: ICommandQeueEntry;
}

export type ICommand = '' | 'prereq' | 'info';
export const commands = ['prereq', 'info'];

class CommandQueue {
  private queue: ICommandQueue = {};
  private commandQueueExpiryTime = 4000;

  clearUser = (userId: number) => {
    clearTimeout(this.queue[userId].timeoutId!);
    this.queue[userId] = { command: '' };
  }

  getEntry = (userId: number) => {
    return this.queue[userId];
  }

  setEntry = (userId: number, command: ICommand, callBack: (expiredUserID: number, expiredCommand: ICommand) => void) => {
    const timeoutId = setTimeout(() => {
      commandQueue.clearUser(userId);
      callBack(userId, command);
    }, this.commandQueueExpiryTime);
    this.queue[userId] = { command, timeoutId }
  }

}

export const commandQueue = new CommandQueue();