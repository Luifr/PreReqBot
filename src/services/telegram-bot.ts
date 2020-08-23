process.env.NTBA_FIX_319 = 1 as any;

import TelegramBot from 'node-telegram-bot-api';
import { onDocument } from './event-listener/on-document';
import { onText } from './event-listener/on-text';


const isProd = process.env.NODE_ENV === 'production';
const PORT = +process.env.PORT! || 3000;

const botToken = process.env.BOT_TOKEN!;
const herokuUrl = process.env.HEROKU_URL!;

let telegramBot: TelegramBot;
if (isProd) {
  telegramBot = new TelegramBot(botToken, { webHook: { port: PORT } });
  telegramBot.setWebHook(`${herokuUrl}/bot${botToken}`);
}
else {
  telegramBot = new TelegramBot(botToken, { polling: true });
}

telegramBot.on('text', async (msg) => {
  const bot = new PreReqBot(msg);
  await onText(bot, msg);
});

telegramBot.on('document', async (doc) => {
  const bot = new PreReqBot(doc);
  await onDocument(bot, doc);
});

console.log('Prereq started running');

export class PreReqBot {

  public userId: number | undefined;
  private chatId: number;
  private fileId: string | undefined;
  public chatType: TelegramBot.ChatType;

  constructor(msg: TelegramBot.Message) {

    this.userId = msg.from?.id;
    this.chatId = msg.chat.id;
    this.chatType = msg.chat.type;
    /* eslint-disable camelcase */
    this.fileId = msg.document?.file_id;
  }

  sendMessage = (text: string, options?: TelegramBot.SendMessageOptions) => {
    telegramBot.sendMessage(
      this.chatId, text, options ?? { reply_markup: { remove_keyboard: true } }
    );
  }

  getFile = () => {
    if (!this.fileId) {
      throw Error(`File id not set`);
    }
    return telegramBot.getFile(this.fileId);
  }
}
