import TelegramBot from 'node-telegram-bot-api';

export const onMessage = async (bot: TelegramBot , msg: TelegramBot.Message) => {
    bot.sendMessage(msg.chat.id, 'Hello');
}
