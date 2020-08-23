import { grade, map } from '../../db';
import { buildPreReqMessage } from '../../helpers/subject';
import { PreReqBot } from '../telegram-bot';

export const prereqCommand = (bot: PreReqBot, subjectName: string) => {
  const subjectCode = map[subjectName];
  if (!subjectCode) {
    bot.sendMessage('Materia não encontrada');
  }
  else {
    const subject = grade[subjectCode];
    bot.sendMessage(buildPreReqMessage(subject));
  }
};
