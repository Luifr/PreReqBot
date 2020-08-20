import TelegramBot from 'node-telegram-bot-api';
import { commandQueue, ICommand, commands, arglessCommands } from './command-queue';

const botName = 'prereqbot';

const emptyCommandRegex = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? *$`);
const commandWithArgRegex = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? +(.*)$`);

const arglessCommandRegex = new RegExp(`${arglessCommands.join('|')}`);

export const onMessage = async (bot: TelegramBot, msg: TelegramBot.Message): Promise<void> => {

  const msgText = msg.text;
  const chatId = msg.chat.id;
  const fromId = msg.from?.id;

  const runArglessCommand = (command: ICommand) => {
    const commandExecuter: { [command: string]: () => void } = {
      'salvarmaterias': () => {
        bot.sendMessage(chatId, 'Me mande seu historico escolar!');
      }
    }
    commandExecuter[command]();
  }

  const runCommand = (command: ICommand, arg: string) => {
    const commandExecuter: { [command: string]: (arg: string) => void } = {
      'info': (arg?: string) => {
        bot.sendMessage(chatId, 'info executed with ' + arg);
      },
      'prereq': (arg?: string) => {
        bot.sendMessage(chatId, 'prereq executed with ' + arg);
      }
    };
    commandExecuter[command](arg);
  }

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
    const isArglessCommand = arglessCommandRegex.test(command);
    if (isArglessCommand) {
      runArglessCommand(command);
    }
    commandQueue.setEntry(fromId, command, isArglessCommand);
    // bot.sendMessage(chatId, `Command ${command} in queue`);
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
