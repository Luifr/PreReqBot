import { bot } from "../telegram-bot";
import { grade } from "../../db";


export const listSubjects = (arg?: string) => {
  if (bot.chatType !== 'private') {
    bot.sendMessage('Esse comando só funciona no privado');
    return;
  }
  let subjects = Object.values(grade);
  if (arg) {
    const likeRegex = new RegExp(arg);
    subjects = subjects.filter((subject) => likeRegex.test(subject.normalisedName))
  }
  
  const subjectsKeyboard = subjects.map(subject => [{ text: subject.name }]);

  const listText = subjectsKeyboard.length === 0 
  ? 'Não encontrei nenhuma materia com esse filtro'
  : 'Ai estão as materias do seu curso';

  bot.sendMessage(listText, {
    reply_markup: {
      keyboard: subjectsKeyboard,
      one_time_keyboard: true,
    }
  });
}