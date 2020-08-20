import { bot } from "../telegram-bot";
import { buildPreReqMessage } from "../../helpers/subject";
import { map, grade } from "../../db";


export const prereqCommand = (arg: string) => {
  const subjectCode = map[arg];
  if (!subjectCode) {
    bot.sendMessage('Materia não encontrada');
  }
  else {
    const subject = grade[subjectCode];
    bot.sendMessage(buildPreReqMessage(subject));
  }
}