import TelegramBot from 'node-telegram-bot-api';
import { commandQueue, ICommand, commands } from './command-queue';

export interface ICommandQueue {
  [key: string]: {
    command: string,
    timeoutId?: NodeJS.Timeout
  };
}

const botName = 'prereqbot';

const emptyCommand = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? *$`);
const commandWithArg = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? +(.*)$`);


export const onMessage = async (bot: TelegramBot, msg: TelegramBot.Message): Promise<void> => {

  const msgText = msg.text!;
  const chatId = msg.chat.id;
  const fromId = msg.from!.id;

  if (!msgText || msg.reply_to_message) {
    return
  }

  const emptyCommandExec = emptyCommand.exec(msgText);
  const commandWithArgExec = commandWithArg.exec(msgText);
  const commandQueueEntry = commandQueue.getEntry(fromId);

  if (commandQueueEntry?.command && (emptyCommandExec || commandWithArgExec)) {
    commandQueue.clearUser(fromId);
  }

  if (emptyCommandExec) {
    const command = emptyCommandExec[1] as ICommand;
    commandQueue.setEntry(fromId, command, (expiredUserId, expiredCommand) =>
      bot.sendMessage(expiredUserId, `Command ${expiredCommand} in queue has expired`)
    );
    bot.sendMessage(chatId, `Command ${command} in queue`);
  }
  else if (commandWithArgExec) {
    const command = commandWithArgExec[1] as ICommand;
    const arg = commandWithArgExec[2];

    bot.sendMessage(chatId, `Running ${command} with arg ${arg}`);
  }
  else if (commandQueueEntry?.command) {
    commandQueue.clearUser(fromId);
    bot.sendMessage(chatId, `Running command ${commandQueueEntry.command} in queue with arg ${msgText}`);
  }
  else {
    bot.sendMessage(chatId, `Running default command with arg ${msgText}`);
  }

}
