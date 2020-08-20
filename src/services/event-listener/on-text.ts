import TelegramBot from 'node-telegram-bot-api';
import { arglessCommands, commandQueue, commands, optionalArgCommands } from '../command-queue';
import { runArglessCommand, runCommand } from '../command-execute';

const botName = 'prereqbot';

const emptyCommandRegex = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? *$`);
const commandWithArgRegex = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? +(.*)$`);

const arglessCommandRegex = new RegExp(`${arglessCommands.join('|')}`);
const optionalArgCommandRegex = new RegExp(`${optionalArgCommands.join('|')}`);

export const onText = async (msg: TelegramBot.Message): Promise<void> => {

  const msgText = msg.text;
  const fromId = msg.from?.id;

  // TODO: logging/report system
  if (msg.reply_to_message) return;
  if (!msgText) {
    console.error(`No message text`);
    console.log(msg);
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
    const command = emptyCommandExec[1];
    runArglessCommand(command);
    if (!optionalArgCommandRegex.test(command)) {
      commandQueue.setEntry(fromId, command, arglessCommandRegex.test(command));
    }
  }
  else if (commandWithArgExec) {
    const command = commandWithArgExec[1];
    const arg = commandWithArgExec[2];
    runCommand(command, arg);
  }
  else if (commandQueueEntry?.command && !commandQueueEntry.argless) {
    commandQueue.clearUser(fromId);
    runCommand(commandQueueEntry.command, msgText);
  }
  else {
    // Run default command
    runCommand('info', msgText);
  }

  // TODO: no command found case
}
