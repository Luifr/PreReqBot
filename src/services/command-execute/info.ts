import { grade, map } from '../../db';
import { buildPosReqMessage, buildPreReqMessage } from '../../helpers/subject';
import { PreReqBot } from '../telegram-bot';

export const infoCommand = (bot: PreReqBot, subjectName: string) => {
  const subjectCode = map[subjectName];
  if (!subjectCode) {
    bot.sendMessage('Materia não encontrada');
  }
  else {
    const subject = grade[subjectCode];
    const prereqText = buildPreReqMessage(subject, false);
    const posreqText = buildPosReqMessage(subject, false);

    const infoText = `- ${subject.name}:\n` +
      `- Codigo: ${subject.code}\n` +
      `- Credito hora: ${subject.creditHour}\n` +
      `- Periodo ideal: ${subject.idealPeriod}\n` +
      `- ${subject.required ? 'Obrigatoria' : 'Optativa'}\n` +
      `- ${prereqText}\n` +
      `- ${posreqText}`;

    bot.sendMessage(infoText);
  }
};
