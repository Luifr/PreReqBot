
interface ICommandQeueEntry {
  command: string;
  timeoutId?: NodeJS.Timeout;
  argless?: boolean;
}

interface ICommandQueue {
  [userId: number]: ICommandQeueEntry | undefined;
}

export const commands = ['prereq', 'info', 'salvarmaterias', 'list'];

export const arglessCommands = ['salvarmaterias'];
export const optionalArgCommands = ['list'];

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

  setEntry = (userId: number, command: string, argless?: boolean) => {
    const timeoutId = setTimeout(() => {
      commandQueue.clearUser(userId);
    }, this.commandQueueExpiryTime);
    this.queue[userId] = { command, timeoutId, argless };
  }

}

export const commandQueue = new CommandQueue();