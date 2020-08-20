import TelegramBot from "node-telegram-bot-api";
import { parsePdf } from "./pdf-parser";
import * as https from "https";
import fs from 'fs';
import { db } from "..";
import { commandQueue } from "./command-queue";

const subjectsPdfName = 'materias.pdf';

export const onDocument = async (bot: TelegramBot, doc: TelegramBot.Message) => {
  if (!doc.from) {
    return; // TODO: show error?
  }
  
  if (commandQueue.getEntry(doc.from.id)?.command !== 'salvarmaterias') {
    bot.sendMessage(doc.chat.id, "Voce quer salvar suas materias? use o /salvarmaterias");
    return; // TODO: tip to user send salvarmaterias
  }
  
  commandQueue.clearUser(doc.from.id);
  
  await getFile(bot, doc);
  const subjectsDone = await parsePdf('./' + subjectsPdfName);
  
  if (subjectsDone === null) {
    bot.sendMessage(doc.chat.id, "Problemas com o documento, ele é realmente seu resumo escolar?");
    return;
  }

  let docRef = db.collection('users').doc(doc.from.id.toString());

  docRef.set({
    subjectsDone
  }, { merge: true });

  bot.sendMessage(doc.chat.id, "Materias salvas!");

  fs.unlinkSync(subjectsPdfName);

};

const getFile = (bot: TelegramBot, doc: TelegramBot.Message) => {
  return bot.getFile(doc.document!.file_id).then((file) => {
    if (!file.file_path?.endsWith('.pdf')) {
      bot.sendMessage(doc.chat.id, "Isso nao parece ser seu resumo escolar");
      throw "pdf deu ruim";
    }
    else {
      return downloadFromUrl(`https://api.telegram.org/file/bot` + process.env.BOT_TOKEN + `/` + file.file_path, './' + subjectsPdfName);
    }
  })
}

const downloadFromUrl = (url: any, dest: any) => {
  const file = fs.createWriteStream(dest);

  https.get(url, (response) => {
    response.pipe(file);
  });

  return new Promise((resolve) => {
    file.on('finish', () => {
      resolve();
    })
  })

};

