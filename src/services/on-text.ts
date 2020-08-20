import TelegramBot from 'node-telegram-bot-api';
import { commandQueue, ICommand, commands, arglessCommands } from './command-queue';
import { bot } from './telegram-bot';

const botName = 'prereqbot';

const emptyCommandRegex = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? *$`);
const commandWithArgRegex = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? +(.*)$`);

const arglessCommandRegex = new RegExp(`${arglessCommands.join('|')}`);

export const onText = async (msg: TelegramBot.Message): Promise<void> => {

  const msgText = msg.text;
  const fromId = msg.from?.id;

  // TODO: logging/report system
  if (msg.reply_to_message) return;
  if (!msgText) {
    console.error(`No message text`);
    // console.log(msg);
    return;
  }
  if (!fromId) {
    console.error(`No user id`);
    console.log(msg);
    return;
  }

  const emptyCommandExec = emptyCommandRegex.exec(msgText);
  const commandWithArgExec = commandWithArgRegex.exec(msgText);
  const commandQueueEntry = commandQueue.getEntry(fromId);

  if (commandQueueEntry?.command && (emptyCommandExec || commandWithArgExec)) {
    commandQueue.clearUser(fromId);
  }

  if (emptyCommandExec) {
    const command = emptyCommandExec[1] as ICommand;
    runArglessCommand(command);
    commandQueue.setEntry(fromId, command, arglessCommandRegex.test(command));
  }
  else if (commandWithArgExec) {
    const command = commandWithArgExec[1] as ICommand;
    const arg = commandWithArgExec[2];
    runCommand(command, arg);
  }
  else if (commandQueueEntry?.command && !commandQueueEntry.argless) {
    commandQueue.clearUser(fromId);
    runCommand(commandQueueEntry.command, msgText);
  }
  else {
    // Run default command
    runCommand('prereq', msgText);
  }

  // TODO: no command found case

}

const runArglessCommand = (command: ICommand) => {
  const commandExecuter: { [command: string]: () => void } = {
    'salvarmaterias': () => {
      bot.sendMessage('Me mande seu historico escolar!');
    },
    'info': () => {
      bot.sendMessage('Me mande o nome da materia!');
    },
    'prereq': () => {
      bot.sendMessage('Me mande o nome da materia!');
    }
  }
  commandExecuter[command]();
}

const runCommand = (command: ICommand, arg: string) => {
  const commandExecuter: { [command: string]: (arg: string) => void } = {
    'info': (arg?: string) => {
      bot.sendMessage('info executed with ' + arg);
    },
    'prereq': (arg?: string) => {
      bot.sendMessage('prereq executed with ' + arg);
    }
  };
  commandExecuter[command](arg);
}