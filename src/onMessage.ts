import TelegramBot from 'node-telegram-bot-api';


const commands = ['prereq', 'info'];
const botName = 'prereqbot';

const commandQueue: { [key: string]: { command: string, timeoutId?: NodeJS.Timeout} } = {};

const emptyCommand = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? *$`);
const commandWithArg = new RegExp(`^/?(${commands.join('|')})(?:@${botName})? +(.*)$`);

const commandQueueExpiryTime = 100000;


export const onMessage = async (bot: TelegramBot, msg: TelegramBot.Message) => {

  const msgText = msg.text!;
  const chatId = msg.chat.id;
  const fromId = msg.from!.id;

  if (!msgText || msg.reply_to_message) {
    return
  }

  const emptyCommandExec = emptyCommand.exec(msgText);
  const commandWithArgExec = commandWithArg.exec(msgText);
  const commandQueueEntry = commandQueue[fromId];

  if (commandQueueEntry?.command && (emptyCommandExec || commandWithArgExec)) {
    clearTimeout(commandQueueEntry.timeoutId!);
    commandQueue[fromId] = { command: '' };
  }

  if (emptyCommandExec) {
    const command = emptyCommandExec[1];
    const timeoutId = setTimeout(() => {
      commandQueue[fromId] = { command: ''};
      bot.sendMessage(chatId, `Command ${command} in queue has expired`);
    }, commandQueueExpiryTime);
    commandQueue[fromId] = { command, timeoutId };
    bot.sendMessage(chatId, `Command ${command} in queue`);
  }
  else if (commandWithArgExec) {
    const command = commandWithArgExec[1];
    const arg = commandWithArgExec[2];
    bot.sendMessage(chatId, `Running ${command} with arg ${arg}`);
  }
  else if (commandQueueEntry?.command) {
    clearTimeout(commandQueue[fromId].timeoutId!);
    commandQueue[fromId] = { command: '' };
    bot.sendMessage(chatId, `Running command ${commandQueueEntry.command} in queue with arg ${msgText}`);
  }
  else {
    bot.sendMessage(chatId, `Running default command with arg ${msgText}`);
  }

}
