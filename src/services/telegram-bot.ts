import TelegramBot from 'node-telegram-bot-api';
import { onDocument } from './event-listener/on-document';
import { onText } from './event-listener/on-text';

process.env.NTBA_FIX_319 = 1 as any;

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
  bot.messageRecieved(msg);
  await onText(msg);
});

telegramBot.on('document', async (doc) => {
  bot.messageRecieved(doc);
  await onDocument(doc);
});

class PreReqBot {
  public userId: number | undefined;
  private chatId: number | undefined;
  private fileId: string | undefined;
  public chatType: TelegramBot.ChatType | undefined;

  messageRecieved = (msg: TelegramBot.Message) => {
    this.userId = msg.from?.id;
    this.chatId = msg.chat.id;
    /* eslint-disable camelcase */
    this.fileId = msg.document?.file_id;
    this.chatType = msg.chat.type;
  }

  sendMessage = (text: string, options?: TelegramBot.SendMessageOptions) => {
    if (!this.chatId) {
      throw Error('Chat id not set');
    }
    telegramBot.sendMessage(
      this.chatId, text, options ?? { reply_markup: { remove_keyboard: true } }
    );
  }

  getFile = () => {
    if (!this.fileId) {
      throw Error('File id not set');
    }
    return telegramBot.getFile(this.fileId);
  }
}

// TODO: Exportar isso assim vai dar ruim quando duas ou mais pessoas estiverem falando com o bot ao mesmo tempo
export const bot = new PreReqBot();

console.log('Prereq started running');
