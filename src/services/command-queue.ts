
interface ICommandQeueEntry {
  command: ICommand;
  timeoutId?: NodeJS.Timeout;
  argless?: boolean;
}

interface ICommandQueue {
  [userId: number]: ICommandQeueEntry | undefined;
}

export type ICommand = '' | 'prereq' | 'info' | 'salvarmaterias';
export const commands = ['prereq', 'info', 'salvarmaterias'];

export const arglessCommands = ['salvarmaterias'];

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

  setEntry = (userId: number, command: ICommand, argless?: boolean) => {
    const timeoutId = setTimeout(() => {
      commandQueue.clearUser(userId);
    }, this.commandQueueExpiryTime);
    this.queue[userId] = { command, timeoutId, argless };
  }

}

export const commandQueue = new CommandQueue();