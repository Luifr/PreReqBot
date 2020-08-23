import TelegramBot from 'node-telegram-bot-api';
import {
  allCommands,
  ArgCommand,
  arglessCommands,
  Command,
  optionalArgCommands
} from '../../models/command';
import { runArglessCommand, runCommand } from '../command-execute';
import { commandQueue } from '../command-queue';
import { PreReqBot } from '../telegram-bot';

const botName = 'prereqbot';

const emptyCommandRegex = new RegExp(`^/?(${allCommands.join('|')})(?:@${botName})? *$`);
const commandWithArgRegex = new RegExp(`^/?(${allCommands.join('|')})(?:@${botName})? +(.*)$`);

const arglessCommandRegex = new RegExp(`${arglessCommands.join('|')}`);
const optionalArgCommandRegex = new RegExp(`${optionalArgCommands.join('|')}`);

export const onText = async (bot: PreReqBot, msg: TelegramBot.Message): Promise<void> => {
  const msgText = msg.text;
  const fromId = msg.from?.id;

  // TODO: logging/report system
  if (msg.reply_to_message) return;
  if (!msgText) {
    console.error('No message text');
    console.log(msg);
    return;
  }
  if (!fromId) {
    console.error('No user id');
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
    const command = emptyCommandExec[1] as Command;
    runArglessCommand(bot, command);
    if (!optionalArgCommandRegex.test(command)) {
      commandQueue.setEntry(fromId, command);
    }
  }
  else if (commandWithArgExec) {
    const command = commandWithArgExec[1] as Command;
    const arg = commandWithArgExec[2];
    // If the user sent a argless command with argument, run it without the argument
    // Exemple: `/help hi` should be `/help` hi has no effect
    if (arglessCommandRegex.test(command)) {
      runArglessCommand(bot, command);
      if (!optionalArgCommandRegex.test(command)) {
        commandQueue.setEntry(fromId, command);
      }
    }
    else {
      runCommand(bot, command as ArgCommand, arg);
    }
  }
  else if (commandQueueEntry?.command && !arglessCommandRegex.test(commandQueueEntry.command)) {
    commandQueue.clearUser(fromId);
    runCommand(bot, commandQueueEntry.command as ArgCommand, msgText);
  }
  else {
    // Run default command
    runCommand(bot, 'info', msgText);
  }

  // TODO: no command found case
};
