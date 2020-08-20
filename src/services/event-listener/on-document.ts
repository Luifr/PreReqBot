import TelegramBot from "node-telegram-bot-api";
import { getSubjectsFromPdf } from "../pdf-parser";
import https from "https";

import { commandQueue } from "../command-queue";
import { bot } from "../telegram-bot";
import { UserController } from "../../controllers/user";

export const onDocument = async (doc: TelegramBot.Message) => {
  if (!doc.from) {
    return; // TODO: show error?
  }

  if (commandQueue.getEntry(doc.from.id)?.command !== 'salvarmaterias') {
    bot.sendMessage("Voce quer salvar suas materias? use o /salvarmaterias");
    return;
  }

  commandQueue.clearUser(doc.from.id);

  const fileBuffer = await getFileBufferFromTelegram();
  const subjectsDone = await getSubjectsFromPdf(fileBuffer);

  if (subjectsDone === null) {
    bot.sendMessage("Problemas com o documento, ele é realmente seu resumo escolar?");
    return;
  }

  UserController.set(doc.from.id, { subjectsDone });

  bot.sendMessage("Materias salvas!");
};

const getFileBufferFromTelegram = async () => {
  const file = await bot.getFile();
  if (!file.file_path?.endsWith('.pdf')) {
    bot.sendMessage("Isso nao parece ser seu resumo escolar");
    throw "pdf deu ruim";
  }
  else {
    return downloadFileFromUrl(`https://api.telegram.org/file/bot` + process.env.BOT_TOKEN + `/` + file.file_path);
  }
}

const downloadFileFromUrl = (url: string): Promise<Buffer> => {
  return new Promise<Buffer>((resolve) => {
    // Request telegram image in url
    https.get(url, (response) => {
      const data: Buffer[] = [];
      response.on(`data`, chunk => data.push(chunk));
      // On data end, resolve promise with all data chunks
      response.on(`end`, () => resolve(Buffer.concat(data)));
    });
  })
};

