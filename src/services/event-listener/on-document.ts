import TelegramBot from 'node-telegram-bot-api';
import { getSubjectsFromPdf } from '../pdf-parser';

import { commandQueue } from '../command-queue';
import { PreReqBot } from '../telegram-bot';
import { UserController } from '../../controllers/user';
import { downloadFileFromUrl } from '../../helpers/https';

export const onDocument = async (bot: PreReqBot, doc: TelegramBot.Message) => {
  if (!doc.from) {
    return; // TODO: show error?
  }

  if (commandQueue.getEntry(doc.from.id)?.command !== 'salvarmaterias') {
    bot.sendMessage('Voce quer salvar suas materias? use o /salvarmaterias');
    return;
  }

  commandQueue.clearUser(doc.from.id);

  const fileBuffer = await getFileBufferFromTelegram(bot);
  const subjectsDone = await getSubjectsFromPdf(fileBuffer);

  if (subjectsDone.length === 0) {
    const contactText = process.env.DEV_CONTACT ?
      `Se o problema persistir me contate: ${process.env.DEV_CONTACT}` :
      '';

    bot.sendMessage(
      `Problemas com o documento\nEsse é realmente seu resumo escolar?\n${contactText}`
    );
    return;
  }

  UserController.set(doc.from.id, { subjectsDone });

  bot.sendMessage('Materias salvas!');
};

const getFileBufferFromTelegram = async (bot: PreReqBot) => {
  const file = await bot.getFile();
  if (!file.file_path?.endsWith('.pdf')) {
    bot.sendMessage('Isso nao parece ser seu resumo escolar');
    throw Error('pdf deu ruim');
  }
  else {
    return downloadFileFromUrl(
      'https://api.telegram.org/file/bot' + process.env.BOT_TOKEN + '/' + file.file_path
    );
  }
};
