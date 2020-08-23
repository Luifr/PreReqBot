import { UserController } from '../../controllers/user';
import { grade } from '../../db';
import { IUser } from '../../models/user';
import { PreReqBot } from '../telegram-bot';

export const showMateriasAprovadas = async (bot: PreReqBot) => {
  const user = await UserController.get(bot.userId!) as IUser;
  if (!user.subjectsDone || user.subjectsDone.length === 0) {
    bot.sendMessage('Me mande seu resumo escolar pelo comando /salvarmaterias');
    return;
  }
  const subjectsDoneList = ' - ' + user.subjectsDone.map(subject => {
    // TODO: what if there is not sbject in grade? how to add exceptions
    return grade[subject]?.name ?? subject;
  }).join('\n - ');
  bot.sendMessage(`As materias que voce foi aprovado:\n\n${subjectsDoneList}`);
};
